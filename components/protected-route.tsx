"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSaaS } from "@/components/saas-provider"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, ready } = useSaaS()
  const router = useRouter()
  useEffect(() => { if (ready && !user) router.replace("/sign-in") }, [ready, user, router])
  if (!ready || !user) return <div className="grid min-h-[70vh] place-items-center bg-background"><div className="text-center"><div className="mx-auto size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" /><p className="mt-4 text-sm text-muted-foreground">Opening your secure workspace…</p></div></div>
  return <>{children}</>
}
