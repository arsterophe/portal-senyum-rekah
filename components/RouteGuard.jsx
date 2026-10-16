"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, AlertTriangle, Loader2, LogOut, ArrowLeft } from "lucide-react";

/**
 * Pemetaan peran yang diizinkan untuk setiap kelompok rute berdasarkan:
 * - docs/PRD.md (Bab 2.3 Hak Akses per Modul)
 * - docs/rancangan.md (Bab 1.1 Tabel Matriks Hak Akses Halaman & Fitur)
 */
export function getAllowedRolesForPath(pathname) {
  // 1. Modul Super Admin (/admin dan seluruh subroute)
  // Hanya Super Admin (Bu Ratna) yang boleh mengakses
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return ["super_admin"];
  }

  // 2. Modul Resepsionis (/resepsionis dan seluruh subroute)
  // Resepsionis dan Super Admin (PRD 2.3)
  if (pathname === "/resepsionis" || pathname.startsWith("/resepsionis/")) {
    return ["resepsionis", "super_admin"];
  }

  // 3. Modul Dokter (/dokter dan seluruh subroute)
  // Dokter dan Super Admin (PRD 2.3)
  if (pathname === "/dokter" || pathname.startsWith("/dokter/")) {
    return ["dokter", "super_admin"];
  }

  // 4. Modul Pasien (/beranda, /janji/*, /riwayat/*)
  // Pasien dan Super Admin (PRD 2.3)
  if (
    pathname === "/beranda" ||
    pathname.startsWith("/beranda/") ||
    pathname === "/janji" ||
    pathname.startsWith("/janji/") ||
    pathname === "/riwayat" ||
    pathname.startsWith("/riwayat/")
  ) {
    return ["pasien", "super_admin"];
  }

  // 5. Modul Profil (/profil)
  // Seluruh peran yang telah masuk berhak mengakses profilnya sendiri (PRD 4.5)
  if (pathname === "/profil" || pathname.startsWith("/profil/")) {
    return ["pasien", "resepsionis", "dokter", "super_admin"];
  }

  // Default untuk halaman dalam PortalLayout: wajib terautentikasi
  return ["pasien", "resepsionis", "dokter", "super_admin"];
}

/**
 * Tentukan halaman beranda default berdasarkan peran
 */
export function getDefaultHomeForRole(role) {
  switch (role) {
    case "super_admin":
      return "/admin";
    case "dokter":
      return "/dokter";
    case "resepsionis":
      return "/resepsionis";
    case "pasien":
      return "/beranda";
    default:
      return "/masuk";
  }
}

export default function RouteGuard({ children }) {
  const { user, userProfile, role, loading, error: authError, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Pengalihan otomatis bagi pengguna yang belum login
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/masuk");
    }
  }, [loading, user, router]);

  // 1. KONDISI LOADING: Jangan tampilkan konten sebelum verifikasi selesai
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-[#0E7490] flex items-center justify-center mb-3">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <h2 className="text-sm font-bold text-[#1F2937] mb-1">
          Memeriksa Izin Akses...
        </h2>
        <p className="text-xs text-[#5A6B78] max-w-sm">
          Sistem sedang memverifikasi sesi login dan peran akun Anda di Klinik Gigi Senyum Rekah.
        </p>
      </div>
    );
  }

  // 2. KONDISI BELUM LOGIN: Tampilkan pesan pengalihan ke /masuk
  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <h2 className="text-sm font-bold text-[#1F2937] mb-1">
          Mengarahkan ke Halaman Masuk...
        </h2>
        <p className="text-xs text-[#5A6B78] max-w-sm">
          Halaman ini memerlukan autentikasi. Mengarahkan Anda ke /masuk.
        </p>
      </div>
    );
  }

  // 3. KONDISI PROFIL TIDAK DITEMUKAN / GAGAL DIBACA DI FIRESTORE
  // Sesuai Persyaratan 4 & 6: Jangan berikan akses berdasarkan role tebakan
  if (!userProfile || !role) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 min-h-[60vh]">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-amber-200 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1F2937]">
              Profil Pengguna Belum Ditemukan
            </h1>
            <p className="text-xs text-[#5A6B78] mt-2 leading-relaxed">
              Sesi login aktif untuk <b>{user.email}</b>, namun dokumen profil dan peran pengguna tidak ditemukan atau gagal dibaca dari Cloud Firestore (<code>users/{user.uid}</code>). Akses ditolak demi keamanan.
            </p>
            {authError && (
              <p className="text-[11px] text-red-600 bg-red-50 p-2 rounded-lg mt-2">
                Detail: {authError}
              </p>
            )}
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              href="/"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#1F2937] rounded-xl text-xs font-semibold transition"
            >
              Halaman Utama
            </Link>
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.replace("/masuk");
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Akun</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. KONDISI AKUN NONAKTIF (PRD 4.1)
  if (userProfile.aktif !== true) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 min-h-[60vh]">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-red-200 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1F2937]">
              Akun Dinonaktifkan
            </h1>
            <p className="text-xs text-[#5A6B78] mt-2 leading-relaxed">
              Akun Anda (<b>{user.email}</b>) telah dinonaktifkan oleh administrator klinik. Anda tidak memiliki izin untuk mengakses layanan ini. Silakan hubungi pihak Klinik Gigi Senyum Rekah.
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.replace("/masuk");
              }}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Akun</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. KONDISI PEMERIKSAAN ROLE SESUAI PRD & RANCANGAN
  const allowedRoles = getAllowedRolesForPath(pathname);
  const isAuthorized = allowedRoles.includes(role);

  // Jika role pengguna TIDAK diizinkan: Tampilkan Halaman Akses Ditolak
  if (!isAuthorized) {
    const roleLabels = {
      pasien: "Pasien",
      resepsionis: "Resepsionis",
      dokter: "Dokter",
      super_admin: "Super Admin",
    };

    const allowedLabels = allowedRoles.map((r) => roleLabels[r] || r).join(" atau ");
    const currentLabel = roleLabels[role] || role;

    return (
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 min-h-[60vh]">
        <div className="max-w-lg w-full bg-white rounded-2xl p-8 border border-red-200 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200 mb-2">
              <span>Akses Tidak Memenuhi Izin</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Akses Ditolak</h1>
            <p className="text-xs text-[#5A6B78] mt-2 leading-relaxed">
              Anda tidak memiliki izin untuk membuka halaman <code>{pathname}</code>. Halaman ini hanya boleh diakses oleh peran <b>{allowedLabels}</b>, sedangkan akun Anda terdaftar sebagai <b>{currentLabel}</b>.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              href={getDefaultHomeForRole(role)}
              className="px-5 py-2.5 bg-[#0E7490] hover:bg-cyan-800 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Halaman Anda ({currentLabel})</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 5. KONDISI TEROTORISASI: Tampilkan konten halaman yang dilindungi
  return <>{children}</>;
}
