"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext({
  user: null,
  userProfile: null,
  role: null,
  loading: true,
  error: null,
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listener sesi autentikasi Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setError(null);

      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          // Ambil profil pengguna dari Firestore: users/{uid}
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserProfile(data);
            // Role WAJIB bersumber dari dokumen Firestore, tidak ditebak
            const validRoles = ["pasien", "resepsionis", "dokter", "super_admin"];
            if (data.role && validRoles.includes(data.role)) {
              setRole(data.role);
            } else {
              setRole(null);
              setError(
                `Peran akun "${data.role || "kosong"}" tidak valid atau tidak dikenali oleh sistem.`
              );
            }
          } else {
            // Profil tidak ditemukan di Firestore: jangan menebak role
            console.warn(
              `Dokumen users/${firebaseUser.uid} tidak ditemukan di Cloud Firestore.`
            );
            setUserProfile(null);
            setRole(null);
            setError("Dokumen profil tidak ditemukan di Firestore.");
          }
        } catch (err) {
          console.error("Gagal membaca profil pengguna dari Firestore:", err);
          setUserProfile(null);
          setRole(null);
          setError(err.message || "Gagal memuat profil pengguna.");
        } finally {
          setLoading(false);
        }
      } else {
        // Pengguna belum login
        setUser(null);
        setUserProfile(null);
        setRole(null);
        setError(null);
        setLoading(false);
      }
    });

    // Bersihkan listener saat komponen unmount
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      setRole(null);
      setError(null);
    } catch (err) {
      console.error("Gagal keluar dari sesi Firebase Auth:", err);
      throw err;
    }
  };

  const value = {
    user,
    userProfile,
    role,
    loading,
    error,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}
