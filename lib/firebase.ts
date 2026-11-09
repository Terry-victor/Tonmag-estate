import { getApp, getApps, initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean)
const demoConfig = { apiKey: "demo-key-not-for-production", authDomain: "localhost", projectId: "tonmag-demo", storageBucket: "tonmag-demo.invalid", appId: "demo-app" }
const app = getApps().length ? getApp() : initializeApp(isFirebaseConfigured ? firebaseConfig : demoConfig)

export const db = (isFirebaseConfigured ? getFirestore(app) : null) as Firestore
export const auth = (isFirebaseConfigured ? getAuth(app) : null) as Auth
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: "select_account" })
export const storage = (isFirebaseConfigured ? getStorage(app) : null) as FirebaseStorage
