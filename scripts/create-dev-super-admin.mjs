import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { cert, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { FieldValue, getFirestore } from "firebase-admin/firestore"

function readEnv(filePath) {
  const values = {}
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    if (!line || line.trimStart().startsWith("#")) continue
    const separator = line.indexOf("=")
    if (separator > 0) values[line.slice(0, separator).trim()] = line.slice(separator + 1)
  }
  return values
}

const env = { ...readEnv(path.resolve(".env.local")), ...process.env }
const projectId = String(env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "").trim()
if (!projectId || env.CONFIRM_FIREBASE_PROJECT_ID !== projectId) {
  throw new Error("Set CONFIRM_FIREBASE_PROJECT_ID to the exact development Firebase project ID.")
}

const raw = env.FIREBASE_SERVICE_ACCOUNT_JSON
if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is required.")
const serviceAccount = JSON.parse(raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8"))
const app = initializeApp({ credential: cert(serviceAccount), projectId })
const auth = getAuth(app)
const database = getFirestore(app)
const email = String(env.DEV_SUPER_ADMIN_EMAIL || "superadmin@test.local").trim().toLowerCase()
const password = String(env.DEV_SUPER_ADMIN_PASSWORD || `Tm!${crypto.randomBytes(15).toString("base64url")}`)
const name = "TONMAG Test Super Administrator"

let authUser
try {
  authUser = await auth.getUserByEmail(email)
  authUser = await auth.updateUser(authUser.uid, { password, displayName: name, disabled: false, emailVerified: true })
} catch (error) {
  if (error?.code !== "auth/user-not-found") throw error
  authUser = await auth.createUser({ email, password, displayName: name, disabled: false, emailVerified: true })
}

const staffReference = database.doc(`staff/${authUser.uid}`)
const existingStaff = await staffReference.get()
let staffId = existingStaff.data()?.staffId
if (typeof staffId !== "string" || !/^id_[1-9]\d*$/.test(staffId)) {
  staffId = await database.runTransaction(async (transaction) => {
    const counterReference = database.doc("system_counters/staff_ids")
    const counter = await transaction.get(counterReference)
    const current = Number(counter.data()?.lastIssued || 0)
    const next = Number.isSafeInteger(current) && current >= 0 ? current + 1 : 1
    transaction.set(counterReference, { lastIssued: next, updatedAt: FieldValue.serverTimestamp() }, { merge: true })
    return `id_${next}`
  })
}

const batch = database.batch()
batch.set(database.doc(`users/${authUser.uid}`), {
  id: authUser.uid,
  name,
  email,
  homeMarket: "",
  currency: "USD",
  role: "admin",
  onboardingComplete: true,
}, { merge: true })
batch.set(staffReference, {
  uid: authUser.uid,
  staffId,
  name,
  email,
  roles: ["super_admin"],
  active: true,
  developmentTestAccount: true,
  updatedAt: FieldValue.serverTimestamp(),
  ...(existingStaff.exists ? {} : { createdAt: FieldValue.serverTimestamp(), createdBy: "development_bootstrap" }),
}, { merge: true })
await batch.commit()

process.stdout.write(`PROJECT_ID=${projectId}\n`)
process.stdout.write(`EMPLOYEE_ID=${staffId}\n`)
process.stdout.write(`EMAIL=${email}\n`)
process.stdout.write(`PASSWORD=${password}\n`)
process.stdout.write(`UID=${authUser.uid}\n`)
