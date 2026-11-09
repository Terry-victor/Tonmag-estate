import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-response"
import { getAdminDatabase, requireStaffPermission } from "@/lib/firebase-admin"
import { PERMISSIONS } from "@/lib/rbac"

export async function GET(request: Request) {
  try {
    await requireStaffPermission(request, PERMISSIONS.LEADS_ASSIGN)
    const snapshot = await getAdminDatabase().collection("staff")
      .where("roles", "array-contains", "sales_representative")
      .get()
    const assignees = snapshot.docs
      .filter((document) => document.data().active === true)
      .map((document) => ({ uid: document.id, name: document.data().name || "Sales representative" }))
      .sort((a, b) => a.name.localeCompare(b.name))
    return NextResponse.json({ assignees })
  } catch (error) { return apiError(error) }
}
