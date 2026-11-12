"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile as updateFirebaseProfile,
} from "firebase/auth"
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { auth, db, googleProvider, isFirebaseConfigured, storage } from "@/lib/firebase"
import { emptySaaSData, initialSaaSData } from "@/lib/saas-demo-data"
import type { Currency, Inspection, MaintenanceRequest, PortfolioDocument, SaaSData, SaaSUser, Transaction } from "@/lib/saas-types"
import type { AppRole } from "@/lib/rbac"

type SignUpInput = { name: string; email: string; password: string }
type ProfileInput = { name: string; phone?: string; homeMarket: string; currency: Currency }

type SaaSContextValue = {
  user: SaaSUser | null
  data: SaaSData
  ready: boolean
  demoMode: boolean
  signUp: (input: SignUpInput) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInStaff: (email: string, password: string, role: AppRole) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (input: ProfileInput) => Promise<void>
  toggleSaved: (propertyId: string) => void
  scheduleInspection: (input: Omit<Inspection, "id" | "status">) => void
  createMaintenance: (input: Pick<MaintenanceRequest, "property" | "title" | "priority">) => void
  addDocument: (file: File, category?: string) => Promise<void>
  sendMessage: (text: string) => void
  markNotificationsRead: () => void
  recordPayment: (transactionId: string, reference: string) => void
}

const SaaSContext = createContext<SaaSContextValue | null>(null)
const cloneDemoData = () => JSON.parse(JSON.stringify(initialSaaSData)) as SaaSData
const demoModeEnabled = process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_SAAS_DEMO_MODE === "true"
const demoUserKey = "tonmag-demo-user"
const demoDataKey = (id: string) => `tonmag-workspace-${id}`
const accessDefaults = () => ({ roles: [], permissions: [], accountActive: true } satisfies Pick<SaaSUser, "roles" | "permissions" | "accountActive">)

function normalizeStoredUser(user: SaaSUser): SaaSUser {
  return {
    ...user,
    roles: Array.isArray(user.roles) ? user.roles : [],
    permissions: Array.isArray(user.permissions) ? user.permissions : [],
    accountActive: user.accountActive !== false,
  }
}

function friendlyFirebaseError(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : ""
  if (code.includes("email-already-in-use")) return "An account already exists for this email."
  if (code.includes("invalid-credential")) return "The email or password is incorrect."
  if (code.includes("weak-password")) return "Use a stronger password with at least 8 characters."
  if (code.includes("popup-closed")) return "Google sign-in was closed before it finished."
  return error instanceof Error ? error.message : "Something went wrong. Please try again."
}

