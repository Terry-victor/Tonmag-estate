"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, ChevronDown, LogOut, UserRound } from "lucide-react"
import { useSaaS } from "@/components/saas-provider"

export function AccountMenu({ mobile = false, closeMenu }: { mobile?: boolean; closeMenu?: () => void }) {
  const { user, data, ready, signOut, markNotificationsRead } = useSaaS()
  const [open, setOpen] = useState(false)
  if (!ready) return <span className="h-12 w-24 animate-pulse rounded-full bg-muted" />
  if (!user) return mobile ? <><Link href="/sign-in" onClick={closeMenu} className="flex min-h-12 items-center border-b border-border/70 py-2 font-semibold">Sign in</Link><Link href="/sign-up" onClick={closeMenu} className="flex min-h-12 items-center border-b border-border/70 py-2 font-semibold text-primary">Create account</Link></> : <div className="hidden items-center md:flex"><Link href="/sign-in" className="flex min-h-12 items-center px-3 text-sm font-semibold">Sign in</Link><Link href="/sign-up" className="flex min-h-12 items-center px-3 text-sm font-semibold text-primary">Create account</Link></div>

  const unread = data.notifications.filter((item) => !item.read).length
  const dashboardHref = user.roles.length ? "/staff/dashboard" : "/dashboard"
  const dashboardLabel = user.roles.length ? "Staff workspace" : "My portfolio"
  if (mobile) return <><Link href={dashboardHref} onClick={closeMenu} className="flex min-h-12 items-center border-b border-border/70 py-2 font-semibold">{dashboardLabel}</Link><button onClick={() => { void signOut(); closeMenu?.() }} className="flex min-h-12 w-full items-center gap-2 border-b border-border/70 text-sm font-semibold"><LogOut className="size-4" /> Sign out</button></>

  return (
    <div className="relative hidden md:block">
      <button type="button" onClick={() => setOpen(!open)} className="flex min-h-12 items-center gap-2 px-2 text-sm font-semibold" aria-expanded={open}>
        <span className="relative grid size-9 place-items-center rounded-full bg-navy text-xs font-extrabold text-white">{user.name.slice(0, 1).toUpperCase()}{unread > 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[10px] text-white">{unread}</span>}</span>
        <span className="max-w-24 truncate">{user.name.split(" ")[0]}</span><ChevronDown className="size-3" />
      </button>
      {open && <div className="absolute right-0 top-full w-64 border border-border bg-card p-2 shadow-2xl">
        <div className="border-b border-border px-3 py-3"><p className="font-bold">{user.name}</p><p className="truncate text-xs text-muted-foreground">{user.email}</p></div>
        <Link href={dashboardHref} onClick={() => setOpen(false)} className="flex min-h-12 items-center gap-3 px-3 text-sm font-semibold hover:bg-muted"><UserRound className="size-4" /> {dashboardLabel}</Link>
        <button onClick={() => { markNotificationsRead(); setOpen(false) }} className="flex min-h-12 w-full items-center gap-3 px-3 text-sm font-semibold hover:bg-muted"><Bell className="size-4" /> Notifications {unread ? `(${unread})` : ""}</button>
        <button onClick={() => { void signOut(); setOpen(false) }} className="flex min-h-12 w-full items-center gap-3 px-3 text-sm font-semibold hover:bg-muted"><LogOut className="size-4" /> Sign out</button>
      </div>}
    </div>
  )
}
