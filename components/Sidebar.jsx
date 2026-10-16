"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Calendar,
  CalendarPlus,
  Clock,
  User,
  Users,
  FileText,
  Stethoscope,
  ClipboardList,
  Layers,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, logout } = useAuth();
  const [janjiExpanded, setJanjiExpanded] = useState(true);

  // Tentukan kelompok menu berdasarkan peran akun terautentikasi (PRD 2.3)
  let isResepsionis = role === "resepsionis";
  let isDokter = role === "dokter";
  let isAdmin = role === "super_admin";
  let isPasien = role === "pasien";

  // Khusus Super Admin: dapat meninjau modul peran lain (PRD 2.3 Hak Akses Penuh)
  if (role === "super_admin") {
    if (pathname.startsWith("/resepsionis")) {
      isResepsionis = true;
      isAdmin = false;
    } else if (pathname.startsWith("/dokter")) {
      isDokter = true;
      isAdmin = false;
    } else if (
      pathname.startsWith("/beranda") ||
      pathname.startsWith("/janji") ||
      pathname.startsWith("/riwayat")
    ) {
      isPasien = true;
      isAdmin = false;
    } else {
      isAdmin = true;
    }
  }

  // Fallback pengenal URL jika role belum termuat dari konteks
  if (!isResepsionis && !isDokter && !isAdmin && !isPasien) {
    if (pathname.startsWith("/resepsionis")) isResepsionis = true;
    else if (pathname.startsWith("/dokter")) isDokter = true;
    else if (pathname.startsWith("/admin")) isAdmin = true;
    else isPasien = true;
  }

  const isActive = (path, exact = false) => {
    if (exact) return pathname === path;
    return pathname.startsWith(path);
  };

  const navLinkClass = (active) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
      active
        ? "bg-[#0E7490] text-white shadow-sm"
        : "text-[#1F2937] hover:bg-slate-100 hover:text-[#0E7490]"
    }`;

  const subNavLinkClass = (active) =>
    `flex items-center gap-2 pl-9 pr-3 py-2 rounded-lg text-xs font-medium transition-all ${
      active
        ? "bg-cyan-50 text-[#0E7490] font-semibold"
        : "text-[#5A6B78] hover:bg-slate-50 hover:text-[#1F2937]"
    }`;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Role Badge Indicator */}
        <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-[#5A6B78]">
          <span className="font-semibold text-[#1F2937] block">
            {isPasien && "Menu Pasien"}
            {isResepsionis && "Menu Resepsionis"}
            {isDokter && "Menu Dokter"}
            {isAdmin && "Menu Super Admin"}
          </span>
          <span className="text-[11px]">Klinik Gigi Senyum Rekah</span>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {/* PASIEN NAVIGATION */}
          {isPasien && (
            <>
              <Link href="/beranda" className={navLinkClass(pathname === "/beranda")}>
                <Home className="w-4 h-4" />
                <span>Beranda</span>
              </Link>

              {/* Janji Saya Accordion Menu */}
              <div>
                <button
                  type="button"
                  onClick={() => setJanjiExpanded(!janjiExpanded)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    pathname.startsWith("/janji")
                      ? "text-[#0E7490] font-semibold"
                      : "text-[#1F2937] hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4" />
                    <span>Janji Saya</span>
                  </div>
                  {janjiExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {janjiExpanded && (
                  <div className="mt-1 space-y-1">
                    <Link
                      href="/janji"
                      className={subNavLinkClass(pathname === "/janji")}
                    >
                      <span>• Daftar Janji</span>
                    </Link>
                    <Link
                      href="/janji/baru"
                      className={subNavLinkClass(pathname === "/janji/baru")}
                    >
                      <span>• Buat Janji Baru</span>
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/riwayat" className={navLinkClass(pathname === "/riwayat")}>
                <ClipboardList className="w-4 h-4" />
                <span>Riwayat Perawatan</span>
              </Link>

              <Link href="/profil" className={navLinkClass(pathname === "/profil")}>
                <User className="w-4 h-4" />
                <span>Profil</span>
              </Link>
            </>
          )}

          {/* RESEPSIONIS NAVIGATION */}
          {isResepsionis && (
            <>
              <Link
                href="/resepsionis"
                className={navLinkClass(pathname === "/resepsionis")}
              >
                <Home className="w-4 h-4" />
                <span>Dasbor Resepsionis</span>
              </Link>

              <Link
                href="/resepsionis/janji"
                className={navLinkClass(pathname.startsWith("/resepsionis/janji"))}
              >
                <Calendar className="w-4 h-4" />
                <span>Kelola Janji</span>
              </Link>

              <Link
                href="/resepsionis/pasien"
                className={navLinkClass(pathname === "/resepsionis/pasien")}
              >
                <Users className="w-4 h-4" />
                <span>Data Pasien</span>
              </Link>

              <Link href="/profil" className={navLinkClass(pathname === "/profil")}>
                <User className="w-4 h-4" />
                <span>Profil</span>
              </Link>
            </>
          )}

          {/* DOKTER NAVIGATION */}
          {isDokter && (
            <>
              <Link href="/dokter" className={navLinkClass(pathname === "/dokter")}>
                <Stethoscope className="w-4 h-4" />
                <span>Dasbor Dokter</span>
              </Link>

              <Link href="/profil" className={navLinkClass(pathname === "/profil")}>
                <User className="w-4 h-4" />
                <span>Profil</span>
              </Link>
            </>
          )}

          {/* SUPER ADMIN NAVIGATION */}
          {isAdmin && (
            <>
              <Link href="/admin" className={navLinkClass(pathname === "/admin")}>
                <Home className="w-4 h-4" />
                <span>Dasbor Admin</span>
              </Link>

              <Link
                href="/admin/pengguna"
                className={navLinkClass(pathname.startsWith("/admin/pengguna"))}
              >
                <Users className="w-4 h-4" />
                <span>Kelola Pengguna</span>
              </Link>

              <Link
                href="/admin/layanan"
                className={navLinkClass(pathname === "/admin/layanan")}
              >
                <Layers className="w-4 h-4" />
                <span>Layanan</span>
              </Link>

              <Link
                href="/admin/jadwal-dokter"
                className={navLinkClass(pathname === "/admin/jadwal-dokter")}
              >
                <Clock className="w-4 h-4" />
                <span>Jadwal Dokter</span>
              </Link>

              <Link
                href="/admin/laporan"
                className={navLinkClass(pathname === "/admin/laporan")}
              >
                <FileText className="w-4 h-4" />
                <span>Laporan</span>
              </Link>

              <Link href="/profil" className={navLinkClass(pathname === "/profil")}>
                <User className="w-4 h-4" />
                <span>Profil</span>
              </Link>

              {/* Sesuai PRD 3.1 & 4.12: Super Admin memuat semua menu peran lain */}
              <div className="pt-4 mt-4 border-t border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 block mb-2">
                  Akses Peran Lain (Super Admin)
                </span>
                <Link
                  href="/beranda"
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 hover:text-[#0E7490] hover:bg-slate-50 rounded"
                >
                  <span>• Halaman Pasien</span>
                </Link>
                <Link
                  href="/resepsionis"
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 hover:text-[#0E7490] hover:bg-slate-50 rounded"
                >
                  <span>• Halaman Resepsionis</span>
                </Link>
                <Link
                  href="/dokter"
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 hover:text-[#0E7490] hover:bg-slate-50 rounded"
                >
                  <span>• Halaman Dokter</span>
                </Link>
              </div>
            </>
          )}
        </nav>
      </div>

      {/* Tombol Keluar Akun & Footer */}
      <div className="pt-4 border-t border-slate-200 space-y-3">
        <button
          type="button"
          onClick={async () => {
            try {
              await logout();
              router.replace("/masuk");
            } catch (err) {
              console.error("Gagal logout:", err);
            }
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition"
        >
          <LogOut className="w-4 h-4 text-red-600" />
          <span>Keluar Akun</span>
        </button>

        {/* Footer Info */}
        <div className="text-[11px] text-[#5A6B78] pt-1 border-t border-slate-100">
          <p className="font-medium text-[#1F2937]">Senyum Rekah v1.0</p>
          <p>Aplikasi Janji Temu Gigi</p>
        </div>
      </div>
    </aside>
  );
}
