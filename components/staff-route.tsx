"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSaaS } from "@/components/saas-provider"

export function StaffRoute({ children }: { children: React.ReactNode }) {
  const { user, ready } = useSaaS()
  const router = useRouter()
  const isStaff = Boolean(user?.roles.length)
  useEffect(() => { if (ready && user && !isStaff) router.replace("/dashboard") }, [ready, user, isStaff, router])
  if (!ready || !user || !isStaff) return null
  return <>{children}</>
}
