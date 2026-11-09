import { applicationDefault, cert, getApps, initializeApp, type App } from "firebase-admin/app"
import { getAuth, type DecodedIdToken } from "firebase-admin/auth"
import { FieldValue, getFirestore } from "firebase-admin/firestore"
import { hasAnyPermission, hasPermission, normalizeRoles, permissionsForRoles, type AppRole, type Permission } from "@/lib/rbac"

function createAdminApp(): App | null {
  if (getApps().length) return getApps()[0]
  try {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    if (raw) {
      const value = raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8")
      const serviceAccount = JSON.parse(value)
      if (serviceAccount.private_key) serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n")
      return initializeApp({ credential: cert(serviceAccount) })
    }
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || process.env.K_SERVICE) {
      return initializeApp({ credential: applicationDefault() })
    }
  } catch (error) {
    console.error("Firebase Admin initialization failed", error)
  }
  return null
}

export const firebaseAdminApp = createAdminApp()

export function getAdminAuth() {
  if (!firebaseAdminApp) throw new Error("SERVER_AUTH_NOT_CONFIGURED")
  return getAuth(firebaseAdminApp)
}

export function getAdminDatabase() {
  if (!firebaseAdminApp) throw new Error("SERVER_AUTH_NOT_CONFIGURED")
  return getFirestore(firebaseAdminApp)
}

export async function requireFirebaseUser(request: Request, checkRevoked = false) {
  const header = request.headers.get("authorization")
  if (!header?.startsWith("Bearer ")) throw new Error("UNAUTHORIZED")
  return getAdminAuth().verifyIdToken(header.slice(7), checkRevoked)
}

export type StaffAccess = {
  token: DecodedIdToken
  uid: string
  roles: AppRole[]
  permissions: Permission[]
  name: string
  email: string
}

export async function getStaffAccess(token: DecodedIdToken): Promise<StaffAccess | null> {
  const snapshot = await getAdminDatabase().doc(`staff/${token.uid}`).get()
  if (!snapshot.exists) return null
  const data = snapshot.data() || {}
  if (data.active !== true) throw new Error("ACCOUNT_INACTIVE")
  const roles = normalizeRoles(data.roles)
  if (!roles.length) return null
  return {
    token,
    uid: token.uid,
    roles,
    permissions: permissionsForRoles(roles),
    name: typeof data.name === "string" ? data.name : token.name || "Staff member",
    email: typeof data.email === "string" ? data.email : token.email || "",
  }
}

export async function requireStaffPermission(
  request: Request,
  permission: Permission,
): Promise<StaffAccess> {
  const token = await requireFirebaseUser(request, true)
  const access = await getStaffAccess(token)
  if (!access || !hasPermission(access.roles, permission)) throw new Error("FORBIDDEN")
  return access
}

export async function requireAnyStaffPermission(
  request: Request,
  permissions: readonly Permission[],
): Promise<StaffAccess> {
  const token = await requireFirebaseUser(request, true)
  const access = await getStaffAccess(token)
  if (!access || !hasAnyPermission(access.roles, permissions)) throw new Error("FORBIDDEN")
  return access
}

export async function recordActivity(
  actor: StaffAccess,
  action: string,
  targetType: string,
  targetId: string,
  detail: Record<string, unknown> = {},
) {
  await getAdminDatabase().collection("activity_logs").add({
    actorId: actor.uid,
    actorName: actor.name,
    actorRoles: actor.roles,
    action,
    targetType,
    targetId,
    detail,
    createdAt: FieldValue.serverTimestamp(),
  })
}

export async function finalizeVerifiedPayment(input: { userId: string; transactionId: string; reference: string; amountNgn: number; paidAt: string }) {
  const database = getAdminDatabase()
  const workspaceRef = database.doc(`users/${input.userId}/workspace/main`)
  await database.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(workspaceRef)
    if (!snapshot.exists) throw new Error("WORKSPACE_NOT_FOUND")
    const workspace = snapshot.data()!
    const transactions = Array.isArray(workspace.transactions) ? workspace.transactions : []
    const target = transactions.find((item: { id?: string }) => item.id === input.transactionId)
    if (!target) throw new Error("TRANSACTION_NOT_FOUND")
    if (target.status === "Paid") return
    if (Number(target.amountNgn) !== input.amountNgn) throw new Error("PAYMENT_AMOUNT_MISMATCH")
    transaction.update(workspaceRef, {
      transactions: transactions.map((item: { id?: string }) => item.id === input.transactionId ? { ...item, status: "Paid", reference: input.reference, paidAt: input.paidAt } : item),
      notifications: [{ id: crypto.randomUUID(), title: "Payment received", detail: `Payment reference ${input.reference} was verified.`, createdAt: "Just now", read: false }, ...(Array.isArray(workspace.notifications) ? workspace.notifications : [])],
    })
  })
}
