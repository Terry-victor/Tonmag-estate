"use client"

import { FormEvent, Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react"
import { useSaaS } from "@/components/saas-provider"

const inputClass = "min-h-12 w-full rounded-xl border border-border bg-background px-4 text-sm"

export function AuthCard({ mode }: { mode: "sign-in" | "sign-up" | "reset" }) {
  return <Suspense fallback={<div className="h-[32rem] w-full max-w-md animate-pulse rounded-[1.5rem] bg-card" />}><AuthCardContent mode={mode} /></Suspense>
}

function AuthCardContent({ mode }: { mode: "sign-in" | "sign-up" | "reset" }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestedNext = searchParams.get("next")
  const nextPath = requestedNext?.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : null
  const { signIn, signUp, signInWithGoogle, resetPassword, demoMode } = useSaaS()
  const [name, setName] = useState("")
  const [email, setEmail] = useState(mode === "sign-in" && demoMode ? "demo@tonmaghomes.com" : "")
  const [password, setPassword] = useState(mode === "sign-in" && demoMode ? "demo1234" : "")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(""); setMessage(""); setLoading(true)
    try {
      if (mode === "reset") { await resetPassword(email); setMessage("Password reset instructions have been sent if the account exists.") }
      else if (mode === "sign-up") { await signUp({ name, email, password }); router.push(nextPath || "/onboarding") }
      else { await signIn(email, password); router.push(nextPath || "/dashboard") }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to continue.") }
    finally { setLoading(false) }
  }

  const google = async () => { setError(""); setLoading(true); try { await signInWithGoogle(); router.push(nextPath || "/dashboard") } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to continue.") } finally { setLoading(false) } }
  const title = mode === "sign-up" ? "Create your ownership account" : mode === "reset" ? "Reset your password" : "Welcome back"

  return (
    <div className="animate-panel-in w-full max-w-md rounded-[1.5rem] border border-border bg-card p-6 shadow-[0_24px_80px_rgba(8,25,39,.12)] sm:p-9">
      <div className="mb-8"><span className="mb-5 grid size-11 place-items-center rounded-full bg-primary/10 text-primary"><ShieldCheck /></span><h1 className="font-serif text-4xl leading-none">{title}</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">{mode === "sign-up" ? "Save homes, inspect remotely, manage documents, and pay securely." : mode === "reset" ? "Enter your account email and we’ll send the next step." : "Access your Nigerian property portfolio from anywhere."}</p></div>
      {demoMode && mode === "sign-in" && <div className="mb-5 rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs leading-5"><strong>Demo workspace:</strong> the credentials are prefilled. Production accounts activate when Firebase keys are configured.</div>}
      <form onSubmit={submit} className="space-y-4">
        {mode === "sign-up" && <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Full name</span><input required className={inputClass} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>}
        <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Email address</span><input required type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
        {mode !== "reset" && <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-wider">Password</span><span className="relative block"><input required minLength={6} type={showPassword ? "text" : "password"} className={`${inputClass} pr-12`} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "sign-up" ? "new-password" : "current-password"} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-0 grid size-12 place-items-center" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></span></label>}
        {mode === "sign-up" && <label className="flex items-start gap-3 text-xs leading-5 text-muted-foreground"><input required type="checkbox" className="mt-0.5 size-5 accent-[#a57b38]" /><span>I agree to the Terms, Privacy Policy, and electronic document delivery for my account.</span></label>}
        {mode === "sign-in" && <div className="text-right"><Link href="/forgot-password" className="text-xs font-bold text-primary">Forgot password?</Link></div>}
        {error && <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}{message && <p role="status" className="rounded-xl bg-primary/10 p-3 text-sm">{message}</p>}
        <button disabled={loading} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-white disabled:opacity-60">{loading ? "Please wait…" : mode === "sign-up" ? "Create account" : mode === "reset" ? "Send reset link" : "Sign in"}<ArrowRight className="size-4" /></button>
      </form>
      {mode !== "reset" && <><div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div><button type="button" disabled={loading} onClick={google} className="min-h-12 w-full rounded-xl border border-border text-sm font-bold hover:bg-muted">Continue with Google</button></>}
      <p className="mt-7 text-center text-sm text-muted-foreground">{mode === "sign-up" ? <>Already have an account? <Link href="/sign-in" className="font-bold text-foreground">Sign in</Link></> : mode === "sign-in" ? <>New to TONMAG? <Link href="/sign-up" className="font-bold text-foreground">Create account</Link></> : <Link href="/sign-in" className="font-bold text-foreground">Back to sign in</Link>}</p>
    </div>
  )
}
