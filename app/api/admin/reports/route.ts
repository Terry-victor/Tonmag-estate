import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-response"
import { getAdminDatabase, requireStaffPermission } from "@/lib/firebase-admin"
import { hasPermission, PERMISSIONS } from "@/lib/rbac"

export async function GET(request: Request) {
  try {
    const actor = await requireStaffPermission(request, PERMISSIONS.SALES_REPORTS_VIEW)
    const database = getAdminDatabase()
    const [leadsSnapshot, salesSnapshot, staffSnapshot] = await Promise.all([
      database.collection("leads").get(),
      database.collection("sales_records").get(),
      database.collection("staff").where("roles", "array-contains", "sales_representative").get(),
    ])
    const leads = leadsSnapshot.docs.map((document) => document.data())
    const sales = salesSnapshot.docs.map((document) => document.data())
    const representatives = staffSnapshot.docs.map((document) => ({
      uid: document.id,
      name: document.data().name || "Representative",
      assignedLeads: leads.filter((lead) => lead.assignedTo === document.id).length,
      completedSales: sales.filter((sale) => sale.representativeId === document.id).length,
    }))
    return NextResponse.json({
      totals: {
        enquiries: leads.length,
        won: leads.filter((lead) => lead.status === "won").length,
        lost: leads.filter((lead) => lead.status === "lost").length,
        completedSales: sales.length,
        ...(hasPermission(actor.roles, PERMISSIONS.FINANCIAL_REPORTS_VIEW)
          ? { revenueNgn: sales.reduce((sum, sale) => sum + (typeof sale.amountNgn === "number" ? sale.amountNgn : 0), 0) }
          : {}),
      },
      representatives,
    })
  } catch (error) { return apiError(error) }
}
