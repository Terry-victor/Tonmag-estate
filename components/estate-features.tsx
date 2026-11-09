import { BatteryCharging, Cctv, Droplets, Smartphone, Trees } from "lucide-react"

const features = [
  { icon: Cctv, title: "Layered security", text: "Controlled access, CCTV, and professional estate response." },
  { icon: BatteryCharging, title: "Resilient power", text: "Grid, backup, and solar-ready energy designed for daily life." },
  { icon: Droplets, title: "Treated water", text: "Reliable supply with managed treatment and storage systems." },
  { icon: Smartphone, title: "Remote access", text: "Monitor updates and request assistance from your dashboard." },
  { icon: Trees, title: "Considered landscape", text: "Generous planting, shade, and calm shared outdoor spaces." },
]

export function EstateFeatures() {
  return (
    <section className="bg-navy px-5 py-24 text-white sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-3xl"><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#e4bd79]">Made for dependable living</p><h2 className="font-serif text-5xl leading-none sm:text-7xl">Luxury is what works, quietly.</h2></div>
        <div className="mt-14 grid gap-px overflow-hidden border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-5">{features.map(({ icon: Icon, title, text }) => <article key={title} className="bg-navy p-7"><Icon className="size-6 text-[#e4bd79]" /><h3 className="mt-12 font-serif text-2xl leading-none">{title}</h3><p className="mt-4 text-sm leading-6 text-white/60">{text}</p></article>)}</div>
      </div>
    </section>
  )
}
