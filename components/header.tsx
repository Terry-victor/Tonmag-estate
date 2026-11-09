"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, Moon, Sun, X } from "lucide-react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { AccountMenu } from "@/components/account-menu"

const navigation = [
  { href: "/projects", label: "Properties" },
  { href: "/investment-plans", label: "Invest" },
  { href: "/credibility-legal", label: "Verification" },
  { href: "/about", label: "About" },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 56)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])
  useEffect(() => setOpen(false), [pathname])
  const overHero = pathname === "/" && !scrolled

  return (
    <header className={`${pathname === "/" ? "fixed inset-x-0" : "sticky"} top-0 z-50 transition-colors duration-300 ${overHero ? "border-b border-white/10 bg-black/10 text-white backdrop-blur-md" : "border-b border-border/80 bg-background/95 text-foreground backdrop-blur-xl"}`}>
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex min-h-12 items-center gap-3" aria-label="TONMAG home">
          <span className="grid size-10 place-items-center border border-primary bg-navy font-serif text-2xl text-white">T</span>
          <span className="leading-none">
            <span className="block text-base font-extrabold tracking-[0.16em]">TONMAG</span>
            <span className={`mt-1 block text-[0.58rem] font-semibold uppercase tracking-[0.25em] ${overHero ? "text-white/65" : "text-muted-foreground"}`}>Homes · Nigeria</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {navigation.map((item) => (
            <div key={item.href} className="group relative">
              <Link href={item.href} className={`flex min-h-12 items-center gap-1 text-sm font-semibold transition hover:text-primary ${overHero ? "text-white/85" : "text-foreground/80"}`}>
                {item.label}
              </Link>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className={`grid size-12 place-items-center rounded-full hover:bg-muted/30 ${overHero ? "text-white" : "text-foreground"}`}
              aria-label={`Use ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
            >
              {resolvedTheme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </button>
          )}
          <AccountMenu />
          <Link href="/book-a-tour" className="hidden min-h-12 items-center bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 sm:flex">Request inspection</Link>
          <button type="button" onClick={() => setOpen(!open)} className="grid size-12 place-items-center lg:hidden" aria-expanded={open} aria-controls="mobile-navigation" aria-label="Toggle navigation">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-navigation" className="border-t border-border bg-card px-5 py-5 lg:hidden" aria-label="Mobile navigation">
          <div className="mx-auto max-w-[1440px] space-y-1">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-border/70 py-2 font-semibold">{item.label}</Link>
            ))}
            <AccountMenu mobile closeMenu={() => setOpen(false)} />
            <Link href="/book-a-tour" onClick={() => setOpen(false)} className="mt-4 flex min-h-12 items-center justify-center bg-primary px-5 font-bold text-primary-foreground">Request inspection</Link>
          </div>
        </nav>
      )}
    </header>
  )
}
