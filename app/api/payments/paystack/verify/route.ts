import { NextResponse } from "next/server"
import { finalizeVerifiedPayment } from "@/lib/firebase-admin"

export async function GET(request: Request) {
  const reference = new URL(request.url).searchParams.get("reference")
  if (!reference || !/^[A-Za-z0-9.=-]+$/.test(reference)) return NextResponse.json({ error: "Invalid payment reference." }, { status: 400 })
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) return NextResponse.json({ error: "Payment verification is not configured." }, { status: 503 })
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${secret}` }, cache: "no-store" })
  const result = await response.json()
  if (!response.ok || !result.status) return NextResponse.json({ error: result.message || "Unable to verify payment." }, { status: response.status || 502 })
  const verified = result.data.status === "success"
  if (verified) {
    const metadata = result.data.metadata || {}
    if (!metadata.userId || !metadata.transactionId) return NextResponse.json({ error: "Verified payment metadata is incomplete." }, { status: 422 })
    try { await finalizeVerifiedPayment({ userId: metadata.userId, transactionId: metadata.transactionId, reference: result.data.reference, amountNgn: result.data.amount / 100, paidAt: new Date(result.data.paid_at).toLocaleDateString("en-GB") }) }
    catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to finalize payment." }, { status: 500 }) }
  }
  return NextResponse.json({ verified, reference: result.data.reference, amountNgn: result.data.amount / 100, paidAt: result.data.paid_at })
}
