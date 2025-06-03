// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnaDO2pVsrQIJZa8Ln2TvR4URzIYzvTI0",
  authDomain: "livedrop-sdiwr.firebaseapp.com",
  projectId: "livedrop-sdiwr",
  storageBucket: "livedrop-sdiwr.firebasestorage.app",
  messagingSenderId: "476238082922",
  appId: "1:476238082922:web:e85336ecc3b8e7e611ab13"
};

// Initialize Firebase

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
