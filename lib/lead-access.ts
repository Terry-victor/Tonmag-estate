import { hasPermission, PERMISSIONS, type AppRole } from "./rbac.ts"

export function canViewLead(
  roles: readonly AppRole[],
  userId: string,
  assignedTo: unknown,
): boolean {
  return hasPermission(roles, PERMISSIONS.LEADS_VIEW_ALL) ||
    (hasPermission(roles, PERMISSIONS.LEADS_VIEW_ASSIGNED) && assignedTo === userId)
}

export function canUpdateLead(
  roles: readonly AppRole[],
  userId: string,
  assignedTo: unknown,
): boolean {
  return hasPermission(roles, PERMISSIONS.LEADS_UPDATE_ALL) ||
    (hasPermission(roles, PERMISSIONS.LEADS_UPDATE_ASSIGNED) && assignedTo === userId)
}
