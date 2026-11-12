import { NextResponse } from "next/server"

export function POST() {
  return NextResponse.json(
    { error: "Use Firebase email and password authentication, then validate access through /api/auth/session." },
    { status: 410 },
  )
}
