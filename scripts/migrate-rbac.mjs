import fs from "node:fs"
import path from "node:path"
import { cert, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { FieldValue, getFirestore } from "firebase-admin/firestore"
import { properties as websiteProperties } from "../lib/properties.ts"

function readEnv(filePath) {
  const values = {}
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    if (!line || line.trimStart().startsWith("#")) continue
    const separator = line.indexOf("=")
    if (separator > 0) values[line.slice(0, separator)] = line.slice(separator + 1)
  }
  return values
}

const apply = process.argv.includes("--apply")
const env = { ...readEnv(path.resolve(".env.local")), ...process.env }
const raw = env.FIREBASE_SERVICE_ACCOUNT_JSON
if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is required.")
const serviceAccount = JSON.parse(raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8"))
const app = initializeApp({ credential: cert(serviceAccount) })
const auth = getAuth(app)
const database = getFirestore(app)

const authResult = await auth.listUsers(1000)
const userSnapshot = await database.collection("users").get()
const contactSnapshot = await database.collection("contact_submissions").get()
const existingLeadSnapshot = await database.collection("leads").get()
const migratedContactIds = new Set(existingLeadSnapshot.docs.map((document) => document.data().migrationSourceId).filter(Boolean))
const legacyStaff = userSnapshot.docs.flatMap((document) => {
  const role = document.data().role
  if (role === "agent") return [{ uid: document.id, role: "sales_representative" }]
  if (role === "admin" && env.RBAC_PROMOTE_LEGACY_ADMINS === "true") return [{ uid: document.id, role: "super_admin" }]
  return []
})
const contactsToMigrate = contactSnapshot.docs.filter((document) => !migratedContactIds.has(document.id))
const bootstrapEmail = String(env.RBAC_BOOTSTRAP_SUPER_ADMIN_EMAIL || "").trim().toLowerCase()
const existingBootstrapUser = bootstrapEmail ? authResult.users.find((user) => user.email?.toLowerCase() === bootstrapEmail) : undefined

process.stdout.write(`MODE=${apply ? "apply" : "dry-run"}\n`)
process.stdout.write(`AUTH_USERS=${authResult.users.length}\n`)
process.stdout.write(`LEGACY_STAFF_TO_MIGRATE=${legacyStaff.length}\n`)
process.stdout.write(`CONTACTS_TO_MIGRATE=${contactsToMigrate.length}\n`)
process.stdout.write(`WEBSITE_PROPERTIES_TO_UPSERT=${websiteProperties.length}\n`)
process.stdout.write(`BOOTSTRAP_EMAIL_CONFIGURED=${Boolean(bootstrapEmail)}\n`)
process.stdout.write(`BOOTSTRAP_AUTH_USER_EXISTS=${Boolean(existingBootstrapUser)}\n`)

if (!apply) {
  await new Promise((resolve) => process.stdout.write("No records were changed. Re-run with --apply after reviewing the counts.\n", resolve))
  process.exit(0)
}

if (!bootstrapEmail && authResult.users.length === 0) {
  throw new Error("Set RBAC_BOOTSTRAP_SUPER_ADMIN_EMAIL and RBAC_BOOTSTRAP_SUPER_ADMIN_PASSWORD before the first applied migration.")
}

const batch = database.batch()
for (const item of legacyStaff) {
  const authUser = authResult.users.find((user) => user.uid === item.uid)
  const profile = userSnapshot.docs.find((document) => document.id === item.uid)?.data() || {}
  batch.set(database.doc(`staff/${item.uid}`), {
    uid: item.uid,
    name: profile.name || authUser?.displayName || "Staff member",
    email: authUser?.email || profile.email || "",
    roles: [item.role],
    active: authUser?.disabled !== true,
    migrationSource: "legacy_user_role",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true })
}

for (const document of contactsToMigrate) {
  const data = document.data()
  const reference = database.collection("leads").doc()
  batch.set(reference, {
    name: typeof data.name === "string" ? data.name.slice(0, 100) : "Website enquiry",
    email: typeof data.email === "string" ? data.email.slice(0, 320) : "",
    phone: typeof data.phone === "string" ? data.phone.slice(0, 30) : "",
    message: typeof data.message === "string" ? data.message.slice(0, 3000) : "",
    source: "legacy_contact_submission",
    migrationSourceId: document.id,
    status: "new",
    assignedTo: null,
    propertyId: null,
    interactions: [],
    siteVisits: [],
    salesUpdates: [],
    createdAt: data.timestamp || FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })
}

for (const property of websiteProperties) {
  batch.set(database.doc(`properties/${property.id}`), {
    name: property.name,
    location: property.location,
    description: property.description,
    status: "published",
    priceNgn: property.priceNgn,
    availableUnits: property.status === "Ready" ? 1 : 10,
    constructionProgress: property.status === "Ready" ? 100 : 0,
    media: property.images,
    migrationSource: "website_property_catalogue",
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: "rbac_migration",
  }, { merge: true })
}

let bootstrapUser = existingBootstrapUser
if (bootstrapEmail && !bootstrapUser) {
  const password = String(env.RBAC_BOOTSTRAP_SUPER_ADMIN_PASSWORD || "")
  if (password.length < 12) throw new Error("RBAC_BOOTSTRAP_SUPER_ADMIN_PASSWORD must contain at least 12 characters.")
  bootstrapUser = await auth.createUser({ email: bootstrapEmail, password, displayName: "TONMAG Super Administrator", disabled: false })
}

if (bootstrapUser) {
  batch.set(database.doc(`users/${bootstrapUser.uid}`), {
    id: bootstrapUser.uid,
    name: bootstrapUser.displayName || "TONMAG Super Administrator",
    email: bootstrapUser.email || bootstrapEmail,
    homeMarket: "Nigeria",
    currency: "USD",
    role: "admin",
    onboardingComplete: true,
  }, { merge: true })
  batch.set(database.doc(`staff/${bootstrapUser.uid}`), {
    uid: bootstrapUser.uid,
    name: bootstrapUser.displayName || "TONMAG Super Administrator",
    email: bootstrapUser.email || bootstrapEmail,
    roles: ["super_admin"],
    active: true,
    migrationSource: "rbac_bootstrap",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true })
}

batch.set(database.doc("migrations/rbac_v1"), {
  appliedAt: FieldValue.serverTimestamp(),
  legacyStaffMigrated: legacyStaff.length,
  contactsMigrated: contactsToMigrate.length,
  propertiesUpserted: websiteProperties.length,
  bootstrapUid: bootstrapUser?.uid || null,
})
await batch.commit()
process.stdout.write("RBAC migration applied successfully without deleting existing records.\n")
