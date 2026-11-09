import type { Metadata } from "next"
import { StaffLoginPortal } from "@/components/staff-login-portal"

export const metadata: Metadata = {
  title: "Staff Login | TONMAG Homes",
  description: "Secure access for authorized TONMAG employees.",
  robots: { index: false, follow: false },
}

export default function StaffLoginPage() { return <StaffLoginPortal /> }
