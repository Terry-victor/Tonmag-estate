import Link from "next/link"

export function AuthPageShell({ children }: { children: React.ReactNode }) {
  return <main className="grid min-h-screen bg-background lg:grid-cols-[.9fr_1.1fr]">
    <div className="flex items-center justify-center px-5 py-10 sm:px-8"><div className="w-full"><Link href="/" className="mx-auto mb-8 flex w-fit items-center gap-3 lg:mx-0 lg:ml-[max(0px,calc((100vw-1440px)/2))]"><span className="grid size-10 place-items-center border border-primary bg-navy font-serif text-2xl text-white">T</span><span className="font-extrabold tracking-[.16em]">TONMAG</span></Link><div className="flex justify-center">{children}</div></div></div>
    <div className="relative hidden overflow-hidden bg-[url('/NICE.JPG')] bg-cover bg-center lg:block"><div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/35 to-transparent" /><div className="absolute bottom-16 left-14 max-w-xl text-white"><p className="mb-4 text-xs font-bold uppercase tracking-[.22em] text-[#e4bd79]">The diaspora ownership platform</p><p className="font-serif text-6xl leading-[.92]">Your Nigerian property life, in one secure place.</p><div className="mt-7 flex gap-6 text-sm text-white/65"><span>Verified documents</span><span>Remote inspections</span><span>Secure payments</span></div></div></div>
  </main>
}
