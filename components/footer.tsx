import Link from "next/link"
import { ArrowUpRight, Instagram, Linkedin, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#061721] px-5 text-white sm:px-8">
      <div className="mx-auto max-w-[1440px] py-16 lg:py-20">
        <div className="grid gap-12 border-b border-white/12 pb-14 lg:grid-cols-[1.2fr_.8fr_.8fr]">
          <div><div className="flex items-center gap-3"><span className="grid size-11 place-items-center border border-[#c99b50] font-serif text-2xl">T</span><span className="font-extrabold tracking-[.16em]">TONMAG</span></div><h2 className="mt-8 max-w-xl font-serif text-4xl leading-none sm:text-5xl">A trusted Nigerian home, wherever life takes you.</h2><Link href="/contact" className="mt-8 inline-flex min-h-12 items-center gap-2 bg-primary px-6 text-sm font-extrabold text-white">Talk to an agent <ArrowUpRight className="size-4" /></Link></div>
          <div><h3 className="text-xs font-bold uppercase tracking-[.18em] text-[#e4bd79]">Explore</h3><nav className="mt-5 grid gap-3 text-sm text-white/68"><Link href="/search">Find a property</Link><Link href="/projects">Collections</Link><Link href="/investment-plans">Investment plans</Link><Link href="/credibility-legal">Verification</Link><Link href="/dashboard">My portfolio</Link></nav></div>
          <div><h3 className="text-xs font-bold uppercase tracking-[.18em] text-[#e4bd79]">Get in touch</h3><div className="mt-5 space-y-2 text-sm leading-6 text-white/68"><p>Abuja · Lagos · Diaspora desk</p><p>hello@tonmaghomes.com</p><p>+234 815 191 6956</p></div><div className="mt-6 flex gap-2"><a href="https://wa.me/2348151916956" className="grid size-12 place-items-center rounded-full border border-white/20 hover:border-[#c99b50]" aria-label="TONMAG on WhatsApp"><MessageCircle /></a><a href="#" className="grid size-12 place-items-center rounded-full border border-white/20 hover:border-[#c99b50]" aria-label="TONMAG on Instagram"><Instagram /></a><a href="#" className="grid size-12 place-items-center rounded-full border border-white/20 hover:border-[#c99b50]" aria-label="TONMAG on LinkedIn"><Linkedin /></a></div></div>
        </div>
        <div className="flex flex-col gap-4 pt-7 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} TONMAG Homes. All rights reserved.</p><div className="flex gap-6"><Link href="#">Privacy</Link><Link href="#">Terms</Link><Link href="#">Accessibility</Link></div></div>
      </div>
    </footer>
  )
}
