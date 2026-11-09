"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ArrowRight, Bath, BedDouble, Building2, Calculator, CalendarDays, Camera, Car, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Compass, FileCheck2, GraduationCap, Heart, Hospital, Info, KeyRound, Landmark, MapPin, Maximize2, Plane, Play, Share2, ShieldCheck, Sparkles, TreePine, WalletCards, X } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PropertyCard } from "@/components/property-card"
import { Reveal } from "@/components/reveal"
import { useSaaS } from "@/components/saas-provider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { formatNaira } from "@/lib/properties"
import { usePublicProperties } from "@/lib/use-public-properties"

const tourCaptions = [
  "Arrival — a private, landscaped approach creates distance from the street.",
  "Living — generous glazing brings natural light deep into the main rooms.",
  "Materials — stone, warm timber, and quiet metal details anchor the interior.",
  "Outdoors — considered terraces extend daily life beyond the building line.",
]

export default function ViewProjectPage() {
  const properties = usePublicProperties()
  const params = useParams<{ id: string }>()
  const property = properties.find((item) => item.id === params.id) ?? properties[0]
  const { user, data, toggleSaved } = useSaaS()
  const saved = data.savedPropertyIds.includes(property.id)
  const [activeImage, setActiveImage] = useState(0)
  const [tourOpen, setTourOpen] = useState(false)
  const [shareNotice, setShareNotice] = useState("")
  const [depositPercent, setDepositPercent] = useState(30)
  const [months, setMonths] = useState(18)

  const previousImage = () => setActiveImage((current) => (current - 1 + property.images.length) % property.images.length)
  const nextImage = () => setActiveImage((current) => (current + 1) % property.images.length)
  const foreignTotal = Number(property.priceForeign.replace(/[^0-9.]/g, ""))
  const foreignSymbol = property.priceForeign.replace(/[0-9,.\s]/g, "")
  const deposit = property.priceNgn * depositPercent / 100
  const monthly = (property.priceNgn - deposit) / months
  const foreignMonthly = (foreignTotal * (1 - depositPercent / 100)) / months
  const legalFee = property.priceNgn * .015
  const agencyFee = property.priceNgn * .02
  const totalAcquisition = property.priceNgn + legalFee + agencyFee + property.serviceChargeNgn
  const related = useMemo(() => properties.filter((item) => item.id !== property.id).slice(0, 3), [property.id])

  useEffect(() => {
    if (!tourOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTourOpen(false)
      if (event.key === "ArrowRight") nextImage()
      if (event.key === "ArrowLeft") previousImage()
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKeyDown) }
  }, [tourOpen, property.images.length])

  const share = async () => {
    if (navigator.share) await navigator.share({ title: property.name, text: `${property.name} · ${property.location}`, url: window.location.href })
    else { await navigator.clipboard.writeText(window.location.href); setShareNotice("Link copied"); window.setTimeout(() => setShareNotice(""), 1800) }
  }

  return (
    <main className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />

      <section className="relative min-h-[calc(100svh-76px)] overflow-hidden bg-navy text-white">
        <Image src={property.images[activeImage]} alt={`${property.name}, view ${activeImage + 1}`} fill priority sizes="100vw" className="object-cover transition-opacity duration-700" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,22,32,.2)_0%,rgba(5,22,32,.16)_42%,rgba(5,22,32,.9)_100%)]" />

        <div className="absolute inset-x-0 top-0 z-10 mx-auto flex max-w-[1600px] items-center justify-between p-5 sm:p-8">
          <Link href="/search" className="flex min-h-12 items-center gap-2 rounded-full bg-white/92 px-5 text-sm font-bold text-navy shadow-lg backdrop-blur"><ArrowLeft className="size-4" /> Back to homes</Link>
          <div className="flex gap-2">
            <button onClick={() => user ? toggleSaved(property.id) : window.location.assign("/sign-in")} className="flex min-h-12 items-center gap-2 rounded-full bg-white/92 px-4 text-sm font-bold text-navy shadow-lg" aria-pressed={saved}><Heart className={`size-5 ${saved ? "fill-primary text-primary" : ""}`} /> <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span></button>
            <button onClick={share} className="grid size-12 place-items-center rounded-full bg-white/92 text-navy shadow-lg" aria-label="Share property"><Share2 className="size-5" /></button>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1600px] px-5 pb-8 sm:px-8 sm:pb-12 lg:pb-16">
          <div className="max-w-5xl">
            <div className="mb-5 flex flex-wrap items-center gap-3"><span className="bg-primary px-4 py-2 text-[.68rem] font-extrabold uppercase tracking-[.18em]">{property.badge}</span><span className="text-xs font-bold uppercase tracking-[.18em] text-white/70">{property.type} · {property.status}</span></div>
            <h1 className="max-w-5xl font-serif text-[clamp(3.5rem,7.8vw,7.8rem)] leading-[.82] tracking-[-.035em]">{property.name}</h1>
            <div className="mt-7 flex flex-col justify-between gap-6 md:flex-row md:items-end"><p className="flex items-center gap-2 text-base text-white/76"><MapPin className="size-5 text-[#e4bd79]" /> {property.location}</p><div className="flex flex-wrap gap-3"><button onClick={() => setTourOpen(true)} className="flex min-h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-extrabold text-navy"><Play className="size-4 fill-navy" /> Start guided tour</button><span className="flex min-h-12 items-center gap-2 rounded-full border border-white/25 bg-black/20 px-5 text-sm font-bold backdrop-blur"><Camera className="size-4" /> {activeImage + 1} / {property.images.length}</span></div></div>
          </div>
        </div>

        <button onClick={previousImage} className="absolute left-5 top-1/2 z-10 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/25 backdrop-blur hover:bg-black/45 md:grid" aria-label="Previous image"><ChevronLeft /></button>
        <button onClick={nextImage} className="absolute right-5 top-1/2 z-10 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/25 backdrop-blur hover:bg-black/45 md:grid" aria-label="Next image"><ChevronRight /></button>
        {shareNotice && <div role="status" className="absolute right-5 top-24 z-20 rounded-full bg-navy px-4 py-2 text-xs font-bold">{shareNotice}</div>}
      </section>

      <div className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-y divide-border px-5 sm:grid-cols-3 sm:px-8 lg:grid-cols-6 lg:divide-y-0">
          <Fact icon={BedDouble} label="Bedrooms" value={String(property.beds)} />
          <Fact icon={Bath} label="Bathrooms" value={String(property.baths)} />
          <Fact icon={Maximize2} label="Internal area" value={`${property.sqm} m²`} />
          <Fact icon={Car} label="Parking" value={`${property.parking} cars`} />
          <Fact icon={CalendarDays} label="Completion" value={property.year} />
          <Fact icon={KeyRound} label="Inspection" value={property.inspection} />
        </div>
      </div>

      <Reveal>
        <section className="bg-card px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[1fr_390px] lg:gap-20">
            <div>
              <p className="luxury-eyebrow mb-5">The residence</p>
              <h2 className="max-w-4xl font-serif text-5xl leading-[.96] sm:text-7xl">Designed to make distance disappear.</h2>
              <p className="mt-8 max-w-3xl text-lg leading-9 text-muted-foreground">{property.description}</p>
              <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
                {property.highlights.map((highlight, index) => <div key={highlight} className="flex min-h-28 items-start gap-4 bg-background p-6"><span className="font-serif text-2xl text-primary">0{index + 1}</span><p className="font-serif text-2xl leading-tight">{highlight}</p></div>)}
              </div>

              <Accordion type="multiple" defaultValue={["interior"]} className="mt-12 border-t border-border">
                <AccordionItem value="interior"><AccordionTrigger className="min-h-20 font-serif text-3xl hover:no-underline">Interior specification</AccordionTrigger><AccordionContent><div className="grid gap-4 text-base leading-7 text-muted-foreground sm:grid-cols-2">{property.amenities.slice(0, 4).map((item) => <p key={item} className="flex gap-3"><CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />{item}</p>)}</div></AccordionContent></AccordionItem>
                <AccordionItem value="amenities"><AccordionTrigger className="min-h-20 font-serif text-3xl hover:no-underline">Amenities & services</AccordionTrigger><AccordionContent><div className="grid gap-4 text-base leading-7 text-muted-foreground sm:grid-cols-2">{property.amenities.map((item) => <p key={item} className="flex gap-3"><CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />{item}</p>)}</div></AccordionContent></AccordionItem>
                <AccordionItem value="ownership"><AccordionTrigger className="min-h-20 font-serif text-3xl hover:no-underline">Ownership & management</AccordionTrigger><AccordionContent className="space-y-3 text-base leading-7 text-muted-foreground"><p>Title: {property.titleType}</p><p>Annual service charge guide: {formatNaira(property.serviceChargeNgn)}</p><p>Remote maintenance, tenancy support, document custody, and periodic inspections are available through TONMAG.</p></AccordionContent></AccordionItem>
              </Accordion>
            </div>

            <aside>
              <div className="sticky top-28 space-y-6 rounded-[1.5rem] border border-border bg-background p-6 shadow-[0_22px_70px_rgba(8,25,39,.09)] sm:p-8">
                <div><p className="text-sm font-semibold text-muted-foreground">Asking price</p><p className="mt-2 text-3xl font-bold tracking-tight">{formatNaira(property.priceNgn)}</p><p className="mt-1 text-sm text-muted-foreground">{property.priceForeign} · indicative {property.foreignCurrency}</p></div>
                <div className="flex gap-3 border-y border-border py-5 text-xs leading-relaxed text-muted-foreground"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" /><p><strong className="block text-sm text-foreground">Title verified</strong>{property.verifiedDate} · {property.verifiedBy}<br />Permit {property.permit}</p></div>
                <Button asChild className="min-h-14 w-full text-sm font-extrabold"><Link href={`/book-a-tour?property=${property.id}`}>Request inspection</Link></Button>
                <Button asChild variant="outline" className="min-h-14 w-full text-sm font-extrabold"><Link href="/contact">Talk to an agent</Link></Button>
                <p className="text-center text-xs leading-5 text-muted-foreground">No obligation. A diaspora adviser typically responds within 30 minutes.</p>
              </div>
            </aside>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-background px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-12 max-w-3xl"><p className="luxury-eyebrow mb-4">Verification dossier</p><h2 className="font-serif text-5xl leading-none sm:text-7xl">Trust, made specific.</h2><p className="mt-6 leading-8 text-muted-foreground">Not a generic checkmark. These are the records reviewed before this home entered the TONMAG collection.</p></div>
            <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 xl:grid-cols-4">
              <VerificationCard icon={Landmark} title="Title search" value={property.titleType} detail={`Reviewed ${property.verifiedDate}`} />
              <VerificationCard icon={FileCheck2} title="Planning record" value={property.permit} detail="Permit reference matched" />
              <VerificationCard icon={ShieldCheck} title="Reviewer" value={property.verifiedBy} detail="Named verification party" />
              <VerificationCard icon={Building2} title="Physical review" value="Site inspected" detail="Identity and condition recorded" />
            </div>
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/8 p-5 text-sm leading-6"><Info className="mt-0.5 size-5 shrink-0 text-primary" /><p>Verification supports due diligence but does not replace independent legal advice. Your adviser can arrange a solicitor and share the complete document pack through your secure vault.</p></div>
          </div>
        </section>
      </Reveal>

      <section className="grid bg-navy text-white lg:grid-cols-2">
        <div className="relative min-h-[62svh] overflow-hidden"><Image src={property.images[1] || property.image} alt={`${property.name} interior`} fill className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-navy/75 to-transparent" /><p className="absolute bottom-8 left-8 max-w-sm font-serif text-3xl leading-none">Materials chosen to feel better with time, not simply photograph well.</p></div>
        <div className="flex min-h-[62svh] flex-col justify-center p-8 sm:p-14 lg:p-20"><p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#e4bd79]">A closer look</p><h2 className="font-serif text-5xl leading-none sm:text-6xl">Walk through, room by room.</h2><p className="mt-6 max-w-xl text-base leading-8 text-white/66">The guided gallery combines the available property media with clear captions, so you understand what you are seeing even with sound off.</p><button onClick={() => setTourOpen(true)} className="mt-9 flex min-h-14 w-fit items-center gap-3 rounded-full bg-white px-6 text-sm font-extrabold text-navy"><Play className="size-4 fill-navy" /> Start the captioned tour</button><div className="mt-12 grid grid-cols-3 gap-3">{property.images.slice(1).map((image, index) => <button key={image} onClick={() => { setActiveImage(index + 1); setTourOpen(true) }} className="relative aspect-square overflow-hidden rounded-xl"><Image src={image} alt={`Open view ${index + 2}`} fill className="object-cover transition duration-500 hover:scale-105" /></button>)}</div></div>
      </section>

      <Reveal>
        <section className="bg-card px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
              <div><p className="luxury-eyebrow mb-4">Payment planner</p><h2 className="font-serif text-5xl leading-none sm:text-7xl">See the path to ownership.</h2><p className="mt-6 leading-8 text-muted-foreground">Explore an illustrative milestone structure before speaking with an adviser. Final terms depend on the property and contract.</p><div className="mt-8 flex items-center gap-3 text-sm font-bold"><Calculator className="text-primary" /> Live scenario · no enquiry required</div></div>
              <div className="rounded-[1.5rem] border border-border bg-background p-6 sm:p-9">
                <div className="grid gap-8 sm:grid-cols-2">
                  <label><span className="flex justify-between text-sm font-bold"><span>Initial deposit</span><span>{depositPercent}%</span></span><input type="range" min="20" max="80" step="5" value={depositPercent} onChange={(event) => setDepositPercent(Number(event.target.value))} className="mt-5 w-full accent-[#a57b38]" /><span className="mt-2 block text-xs text-muted-foreground">{formatNaira(deposit)} upfront</span></label>
                  <label><span className="flex justify-between text-sm font-bold"><span>Payment period</span><span>{months} months</span></span><input type="range" min="6" max="36" step="6" value={months} onChange={(event) => setMonths(Number(event.target.value))} className="mt-5 w-full accent-[#a57b38]" /><span className="mt-2 block text-xs text-muted-foreground">Illustrative construction milestones</span></label>
                </div>
                <div className="mt-9 grid gap-4 border-y border-border py-7 sm:grid-cols-3"><FinancialMetric label="Deposit" value={formatNaira(deposit)} sub={`${foreignSymbol}${Math.round(foreignTotal * depositPercent / 100).toLocaleString()} ${property.foreignCurrency}`} /><FinancialMetric label="Balance" value={formatNaira(property.priceNgn - deposit)} sub="Before acquisition costs" /><FinancialMetric label="Monthly guide" value={formatNaira(monthly)} sub={`${foreignSymbol}${Math.round(foreignMonthly).toLocaleString()} ${property.foreignCurrency}`} /></div>
                <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2"><CostRow label="Property price" value={formatNaira(property.priceNgn)} /><CostRow label="Legal estimate · 1.5%" value={formatNaira(legalFee)} /><CostRow label="Agency estimate · 2%" value={formatNaira(agencyFee)} /><CostRow label="Year-one service charge" value={formatNaira(property.serviceChargeNgn)} /><div className="mt-2 flex justify-between border-t border-border pt-4 font-bold sm:col-span-2"><span>Estimated acquisition total</span><span>{formatNaira(totalAcquisition)}</span></div></div>
                <Button asChild className="mt-8 min-h-14 w-full"><Link href="/contact"><WalletCards /> Discuss this payment plan</Link></Button>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-background px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-[1440px]"><div className="mb-12 grid gap-6 lg:grid-cols-2 lg:items-end"><div><p className="luxury-eyebrow mb-4">The neighbourhood</p><h2 className="font-serif text-5xl leading-none sm:text-7xl">Life around {property.area}.</h2></div><p className="max-w-xl leading-8 text-muted-foreground">Travel times are indicative and vary with Lagos or Abuja traffic. Your inspection pack includes a local orientation and live route checks.</p></div><div className="grid overflow-hidden rounded-[1.5rem] border border-border lg:grid-cols-[1.2fr_.8fr]"><div className="map-grid relative min-h-[480px]"><div className="absolute left-[52%] top-[46%] -translate-x-1/2 -translate-y-1/2"><span className="absolute inset-0 animate-ping rounded-full bg-primary/35" /><span className="relative grid size-16 place-items-center rounded-full border-4 border-white bg-navy text-white shadow-2xl"><HomePin /></span></div><div className="absolute bottom-5 left-5 rounded-full bg-card px-4 py-2 text-xs font-bold shadow-lg">{property.location}</div></div><div className="bg-card p-7 sm:p-10"><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Nearby</p><div className="mt-7 divide-y divide-border">{property.nearby.map((place) => <div key={place.name} className="flex items-center gap-4 py-5"><span className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary">{place.type === "airport" ? <Plane className="size-5" /> : place.type === "school" ? <GraduationCap className="size-5" /> : place.type === "health" ? <Hospital className="size-5" /> : <TreePine className="size-5" />}</span><div className="flex-1"><p className="font-bold">{place.name}</p><p className="text-xs text-muted-foreground">By car, typical traffic</p></div><strong className="text-sm">{place.time}</strong></div>)}</div><div className="mt-7 flex items-center gap-3 rounded-xl bg-muted p-4 text-sm"><Compass className="text-primary" /> Neighbourhood guide available after sign-in.</div></div></div></div>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-navy px-5 py-20 text-white sm:px-8 lg:py-28"><div className="mx-auto max-w-[1440px]"><div className="max-w-3xl"><p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#e4bd79]">From interest to keys</p><h2 className="font-serif text-5xl leading-none sm:text-7xl">A visible ownership journey.</h2></div><div className="mt-14 grid gap-px overflow-hidden border border-white/15 bg-white/15 md:grid-cols-4"><TimelineStep number="01" title="Private inspection" detail="Live, representative, or in person" /><TimelineStep number="02" title="Legal review" detail="Independent advice and document vault" /><TimelineStep number="03" title="Reservation & payments" detail="Server-verified receipts in your portfolio" /><TimelineStep number="04" title="Handover & care" detail="Snagging, keys, management, and maintenance" /></div></div></section>
      </Reveal>

      <Reveal>
        <section className="bg-card px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto max-w-[1440px]"><div className="mb-10 flex items-end justify-between gap-5"><div><p className="luxury-eyebrow mb-3">Continue exploring</p><h2 className="font-serif text-5xl leading-none">You may also like.</h2></div><Link href="/search" className="hidden min-h-12 items-center gap-2 text-sm font-bold text-primary sm:flex">All verified homes <ArrowRight className="size-4" /></Link></div><div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">{related.map((item) => <PropertyCard key={item.id} property={item} />)}</div></div></section>
      </Reveal>

      <section className="bg-primary px-5 py-16 text-white sm:px-8"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 lg:flex-row lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-white/70">Ready for a closer look?</p><h2 className="mt-3 font-serif text-5xl leading-none sm:text-6xl">See it as if you were here.</h2></div><div className="flex flex-col gap-3 sm:flex-row"><Button asChild className="min-h-14 bg-white px-7 text-navy hover:bg-white/90"><Link href={`/book-a-tour?property=${property.id}`}>Request inspection</Link></Button><Button asChild variant="outline" className="min-h-14 border-white/35 bg-transparent px-7 text-white hover:bg-white hover:text-navy"><Link href="/contact">Talk to an agent</Link></Button></div></div></section>

      <Footer />

      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-border bg-card/96 p-3 pb-[max(.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden"><div className="min-w-0"><p className="truncate text-xs text-muted-foreground">{property.priceForeign}</p><p className="truncate text-sm font-bold">{formatNaira(property.priceNgn)}</p></div><Button asChild className="min-h-12"><Link href={`/book-a-tour?property=${property.id}`}>Request inspection</Link></Button></div>

      {tourOpen && <div className="fixed inset-0 z-[100] bg-[#020b11] text-white" role="dialog" aria-modal="true" aria-label={`${property.name} guided tour`}><Image src={property.images[activeImage]} alt={`${property.name}, guided view ${activeImage + 1}`} fill priority className="object-contain" /><div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/45" /><div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-8"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#e4bd79]">Guided tour</p><p className="mt-1 font-serif text-2xl">{property.name}</p></div><button onClick={() => setTourOpen(false)} className="grid size-12 place-items-center rounded-full border border-white/30 bg-black/20" aria-label="Close tour"><X /></button></div><button onClick={previousImage} className="absolute left-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/25 sm:left-8" aria-label="Previous view"><ChevronLeft /></button><button onClick={nextImage} className="absolute right-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/25 sm:right-8" aria-label="Next view"><ChevronRight /></button><div className="absolute inset-x-0 bottom-0 p-5 sm:p-8"><div className="mx-auto max-w-4xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#e4bd79]">View {activeImage + 1} of {property.images.length}</p><p className="mt-3 max-w-3xl font-serif text-3xl leading-tight sm:text-5xl">{tourCaptions[activeImage] || tourCaptions[0]}</p><div className="mt-6 flex gap-2">{property.images.map((_, index) => <button key={index} onClick={() => setActiveImage(index)} className={`h-1.5 rounded-full transition-all ${index === activeImage ? "w-12 bg-[#c99b50]" : "w-6 bg-white/35"}`} aria-label={`Go to view ${index + 1}`} />)}</div></div></div></div>}
    </main>
  )
}

function Fact({ icon: Icon, label, value }: { icon: typeof BedDouble; label: string; value: string }) { return <div className="flex min-h-28 flex-col justify-center px-4 py-5 sm:px-6"><Icon className="size-5 text-primary" /><p className="mt-3 text-[.65rem] font-bold uppercase tracking-[.16em] text-muted-foreground">{label}</p><p className="mt-1 font-serif text-xl">{value}</p></div> }
function VerificationCard({ icon: Icon, title, value, detail }: { icon: typeof Landmark; title: string; value: string; detail: string }) { return <article className="bg-card p-7"><span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary"><Icon /></span><p className="mt-10 text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">{title}</p><h3 className="mt-2 font-serif text-2xl leading-tight">{value}</h3><p className="mt-3 text-sm text-muted-foreground">{detail}</p></article> }
function FinancialMetric({ label, value, sub }: { label: string; value: string; sub: string }) { return <div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-2 font-serif text-2xl">{value}</p><p className="mt-1 text-xs text-muted-foreground">{sub}</p></div> }
function CostRow({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-3"><span className="text-muted-foreground">{label}</span><strong>{value}</strong></div> }
function TimelineStep({ number, title, detail }: { number: string; title: string; detail: string }) { return <article className="bg-navy p-7 sm:p-9"><span className="font-serif text-3xl text-[#e4bd79]">{number}</span><h3 className="mt-14 font-serif text-3xl leading-none">{title}</h3><p className="mt-4 text-sm leading-6 text-white/58">{detail}</p></article> }
function HomePin() { return <MapPin className="size-7 fill-white" /> }
