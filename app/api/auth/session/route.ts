import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-response"

export async function GET(request: Request) {
  try {
    if (!request.headers.get("authorization")?.startsWith("Bearer ")) throw new Error("UNAUTHORIZED")
    const { getAdminDatabase, getStaffAccess, requireFirebaseUser } = await import("@/lib/firebase-admin")
    const token = await requireFirebaseUser(request, true)
    const [profileSnapshot, access] = await Promise.all([
      getAdminDatabase().doc(`users/${token.uid}`).get(),
      getStaffAccess(token),
    ])
    const profile = profileSnapshot.data() || {}
    return NextResponse.json({
      user: {
        id: token.uid,
        name: typeof profile.name === "string" ? profile.name : token.name || "TONMAG user",
        email: token.email || (typeof profile.email === "string" ? profile.email : ""),
        phone: typeof profile.phone === "string" ? profile.phone : "",
        homeMarket: typeof profile.homeMarket === "string" ? profile.homeMarket : "",
        currency: ["USD", "GBP", "CAD", "EUR"].includes(profile.currency) ? profile.currency : "USD",
        role: access ? "admin" : "client",
        roles: access?.roles || [],
        permissions: access?.permissions || [],
        accountActive: true,
        onboardingComplete: profile.onboardingComplete === true || Boolean(access),
      },
    })
  } catch (error) {
    return apiError(error)
  }
}
