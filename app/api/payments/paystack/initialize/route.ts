import { NextResponse } from "next/server"
import { paymentItems } from "@/lib/payment-items"
import { requireFirebaseUser } from "@/lib/firebase-admin"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { transactionId?: string; email?: string } | null
  if (!body?.transactionId || !body.email || !/^\S+@\S+\.\S+$/.test(body.email)) return NextResponse.json({ error: "A valid transaction and email are required." }, { status: 400 })
  const item = paymentItems[body.transactionId]
  if (!item) return NextResponse.json({ error: "This payment item is not available." }, { status: 404 })

  const reference = `TMG-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`
  const callbackUrl = new URL("/payment/callback", process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin)
  callbackUrl.searchParams.set("transaction", body.transactionId)
  const secret = process.env.PAYSTACK_SECRET_KEY

  if (!secret) {
    const demoAllowed = process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_SAAS_DEMO_MODE === "true"
    if (!demoAllowed) return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 })
    callbackUrl.searchParams.set("reference", reference)
    callbackUrl.searchParams.set("demo", "1")
    return NextResponse.json({ authorizationUrl: callbackUrl.toString(), reference, demo: true })
  }

  let authenticatedUser
  try { authenticatedUser = await requireFirebaseUser(request) }
  catch (error) { return NextResponse.json({ error: error instanceof Error && error.message === "SERVER_AUTH_NOT_CONFIGURED" ? "Server authentication is not configured." : "Your session could not be verified." }, { status: error instanceof Error && error.message === "SERVER_AUTH_NOT_CONFIGURED" ? 503 : 401 }) }
  if (!authenticatedUser.email || authenticatedUser.email.toLowerCase() !== body.email.trim().toLowerCase()) return NextResponse.json({ error: "The payment email must match your signed-in account." }, { status: 403 })

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: body.email,
      amount: String(item.amountNgn * 100),
      currency: "NGN",
      reference,
      callback_url: callbackUrl.toString(),
      metadata: { transactionId: body.transactionId, userId: authenticatedUser.uid, title: item.title },
      channels: ["card", "bank", "ussd", "bank_transfer"],
    }),
    cache: "no-store",
  })
  const result = await response.json()
  if (!response.ok || !result.status) return NextResponse.json({ error: result.message || "Paystack could not initialize the payment." }, { status: response.status || 502 })
  return NextResponse.json({ authorizationUrl: result.data.authorization_url, reference: result.data.reference })
}
