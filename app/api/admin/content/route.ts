import { FieldValue } from "firebase-admin/firestore"
import { NextResponse } from "next/server"
import { apiError, timestampToIso } from "@/lib/api-response"
import { getAdminDatabase, recordActivity, requireStaffPermission } from "@/lib/firebase-admin"
import { PERMISSIONS } from "@/lib/rbac"

const types = new Set(["announcement", "banner", "testimonial"])

function parseContent(body: Record<string, unknown>) {
  const type = typeof body.type === "string" ? body.type : ""
  const title = typeof body.title === "string" ? body.title.trim() : ""
  const contentBody = typeof body.body === "string" ? body.body.trim() : ""
  const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : ""
  if (!types.has(type) || title.length < 2 || title.length > 200 || contentBody.length < 2 || contentBody.length > 5000 || (imageUrl && (imageUrl.length > 2000 || !/^https:\/\//.test(imageUrl)))) throw new Error("INVALID_INPUT")
  return { type, title, body: contentBody, imageUrl, published: body.published === true }
}

export async function GET(request: Request) {
  try {
    await requireStaffPermission(request, PERMISSIONS.CONTENT_MANAGE)
    const snapshot = await getAdminDatabase().collection("website_content").get()
    return NextResponse.json({ content: snapshot.docs.map((document) => ({ id: document.id, ...document.data(), createdAt: timestampToIso(document.data().createdAt), updatedAt: timestampToIso(document.data().updatedAt) })) })
  } catch (error) { return apiError(error) }
}

export async function POST(request: Request) {
  try {
    const actor = await requireStaffPermission(request, PERMISSIONS.CONTENT_MANAGE)
    const body = await request.json().catch(() => null) as Record<string, unknown> | null
    if (!body) throw new Error("INVALID_INPUT")
    const reference = await getAdminDatabase().collection("website_content").add({ ...parseContent(body), createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(), updatedBy: actor.uid })
    await recordActivity(actor, "content.created", "website_content", reference.id)
    return NextResponse.json({ id: reference.id }, { status: 201 })
  } catch (error) { return apiError(error) }
}

export async function PATCH(request: Request) {
  try {
    const actor = await requireStaffPermission(request, PERMISSIONS.CONTENT_MANAGE)
    const body = await request.json().catch(() => null) as Record<string, unknown> | null
    const id = typeof body?.id === "string" ? body.id : ""
    if (!id || !body) throw new Error("INVALID_INPUT")
    await getAdminDatabase().doc(`website_content/${id}`).update({ ...parseContent(body), updatedAt: FieldValue.serverTimestamp(), updatedBy: actor.uid })
    await recordActivity(actor, "content.updated", "website_content", id)
    return NextResponse.json({ ok: true })
  } catch (error) { return apiError(error) }
}

export async function DELETE(request: Request) {
  try {
    const actor = await requireStaffPermission(request, PERMISSIONS.CONTENT_MANAGE)
    const id = new URL(request.url).searchParams.get("id") || ""
    if (!id) throw new Error("INVALID_INPUT")
    await getAdminDatabase().doc(`website_content/${id}`).delete()
    await recordActivity(actor, "content.deleted", "website_content", id)
    return NextResponse.json({ ok: true })
  } catch (error) { return apiError(error) }
}
