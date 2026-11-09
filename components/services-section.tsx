import Image from "next/image"
import { ClipboardCheck, FileSearch, Hammer, HousePlug } from "lucide-react"

const services = [
  { icon: FileSearch, title: "Title & permit verification", copy: "Named legal review with dated evidence." },
  { icon: ClipboardCheck, title: "Remote property inspections", copy: "Live video, written findings, and captions." },
  { icon: Hammer, title: "Construction oversight", copy: "Milestone reports, site media, and approvals." },
  { icon: HousePlug, title: "Property management", copy: "Tenancy, maintenance, and local representation." },
]

export function ServicesSection() {
  return (
    <section className="bg-background px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-2 lg:items-stretch">
        <div className="relative min-h-[520px] overflow-hidden rounded-[1.5rem]"><Image src="/worker.jpg" alt="TONMAG construction professional reviewing a site" fill className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" /><p className="absolute bottom-7 left-7 max-w-sm font-serif text-3xl leading-none text-white">Your eyes, expertise, and advocate on the ground.</p></div>
        <div className="flex flex-col justify-center"><p className="luxury-eyebrow mb-4">Beyond the keys</p><h2 className="font-serif text-5xl leading-none sm:text-6xl">Local care for every stage of ownership.</h2><div className="mt-10 divide-y divide-border border-y border-border">{services.map(({ icon: Icon, title, copy }) => <div key={title} className="grid grid-cols-[48px_1fr] gap-4 py-6"><span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary"><Icon className="size-5" /></span><div><h3 className="font-serif text-2xl">{title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{copy}</p></div></div>)}</div></div>
      </div>
    </section>
  )
}
