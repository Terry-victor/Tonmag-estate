import { FieldValue } from "firebase-admin/firestore"
import { getAdminDatabase } from "@/lib/firebase-admin"

export type BookingNotice = {
  bookingId: string
  userId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  property: string
  scheduledFor: string
  paymentMethod: "paystack" | "bank_transfer"
  paymentStatus: "confirmed" | "pending_verification"
  reference: string
}

export async function notifyBooking(input: BookingNotice) {
  const database = getAdminDatabase()
  const clientTitle = input.paymentStatus === "confirmed" ? "Inspection booking confirmed" : "Inspection transfer awaiting verification"
  const detail = `${input.property} · ${new Date(input.scheduledFor).toLocaleString("en-NG")} · ${input.reference}`
  const workspace = database.doc(`users/${input.userId}/workspace/main`)
  await Promise.allSettled([
    database.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(workspace)
      if (!snapshot.exists) return
      const current = Array.isArray(snapshot.data()?.notifications) ? snapshot.data()!.notifications : []
      transaction.update(workspace, { notifications: [{ id: crypto.randomUUID(), title: clientTitle, detail, createdAt: "Just now", read: false }, ...current].slice(0, 200) })
    }),
    database.collection("ops_notifications").add({
      bookingId: input.bookingId,
      title: input.paymentStatus === "confirmed" ? "New confirmed inspection" : "Bank transfer awaiting verification",
      detail,
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      clientPhone: input.clientPhone,
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentStatus,
      read: false,
      createdAt: FieldValue.serverTimestamp(),
    }),
    sendEmailNotifications(input, clientTitle, detail),
    sendSmsNotifications(input, clientTitle),
  ])
}

async function sendEmailNotifications(input: BookingNotice, clientTitle: string, detail: string) {
  const key = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const opsEmail = process.env.OPS_NOTIFICATION_EMAIL
  if (!key || !from) return
  const recipients = [{ to: input.clientEmail, subject: clientTitle }]
  if (opsEmail) recipients.push({ to: opsEmail, subject: input.paymentStatus === "confirmed" ? "New inspection booking" : "Bank transfer requires verification" })
  await Promise.all(recipients.map(({ to, subject }) => fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, text: `${subject}\n\n${detail}\nPayment method: ${input.paymentMethod.replace("_", " ")}` }),
  })))
}

async function sendSmsNotifications(input: BookingNotice, clientTitle: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_FROM_NUMBER
  const opsPhone = process.env.OPS_NOTIFICATION_PHONE
  if (!sid || !token || !from) return
  const targets = [input.clientPhone, opsPhone].filter((value): value is string => Boolean(value))
  const authorization = Buffer.from(`${sid}:${token}`).toString("base64")
  await Promise.all(targets.map((to) => fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: { Authorization: `Basic ${authorization}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: to, From: from, Body: `${clientTitle}: ${input.property}, ${new Date(input.scheduledFor).toLocaleString("en-NG")}. Ref ${input.reference}` }),
  })))
}
