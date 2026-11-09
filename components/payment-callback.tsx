"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, LoaderCircle, XCircle } from "lucide-react"
import { useSaaS } from "@/components/saas-provider"

export function PaymentCallback() {
  const params = useSearchParams()
  const { recordPayment } = useSaaS()
  const [state, setState] = useState<"checking" | "success" | "error">("checking")
  const [detail, setDetail] = useState("We’re confirming the transaction with Paystack.")
  const processed = useRef(false)

  useEffect(() => {
    if (processed.current) return
    processed.current = true
    const reference = params.get("reference") || params.get("trxref")
    const transactionId = params.get("transaction")
    if (!reference || !transactionId) { setState("error"); setDetail("The payment callback is missing required information."); return }
    if (params.get("demo") === "1") {
      if (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_SAAS_DEMO_MODE === "true") { recordPayment(transactionId, reference); setState("success"); setDetail("Demo payment recorded. No real funds were charged."); return }
      setState("error"); setDetail("Simulated payments are disabled in production."); return
    }
    fetch(`/api/payments/paystack/verify?reference=${encodeURIComponent(reference)}`).then(async (response) => {
      const result = await response.json()
      if (!response.ok || !result.verified) throw new Error(result.error || "Payment has not been confirmed.")
      setState("success"); setDetail("Your payment was verified and your portfolio has been updated.")
    }).catch((error) => { setState("error"); setDetail(error instanceof Error ? error.message : "Unable to verify payment.") })
  }, [params, recordPayment])

  return <div className="w-full max-w-xl rounded-[1.5rem] bg-card p-8 text-center shadow-2xl sm:p-12">{state === "checking" ? <LoaderCircle className="mx-auto size-12 animate-spin text-primary" /> : state === "success" ? <CheckCircle2 className="mx-auto size-12 text-primary" /> : <XCircle className="mx-auto size-12 text-destructive" />}<h1 className="mt-6 font-serif text-5xl">{state === "checking" ? "Confirming payment" : state === "success" ? "Payment confirmed" : "Payment needs attention"}</h1><p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">{detail}</p><Link href="/dashboard?section=transactions" className="mt-8 inline-flex min-h-12 items-center bg-primary px-6 text-sm font-extrabold text-white">Return to transactions</Link></div>
}
