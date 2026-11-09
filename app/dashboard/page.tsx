import { Header } from "@/components/header"
import { DiasporaDashboard } from "@/components/diaspora-dashboard"
import { Footer } from "@/components/footer"
import { ProtectedRoute } from "@/components/protected-route"
import { Suspense } from "react"

export default function DashboardPage() {
  return <><Header /><ProtectedRoute><Suspense fallback={<div className="min-h-[70vh] bg-background" />}><DiasporaDashboard /></Suspense></ProtectedRoute><Footer /></>
}
