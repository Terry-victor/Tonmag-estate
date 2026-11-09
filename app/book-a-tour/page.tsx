"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, Building2, Calendar, Car, CheckCircle2, Clock, CreditCard, MapPin, Phone, User } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { auth } from "@/lib/firebase"
import { useSaaS } from "@/components/saas-provider"
import { usePublicProperties } from "@/lib/use-public-properties"

interface BookingForm {
  fullName: string
  email: string
  phone: string
  appointmentDate: string
  appointmentTime: string
  property: string
  propertyType: string
  agentFee: string
  transportation: boolean
  additionalNotes: string
}

type BankResult = {
  reference: string
  amountNgn: number
  bankDetails: { bankName: string; accountName: string; accountNumber: string }
}

export default function BookATourPage() {
  return <Suspense fallback={<main className="min-h-dvh bg-background"><Header /><div className="mx-auto h-[42rem] max-w-6xl animate-pulse px-4 py-16"><div className="h-full rounded-3xl bg-card" /></div></main>}><BookATourPageContent /></Suspense>
}

function BookATourPageContent() {
  const properties = usePublicProperties()
  const { user, ready } = useSaaS()
  const router = useRouter()
  const query = useSearchParams()
  const [formData, setFormData] = useState<BookingForm>({
    fullName: "", email: "", phone: "", appointmentDate: "", appointmentTime: "",
    property: "", propertyType: "", agentFee: "standard", transportation: false, additionalNotes: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [step, setStep] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<"paystack" | "bank_transfer">("paystack")
  const [submitting, setSubmitting] = useState(false)
  const [bookingError, setBookingError] = useState("")
  const [bankResult, setBankResult] = useState<BankResult | null>(null)

  useEffect(() => {
    if (!user) return
    setFormData((current) => ({
      ...current,
      fullName: current.fullName || user.name,
      email: current.email || user.email,
      phone: current.phone || user.phone || "",
    }))
  }, [user])

  useEffect(() => {
    const propertyId = query.get("property")
    if (propertyId && properties.some((property) => property.id === propertyId)) {
      setFormData((current) => ({ ...current, property: current.property || propertyId }))
    }
  }, [properties, query])

  useEffect(() => {
    const reference = query.get("reference")
    const booking = query.get("booking")
    if (!reference || !booking || !user) return
    void auth.currentUser?.getIdToken().then(async (token) => {
      const response = await fetch(`/api/bookings/verify?reference=${encodeURIComponent(reference)}&booking=${encodeURIComponent(booking)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        setSubmitted(true)
        setStep(2)
        window.history.replaceState(null, "", "/book-a-tour")
      } else {
        setBookingError("We could not verify that Paystack payment. Please contact support with your reference.")
        setStep(2)
      }
    })
  }, [query, user])

  const setField = (name: keyof BookingForm, value: string | boolean) => {
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!ready) return
    if (!user) {
      router.push(`/sign-in?next=${encodeURIComponent(`/book-a-tour?property=${formData.property}`)}`)
      return
    }
    setSubmitting(true)
    setBookingError("")
    try {
      const token = await auth.currentUser?.getIdToken()
      const selected = properties.find((property) => property.id === formData.property)
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          clientName: formData.fullName,
          clientEmail: formData.email,
          clientPhone: formData.phone,
          propertyId: formData.property,
          property: selected?.name || formData.property,
          scheduledFor: new Date(`${formData.appointmentDate}T${formData.appointmentTime}`).toISOString(),
          paymentMethod,
          notes: formData.additionalNotes,
          transportation: formData.transportation,
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to create booking.")
      if (paymentMethod === "paystack") window.location.assign(result.authorizationUrl)
      else {
        setBankResult(result)
        setSubmitted(true)
      }
    } catch (cause) {
      setBookingError(cause instanceof Error ? cause.message : "Unable to create booking.")
    } finally {
      setSubmitting(false)
    }
  }

  const selectedProperty = properties.find((property) => property.id === formData.property)
  const canSchedule = Boolean(formData.fullName && formData.email && formData.phone.length >= 7 && formData.appointmentDate && formData.appointmentTime)

  return <main className="min-h-screen overflow-x-clip">
    <Header />
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background px-4 py-16 sm:px-8 sm:py-20">
      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <h1 className="font-serif text-[clamp(3rem,8vw,5rem)] leading-none text-foreground">Book an inspection</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">Choose a property, select a suitable date and time, then confirm the secure payment method that works for you.</p>
      </div>
    </section>

    <section className="bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="border-border bg-card/70 backdrop-blur-sm">
              <div className="p-5 sm:p-8">
                <h2 className="mb-7 flex items-center gap-3 font-serif text-3xl sm:text-4xl"><Calendar className="size-7 text-accent" /> Schedule your tour</h2>
                <div className="mb-8 grid grid-cols-3 gap-2" aria-label="Booking progress">
                  {["Property", "Date & time", "Confirm & pay"].map((label, index) => <div key={label} className="min-w-0">
                    <div className={`h-1.5 rounded-full transition-colors ${index <= step ? "bg-accent" : "bg-border"}`} />
                    <p className={`mt-2 truncate text-[10px] font-bold uppercase tracking-wide sm:text-xs ${index <= step ? "text-foreground" : "text-muted-foreground"}`}>{label}</p>
                  </div>)}
                </div>

                {submitted ? <SuccessPanel bankResult={bankResult} /> : <form onSubmit={handleSubmit} className="space-y-6">
                  {step === 0 && <div className="space-y-5">
                    <h3 className="flex items-center gap-2 text-lg font-semibold"><MapPin className="size-5 text-accent" /> Select a property</h3>
                    <div><Label htmlFor="property">Property *</Label><Select value={formData.property} onValueChange={(value) => setField("property", value)}><SelectTrigger id="property" className="mt-2 min-h-12"><SelectValue placeholder="Choose a property" /></SelectTrigger><SelectContent>{properties.map((property) => <SelectItem key={property.id} value={property.id}>{property.name}</SelectItem>)}</SelectContent></Select></div>
                    <div><Label htmlFor="propertyType">Preferred property type</Label><Select value={formData.propertyType} onValueChange={(value) => setField("propertyType", value)}><SelectTrigger id="propertyType" className="mt-2 min-h-12"><SelectValue placeholder="Optional" /></SelectTrigger><SelectContent><SelectItem value="apartment">Apartment</SelectItem><SelectItem value="terrace">Terrace</SelectItem><SelectItem value="detached">Fully detached</SelectItem><SelectItem value="semi-detached">Semi-detached</SelectItem></SelectContent></Select></div>
                    <Button type="button" size="lg" className="w-full" disabled={!formData.property} onClick={() => setStep(1)}>Continue to date and time <ArrowRight className="size-4" /></Button>
                  </div>}

                  {step === 1 && <div className="space-y-6">
                    <div className="space-y-4"><h3 className="flex items-center gap-2 text-lg font-semibold"><User className="size-5 text-accent" /> Your information</h3><div className="grid gap-4 md:grid-cols-2">
                      <div><Label htmlFor="fullName">Full name *</Label><Input id="fullName" value={formData.fullName} onChange={(event) => setField("fullName", event.target.value)} required className="mt-2 min-h-12" /></div>
                      <div><Label htmlFor="email">Email address *</Label><Input id="email" type="email" value={formData.email} onChange={(event) => setField("email", event.target.value)} readOnly={Boolean(user?.email)} required className="mt-2 min-h-12" /></div>
                      <div className="md:col-span-2"><Label htmlFor="phone">Phone number *</Label><Input id="phone" value={formData.phone} onChange={(event) => setField("phone", event.target.value)} required className="mt-2 min-h-12" /></div>
                    </div></div>
                    <div className="space-y-4 border-t border-border pt-5"><h3 className="flex items-center gap-2 text-lg font-semibold"><Clock className="size-5 text-accent" /> Appointment details</h3><div className="grid gap-4 md:grid-cols-2">
                      <div><Label htmlFor="appointmentDate">Preferred date *</Label><Input id="appointmentDate" type="date" min={new Date().toISOString().slice(0, 10)} value={formData.appointmentDate} onChange={(event) => setField("appointmentDate", event.target.value)} required className="mt-2 min-h-12" /></div>
                      <div><Label htmlFor="appointmentTime">Preferred time *</Label><Input id="appointmentTime" type="time" value={formData.appointmentTime} onChange={(event) => setField("appointmentTime", event.target.value)} required className="mt-2 min-h-12" /></div>
                    </div></div>
                    <WizardButtons back={() => setStep(0)} next={() => setStep(2)} nextDisabled={!canSchedule} nextLabel="Review and pay" />
                  </div>}

                  {step === 2 && <div className="space-y-6">
                    <div className="rounded-2xl bg-muted/60 p-5 text-sm"><p className="font-bold">{selectedProperty?.name}</p><p className="mt-1 text-muted-foreground">{formData.appointmentDate} at {formData.appointmentTime} · {formData.fullName}</p></div>
                    <div className="space-y-4 border-b border-border pb-5"><h3 className="font-semibold">Additional services</h3>
                      <div className="flex items-start gap-3"><Checkbox id="transportation" checked={formData.transportation} onCheckedChange={(checked) => setField("transportation", Boolean(checked))} /><Label htmlFor="transportation" className="flex min-h-6 cursor-pointer items-center gap-2"><Car className="size-4 text-accent" /> Arrange transportation from hotel/airport</Label></div>
                      <div><Label htmlFor="agentFee">Consultation preference</Label><Select value={formData.agentFee} onValueChange={(value) => setField("agentFee", value)}><SelectTrigger id="agentFee" className="mt-2 min-h-12"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="standard">Standard</SelectItem><SelectItem value="premium">Premium consultation</SelectItem><SelectItem value="vip">VIP concierge</SelectItem></SelectContent></Select></div>
                      <div><Label htmlFor="additionalNotes">Additional notes</Label><textarea id="additionalNotes" value={formData.additionalNotes} onChange={(event) => setField("additionalNotes", event.target.value)} rows={4} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50" /></div>
                    </div>
                    <fieldset className="space-y-3"><legend className="mb-3 font-semibold">Payment method</legend><PaymentOption active={paymentMethod === "paystack"} onClick={() => setPaymentMethod("paystack")} icon={<CreditCard className="size-5" />} title="Paystack" detail="Pay securely by card or supported Paystack methods." /><PaymentOption active={paymentMethod === "bank_transfer"} onClick={() => setPaymentMethod("bank_transfer")} icon={<Building2 className="size-5" />} title="Bank transfer" detail="Receive account details and a unique reference. Booking stays pending until verified." /></fieldset>
                    {bookingError && <p role="alert" className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{bookingError}</p>}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><Button type="button" variant="outline" onClick={() => setStep(1)}><ArrowLeft className="size-4" /> Back</Button><Button type="submit" disabled={submitting}>{submitting ? "Preparing booking…" : paymentMethod === "paystack" ? "Continue to Paystack" : "Get bank transfer details"}</Button></div>
                  </div>}
                </form>}
              </div>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="border-border bg-card/70 p-6"><h3 className="text-xl font-bold">What to expect</h3><ul className="mt-4 space-y-3 text-sm text-muted-foreground">{["A guided walkthrough of your selected property", "Professional agent guidance and consultation", "Financing and payment-plan information", "Flexible scheduling and local orientation"].map((item) => <li key={item} className="flex gap-3"><span className="font-bold text-accent">•</span><span>{item}</span></li>)}</ul></Card>
            <Card className="border-border bg-gradient-to-br from-accent/10 to-accent/5 p-6"><h3 className="flex items-center gap-2 text-xl font-bold"><Phone className="size-5 text-accent" /> Need help?</h3><p className="mt-4 text-sm text-muted-foreground">Our team can help with properties or the booking process.</p><div className="mt-4 space-y-3 text-sm"><div><p className="font-semibold">Call us</p><p className="text-accent">+234 (0) 123 456 7890</p></div><div><p className="font-semibold">Email us</p><p className="break-all text-accent">tours@tonmag.com</p></div></div></Card>
            <Card className="border-border bg-card/70 p-6"><h3 className="text-lg font-bold">Tour duration</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Allow 60–90 minutes for the walkthrough, amenities, investment discussion, and questions.</p></Card>
          </aside>
        </div>
      </div>
    </section>
    <Footer />
  </main>
}

function WizardButtons({ back, next, nextDisabled, nextLabel }: { back: () => void; next: () => void; nextDisabled: boolean; nextLabel: string }) {
  return <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><Button type="button" variant="outline" onClick={back}><ArrowLeft className="size-4" /> Back</Button><Button type="button" disabled={nextDisabled} onClick={next}>{nextLabel} <ArrowRight className="size-4" /></Button></div>
}

function PaymentOption({ active, onClick, icon, title, detail }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; detail: string }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={`flex min-h-16 w-full items-start gap-4 rounded-xl border p-4 text-left transition ${active ? "border-accent bg-accent/5" : "border-border hover:border-accent/40"}`}><span className="mt-0.5 text-accent">{icon}</span><span><strong className="block">{title}</strong><span className="text-sm leading-6 text-muted-foreground">{detail}</span></span></button>
}

function SuccessPanel({ bankResult }: { bankResult: BankResult | null }) {
  return <div className="rounded-2xl border border-green-500/40 bg-green-500/10 p-5 text-green-800"><div className="flex items-center gap-3 font-semibold"><CheckCircle2 className="size-5" /> Booking received</div><p className="mt-2 text-sm">{bankResult ? "Your bank-transfer booking is awaiting verification. Use the exact reference below." : "Your Paystack payment was verified and the inspection is confirmed."}</p>{bankResult && <div className="mt-5 space-y-2 rounded-xl bg-background p-4 text-sm text-foreground"><p><strong>Bank:</strong> {bankResult.bankDetails.bankName}</p><p><strong>Account:</strong> {bankResult.bankDetails.accountName}</p><p><strong>Account number:</strong> {bankResult.bankDetails.accountNumber}</p><p><strong>Amount:</strong> {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(bankResult.amountNgn)}</p><p className="break-all rounded-lg bg-accent/10 p-3 font-mono font-bold text-accent">Reference: {bankResult.reference}</p><p className="text-muted-foreground">Include this reference in the transfer narration. Operations will verify payment before confirming the inspection.</p></div>}</div>
}
