"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { LogIn, Mail, Lock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export default function MasukPage() {
  const router = useRouter();
  const { user: currentUser, role: currentRole, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Jika pengguna sudah login dengan peran valid, arahkan langsung ke halaman perannya
  useEffect(() => {
    if (!authLoading && currentUser && currentRole) {
      const roleTargets = {
        pasien: "/beranda",
        resepsionis: "/resepsionis",
        dokter: "/dokter",
        super_admin: "/admin",
      };
      const dest = roleTargets[currentRole];
      if (dest) {
        router.replace(dest);
      }
    }
  }, [currentUser, currentRole, authLoading, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSuccess(false);

    if (!email || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Masuk menggunakan Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 2. Baca dokumen profil dari Cloud Firestore: users/{uid}
      let userDocSnap;
      try {
        userDocSnap = await getDoc(doc(db, "users", user.uid));
      } catch (readErr) {
        console.error("Gagal membaca profil dari Firestore:", readErr);
        // Tangani kondisi pembacaan profil gagal tanpa membuat akun baru
        setError(
          `Autentikasi akun berhasil, namun profil pengguna tidak dapat dibaca dari database (${readErr.message}). Silakan hubungi pihak klinik atau administrator.`
        );
        return;
      }

      // 3. Validasi keberadaan dokumen profil (tidak menebak role atau menggunakan mock)
      if (!userDocSnap || !userDocSnap.exists()) {
        setError(
          `Autentikasi akun berhasil, namun data profil belum terdaftar di database (users/${user.uid}). Silakan hubungi pihak klinik.`
        );
        return;
      }

      const profile = userDocSnap.data();

      // 4. Validasi status aktif akun (PRD 4.1)
      if (profile.aktif !== true) {
        await signOut(auth);
        setError("Akun Anda telah dinonaktifkan oleh administrator klinik. Silakan hubungi klinik.");
        return;
      }

      // 5. Validasi role yang dikenal (PRD 2.1 & 4.1)
      const roleRedirects = {
        pasien: "/beranda",
        resepsionis: "/resepsionis",
        dokter: "/dokter",
        super_admin: "/admin",
      };

      const targetUrl = roleRedirects[profile.role];
      if (!targetUrl) {
        await signOut(auth);
        setError(
          `Peran akun "${profile.role || "tidak terdefinisi"}" tidak valid atau tidak dikenali oleh sistem. Hubungi administrator klinik.`
        );
        return;
      }

      setRedirectTarget(targetUrl);
      setIsSuccess(true);

      // Arahkan ke halaman peran yang sesuai
      setTimeout(() => {
        router.push(targetUrl);
      }, 800);
    } catch (err) {
      console.error("Login error:", err);
      let pesanError = "Gagal masuk. Periksa kembali email dan kata sandi Anda.";

      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        pesanError = "Email atau kata sandi yang Anda masukkan salah.";
      } else if (err.code === "auth/invalid-email") {
        pesanError = "Format alamat email tidak valid.";
      } else if (err.code === "auth/user-disabled") {
        pesanError = "Akun ini telah dinonaktifkan oleh sistem autentikasi.";
      } else if (err.code === "auth/too-many-requests") {
        pesanError = "Terlalu banyak percobaan masuk yang gagal. Silakan tunggu beberapa saat.";
      } else if (err.code === "auth/network-request-failed") {
        pesanError = "Gagal terhubung ke server Firebase. Periksa koneksi internet Anda.";
      } else if (err.message) {
        pesanError = err.message;
      }

      setError(pesanError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setError(
      "Fitur masuk via Google dapat digunakan di tahap berikutnya. Silakan masuk menggunakan formulir Email & Kata Sandi di bawah."
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-cyan-100 text-[#0E7490] rounded-xl flex items-center justify-center mx-auto mb-3 font-bold text-lg">
              <LogIn className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Masuk ke Portal</h1>
            <p className="text-xs text-[#5A6B78] mt-1">
              Portal Janji Senyum Rekah · Makassar
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Masuk berhasil! Mengarahkan ke {redirectTarget}...</span>
            </div>
          )}

          {/* Tombol Masuk dengan Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full mb-5 flex items-center justify-center gap-3 py-2.5 px-4 border border-slate-300 rounded-xl text-xs font-semibold text-[#1F2937] hover:bg-slate-50 transition shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Masuk dengan Akun Google</span>
          </button>

          <div className="relative flex py-2 items-center mb-5">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-[11px] uppercase">
              atau masuk dengan email
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  placeholder="nama@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0E7490] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0E7490] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full mt-2 bg-[#0E7490] hover:bg-cyan-800 disabled:opacity-60 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Masuk</span>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[#5A6B78] mt-6">
            Belum punya akun?{" "}
            <Link href="/daftar" className="text-[#0E7490] font-semibold hover:underline">
              Daftar sebagai Pasien
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
