import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAnalytics, isSupported } from "firebase/analytics"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAaBlTbT7vvwQv4iJjAuN_BuGf5hWKohUY",
  authDomain: "livedrop-app.firebaseapp.com",
  projectId: "livedrop-app",
  storageBucket: "livedrop-app.appspot.com",
  messagingSenderId: "885115921378",
  appId: "1:885115921378:web:dcfc89e162a43830ce8fbb",
  measurementId: "G-DCFLYML4Q3"
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const analyticsPromise = isSupported().then(yes => yes ? getAnalytics(app) : null)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
export { analyticsPromise }
export const provider = new GoogleAuthProvider()
