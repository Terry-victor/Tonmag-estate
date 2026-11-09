import { FieldValue } from "firebase-admin/firestore"
import { NextResponse } from "next/server"
import { apiError, timestampToIso } from "@/lib/api-response"
import { getAdminDatabase, recordActivity, requireAnyStaffPermission, requireStaffPermission } from "@/lib/firebase-admin"
import { hasPermission, PERMISSIONS } from "@/lib/rbac"

const statuses = new Set(["draft", "published", "sold", "unavailable"])

function propertyPayload(body: Record<string, unknown>, partial = false) {
  const result: Record<string, unknown> = {}
  const textFields = ["name", "location", "description", "estateId"] as const
  for (const field of textFields) {
    if (!(field in body)) continue
    if (typeof body[field] !== "string" || body[field].trim().length > (field === "description" ? 5000 : 200)) throw new Error("INVALID_INPUT")
    result[field] = body[field].trim()
  }
  if (!partial && (!result.name || !result.location)) throw new Error("INVALID_INPUT")
  if ("status" in body) {
    if (typeof body.status !== "string" || !statuses.has(body.status)) throw new Error("INVALID_INPUT")
    result.status = body.status
  } else if (!partial) result.status = "draft"
  for (const field of ["availableUnits", "constructionProgress", "priceNgn"] as const) {
    if (!(field in body)) continue
    const value = body[field]
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) throw new Error("INVALID_INPUT")
    if (field === "constructionProgress" && value > 100) throw new Error("INVALID_INPUT")
    if (field === "availableUnits" && (!Number.isInteger(value) || value > 100000)) throw new Error("INVALID_INPUT")
    if (field === "priceNgn" && value > 100_000_000_000) throw new Error("INVALID_INPUT")
    result[field] = value
  }
  if ("media" in body) {
    if (!Array.isArray(body.media) || body.media.length > 30 || body.media.some((item) => typeof item !== "string" || item.length > 2000 || !/^https:\/\//.test(item))) throw new Error("INVALID_INPUT")
    result.media = body.media
  }
  return result
}

function serializeProperty(id: string, data: Record<string, unknown>) {
  return {
    id,
    name: typeof data.name === "string" ? data.name : "",
    location: typeof data.location === "string" ? data.location : "",
    description: typeof data.description === "string" ? data.description : "",
    status: data.status || "draft",
    priceNgn: typeof data.priceNgn === "number" ? data.priceNgn : undefined,
    availableUnits: typeof data.availableUnits === "number" ? data.availableUnits : 0,
    constructionProgress: typeof data.constructionProgress === "number" ? data.constructionProgress : 0,
    media: Array.isArray(data.media) ? data.media : [],
    estateId: data.estateId || "",
    updatedAt: timestampToIso(data.updatedAt),
    updatedBy: data.updatedBy || "",
  }
}

export async function GET(request: Request) {
  try {
    await requireStaffPermission(request, PERMISSIONS.PROPERTIES_VIEW)
    const snapshot = await getAdminDatabase().collection("properties").get()
    const properties = snapshot.docs
      .filter((document) => typeof document.data().name === "string")
      .map((document) => serializeProperty(document.id, document.data()))
      .sort((a, b) => a.name.localeCompare(b.name))
    return NextResponse.json({ properties })
  } catch (error) { return apiError(error) }
}

export async function POST(request: Request) {
  try {
    const actor = await requireAnyStaffPermission(request, [PERMISSIONS.PROPERTIES_CREATE, PERMISSIONS.PROPERTIES_DELETE])
    const body = await request.json().catch(() => null) as Record<string, unknown> | null
    if (!body) throw new Error("INVALID_INPUT")
    if ("priceNgn" in body && !hasPermission(actor.roles, PERMISSIONS.PROPERTY_PRICES_MANAGE)) throw new Error("FORBIDDEN")
    const data = propertyPayload(body)
    const reference = getAdminDatabase().collection("properties").doc()
    await reference.set({ ...data, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(), createdBy: actor.uid, updatedBy: actor.uid })
    await recordActivity(actor, "property.created", "property", reference.id)
    return NextResponse.json({ id: reference.id }, { status: 201 })
  } catch (error) { return apiError(error) }
}

export async function PATCH(request: Request) {
  try {
    const actor = await requireAnyStaffPermission(request, [PERMISSIONS.PROPERTIES_UPDATE, PERMISSIONS.PROPERTIES_DELETE])
    const body = await request.json().catch(() => null) as Record<string, unknown> | null
    const id = typeof body?.id === "string" ? body.id : ""
    if (!id || !body) throw new Error("INVALID_INPUT")
    if ("priceNgn" in body && !hasPermission(actor.roles, PERMISSIONS.PROPERTY_PRICES_MANAGE)) throw new Error("FORBIDDEN")
    const data = propertyPayload(body, true)
    if (!Object.keys(data).length) throw new Error("INVALID_INPUT")
    const reference = getAdminDatabase().doc(`properties/${id}`)
    if (!(await reference.get()).exists) throw new Error("NOT_FOUND")
    await reference.update({ ...data, updatedAt: FieldValue.serverTimestamp(), updatedBy: actor.uid })
    await recordActivity(actor, "property.updated", "property", id, { fields: Object.keys(data) })
    return NextResponse.json({ ok: true })
  } catch (error) { return apiError(error) }
}

export async function DELETE(request: Request) {
  try {
    const actor = await requireStaffPermission(request, PERMISSIONS.PROPERTIES_DELETE)
    const id = new URL(request.url).searchParams.get("id") || ""
    if (!id) throw new Error("INVALID_INPUT")
    await getAdminDatabase().doc(`properties/${id}`).delete()
    await recordActivity(actor, "property.deleted", "property", id)
    return NextResponse.json({ ok: true })
  } catch (error) { return apiError(error) }
}
