export const APP_ROLES = {
  SUPER_ADMIN: "super_admin",
  SALES_MANAGER: "sales_manager",
  SALES_REPRESENTATIVE: "sales_representative",
  CONTENT_PROPERTY_MANAGER: "content_property_manager",
} as const

export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES]

export const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Super Administrator",
  sales_manager: "Sales Manager",
  sales_representative: "Sales Representative",
  content_property_manager: "Content & Property Manager",
}

export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard:view",
  STAFF_MANAGE: "staff:manage",
  ROLES_MANAGE: "roles:manage",
  PROPERTIES_VIEW: "properties:view",
  PROPERTIES_CREATE: "properties:create",
  PROPERTIES_UPDATE: "properties:update",
  PROPERTIES_DELETE: "properties:delete",
  PROPERTY_PRICES_MANAGE: "properties:prices_manage",
  PROPERTY_MEDIA_MANAGE: "properties:media_manage",
  ESTATES_MANAGE: "estates:manage",
  LEADS_VIEW_ALL: "leads:view_all",
  LEADS_VIEW_ASSIGNED: "leads:view_assigned",
  LEADS_ASSIGN: "leads:assign",
  LEADS_UPDATE_ALL: "leads:update_all",
  LEADS_UPDATE_ASSIGNED: "leads:update_assigned",
  LEADS_DELETE: "leads:delete",
  LEAD_INTERACTIONS_MANAGE: "leads:interactions_manage",
  SITE_VISITS_MANAGE: "site_visits:manage",
  SALES_RECORD: "sales:record",
  SALES_UPDATE_SUBMIT: "sales:update_submit",
  SALES_PERFORMANCE_VIEW: "sales:performance_view",
  FINANCIAL_REPORTS_VIEW: "reports:financial_view",
  CONTENT_MANAGE: "content:manage",
  SALES_REPORTS_VIEW: "reports:sales_view",
  ACTIVITY_LOGS_VIEW: "activity:view",
  SETTINGS_MANAGE: "settings:manage",
  INTEGRATIONS_MANAGE: "integrations:manage",
  SENSITIVE_CHANGES_APPROVE: "sensitive:approve",
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

const ALL_PERMISSIONS = Object.values(PERMISSIONS) as Permission[]

export const ROLE_PERMISSIONS: Record<AppRole, readonly Permission[]> = {
  super_admin: ALL_PERMISSIONS,
  sales_manager: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROPERTIES_VIEW,
    PERMISSIONS.LEADS_VIEW_ALL,
    PERMISSIONS.LEADS_ASSIGN,
    PERMISSIONS.LEADS_UPDATE_ALL,
    PERMISSIONS.LEAD_INTERACTIONS_MANAGE,
    PERMISSIONS.SITE_VISITS_MANAGE,
    PERMISSIONS.SALES_RECORD,
    PERMISSIONS.SALES_PERFORMANCE_VIEW,
    PERMISSIONS.SALES_REPORTS_VIEW,
  ],
  sales_representative: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROPERTIES_VIEW,
    PERMISSIONS.LEADS_VIEW_ASSIGNED,
    PERMISSIONS.LEADS_UPDATE_ASSIGNED,
    PERMISSIONS.LEAD_INTERACTIONS_MANAGE,
    PERMISSIONS.SITE_VISITS_MANAGE,
    PERMISSIONS.SALES_UPDATE_SUBMIT,
  ],
  content_property_manager: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROPERTIES_VIEW,
    PERMISSIONS.PROPERTIES_CREATE,
    PERMISSIONS.PROPERTIES_UPDATE,
    PERMISSIONS.PROPERTY_MEDIA_MANAGE,
    PERMISSIONS.ESTATES_MANAGE,
    PERMISSIONS.CONTENT_MANAGE,
  ],
}

const VALID_ROLES = new Set<AppRole>(Object.values(APP_ROLES))

export function isAppRole(value: unknown): value is AppRole {
  return typeof value === "string" && VALID_ROLES.has(value as AppRole)
}

export function normalizeRoles(value: unknown): AppRole[] {
  if (!Array.isArray(value)) return []
  return [...new Set(value.filter(isAppRole))]
}

export function permissionsForRoles(roles: readonly AppRole[]): Permission[] {
  if (roles.includes(APP_ROLES.SUPER_ADMIN)) return [...ALL_PERMISSIONS]
  return [...new Set(roles.flatMap((role) => ROLE_PERMISSIONS[role]))]
}

export function hasPermission(
  roles: readonly AppRole[],
  permission: Permission,
): boolean {
  return roles.includes(APP_ROLES.SUPER_ADMIN) ||
    roles.some((role) => ROLE_PERMISSIONS[role].includes(permission))
}

export function hasAnyPermission(
  roles: readonly AppRole[],
  permissions: readonly Permission[],
): boolean {
  return permissions.some((permission) => hasPermission(roles, permission))
}

export function isStaff(roles: readonly AppRole[]): boolean {
  return roles.length > 0
}
