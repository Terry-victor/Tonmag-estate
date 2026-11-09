import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProtectedRoute } from "@/components/protected-route"
import { StaffRoute } from "@/components/staff-route"
import { DiasporaDashboard } from "@/components/diaspora-dashboard"

export default function StaffDashboardPage() {
  return <><Header /><ProtectedRoute><StaffRoute><Suspense fallback={<div className="min-h-[70vh] bg-background" />}><DiasporaDashboard /></Suspense></StaffRoute></ProtectedRoute><Footer /></>
}
