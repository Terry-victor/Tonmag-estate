import { NextResponse } from "next/server"
import { isUnauthorizedFirebaseAuthError } from "@/lib/firebase-auth-errors"

function safeDiagnostic(error: unknown): string {
  if (!(error instanceof Error)) return "non-error"
  const name = error.name.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || "Error"
  const message = error.message
    .split(/\r?\n/, 1)[0]
    .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/-----BEGIN[\s\S]*$/i, "[redacted]")
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[redacted-email]")
    .replace(/ya29\.[A-Za-z0-9._-]+/g, "[redacted-token]")
    .slice(0, 180)
  return `${name}: ${message || "no-message"}`
}

export function apiError(error: unknown) {
  const message = error instanceof Error ? error.message : "UNKNOWN_ERROR"
  const code = error && typeof error === "object" && "code" in error ? String(error.code) : ""
  if (message === "UNAUTHORIZED" || isUnauthorizedFirebaseAuthError(error)) return NextResponse.json({ error: "Authentication is required." }, { status: 401 })
  if (message === "FORBIDDEN") return NextResponse.json({ error: "You do not have permission to perform this action." }, { status: 403 })
  if (message === "ACCOUNT_INACTIVE") return NextResponse.json({ error: "This staff account is inactive." }, { status: 403 })
  if (message === "SERVER_AUTH_NOT_CONFIGURED") return NextResponse.json({ error: "Server authentication is not configured." }, { status: 503 })
  if (message === "FIREBASE_SERVICE_ACCOUNT_INVALID" || message === "FIREBASE_PROJECT_MISMATCH") return NextResponse.json({ error: "Server authentication is not configured correctly." }, { status: 503 })
  if (code === "auth/invalid-credential" || code === "app/invalid-credential" || code === "firestore/invalid-credential") {
    console.error("Firebase server credential rejected", { code })
    return NextResponse.json({ error: "The Firebase server credential configured in Vercel is invalid." }, { status: 503 })
  }
  if (code === "7" || code === "permission-denied" || code === "firestore/permission-denied") {
    console.error("Firebase server permission denied", { code })
    return NextResponse.json({ error: "The Firebase server credential does not have permission to read staff records." }, { status: 503 })
  }
  if (code === "auth/internal-error" || code === "auth/network-request-failed" || code === "14" || code === "unavailable") {
    console.error("Firebase service unavailable", { code })
    return NextResponse.json({ error: "Firebase is temporarily unavailable. Please try again." }, { status: 503 })
  }
  if (message === "NOT_FOUND") return NextResponse.json({ error: "The requested record was not found." }, { status: 404 })
  if (message === "SELF_ROLE_CHANGE_FORBIDDEN") return NextResponse.json({ error: "You cannot change your own roles or account status." }, { status: 403 })
  if (message === "LAST_SUPER_ADMIN") return NextResponse.json({ error: "The final active Super Administrator cannot be removed or deactivated." }, { status: 409 })
  if (message === "INVALID_INPUT") return NextResponse.json({ error: "The submitted data is invalid." }, { status: 400 })
  const reference = code || safeDiagnostic(error)
  console.error("Admin API error", { reference, error })
  return NextResponse.json({ error: `The request could not be completed (reference: ${reference}).` }, { status: 500 })
}

export function timestampToIso(value: unknown): string {
  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate().toISOString()
  }
  if (typeof value === "string") return value
  if (value instanceof Date) return value.toISOString()
  return new Date(0).toISOString()
}
