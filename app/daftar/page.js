"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { UserPlus, Mail, Lock, Phone, User, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function DaftarPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    noHp: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSuccess(false);

    if (!formData.nama || !formData.email || !formData.noHp || !formData.password) {
      setError("Semua bidang bertanda (*) wajib diisi.");
      return;
    }

    if (!formData.noHp.startsWith("08")) {
      setError("Nomor HP harus diawali 08 dan hanya angka.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Dapatkan atau buat akun pengguna di Firebase Authentication
      // Jika akun Auth sudah berhasil dibuat sebelumnya (misal percobaan pertama gagal di Firestore),
      // gunakan sesi yang ada atau login ulang tanpa membuat akun baru.
      let user = auth.currentUser;

      if (!user || user.email?.toLowerCase() !== formData.email.trim().toLowerCase()) {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            formData.email.trim(),
            formData.password
          );
          user = userCredential.user;
        } catch (authErr) {
          if (authErr.code === "auth/email-already-in-use") {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              formData.email.trim(),
              formData.password
            );
            user = userCredential.user;
          } else {
            throw authErr;
          }
        }
      }

      // Update displayName pada profil auth (opsional)
      try {
        await updateProfile(user, { displayName: formData.nama.trim() });
      } catch (profileErr) {
        console.warn("Pembaruan display name auth dilewati:", profileErr);
      }

      // 2. Simpan profil ke koleksi users di Cloud Firestore
      // Sesuai PRD 7.1: nama, email, noHp, role, aktif, dibuatPada
      // Password TIDAK PERNAH disimpan ke Firestore
      // Role default adalah "pasien"
      await setDoc(doc(db, "users", user.uid), {
        nama: formData.nama.trim(),
        email: formData.email.trim().toLowerCase(),
        noHp: formData.noHp.trim(),
        role: "pasien",
        aktif: true,
        dibuatPada: new Date().toISOString(),
      });

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/beranda");
      }, 1500);
    } catch (err) {
      console.error("Registrasi error:", err);
      let pesanError = "Terjadi kesalahan saat registrasi. Silakan coba lagi.";

      if (err.code === "auth/email-already-in-use") {
        pesanError = "Alamat email ini sudah terdaftar. Silakan gunakan email lain atau masuk.";
      } else if (err.code === "auth/invalid-email") {
        pesanError = "Format alamat email tidak valid.";
      } else if (err.code === "auth/weak-password") {
        pesanError = "Kata sandi terlalu lemah. Gunakan minimal 6 karakter.";
      } else if (err.code === "auth/operation-not-allowed") {
        pesanError = "Metode pendaftaran Email/Password belum diaktifkan di Firebase Console.";
      } else if (err.code === "auth/network-request-failed") {
        pesanError = "Gagal terhubung ke server Firebase. Periksa koneksi internet Anda.";
      } else if (err.code === "permission-denied") {
        pesanError = "Akun dibuat di Auth, namun penyimpanan profil ke Cloud Firestore ditolak aturan keamanan (Security Rules).";
      } else if (err.message) {
        pesanError = err.message;
      }

      setError(pesanError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setError("Pendaftaran via Google dapat digunakan di tahap berikutnya. Silakan daftar menggunakan formulir Email & Kata Sandi di bawah.");
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-cyan-100 text-[#0E7490] rounded-xl flex items-center justify-center mx-auto mb-3 font-bold text-lg">
              <UserPlus className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Daftar Akun Baru</h1>
            <p className="text-xs text-[#5A6B78] mt-1">
              Pasien baru Klinik Gigi Senyum Rekah
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
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Pendaftaran berhasil! Mengarahkan ke /beranda...</span>
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
            <span>Daftar dengan Google</span>
          </button>

          <div className="relative flex py-2 items-center mb-5">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-[11px] uppercase">
              atau daftar manual
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="nama"
                  placeholder="Contoh: Andi Wijaya"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0E7490] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Alamat Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  name="email"
                  placeholder="contoh@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0E7490] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Nomor HP (WhatsApp) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  name="noHp"
                  placeholder="08xxxxxxxxxx"
                  value={formData.noHp}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs tabular-nums focus:outline-none focus:ring-2 focus:ring-[#0E7490] focus:border-transparent"
                  required
                />
              </div>
              <p className="text-[10px] text-[#5A6B78] mt-1">
                Hanya angka, diawali dengan 08.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Kata Sandi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  name="password"
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={handleChange}
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
                  <span>Mendaftarkan akun...</span>
                </>
              ) : (
                <span>Daftar Sebagai Pasien</span>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[#5A6B78] mt-6">
            Sudah memiliki akun?{" "}
            <Link href="/masuk" className="text-[#0E7490] font-semibold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
