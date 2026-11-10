import fs from "node:fs"
import path from "node:path"
import { cert, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { FieldValue, getFirestore } from "firebase-admin/firestore"

function readEnv(filePath) {
  if (!fs.existsSync(filePath)) return {}
  const values = {}
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/)
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    if (!line || line.trimStart().startsWith("#")) continue
    const separator = line.indexOf("=")
    if (separator <= 0) continue
    const key = line.slice(0, separator).trim()
    let value = line.slice(separator + 1)
    if (key === "FIREBASE_SERVICE_ACCOUNT_JSON" && value.trimStart().startsWith("{")) {
      while (index + 1 < lines.length) {
        try {
          JSON.parse(value)
          break
        } catch {
          index += 1
          value += `\n${lines[index]}`
        }
      }
    }
    values[key] = value
  }
  return values
}

const env = { ...readEnv(path.resolve(".env.local")), ...process.env }
const projectId = String(env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "").trim()
const uid = String(env.PRODUCTION_SUPER_ADMIN_UID || "").trim()

if (!projectId || env.CONFIRM_FIREBASE_PROJECT_ID !== projectId) {
  throw new Error("Set CONFIRM_FIREBASE_PROJECT_ID to the exact target Firebase project ID.")
}
if (!uid || env.CONFIRM_PRODUCTION_ADMIN_UID !== uid) {
  throw new Error("Set PRODUCTION_SUPER_ADMIN_UID and CONFIRM_PRODUCTION_ADMIN_UID to the same existing Firebase UID.")
}

const raw = env.FIREBASE_SERVICE_ACCOUNT_JSON
if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is required.")
const serviceAccount = JSON.parse(raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8"))
if (serviceAccount.project_id && serviceAccount.project_id !== projectId) {
  throw new Error("The service account project does not match NEXT_PUBLIC_FIREBASE_PROJECT_ID.")
}

const app = initializeApp({ credential: cert(serviceAccount), projectId })
const auth = getAuth(app)
const database = getFirestore(app)
const authUser = await auth.getUser(uid)
if (!authUser.email) throw new Error("The Firebase Authentication user must have an email address.")
if (authUser.disabled) throw new Error("The Firebase Authentication user is disabled.")

const email = authUser.email.trim().toLowerCase()
const name = String(authUser.displayName || email.split("@")[0] || "TONMAG Super Administrator").trim()
const staffReference = database.doc(`staff/${uid}`)
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
batch.set(database.doc(`users/${uid}`), {
  id: uid,
  name,
  email,
  homeMarket: "",
  currency: "USD",
  role: "admin",
  onboardingComplete: true,
}, { merge: true })
batch.set(staffReference, {
  uid,
  staffId,
  name,
  email,
  roles: ["super_admin"],
  active: true,
  developmentTestAccount: FieldValue.delete(),
  updatedAt: FieldValue.serverTimestamp(),
  updatedBy: "production_bootstrap",
  ...(existingStaff.exists ? {} : {
    createdAt: FieldValue.serverTimestamp(),
    createdBy: "production_bootstrap",
  }),
}, { merge: true })
batch.set(database.collection("activity_logs").doc(), {
  actorId: uid,
  actorName: name,
  actorRoles: ["super_admin"],
  action: existingStaff.exists ? "staff.production_super_admin_reconfirmed" : "staff.production_super_admin_bootstrapped",
  targetType: "staff",
  targetId: uid,
  detail: { staffId },
  createdAt: FieldValue.serverTimestamp(),
})
await batch.commit()

process.stdout.write(`PROJECT_ID=${projectId}\n`)
process.stdout.write(`UID=${uid}\n`)
process.stdout.write(`EMPLOYEE_ID=${staffId}\n`)
process.stdout.write(`EMAIL=${email}\n`)
process.stdout.write("ROLE=super_admin\n")
process.stdout.write("ACTIVE=true\n")
