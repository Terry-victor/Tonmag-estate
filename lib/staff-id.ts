import type { Firestore } from "firebase-admin/firestore"

const STAFF_ID_PATTERN = /^id_([1-9]\d*)$/

export function normalizeStaffId(value: unknown): string {
  if (typeof value !== "string") return ""
  const normalized = value.trim().toLowerCase()
  return STAFF_ID_PATTERN.test(normalized) ? normalized : ""
}

export async function allocateStaffId(database: Firestore): Promise<string> {
  const counter = database.doc("system_counters/staff_ids")
  return database.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(counter)
    const current = Number(snapshot.data()?.lastIssued || 0)
    const next = Number.isSafeInteger(current) && current >= 0 ? current + 1 : 1
    transaction.set(counter, { lastIssued: next, updatedAt: new Date() }, { merge: true })
    return `id_${next}`
  })
}
