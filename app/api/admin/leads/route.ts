import { FieldValue } from "firebase-admin/firestore"
import { NextResponse } from "next/server"
import { apiError, timestampToIso } from "@/lib/api-response"
import { getAdminDatabase, recordActivity, requireAnyStaffPermission, requireStaffPermission } from "@/lib/firebase-admin"
import { LEAD_STATUSES, type LeadStatus } from "@/lib/admin-types"
import { canUpdateLead, canViewLead } from "@/lib/lead-access"
import { hasPermission, PERMISSIONS } from "@/lib/rbac"

const validStatuses = new Set<string>(LEAD_STATUSES)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function serializeLead(id: string, data: Record<string, unknown>) {
  return {
    id,
    name: data.name || "",
    email: data.email || "",
    phone: data.phone || "",
    message: data.message || "",
    source: data.source || "manual",
    status: data.status || "new",
    assignedTo: data.assignedTo || null,
    propertyId: data.propertyId || null,
    interactions: Array.isArray(data.interactions) ? data.interactions : [],
    siteVisits: Array.isArray(data.siteVisits) ? data.siteVisits : [],
    salesUpdates: Array.isArray(data.salesUpdates) ? data.salesUpdates : [],
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
  }
}

export async function GET(request: Request) {
  try {
    const actor = await requireAnyStaffPermission(request, [PERMISSIONS.LEADS_VIEW_ALL, PERMISSIONS.LEADS_VIEW_ASSIGNED])
    const id = new URL(request.url).searchParams.get("id")
    const database = getAdminDatabase()
    if (id) {
      const snapshot = await database.doc(`leads/${id}`).get()
      if (!snapshot.exists) throw new Error("NOT_FOUND")
      const data = snapshot.data() || {}
      if (!canViewLead(actor.roles, actor.uid, data.assignedTo)) throw new Error("FORBIDDEN")
      return NextResponse.json({ lead: serializeLead(snapshot.id, data) })
    }
    const snapshot = hasPermission(actor.roles, PERMISSIONS.LEADS_VIEW_ALL)
      ? await database.collection("leads").get()
      : await database.collection("leads").where("assignedTo", "==", actor.uid).get()
    const leads = snapshot.docs
      .map((document) => serializeLead(document.id, document.data()))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    return NextResponse.json({ leads })
  } catch (error) { return apiError(error) }
}

