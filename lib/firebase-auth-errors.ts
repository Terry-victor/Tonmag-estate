const unauthorizedFirebaseAuthCodes = new Set([
  "auth/argument-error",
  "auth/id-token-expired",
  "auth/id-token-revoked",
  "auth/invalid-id-token",
  "auth/user-disabled",
  "auth/user-not-found",
])

export function isUnauthorizedFirebaseAuthError(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("code" in error)) return false
  return unauthorizedFirebaseAuthCodes.has(String(error.code))
}
