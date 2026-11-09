import { NextResponse } from "next/server"
import { getAdminAuth, getAdminDatabase } from "@/lib/firebase-admin"
import { isAppRole } from "@/lib/rbac"
import { normalizeStaffId } from "@/lib/staff-id"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null) as Record<string, unknown> | null
    const staffId = normalizeStaffId(body?.staffId)
    const requestedRole = body?.role
    const password = typeof body?.password === "string" ? body.password : ""
    if (!staffId || !isAppRole(requestedRole) || password.length < 6 || password.length > 128) {
      return NextResponse.json({ error: "The employee ID, role or password is invalid." }, { status: 401 })
    }

    const snapshot = await getAdminDatabase().collection("staff")
      .where("staffId", "==", staffId)
      .limit(1)
      .get()
    const document = snapshot.docs[0]
    const staff = document?.data()
    const roles = Array.isArray(staff?.roles) ? staff.roles : []
    if (!document || staff?.active !== true || !roles.includes(requestedRole) || typeof staff.email !== "string") {
      return NextResponse.json({ error: "The employee ID, role or password is invalid." }, { status: 401 })
    }

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    if (!apiKey) throw new Error("FIREBASE_API_KEY_NOT_CONFIGURED")
    const firebaseResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: staff.email, password, returnSecureToken: true }),
      cache: "no-store",
    })
    const authenticated = await firebaseResponse.json().catch(() => null) as { localId?: string } | null
    if (!firebaseResponse.ok || authenticated?.localId !== document.id) {
      return NextResponse.json({ error: "The employee ID, role or password is invalid." }, { status: 401 })
    }

    const customToken = await getAdminAuth().createCustomToken(document.id)
    return NextResponse.json({ customToken })
  } catch (error) {
    console.error("Staff login lookup failed", error)
    return NextResponse.json({ error: "Staff sign-in is temporarily unavailable." }, { status: 503 })
  }
}
