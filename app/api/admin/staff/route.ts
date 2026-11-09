import { FieldValue } from "firebase-admin/firestore"
import { NextResponse } from "next/server"
import { apiError, timestampToIso } from "@/lib/api-response"
import { getAdminAuth, getAdminDatabase, recordActivity, requireStaffPermission } from "@/lib/firebase-admin"
import { APP_ROLES, normalizeRoles, PERMISSIONS } from "@/lib/rbac"
import { allocateStaffId } from "@/lib/staff-id"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function protectFinalSuperAdmin(uid: string, nextRoles: string[], nextActive: boolean) {
  const database = getAdminDatabase()
  const target = await database.doc(`staff/${uid}`).get()
  const current = target.data()
  const removesSuper = Array.isArray(current?.roles) && current.roles.includes(APP_ROLES.SUPER_ADMIN) &&
    (!nextRoles.includes(APP_ROLES.SUPER_ADMIN) || !nextActive)
  if (!removesSuper) return
  const activeSupers = await database.collection("staff")
    .where("active", "==", true)
    .where("roles", "array-contains", APP_ROLES.SUPER_ADMIN)
    .count()
    .get()
  if (activeSupers.data().count <= 1) throw new Error("LAST_SUPER_ADMIN")
}

export async function GET(request: Request) {
  try {
    await requireStaffPermission(request, PERMISSIONS.STAFF_MANAGE)
    const snapshot = await getAdminDatabase().collection("staff").get()
    const staff = snapshot.docs.map((document) => {
      const data = document.data()
      return {
        uid: document.id,
        staffId: typeof data.staffId === "string" ? data.staffId : "",
        name: data.name || "Staff member",
        email: data.email || "",
        roles: normalizeRoles(data.roles),
        active: data.active === true,
        createdAt: timestampToIso(data.createdAt),
        updatedAt: timestampToIso(data.updatedAt),
      }
    }).sort((a, b) => a.name.localeCompare(b.name))
    return NextResponse.json({ staff })
  } catch (error) { return apiError(error) }
}

export async function POST(request: Request) {
  let createdUid = ""
  try {
    const actor = await requireStaffPermission(request, PERMISSIONS.STAFF_MANAGE)
    const body = await request.json().catch(() => null) as Record<string, unknown> | null
    const name = typeof body?.name === "string" ? body.name.trim() : ""
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""
    const password = typeof body?.password === "string" ? body.password : ""
    const roles = normalizeRoles(body?.roles)
    if (name.length < 2 || name.length > 100 || !emailPattern.test(email) || password.length < 12 || !roles.length) throw new Error("INVALID_INPUT")

    const authUser = await getAdminAuth().createUser({ email, password, displayName: name, disabled: false })
    createdUid = authUser.uid
    const database = getAdminDatabase()
    const staffId = await allocateStaffId(database)
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
    batch.set(database.doc(`staff/${authUser.uid}`), {
      uid: authUser.uid,
      staffId,
      name,
      email,
      roles,
      active: true,
      createdBy: actor.uid,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })
    await batch.commit()
    await recordActivity(actor, "staff.created", "staff", authUser.uid, { roles, staffId })
    return NextResponse.json({ uid: authUser.uid, staffId }, { status: 201 })
  } catch (error) {
    if (createdUid) await getAdminAuth().deleteUser(createdUid).catch(() => undefined)
    return apiError(error)
  }
}

export async function PATCH(request: Request) {
  try {
    const actor = await requireStaffPermission(request, PERMISSIONS.STAFF_MANAGE)
    const body = await request.json().catch(() => null) as Record<string, unknown> | null
    const uid = typeof body?.uid === "string" ? body.uid : ""
    if (!uid) throw new Error("INVALID_INPUT")
    if (uid === actor.uid && ("roles" in (body || {}) || "active" in (body || {}))) throw new Error("SELF_ROLE_CHANGE_FORBIDDEN")
    const target = await getAdminDatabase().doc(`staff/${uid}`).get()
    if (!target.exists) throw new Error("NOT_FOUND")
    const current = target.data() || {}
    const name = typeof body?.name === "string" ? body.name.trim() : current.name
    const roles = body && "roles" in body ? normalizeRoles(body.roles) : normalizeRoles(current.roles)
    const active = typeof body?.active === "boolean" ? body.active : current.active === true
    if (typeof name !== "string" || name.length < 2 || name.length > 100) throw new Error("INVALID_INPUT")
    await protectFinalSuperAdmin(uid, roles, active)
    const database = getAdminDatabase()
    const staffId = typeof current.staffId === "string" && current.staffId ? current.staffId : await allocateStaffId(database)
    await getAdminAuth().updateUser(uid, { displayName: name, disabled: !active })
    await Promise.all([
      database.doc(`staff/${uid}`).update({ name, roles, active, staffId, updatedAt: FieldValue.serverTimestamp(), updatedBy: actor.uid }),
      database.doc(`users/${uid}`).set({ name }, { merge: true }),
    ])
    await recordActivity(actor, "staff.updated", "staff", uid, { roles, active })
    return NextResponse.json({ ok: true, staffId })
  } catch (error) { return apiError(error) }
}

export async function DELETE(request: Request) {
  try {
    const actor = await requireStaffPermission(request, PERMISSIONS.STAFF_MANAGE)
    const uid = new URL(request.url).searchParams.get("uid") || ""
    if (!uid) throw new Error("INVALID_INPUT")
    if (uid === actor.uid) throw new Error("SELF_ROLE_CHANGE_FORBIDDEN")
    await protectFinalSuperAdmin(uid, [], false)
    await getAdminAuth().deleteUser(uid)
    await getAdminDatabase().doc(`staff/${uid}`).delete()
    await recordActivity(actor, "staff.deleted", "staff", uid)
    return NextResponse.json({ ok: true })
  } catch (error) { return apiError(error) }
}
