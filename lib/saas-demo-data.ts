import type { SaaSData } from "@/lib/saas-types"

export const initialSaaSData: SaaSData = {
  savedPropertyIds: ["2", "3"],
  portfolio: [
    { id: "portfolio-1", propertyId: "1", name: "The Nouveau Residence", location: "Maitama, Abuja", image: "/M1.JPG", stage: "Owned", ownership: 100, progress: 100, nextMilestone: "Annual title review · 18 Dec", valueNgn: 485000000, valueForeign: "$303,125 USD" },
    { id: "portfolio-2", propertyId: "4", name: "Palm Court Terraces", location: "Lekki Phase 1, Lagos", image: "/luxury-residential-complex-with-gardens.jpg", stage: "Under construction", ownership: 35, progress: 72, nextMilestone: "Second fix inspection · 08 Nov", valueNgn: 185000000, valueForeign: "$115,625 USD" },
  ],
  transactions: [
    { id: "txn-1", title: "Palm Court milestone 4", amountNgn: 18500000, amountForeign: "$11,563 USD", dueDate: "12 Nov 2026", status: "Due" },
    { id: "txn-2", title: "Palm Court milestone 3", amountNgn: 18500000, amountForeign: "$11,563 USD", dueDate: "12 Aug 2026", status: "Paid", reference: "TMG-2026-0812", paidAt: "12 Aug 2026" },
  ],
  inspections: [{ id: "inspection-1", property: "Palm Court Terraces", date: "08 Nov 2026", time: "14:00 WAT", format: "Virtual", status: "Confirmed", notes: "Focus on MEP first-fix and window installation." }],
  documents: [
    { id: "doc-1", name: "Governor's Consent", category: "Title", date: "18 Oct 2026", status: "Verified", size: "2.4 MB" },
    { id: "doc-2", name: "Sale & Purchase Agreement", category: "Contract", date: "12 Jul 2026", status: "Verified", size: "4.1 MB" },
    { id: "doc-3", name: "Construction report · October", category: "Progress", date: "30 Oct 2026", status: "Pending review", size: "8.6 MB" },
  ],
  maintenance: [],
  messages: [{ id: "message-1", sender: "agent", text: "Hi Chidi, I reviewed the October progress report. The roofing and MEP milestones are both on track.", sentAt: "Today · 09:14" }],
  notifications: [
    { id: "note-1", title: "Inspection confirmed", detail: "Your Palm Court virtual inspection is booked for 08 November.", createdAt: "Today", read: false },
    { id: "note-2", title: "New document", detail: "The October construction report is ready for review.", createdAt: "Yesterday", read: false },
  ],
}

export const emptySaaSData = (): SaaSData => ({
  savedPropertyIds: [],
  portfolio: [],
  transactions: [],
  inspections: [],
  documents: [],
  maintenance: [],
  messages: [],
  notifications: [],
})
