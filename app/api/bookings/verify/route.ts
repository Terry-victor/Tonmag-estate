import { FieldValue } from "firebase-admin/firestore"
import { NextResponse } from "next/server"
import { getAdminDatabase, requireFirebaseUser } from "@/lib/firebase-admin"
import { notifyBooking } from "@/lib/booking-notifications"

export async function GET(request: Request) {
  let user
  try { user = await requireFirebaseUser(request, true) }
  catch { return NextResponse.json({ error: "Authentication is required." }, { status: 401 }) }
  const url = new URL(request.url)
  const reference = url.searchParams.get("reference") || ""
  const bookingId = url.searchParams.get("booking") || ""
  if (!reference || !bookingId) return NextResponse.json({ error: "Booking verification details are missing." }, { status: 400 })
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) return NextResponse.json({ error: "Paystack is not configured." }, { status: 503 })
  const database = getAdminDatabase()
  const bookingRef = database.doc(`bookings/${bookingId}`)
  const bookingSnapshot = await bookingRef.get()
  if (!bookingSnapshot.exists || bookingSnapshot.data()?.userId !== user.uid || bookingSnapshot.data()?.reference !== reference) return NextResponse.json({ error: "Booking not found." }, { status: 404 })
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${secret}` }, cache: "no-store" })
  const result = await response.json()
  const data = bookingSnapshot.data()!
  if (!response.ok || result.data?.status !== "success" || result.data?.metadata?.bookingId !== bookingId || Number(result.data.amount) !== Number(data.amountNgn) * 100) return NextResponse.json({ verified: false }, { status: 422 })
  if (data.paymentStatus !== "confirmed") {
    await bookingRef.update({ status: "confirmed", paymentStatus: "confirmed", paidAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() })
    await notifyBooking({ bookingId, userId: user.uid, clientName: data.clientName, clientEmail: data.clientEmail, clientPhone: data.clientPhone, property: data.property, scheduledFor: data.scheduledFor, paymentMethod: "paystack", paymentStatus: "confirmed", reference })
  }
  return NextResponse.json({ verified: true, bookingId, reference })
}
