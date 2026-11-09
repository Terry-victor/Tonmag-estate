import { FieldValue } from "firebase-admin/firestore"
import { NextResponse } from "next/server"
import { apiError, timestampToIso } from "@/lib/api-response"
import { getAdminDatabase, recordActivity, requireStaffPermission } from "@/lib/firebase-admin"
import { PERMISSIONS } from "@/lib/rbac"

function parseEstate(body: Record<string, unknown>) {
  const name = typeof body.name === "string" ? body.name.trim() : ""
  const location = typeof body.location === "string" ? body.location.trim() : ""
  const description = typeof body.description === "string" ? body.description.trim() : ""
  const progress = typeof body.constructionProgress === "number" ? body.constructionProgress : 0
  if (name.length < 2 || name.length > 150 || location.length < 2 || location.length > 200 || description.length > 5000 || progress < 0 || progress > 100) throw new Error("INVALID_INPUT")
  return { name, location, description, constructionProgress: progress }
}

export async function GET(request: Request) {
  try {
    await requireStaffPermission(request, PERMISSIONS.ESTATES_MANAGE)
    const snapshot = await getAdminDatabase().collection("estates").get()
    return NextResponse.json({ estates: snapshot.docs.map((document) => ({ id: document.id, ...document.data(), updatedAt: timestampToIso(document.data().updatedAt) })) })
  } catch (error) { return apiError(error) }
}

export async function POST(request: Request) {
  try {
    const actor = await requireStaffPermission(request, PERMISSIONS.ESTATES_MANAGE)
    const body = await request.json().catch(() => null) as Record<string, unknown> | null
    if (!body) throw new Error("INVALID_INPUT")
    const reference = await getAdminDatabase().collection("estates").add({ ...parseEstate(body), createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(), updatedBy: actor.uid })
    await recordActivity(actor, "estate.created", "estate", reference.id)
    return NextResponse.json({ id: reference.id }, { status: 201 })
  } catch (error) { return apiError(error) }
}

export async function PATCH(request: Request) {
  try {
    const actor = await requireStaffPermission(request, PERMISSIONS.ESTATES_MANAGE)
    const body = await request.json().catch(() => null) as Record<string, unknown> | null
    const id = typeof body?.id === "string" ? body.id : ""
    if (!id || !body) throw new Error("INVALID_INPUT")
    await getAdminDatabase().doc(`estates/${id}`).update({ ...parseEstate(body), updatedAt: FieldValue.serverTimestamp(), updatedBy: actor.uid })
    await recordActivity(actor, "estate.updated", "estate", id)
    return NextResponse.json({ ok: true })
  } catch (error) { return apiError(error) }
}

export async function DELETE(request: Request) {
  try {
    const actor = await requireStaffPermission(request, PERMISSIONS.ESTATES_MANAGE)
    const id = new URL(request.url).searchParams.get("id") || ""
    if (!id) throw new Error("INVALID_INPUT")
    await getAdminDatabase().doc(`estates/${id}`).delete()
    await recordActivity(actor, "estate.deleted", "estate", id)
    return NextResponse.json({ ok: true })
  } catch (error) { return apiError(error) }
}
