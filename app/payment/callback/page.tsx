import { Suspense } from "react"
import { PaymentCallback } from "@/components/payment-callback"
export default function PaymentCallbackPage() { return <main className="grid min-h-screen place-items-center bg-navy px-5 py-10"><Suspense fallback={<div className="text-white">Confirming payment…</div>}><PaymentCallback /></Suspense></main> }
