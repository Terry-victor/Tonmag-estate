export type FirebaseServiceAccount = {
  type: "service_account"
  project_id: string
  private_key: string
  client_email: string
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value)
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_INVALID")
  }
}

export function parseFirebaseServiceAccount(
  rawValue: string,
  expectedProjectId?: string,
): FirebaseServiceAccount {
  const value = rawValue.trim()
  if (!value) throw new Error("FIREBASE_SERVICE_ACCOUNT_INVALID")

  const parsed = value.startsWith("{")
    ? parseJson(value)
    : parseJson(Buffer.from(value.replace(/\s/g, ""), "base64").toString("utf8"))

  if (
    !parsed ||
    typeof parsed !== "object" ||
    (parsed as Record<string, unknown>).type !== "service_account" ||
    typeof (parsed as Record<string, unknown>).project_id !== "string" ||
    typeof (parsed as Record<string, unknown>).private_key !== "string" ||
    typeof (parsed as Record<string, unknown>).client_email !== "string"
  ) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_INVALID")
  }

  const serviceAccount = parsed as FirebaseServiceAccount
  if (expectedProjectId && serviceAccount.project_id !== expectedProjectId) {
    throw new Error("FIREBASE_PROJECT_MISMATCH")
  }
  return serviceAccount
}
