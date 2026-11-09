import type { AppRole, Permission } from "@/lib/rbac"

export type Currency = "USD" | "GBP" | "CAD" | "EUR"

export type SaaSUser = {
  id: string
  name: string
  email: string
  phone?: string
  homeMarket: string
  currency: Currency
  role: "client" | "agent" | "admin"
  roles: AppRole[]
  permissions: Permission[]
  accountActive: boolean
  onboardingComplete: boolean
}

export type PortfolioProperty = {
  id: string
  propertyId: string
  name: string
  location: string
  image: string
  stage: "Reserved" | "Owned" | "Under construction"
  ownership: number
  progress: number
  nextMilestone: string
  valueNgn: number
  valueForeign: string
}

export type Transaction = { id: string; title: string; amountNgn: number; amountForeign: string; dueDate: string; status: "Paid" | "Due" | "Processing"; reference?: string; paidAt?: string }
export type Inspection = { id: string; property: string; date: string; time: string; format: "Virtual" | "In-person" | "Representative"; status: "Requested" | "Confirmed" | "Completed"; notes: string }
export type PortfolioDocument = { id: string; name: string; category: string; date: string; status: "Verified" | "Pending review"; size: string; url?: string }
export type MaintenanceRequest = { id: string; property: string; title: string; priority: "Routine" | "Urgent"; status: "Open" | "In progress" | "Resolved"; createdAt: string }
export type AgentMessage = { id: string; sender: "user" | "agent"; text: string; sentAt: string }
export type NotificationItem = { id: string; title: string; detail: string; createdAt: string; read: boolean }

export type SaaSData = {
  savedPropertyIds: string[]
  portfolio: PortfolioProperty[]
  transactions: Transaction[]
  inspections: Inspection[]
  documents: PortfolioDocument[]
  maintenance: MaintenanceRequest[]
  messages: AgentMessage[]
  notifications: NotificationItem[]
}
