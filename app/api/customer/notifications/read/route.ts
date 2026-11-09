import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-response"
import { getAdminDatabase, requireFirebaseUser } from "@/lib/firebase-admin"

export async function POST(request: Request) {
  try {
    const token = await requireFirebaseUser(request, true)
    const reference = getAdminDatabase().doc(`users/${token.uid}/workspace/main`)
    await getAdminDatabase().runTransaction(async (transaction) => {
      const snapshot = await transaction.get(reference)
      if (!snapshot.exists) throw new Error("NOT_FOUND")
      const notifications = Array.isArray(snapshot.data()?.notifications) ? snapshot.data()!.notifications : []
      transaction.update(reference, { notifications: notifications.map((item: Record<string, unknown>) => ({ ...item, read: true })) })
    })
    return NextResponse.json({ ok: true })
  } catch (error) { return apiError(error) }
}
