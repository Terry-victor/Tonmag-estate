import { FieldValue } from "firebase-admin/firestore"
import { NextResponse } from "next/server"
import { getAdminDatabase } from "@/lib/firebase-admin"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  const name = typeof body?.name === "string" ? body.name.trim() : ""
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""
  const phone = typeof body?.phone === "string" ? body.phone.trim() : ""
  const message = typeof body?.message === "string" ? body.message.trim() : ""
  const website = typeof body?.website === "string" ? body.website.trim() : ""
  if (website) return NextResponse.json({ ok: true })
  if (name.length < 2 || name.length > 100 || !emailPattern.test(email) || phone.length > 30 || message.length < 5 || message.length > 3000) {
    return NextResponse.json({ error: "Please provide valid enquiry details." }, { status: 400 })
  }
  try {
    await getAdminDatabase().collection("leads").add({
      name,
      email,
      phone,
      message,
      source: "website",
      status: "new",
      assignedTo: null,
      propertyId: null,
      interactions: [],
      siteVisits: [],
      salesUpdates: [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error("Unable to create enquiry", error)
    return NextResponse.json({ error: "Unable to submit your enquiry right now." }, { status: 503 })
  }
}
