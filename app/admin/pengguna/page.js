"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import { Users, Search, ArrowRight, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function KelolaPenggunaPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("semua");

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = [];
      querySnapshot.forEach((docSnap) => {
        userList.push({
          id: docSnap.id,
          ...docSnap.data(),
        });
      });

      // Urutkan pengguna: yang memiliki tanggal dibuat terbaru atau menurut abjad nama
      userList.sort((a, b) => {
        if (b.dibuatPada && a.dibuatPada) {
          return b.dibuatPada.localeCompare(a.dibuatPada);
        }
        return (a.nama || "").localeCompare(b.nama || "");
      });

      setUsers(userList);
    } catch (err) {
      console.error("Gagal memuat pengguna dari Firestore:", err);
      setError(
        `Gagal memuat data pengguna dari Cloud Firestore: ${err.message}. Periksa koneksi atau izin akses Firestore.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== "semua" && u.role !== roleFilter) return false;
    if (searchTerm) {
      const matchName = (u.nama || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchEmail = (u.email || "").toLowerCase().includes(searchTerm.toLowerCase());
      return matchName || matchEmail;
    }
    return true;
  });

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Kelola Pengguna & Peran</h1>
            <p className="text-xs text-[#5A6B78] mt-1">
              Atur penugasan peran (Pasien, Resepsionis, Dokter, Super Admin) dan status akun dari Cloud Firestore
            </p>
          </div>

          <button
            type="button"
            onClick={fetchUsers}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#1F2937] rounded-xl text-xs font-semibold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Segarkan Data</span>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchUsers}
              className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Filter & Pencarian Sesuai PRD 4.13 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atau email pengguna..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-[#0E7490] focus:border-[#0E7490]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1F2937]">Filter Peran:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="p-2 border border-slate-300 rounded-lg text-xs"
            >
              <option value="semua">Semua Peran</option>
              <option value="pasien">Pasien</option>
              <option value="resepsionis">Resepsionis</option>
              <option value="dokter">Dokter</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
        </div>

        {/* Tabel Pengguna (PRD 4.13: Tabel Nama, Email, Peran, Status) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="py-16 text-center text-xs text-[#5A6B78] space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0E7490]" />
              <p className="font-medium">Memuat data pengguna dari Cloud Firestore...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#5A6B78] space-y-2">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">Belum Ada Pengguna Terdaftar</p>
              <p>Belum ada dokumen yang ditemukan di koleksi <code>users</code> Firestore.</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#5A6B78] space-y-2">
              <Search className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">Tidak Ada Hasil</p>
              <p>Tidak ditemukan pengguna dengan filter atau kata kunci tersebut.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[#5A6B78] font-semibold">
                    <th className="py-3.5 px-4">Nama Lengkap</th>
                    <th className="py-3.5 px-4">Alamat Email</th>
                    <th className="py-3.5 px-4">Nomor HP</th>
                    <th className="py-3.5 px-4">Peran (Role)</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Kelola</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-semibold text-[#1F2937]">
                        <Link
                          href={`/admin/pengguna/${u.id}`}
                          className="hover:text-[#0E7490] hover:underline"
                        >
                          {u.nama || "Tanpa Nama"}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{u.email || "-"}</td>
                      <td className="py-3.5 px-4 tabular-nums text-slate-700">
                        {u.noHp || "-"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-800">
                          {u.role || "pasien"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {u.aktif !== false ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                            Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/pengguna/${u.id}`}
                          className="inline-flex items-center gap-1 font-semibold text-[#0E7490] hover:underline"
                        >
                          <span>Ubah Peran</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
