"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Building2, Eye, EyeOff, ShieldCheck, UserCog, Users, X } from "lucide-react"
import { useSaaS } from "@/components/saas-provider"
import { APP_ROLES, type AppRole } from "@/lib/rbac"

const roles: { role: AppRole; title: string; description: string; icon: typeof ShieldCheck; color: string }[] = [
  { role: APP_ROLES.SUPER_ADMIN, title: "Super Administrator", description: "System administration, staff access, settings and complete oversight.", icon: ShieldCheck, color: "bg-[#17263c]" },
  { role: APP_ROLES.SALES_MANAGER, title: "Sales Manager", description: "Manage customer leads, assignments, sales activity and team performance.", icon: Users, color: "bg-[#7759e8]" },
  { role: APP_ROLES.SALES_REPRESENTATIVE, title: "Sales Representative", description: "Work assigned leads, schedule visits and submit sales updates.", icon: UserCog, color: "bg-[#168c79]" },
  { role: APP_ROLES.CONTENT_PROPERTY_MANAGER, title: "Content & Property Manager", description: "Manage property listings, estates, media and website content.", icon: Building2, color: "bg-[#d68b20]" },
]

export function StaffLoginPortal() {
  const router = useRouter()
  const { signInStaff, user, ready } = useSaaS()
  const [selected, setSelected] = useState<(typeof roles)[number] | null>(null)
  const [staffId, setStaffId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!selected) return
    setError(""); setLoading(true)
    try {
      await signInStaff(staffId, password, selected.role)
      router.replace("/staff/dashboard")
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in.")
    } finally { setLoading(false) }
  }

  if (ready && user?.roles.length) {
    return <main className="grid min-h-screen place-items-center bg-[#f5faf9] px-5"><div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-xl"><ShieldCheck className="mx-auto size-10 text-primary" /><h1 className="mt-4 font-serif text-3xl">You are already signed in</h1><Link href="/staff/dashboard" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-5 font-bold text-white">Open staff workspace <ArrowRight className="size-4" /></Link></div></main>
  }

  return <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(28,160,137,.09),transparent_34%),#f7fbfa] px-5 py-10 sm:px-8 sm:py-14">
    <div className="mx-auto max-w-[1320px]">
      <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Public website</Link>
      <header className="mx-auto mb-12 mt-3 max-w-3xl text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl border border-primary/15 bg-primary/10 text-primary"><ShieldCheck className="size-8" /></span>
        <p className="mt-6 text-xs font-extrabold uppercase tracking-[.22em] text-primary">Secure employee access</p>
        <h1 className="mt-2 font-serif text-5xl leading-none text-navy sm:text-6xl">TONMAG Staff Workspace</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Choose your assigned workspace, then sign in with your unique employee ID and password.</p>
      </header>
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4" aria-label="Staff roles">
        {roles.map((item) => { const Icon = item.icon; return <button key={item.role} type="button" onClick={() => { setSelected(item); setError("") }} className="group min-h-80 rounded-[1.75rem] border border-black/5 bg-white p-7 text-left shadow-[0_20px_60px_rgba(15,45,40,.07)] transition hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(15,45,40,.13)]">
          <span className={`grid size-16 place-items-center rounded-2xl text-white ${item.color}`}><Icon className="size-7" /></span>
          <p className="mt-8 text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">Access</p>
          <h2 className="mt-2 font-serif text-3xl leading-tight text-navy">{item.title}</h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.description}</p>
          <span className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-primary">Continue <ArrowRight className="size-4 transition group-hover:translate-x-1" /></span>
        </button> })}
      </section>
      <p className="mt-10 text-center text-xs leading-5 text-muted-foreground">Authorized TONMAG employees only. Access attempts are subject to authentication and activity monitoring.</p>
    </div>

    {selected && <div className="fixed inset-0 z-[100] grid place-items-center bg-navy/60 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="staff-sign-in-title">
      <div className="w-full max-w-md rounded-[1.75rem] bg-card p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">{selected.title}</p><h2 id="staff-sign-in-title" className="mt-2 font-serif text-4xl">Employee sign in</h2></div><button type="button" onClick={() => setSelected(null)} className="grid size-11 place-items-center rounded-full border border-border" aria-label="Close"><X className="size-5" /></button></div>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Employee ID</span><input required pattern="id_[1-9][0-9]*" placeholder="id_1" autoComplete="username" value={staffId} onChange={(event) => setStaffId(event.target.value.toLowerCase())} className="min-h-13 w-full rounded-xl border border-border bg-background px-4 text-sm" /></label>
          <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Password</span><span className="relative block"><input required minLength={6} type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="min-h-13 w-full rounded-xl border border-border bg-background px-4 pr-12 text-sm" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-0 grid size-13 place-items-center" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></span></label>
          {error && <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <button disabled={loading} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-white disabled:opacity-60">{loading ? "Verifying access…" : "Sign in securely"}<ArrowRight className="size-4" /></button>
        </form>
        <div className="mt-5 flex justify-between gap-4 text-xs"><Link href="/forgot-password" className="font-bold text-primary">Forgot password?</Link><span className="text-muted-foreground">Use your assigned ID</span></div>
      </div>
    </div>}
  </main>
}
