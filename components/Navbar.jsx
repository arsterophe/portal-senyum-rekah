"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, LogIn, UserPlus, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userProfile, role, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/masuk");
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };

  const activeUserName = userProfile?.nama || user?.displayName || user?.email || "";
  const activeRole = role || (user ? "" : "pengunjung");

  let roleLabel = "Pengunjung";
  if (user) {
    const roleNames = {
      super_admin: "Super Admin",
      dokter: "Dokter",
      resepsionis: "Resepsionis",
      pasien: "Pasien",
    };
    const rName = role ? (roleNames[role] || role) : (userProfile ? "Pengguna" : "Memuat Akun...");
    roleLabel = activeUserName ? `${rName} (${activeUserName})` : rName;
  }

  const isAuthPage = pathname === "/masuk" || pathname === "/daftar";

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0E7490] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white text-[#0E7490] flex items-center justify-center font-bold text-xl shadow-sm">
            SR
          </div>
          <div>
            <div className="font-bold text-lg leading-tight tracking-tight">
              Portal Janji Senyum Rekah
            </div>
            <div className="text-xs text-cyan-100 flex items-center gap-1.5">
              <span>Klinik Gigi Makassar</span>
              <span className="inline-block w-1 h-1 rounded-full bg-cyan-200"></span>
              <span className="text-[11px] font-medium bg-cyan-800/60 px-1.5 py-0.5 rounded">
                Senin - Sabtu
              </span>
            </div>
          </div>
        </Link>

        {/* Right side: Role indicator & Navigation links */}
        <div className="flex items-center gap-3">
          {/* Quick Module Switcher khusus Super Admin (PRD 2.3 Hak Akses Penuh) */}
          {role === "super_admin" && (
            <div className="hidden md:flex items-center gap-1 bg-cyan-800/60 p-1 rounded-lg text-xs">
              <span className="px-2 text-cyan-200 font-medium">Akses Admin:</span>
              <Link
                href="/beranda"
                className={`px-2.5 py-1 rounded transition ${
                  pathname.startsWith("/beranda") || pathname.startsWith("/janji") || pathname.startsWith("/riwayat")
                    ? "bg-white text-[#0E7490] font-semibold"
                    : "text-white hover:bg-cyan-700"
                }`}
              >
                Pasien
              </Link>
              <Link
                href="/resepsionis"
                className={`px-2.5 py-1 rounded transition ${
                  pathname.startsWith("/resepsionis")
                    ? "bg-white text-[#0E7490] font-semibold"
                    : "text-white hover:bg-cyan-700"
                }`}
              >
                Resepsionis
              </Link>
              <Link
                href="/dokter"
                className={`px-2.5 py-1 rounded transition ${
                  pathname.startsWith("/dokter")
                    ? "bg-white text-[#0E7490] font-semibold"
                    : "text-white hover:bg-cyan-700"
                }`}
              >
                Dokter
              </Link>
              <Link
                href="/admin"
                className={`px-2.5 py-1 rounded transition ${
                  pathname.startsWith("/admin")
                    ? "bg-white text-[#0E7490] font-semibold"
                    : "text-white hover:bg-cyan-700"
                }`}
              >
                Admin
              </Link>
            </div>
          )}

          {isAuthPage ? (
            <div className="flex items-center gap-2 text-sm">
              <Link
                href="/masuk"
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border border-cyan-400/30 hover:bg-cyan-800 ${
                  pathname === "/masuk" ? "bg-cyan-800 font-semibold" : ""
                }`}
              >
                <LogIn className="w-4 h-4" /> Masuk
              </Link>
              <Link
                href="/daftar"
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-[#0E7490] font-semibold hover:bg-cyan-50 shadow-sm ${
                  pathname === "/daftar" ? "ring-2 ring-white" : ""
                }`}
              >
                <UserPlus className="w-4 h-4" /> Daftar
              </Link>
            </div>
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profil"
                className="flex items-center gap-2 bg-cyan-800/80 hover:bg-cyan-800 px-3 py-1.5 rounded-lg transition"
              >
                <div className="w-7 h-7 rounded-full bg-cyan-200 text-[#0E7490] flex items-center justify-center font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left text-xs">
                  <p className="font-semibold leading-tight">{roleLabel}</p>
                  <p className="text-[10px] text-cyan-200">Lihat Profil</p>
                </div>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-700 text-white text-xs font-semibold transition shadow-sm"
                title="Keluar dari akun"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <Link
                href="/masuk"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-cyan-400/30 hover:bg-cyan-800"
              >
                <LogIn className="w-4 h-4" /> Masuk
              </Link>
              <Link
                href="/daftar"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-[#0E7490] font-semibold hover:bg-cyan-50 shadow-sm"
              >
                <UserPlus className="w-4 h-4" /> Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
