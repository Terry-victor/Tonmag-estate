import type { AppRole, Permission } from "@/lib/rbac"

export type StaffMember = {
  uid: string
  staffId: string
  name: string
  email: string
  roles: AppRole[]
  active: boolean
  createdAt: string
  updatedAt: string
}

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "site_visit_scheduled",
  "negotiating",
  "won",
  "lost",
] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]

export type LeadInteraction = {
  id: string
  type: "call" | "email" | "whatsapp" | "meeting" | "note"
  note: string
  createdBy: string
  createdAt: string
}

export type SiteVisit = {
  id: string
  scheduledFor: string
  location: string
  status: "scheduled" | "completed" | "cancelled"
  createdBy: string
  createdAt: string
}

export type SalesUpdate = {
  id: string
  note: string
  submittedBy: string
  createdAt: string
}

export type Lead = {
  id: string
  name: string
  email: string
  phone: string
  message: string
  source: string
  status: LeadStatus
  assignedTo: string | null
  propertyId: string | null
  interactions: LeadInteraction[]
  siteVisits: SiteVisit[]
  salesUpdates: SalesUpdate[]
  createdAt: string
  updatedAt: string
}

export type ManagedProperty = {
  id: string
  name: string
  location: string
  description: string
  status: "draft" | "published" | "sold" | "unavailable"
  priceNgn?: number
  availableUnits: number
  constructionProgress: number
  media: string[]
  estateId?: string
  updatedAt: string
  updatedBy: string
}

export type ContentEntry = {
  id: string
  type: "announcement" | "banner" | "testimonial"
  title: string
  body: string
  published: boolean
  imageUrl?: string
  createdAt: string
  updatedAt: string
  updatedBy: string
}

export type StaffSession = {
  roles: AppRole[]
  permissions: Permission[]
  active: boolean
}
