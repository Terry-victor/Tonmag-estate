import { NextResponse } from "next/server"
import { apiError, timestampToIso } from "@/lib/api-response"
import { getAdminDatabase, requireStaffPermission } from "@/lib/firebase-admin"
import { hasPermission, PERMISSIONS, ROLE_LABELS } from "@/lib/rbac"

export async function GET(request: Request) {
  try {
    const actor = await requireStaffPermission(request, PERMISSIONS.DASHBOARD_VIEW)
    const database = getAdminDatabase()
    const canViewAllLeads = hasPermission(actor.roles, PERMISSIONS.LEADS_VIEW_ALL)
    const canViewAssignedLeads = hasPermission(actor.roles, PERMISSIONS.LEADS_VIEW_ASSIGNED)
    const canViewProperties = hasPermission(actor.roles, PERMISSIONS.PROPERTIES_VIEW)
    const canManageContent = hasPermission(actor.roles, PERMISSIONS.CONTENT_MANAGE)

    const [leadSnapshot, propertySnapshot, contentSnapshot, salesSnapshot, staffSnapshot] = await Promise.all([
      canViewAllLeads ? database.collection("leads").get() : canViewAssignedLeads ? database.collection("leads").where("assignedTo", "==", actor.uid).get() : Promise.resolve(null),
      canViewProperties ? database.collection("properties").get() : Promise.resolve(null),
      canManageContent ? database.collection("website_content").get() : Promise.resolve(null),
      hasPermission(actor.roles, PERMISSIONS.SALES_PERFORMANCE_VIEW) ? database.collection("sales_records").get() : Promise.resolve(null),
      hasPermission(actor.roles, PERMISSIONS.STAFF_MANAGE) ? database.collection("staff").get() : Promise.resolve(null),
    ])

    const leads = leadSnapshot?.docs.map((document) => document.data()) || []
    const properties = propertySnapshot?.docs.map((document) => document.data()).filter((property) => typeof property.name === "string") || []
    const content = contentSnapshot?.docs.map((document) => document.data()) || []
    const metrics: { label: string; value: number | string; detail: string }[] = []

    if (leadSnapshot) {
      metrics.push({ label: canViewAllLeads ? "Customer enquiries" : "My assigned leads", value: leads.length, detail: `${leads.filter((lead) => lead.status !== "won" && lead.status !== "lost").length} active` })
      metrics.push({ label: "Unassigned leads", value: canViewAllLeads ? leads.filter((lead) => !lead.assignedTo).length : 0, detail: canViewAllLeads ? "Awaiting assignment" : "Manager controlled" })
      metrics.push({ label: "Scheduled site visits", value: leads.reduce((total, lead) => total + (Array.isArray(lead.siteVisits) ? lead.siteVisits.filter((visit: { status?: string }) => visit.status === "scheduled").length : 0), 0), detail: "Upcoming customer visits" })
    }
    if (propertySnapshot) {
      metrics.push({ label: "Property listings", value: properties.length, detail: `${properties.filter((property) => property.status === "published").length} published` })
      metrics.push({ label: "Awaiting updates", value: properties.filter((property) => property.status === "draft" || Number(property.constructionProgress) < 100).length, detail: "Draft or in construction" })
    }
    if (salesSnapshot) metrics.push({ label: "Completed sales", value: salesSnapshot.size, detail: "Recorded sales" })
    if (staffSnapshot) metrics.push({ label: "Administrator accounts", value: staffSnapshot.size, detail: `${staffSnapshot.docs.filter((document) => document.data().active === true).length} active` })
    if (contentSnapshot) metrics.push({ label: "Published content", value: content.filter((entry) => entry.published === true).length, detail: `${content.length} total entries` })

    let recentActivity: unknown[] = []
    if (hasPermission(actor.roles, PERMISSIONS.ACTIVITY_LOGS_VIEW)) {
      const snapshot = await database.collection("activity_logs").orderBy("createdAt", "desc").limit(8).get()
      recentActivity = snapshot.docs.map((document) => ({ id: document.id, ...document.data(), createdAt: timestampToIso(document.data().createdAt) }))
    }

    return NextResponse.json({
      roles: actor.roles.map((role) => ROLE_LABELS[role]),
      metrics,
      recentActivity,
    })
  } catch (error) { return apiError(error) }
}
