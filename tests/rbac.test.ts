import assert from "node:assert/strict"
import test from "node:test"
import { canUpdateLead, canViewLead } from "../lib/lead-access.ts"
import { APP_ROLES, hasPermission, normalizeRoles, PERMISSIONS, permissionsForRoles } from "../lib/rbac.ts"

test("Super Administrator receives every sensitive permission only when explicit", () => {
  assert.equal(hasPermission([], PERMISSIONS.STAFF_MANAGE), false)
  assert.equal(hasPermission([APP_ROLES.SALES_MANAGER], PERMISSIONS.STAFF_MANAGE), false)
  assert.equal(hasPermission([APP_ROLES.SUPER_ADMIN], PERMISSIONS.STAFF_MANAGE), true)
  assert.equal(hasPermission([APP_ROLES.SUPER_ADMIN], PERMISSIONS.FINANCIAL_REPORTS_VIEW), true)
})

test("Sales Manager can manage leads but not staff, prices, settings, or financial reports", () => {
  const roles = [APP_ROLES.SALES_MANAGER]
  assert.equal(hasPermission(roles, PERMISSIONS.LEADS_VIEW_ALL), true)
  assert.equal(hasPermission(roles, PERMISSIONS.LEADS_ASSIGN), true)
  assert.equal(hasPermission(roles, PERMISSIONS.SALES_PERFORMANCE_VIEW), true)
  assert.equal(hasPermission(roles, PERMISSIONS.STAFF_MANAGE), false)
  assert.equal(hasPermission(roles, PERMISSIONS.PROPERTY_PRICES_MANAGE), false)
  assert.equal(hasPermission(roles, PERMISSIONS.SETTINGS_MANAGE), false)
  assert.equal(hasPermission(roles, PERMISSIONS.FINANCIAL_REPORTS_VIEW), false)
})

test("Sales Representative is restricted to owned leads", () => {
  const roles = [APP_ROLES.SALES_REPRESENTATIVE]
  assert.equal(canViewLead(roles, "rep-a", "rep-a"), true)
  assert.equal(canUpdateLead(roles, "rep-a", "rep-a"), true)
  assert.equal(canViewLead(roles, "rep-a", "rep-b"), false)
  assert.equal(canUpdateLead(roles, "rep-a", "rep-b"), false)
  assert.equal(canViewLead(roles, "rep-a", null), false)
})

test("Content & Property Manager cannot access leads, reports, staff, prices, or settings", () => {
  const roles = [APP_ROLES.CONTENT_PROPERTY_MANAGER]
  assert.equal(hasPermission(roles, PERMISSIONS.PROPERTIES_UPDATE), true)
  assert.equal(hasPermission(roles, PERMISSIONS.CONTENT_MANAGE), true)
  assert.equal(hasPermission(roles, PERMISSIONS.LEADS_VIEW_ALL), false)
  assert.equal(hasPermission(roles, PERMISSIONS.LEADS_VIEW_ASSIGNED), false)
  assert.equal(hasPermission(roles, PERMISSIONS.FINANCIAL_REPORTS_VIEW), false)
  assert.equal(hasPermission(roles, PERMISSIONS.STAFF_MANAGE), false)
  assert.equal(hasPermission(roles, PERMISSIONS.PROPERTY_PRICES_MANAGE), false)
})

test("Multiple roles receive the union without gaining unrelated permissions", () => {
  const roles = [APP_ROLES.SALES_REPRESENTATIVE, APP_ROLES.CONTENT_PROPERTY_MANAGER]
  const permissions = permissionsForRoles(roles)
  assert.equal(permissions.includes(PERMISSIONS.LEADS_VIEW_ASSIGNED), true)
  assert.equal(permissions.includes(PERMISSIONS.PROPERTIES_UPDATE), true)
  assert.equal(permissions.includes(PERMISSIONS.CONTENT_MANAGE), true)
  assert.equal(permissions.includes(PERMISSIONS.FINANCIAL_REPORTS_VIEW), false)
  assert.equal(permissions.includes(PERMISSIONS.STAFF_MANAGE), false)
})

test("Removing a role immediately removes permissions supplied by that role", () => {
  const before = permissionsForRoles([APP_ROLES.SALES_MANAGER, APP_ROLES.CONTENT_PROPERTY_MANAGER])
  const after = permissionsForRoles([APP_ROLES.SALES_MANAGER])
  assert.equal(before.includes(PERMISSIONS.CONTENT_MANAGE), true)
  assert.equal(after.includes(PERMISSIONS.CONTENT_MANAGE), false)
  assert.equal(after.includes(PERMISSIONS.LEADS_ASSIGN), true)
})

test("Unknown and duplicate roles are normalized safely", () => {
  assert.deepEqual(normalizeRoles([APP_ROLES.SALES_MANAGER, "owner", APP_ROLES.SALES_MANAGER]), [APP_ROLES.SALES_MANAGER])
})
