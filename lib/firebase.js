import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase dibaca dari environment variables (.env.local)
// Nilai sensitif tidak ditulis langsung di dalam kode aplikasi
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "portal-senyum-rekah-ale",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Singleton pattern: Mencegah inisialisasi ganda saat Fast Refresh / HMR di Next.js
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Inisialisasi layanan Firebase (Auth & Firestore)
let auth;
let db;

try {
  auth = getAuth(app);
} catch (error) {
  // Ditangani jika API key belum diisi atau sedang dalam proses build
  console.warn("Firebase Auth belum aktif (periksa NEXT_PUBLIC_FIREBASE_API_KEY):", error.message);
}

try {
  db = getFirestore(app);
} catch (error) {
  console.warn("Cloud Firestore belum aktif:", error.message);
}

export { app, auth, db };
export default app;
