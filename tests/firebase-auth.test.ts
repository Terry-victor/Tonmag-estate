import assert from "node:assert/strict"
import test from "node:test"
import { isUnauthorizedFirebaseAuthError } from "../lib/firebase-auth-errors.ts"
import { parseFirebaseServiceAccount } from "../lib/firebase-admin-credentials.ts"

const fixture = {
  type: "service_account" as const,
  project_id: "test-project",
  private_key: "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-admin@test-project.iam.gserviceaccount.com",
}

test("Firebase Admin credentials accept compact JSON", () => {
  assert.deepEqual(parseFirebaseServiceAccount(JSON.stringify(fixture), "test-project"), fixture)
})

test("Firebase Admin credentials accept base64 JSON", () => {
  const encoded = Buffer.from(JSON.stringify(fixture), "utf8").toString("base64")
  assert.deepEqual(parseFirebaseServiceAccount(encoded, "test-project"), fixture)
})

test("Firebase Admin credentials reject malformed and mismatched values", () => {
  assert.throws(() => parseFirebaseServiceAccount("not-json"), /FIREBASE_SERVICE_ACCOUNT_INVALID/)
  assert.throws(() => parseFirebaseServiceAccount(JSON.stringify(fixture), "other-project"), /FIREBASE_PROJECT_MISMATCH/)
})

test("expired, revoked, and invalid Firebase tokens are unauthorized", () => {
  assert.equal(isUnauthorizedFirebaseAuthError({ code: "auth/id-token-expired" }), true)
  assert.equal(isUnauthorizedFirebaseAuthError({ code: "auth/id-token-revoked" }), true)
  assert.equal(isUnauthorizedFirebaseAuthError({ code: "auth/invalid-id-token" }), true)
  assert.equal(isUnauthorizedFirebaseAuthError({ code: "auth/internal-error" }), false)
})
