import assert from "node:assert/strict"
import test from "node:test"
import { normalizeStaffId } from "../lib/staff-id.ts"

test("staff IDs are normalized without accepting arbitrary identifiers", () => {
  assert.equal(normalizeStaffId(" ID_12 "), "id_12")
  assert.equal(normalizeStaffId("id_0"), "")
  assert.equal(normalizeStaffId("admin"), "")
  assert.equal(normalizeStaffId({ id: "id_1" }), "")
})
