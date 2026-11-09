import { NextResponse } from "next/server"
import { apiError, timestampToIso } from "@/lib/api-response"
import { getAdminDatabase, requireStaffPermission } from "@/lib/firebase-admin"
import { PERMISSIONS } from "@/lib/rbac"

export async function GET(request: Request) {
  try {
    await requireStaffPermission(request, PERMISSIONS.ACTIVITY_LOGS_VIEW)
    const snapshot = await getAdminDatabase().collection("activity_logs").orderBy("createdAt", "desc").limit(100).get()
    const activity = snapshot.docs.map((document) => ({ id: document.id, ...document.data(), createdAt: timestampToIso(document.data().createdAt) }))
    return NextResponse.json({ activity })
  } catch (error) { return apiError(error) }
}