export async function POST(request: Request) {
  try {
    const actor = await requireStaffPermission(request, PERMISSIONS.LEADS_UPDATE_ALL)
    const body = await request.json().catch(() => null) as Record<string, unknown> | null
    const name = typeof body?.name === "string" ? body.name.trim() : ""
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""
    const phone = typeof body?.phone === "string" ? body.phone.trim() : ""
    const message = typeof body?.message === "string" ? body.message.trim() : ""
    if (name.length < 2 || name.length > 100 || !emailPattern.test(email) || phone.length > 30 || message.length > 3000) throw new Error("INVALID_INPUT")
    const reference = await getAdminDatabase().collection("leads").add({
      name,
      email,
      phone,
      message,
      source: "staff",
      status: "new",
      assignedTo: null,
      propertyId: typeof body?.propertyId === "string" ? body.propertyId : null,
      interactions: [],
      siteVisits: [],
      salesUpdates: [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })
    await recordActivity(actor, "lead.created", "lead", reference.id)
    return NextResponse.json({ id: reference.id }, { status: 201 })
  } catch (error) { return apiError(error) }
}

export async function PATCH(request: Request) {
  try {
    const actor = await requireAnyStaffPermission(request, [PERMISSIONS.LEADS_UPDATE_ALL, PERMISSIONS.LEADS_UPDATE_ASSIGNED])
    const body = await request.json().catch(() => null) as Record<string, unknown> | null
    const id = typeof body?.id === "string" ? body.id : ""
    if (!id) throw new Error("INVALID_INPUT")
    const database = getAdminDatabase()
    const reference = database.doc(`leads/${id}`)
    const snapshot = await reference.get()
    if (!snapshot.exists) throw new Error("NOT_FOUND")
    const current = snapshot.data() || {}
    if (!canUpdateLead(actor.roles, actor.uid, current.assignedTo)) throw new Error("FORBIDDEN")

    const updates: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() }
    if (body && "status" in body) {
      if (typeof body.status !== "string" || !validStatuses.has(body.status)) throw new Error("INVALID_INPUT")
      updates.status = body.status as LeadStatus
    }
    if (body && "assignedTo" in body) {
      if (!hasPermission(actor.roles, PERMISSIONS.LEADS_ASSIGN)) throw new Error("FORBIDDEN")
      if (body.assignedTo !== null && typeof body.assignedTo !== "string") throw new Error("INVALID_INPUT")
      if (typeof body.assignedTo === "string") {
        const assignee = await database.doc(`staff/${body.assignedTo}`).get()
        const assigneeData = assignee.data()
        if (!assignee.exists || assigneeData?.active !== true || !Array.isArray(assigneeData.roles) || !assigneeData.roles.includes("sales_representative")) throw new Error("INVALID_INPUT")
      }
      updates.assignedTo = body.assignedTo
    }
    if (body?.interaction && typeof body.interaction === "object") {
      const interaction = body.interaction as Record<string, unknown>
      const type = typeof interaction.type === "string" ? interaction.type : "note"
      const note = typeof interaction.note === "string" ? interaction.note.trim() : ""
      if (!["call", "email", "whatsapp", "meeting", "note"].includes(type) || note.length < 1 || note.length > 2000) throw new Error("INVALID_INPUT")
      updates.interactions = [...(Array.isArray(current.interactions) ? current.interactions : []), { id: crypto.randomUUID(), type, note, createdBy: actor.uid, createdAt: new Date().toISOString() }].slice(-200)
    }
    if (body?.siteVisit && typeof body.siteVisit === "object") {
      const visit = body.siteVisit as Record<string, unknown>
      const scheduledFor = typeof visit.scheduledFor === "string" ? visit.scheduledFor : ""
      const location = typeof visit.location === "string" ? visit.location.trim() : ""
      if (!scheduledFor || Number.isNaN(Date.parse(scheduledFor)) || location.length < 2 || location.length > 200) throw new Error("INVALID_INPUT")
      updates.siteVisits = [...(Array.isArray(current.siteVisits) ? current.siteVisits : []), { id: crypto.randomUUID(), scheduledFor, location, status: "scheduled", createdBy: actor.uid, createdAt: new Date().toISOString() }].slice(-100)
    }
    if (body && "salesUpdate" in body) {
      const note = typeof body.salesUpdate === "string" ? body.salesUpdate.trim() : ""
      if (note.length < 1 || note.length > 2000) throw new Error("INVALID_INPUT")
      updates.salesUpdates = [...(Array.isArray(current.salesUpdates) ? current.salesUpdates : []), { id: crypto.randomUUID(), note, submittedBy: actor.uid, createdAt: new Date().toISOString() }].slice(-200)
    }
    if (body?.completedSale && typeof body.completedSale === "object") {
      if (!hasPermission(actor.roles, PERMISSIONS.SALES_RECORD)) throw new Error("FORBIDDEN")
      const sale = body.completedSale as Record<string, unknown>
      const amountNgn = typeof sale.amountNgn === "number" ? sale.amountNgn : 0
      if (!Number.isFinite(amountNgn) || amountNgn <= 0 || amountNgn > 100_000_000_000) throw new Error("INVALID_INPUT")
      const saleReference = database.collection("sales_records").doc()
      await saleReference.set({ leadId: id, propertyId: current.propertyId || null, representativeId: current.assignedTo || null, recordedBy: actor.uid, amountNgn, completedAt: FieldValue.serverTimestamp(), createdAt: FieldValue.serverTimestamp() })
      updates.status = "won"
    }
    if (Object.keys(updates).length === 1) throw new Error("INVALID_INPUT")
    await reference.update(updates)
    await recordActivity(actor, "lead.updated", "lead", id, { fields: Object.keys(updates).filter((field) => field !== "updatedAt") })
    return NextResponse.json({ ok: true })
  } catch (error) { return apiError(error) }
}

export async function DELETE(request: Request) {
  try {
    const actor = await requireStaffPermission(request, PERMISSIONS.LEADS_DELETE)
    const id = new URL(request.url).searchParams.get("id") || ""
    if (!id) throw new Error("INVALID_INPUT")
    await getAdminDatabase().doc(`leads/${id}`).delete()
    await recordActivity(actor, "lead.deleted", "lead", id)
    return NextResponse.json({ ok: true })
  } catch (error) { return apiError(error) }
}