export function SaaSProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SaaSUser | null>(null)
  const [data, setData] = useState<SaaSData>(emptySaaSData)
  const [ready, setReady] = useState(false)
  const demoMode = demoModeEnabled && !isFirebaseConfigured

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (!firebaseUser) { setUser(null); setData(emptySaaSData()); setReady(true); return }
        try {
          const token = await firebaseUser.getIdToken()
          const response = await fetch("/api/auth/session", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" })
          if (!response.ok) throw new Error(response.status === 403 ? "This account is inactive." : "Unable to load your account access.")
          const result = await response.json() as { user: SaaSUser }
          setUser(normalizeStoredUser(result.user))
        } catch (error) {
          console.error("Unable to load authenticated session", error)
          await firebaseSignOut(auth)
          setUser(null)
        } finally { setReady(true) }
      })
      return unsubscribe
    }

    if (!demoMode) { setUser(null); setData(emptySaaSData()); setReady(true); return }
    const session = window.localStorage.getItem(demoUserKey)
    if (session) setUser(normalizeStoredUser(JSON.parse(session) as SaaSUser))
    setReady(true)
  }, [demoMode])

  useEffect(() => {
    if (!user) return
    if (isFirebaseConfigured) {
      return onSnapshot(doc(db, "users", user.id, "workspace", "main"), (snapshot) => {
        setData(snapshot.exists() ? snapshot.data() as SaaSData : emptySaaSData())
      }, () => setData(emptySaaSData()))
    }
    if (!demoMode) { setData(emptySaaSData()); return }
    const stored = window.localStorage.getItem(demoDataKey(user.id))
    setData(stored ? JSON.parse(stored) as SaaSData : cloneDemoData())
  }, [user?.id, demoMode])

  const persistData = useCallback((next: SaaSData) => {
    setData(next)
    if (!user) return
    if (isFirebaseConfigured) void setDoc(doc(db, "users", user.id, "workspace", "main"), next)
    else if (demoMode) window.localStorage.setItem(demoDataKey(user.id), JSON.stringify(next))
  }, [user, demoMode])

  const signUp = async ({ name, email, password }: SignUpInput) => {
    try {
      if (isFirebaseConfigured) {
        const credential = await createUserWithEmailAndPassword(auth, email, password)
        await updateFirebaseProfile(credential.user, { displayName: name })
        const profile: SaaSUser = { id: credential.user.uid, name, email, homeMarket: "", currency: "USD", role: "client", onboardingComplete: false, ...accessDefaults() }
        await Promise.all([setDoc(doc(db, "users", profile.id), profile), setDoc(doc(db, "users", profile.id, "workspace", "main"), emptySaaSData())])
        setUser(profile)
      } else if (demoMode) {
        const profile: SaaSUser = { id: `demo-${Date.now()}`, name, email, homeMarket: "", currency: "USD", role: "client", onboardingComplete: false, ...accessDefaults() }
        window.localStorage.setItem(demoUserKey, JSON.stringify(profile)); setUser(profile); setData(cloneDemoData())
      } else throw new Error("Authentication is not configured.")
    } catch (error) { throw new Error(friendlyFirebaseError(error)) }
  }

  const signIn = async (email: string, password: string) => {
    try {
      if (isFirebaseConfigured) await signInWithEmailAndPassword(auth, email, password)
      else if (demoMode) {
        if (password.length < 6) throw new Error("Use at least 6 characters for the demo password.")
        const stored = window.localStorage.getItem(demoUserKey)
        const existing = stored ? JSON.parse(stored) as SaaSUser : null
        const profile: SaaSUser = existing?.email === email ? normalizeStoredUser(existing) : { id: "demo-client", name: email.split("@")[0] || "Demo client", email, homeMarket: "United Kingdom", currency: "GBP", role: "client", onboardingComplete: true, ...accessDefaults() }
        window.localStorage.setItem(demoUserKey, JSON.stringify(profile)); setUser(profile)
      } else throw new Error("Authentication is not configured.")
    } catch (error) { throw new Error(friendlyFirebaseError(error)) }
  }

  const signInStaff = async (email: string, password: string, role: AppRole) => {
    if (!isFirebaseConfigured) throw new Error("Staff sign-in requires Firebase to be configured.")
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password)
      const token = await credential.user.getIdToken()
      const session = await fetch("/api/auth/session", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" })
      const result = await session.json().catch(() => null) as { user?: SaaSUser; error?: string } | null
      if (!session.ok || !result?.user || result.user.role !== "admin" || !result.user.roles.includes(role)) {
        await firebaseSignOut(auth)
        throw new Error(result?.error || "This account is not authorized for the selected staff workspace.")
      }
      setUser(normalizeStoredUser(result.user))
    } catch (error) {
      if (auth.currentUser) await firebaseSignOut(auth).catch(() => undefined)
      throw new Error(friendlyFirebaseError(error))
    }
  }

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured) { if (demoMode) await signIn("demo@tonmaghomes.com", "demo1234"); else throw new Error("Authentication is not configured."); return }
    try {
      const credential = await signInWithPopup(auth, googleProvider)
      const ref = doc(db, "users", credential.user.uid)
      if (!(await getDoc(ref)).exists()) await setDoc(ref, { id: credential.user.uid, name: credential.user.displayName || "TONMAG client", email: credential.user.email || "", homeMarket: "", currency: "USD", role: "client", onboardingComplete: false, ...accessDefaults() } satisfies SaaSUser)
    } catch (error) { throw new Error(friendlyFirebaseError(error)) }
  }

  const signOut = async () => { if (isFirebaseConfigured) await firebaseSignOut(auth); else if (demoMode) window.localStorage.removeItem(demoUserKey); setUser(null); setData(emptySaaSData()) }
  const resetPassword = async (email: string) => { if (isFirebaseConfigured) await sendPasswordResetEmail(auth, email); else if (demoMode) await new Promise((resolve) => setTimeout(resolve, 500)); else throw new Error("Authentication is not configured.") }

  const updateProfile = async (input: ProfileInput) => {
    if (!user) return
    const next = { ...user, ...input, onboardingComplete: true }
    setUser(next)
    if (isFirebaseConfigured) await setDoc(doc(db, "users", user.id), next, { merge: true })
    else if (demoMode) window.localStorage.setItem(demoUserKey, JSON.stringify(next))
  }

  const mutate = (recipe: (current: SaaSData) => SaaSData) => persistData(recipe(data))
  const toggleSaved = (propertyId: string) => mutate((current) => ({ ...current, savedPropertyIds: current.savedPropertyIds.includes(propertyId) ? current.savedPropertyIds.filter((id) => id !== propertyId) : [...current.savedPropertyIds, propertyId] }))
  const scheduleInspection = (input: Omit<Inspection, "id" | "status">) => mutate((current) => ({ ...current, inspections: [{ ...input, id: crypto.randomUUID(), status: "Requested" }, ...current.inspections], notifications: [{ id: crypto.randomUUID(), title: "Inspection requested", detail: `${input.format} inspection requested for ${input.property}.`, createdAt: "Just now", read: false }, ...current.notifications] }))
  const createMaintenance = (input: Pick<MaintenanceRequest, "property" | "title" | "priority">) => mutate((current) => ({ ...current, maintenance: [{ ...input, id: crypto.randomUUID(), status: "Open", createdAt: new Date().toLocaleDateString("en-GB") }, ...current.maintenance] }))
  const addDocument = async (file: File, category = "Uploaded") => {
    if (!user) return
    let url: string | undefined
    if (isFirebaseConfigured) {
      const target = ref(storage, `user-documents/${user.id}/${crypto.randomUUID()}-${file.name}`)
      await uploadBytes(target, file, { contentType: file.type })
      url = await getDownloadURL(target)
    }
    mutate((current) => ({ ...current, documents: [{ name: file.name, category, size: `${(file.size / 1024 / 1024).toFixed(1)} MB`, url, id: crypto.randomUUID(), date: new Date().toLocaleDateString("en-GB"), status: "Pending review" }, ...current.documents] }))
  }
  const sendMessage = (text: string) => mutate((current) => ({ ...current, messages: [...current.messages, { id: crypto.randomUUID(), sender: "user", text, sentAt: "Just now" }] }))
  const markNotificationsRead = () => {
    const next = { ...data, notifications: data.notifications.map((item) => ({ ...item, read: true })) }
    setData(next)
    if (!user) return
    if (isFirebaseConfigured) {
      void auth.currentUser?.getIdToken().then((token) => fetch("/api/customer/notifications/read", { method: "POST", headers: { Authorization: `Bearer ${token}` } }))
    } else if (demoMode) window.localStorage.setItem(demoDataKey(user.id), JSON.stringify(next))
  }
  const recordPayment = (transactionId: string, reference: string) => mutate((current) => ({ ...current, transactions: current.transactions.map((item): Transaction => item.id === transactionId ? { ...item, status: "Paid", reference, paidAt: new Date().toLocaleDateString("en-GB") } : item), notifications: [{ id: crypto.randomUUID(), title: "Payment received", detail: `Payment reference ${reference} was verified.`, createdAt: "Just now", read: false }, ...current.notifications] }))

  const value = useMemo<SaaSContextValue>(() => ({ user, data, ready, demoMode, signUp, signIn, signInStaff, signInWithGoogle, signOut, resetPassword, updateProfile, toggleSaved, scheduleInspection, createMaintenance, addDocument, sendMessage, markNotificationsRead, recordPayment }), [user, data, ready, demoMode, persistData])
  return <SaaSContext.Provider value={value}>{children}</SaaSContext.Provider>
}

export function useSaaS() {
  const context = useContext(SaaSContext)
  if (!context) throw new Error("useSaaS must be used inside SaaSProvider")
  return context
}
