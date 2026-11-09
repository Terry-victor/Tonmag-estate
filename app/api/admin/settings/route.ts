import { FieldValue } from "firebase-admin/firestore"
import { NextResponse } from "next/server"
import { apiError, timestampToIso } from "@/lib/api-response"
import { getAdminDatabase, recordActivity, requireStaffPermission } from "@/lib/firebase-admin"
import { PERMISSIONS } from "@/lib/rbac"

const allowedKeys = new Set(["companyName", "supportEmail", "supportPhone", "leadResponseTargetHours", "maintenanceMode"])

export async function GET(request: Request) {
  try {
    await requireStaffPermission(request, PERMISSIONS.SETTINGS_MANAGE)
    const snapshot = await getAdminDatabase().doc("system_settings/general").get()
    return NextResponse.json({ settings: snapshot.exists ? { ...snapshot.data(), updatedAt: timestampToIso(snapshot.data()?.updatedAt) } : {} })
  } catch (error) { return apiError(error) }
}

export async function PATCH(request: Request) {
  try {
    const actor = await requireStaffPermission(request, PERMISSIONS.SETTINGS_MANAGE)
    const body = await request.json().catch(() => null) as Record<string, unknown> | null
    if (!body || Object.keys(body).some((key) => !allowedKeys.has(key))) throw new Error("INVALID_INPUT")
    const settings: Record<string, unknown> = {}
    if ("companyName" in body && (typeof body.companyName !== "string" || body.companyName.trim().length < 2 || body.companyName.length > 150)) throw new Error("INVALID_INPUT")
    if ("supportEmail" in body && (typeof body.supportEmail !== "string" || !/^\S+@\S+\.\S+$/.test(body.supportEmail))) throw new Error("INVALID_INPUT")
    if ("supportPhone" in body && (typeof body.supportPhone !== "string" || body.supportPhone.length > 30)) throw new Error("INVALID_INPUT")
    if ("leadResponseTargetHours" in body && (typeof body.leadResponseTargetHours !== "number" || body.leadResponseTargetHours < 1 || body.leadResponseTargetHours > 168)) throw new Error("INVALID_INPUT")
    if ("maintenanceMode" in body && typeof body.maintenanceMode !== "boolean") throw new Error("INVALID_INPUT")
    for (const [key, value] of Object.entries(body)) settings[key] = typeof value === "string" ? value.trim() : value
    await getAdminDatabase().doc("system_settings/general").set({ ...settings, updatedAt: FieldValue.serverTimestamp(), updatedBy: actor.uid }, { merge: true })
    await recordActivity(actor, "settings.updated", "system_settings", "general", { fields: Object.keys(settings) })
    return NextResponse.json({ ok: true })
  } catch (error) { return apiError(error) }
}
