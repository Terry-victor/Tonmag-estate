"use client"

import { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Globe2 } from "lucide-react"
import { useSaaS } from "@/components/saas-provider"
import type { Currency } from "@/lib/saas-types"

export default function OnboardingPage() {
  const { user, ready, updateProfile } = useSaaS()
  const router = useRouter()
  const [name, setName] = useState(user?.name || "")
  const [phone, setPhone] = useState("")
  const [homeMarket, setHomeMarket] = useState("United Kingdom")
  const [currency, setCurrency] = useState<Currency>("GBP")
  useEffect(() => { if (ready && !user) router.replace("/sign-in"); if (user) setName(user.name) }, [ready, user, router])
  const submit = async (event: FormEvent) => { event.preventDefault(); await updateProfile({ name, phone, homeMarket, currency }); router.push("/dashboard") }
  if (!user) return null
  return <main className="grid min-h-screen place-items-center bg-navy px-5 py-10"><div className="w-full max-w-2xl rounded-[1.5rem] bg-card p-7 sm:p-12"><span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary"><Globe2 /></span><p className="luxury-eyebrow mt-7">Account setup · 1 of 1</p><h1 className="mt-3 font-serif text-5xl leading-none">Make the platform feel local to you.</h1><p className="mt-4 text-sm leading-6 text-muted-foreground">We’ll use these preferences for dual-currency pricing, inspection times, and payment reminders.</p><form onSubmit={submit} className="mt-9 grid gap-5 sm:grid-cols-2">{[
    ["Full name", name, setName, "text"], ["Phone / WhatsApp", phone, setPhone, "tel"]
  ].map(([label, value, setter, type]) => <label key={String(label)}><span className="mb-2 block text-xs font-bold uppercase tracking-wider">{String(label)}</span><input required={label === "Full name"} type={String(type)} value={String(value)} onChange={(e) => (setter as (value: string) => void)(e.target.value)} className="min-h-12 w-full rounded-xl border border-border bg-background px-4 text-sm" /></label>)}<label><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Country of residence</span><select value={homeMarket} onChange={(e) => setHomeMarket(e.target.value)} className="min-h-12 w-full rounded-xl border border-border bg-background px-4 text-sm"><option>United Kingdom</option><option>United States</option><option>Canada</option><option>Europe</option><option>United Arab Emirates</option><option>Nigeria</option></select></label><label><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Preferred currency</span><select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="min-h-12 w-full rounded-xl border border-border bg-background px-4 text-sm"><option>GBP</option><option>USD</option><option>CAD</option><option>EUR</option></select></label><button className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-extrabold text-white sm:col-span-2">Finish account setup <Check className="size-4" /></button></form></div></main>
}
