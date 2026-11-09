import { FieldValue } from "firebase-admin/firestore"
import { NextResponse } from "next/server"
import { getAdminDatabase, requireFirebaseUser } from "@/lib/firebase-admin"
import { notifyBooking } from "@/lib/booking-notifications"
import { properties as fallbackProperties } from "@/lib/properties"

export async function POST(request: Request) {
  let user
  try { user = await requireFirebaseUser(request, true) }
  catch { return NextResponse.json({ error: "Sign in before booking an inspection." }, { status: 401 }) }
  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  const clientName = typeof body?.clientName === "string" ? body.clientName.trim() : ""
  const clientEmail = typeof body?.clientEmail === "string" ? body.clientEmail.trim().toLowerCase() : ""
  const clientPhone = typeof body?.clientPhone === "string" ? body.clientPhone.trim() : ""
  const propertyId = typeof body?.propertyId === "string" ? body.propertyId.trim() : ""
  const scheduledFor = typeof body?.scheduledFor === "string" ? body.scheduledFor : ""
  const notes = typeof body?.notes === "string" ? body.notes.trim() : ""
  const transportation = body?.transportation === true
  const paymentMethod = body?.paymentMethod === "bank_transfer" ? "bank_transfer" : body?.paymentMethod === "paystack" ? "paystack" : null
  const scheduledAt = Date.parse(scheduledFor)
  if (!clientName || clientName.length > 100 || !clientEmail || clientEmail !== user.email?.toLowerCase() || clientPhone.length < 7 || clientPhone.length > 30 || !propertyId || propertyId.length > 128 || notes.length > 2000 || Number.isNaN(scheduledAt) || scheduledAt < Date.now() || scheduledAt > Date.now() + 366 * 24 * 60 * 60 * 1000 || !paymentMethod) return NextResponse.json({ error: "Valid booking and payment details are required." }, { status: 400 })
  const amountNgn = Number(process.env.INSPECTION_BOOKING_FEE_NGN || 0)
  if (!Number.isFinite(amountNgn) || amountNgn <= 0) return NextResponse.json({ error: "The inspection booking fee is not configured." }, { status: 503 })
  const reference = `TMG-INSP-${Date.now()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`
  const database = getAdminDatabase()
  const propertyDocument = await database.doc(`properties/${propertyId}`).get()
  const fallbackProperty = fallbackProperties.find((item) => item.id === propertyId)
  const propertyData = propertyDocument.data()
  const property = propertyDocument.exists && propertyData?.status === "published" && typeof propertyData.name === "string" ? propertyData.name : fallbackProperty?.name
  if (!property) return NextResponse.json({ error: "Select an available property." }, { status: 400 })
  const booking = database.collection("bookings").doc()
  const base = { userId: user.uid, clientName, clientEmail, clientPhone, propertyId, property, scheduledFor, paymentMethod, amountNgn, reference, notes, transportation, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() }

  if (paymentMethod === "bank_transfer") {
    const bankDetails = { bankName: process.env.BANK_TRANSFER_BANK_NAME || "", accountName: process.env.BANK_TRANSFER_ACCOUNT_NAME || "", accountNumber: process.env.BANK_TRANSFER_ACCOUNT_NUMBER || "" }
    if (!bankDetails.bankName || !bankDetails.accountName || !bankDetails.accountNumber) return NextResponse.json({ error: "Bank-transfer details are not configured." }, { status: 503 })
    await booking.set({ ...base, status: "pending_verification", paymentStatus: "pending_verification" })
    await notifyBooking({ bookingId: booking.id, userId: user.uid, clientName, clientEmail, clientPhone, property, scheduledFor, paymentMethod, paymentStatus: "pending_verification", reference })
    return NextResponse.json({ bookingId: booking.id, reference, status: "pending_verification", amountNgn, bankDetails }, { status: 201 })
  }

  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) return NextResponse.json({ error: "Paystack is not configured." }, { status: 503 })
  await booking.set({ ...base, status: "pending_payment", paymentStatus: "pending" })
  const callbackUrl = new URL("/book-a-tour", process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin)
  callbackUrl.searchParams.set("booking", booking.id)
  const response = await fetch("https://api.paystack.co/transaction/initialize", { method: "POST", headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" }, body: JSON.stringify({ email: clientEmail, amount: String(amountNgn * 100), currency: "NGN", reference, callback_url: callbackUrl.toString(), metadata: { bookingId: booking.id, userId: user.uid, kind: "inspection_booking" } }), cache: "no-store" })
  const result = await response.json()
  if (!response.ok || !result.status) { await booking.update({ status: "payment_initialization_failed", updatedAt: FieldValue.serverTimestamp() }); return NextResponse.json({ error: result.message || "Paystack could not initialize the booking payment." }, { status: 502 }) }
  return NextResponse.json({ bookingId: booking.id, reference, status: "pending_payment", authorizationUrl: result.data.authorization_url })
}
