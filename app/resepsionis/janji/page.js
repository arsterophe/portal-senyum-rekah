"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PortalLayout from "@/components/PortalLayout";
import StatusBadge from "@/components/StatusBadge";
import {
  Calendar,
  Filter,
  ArrowRight,
  Clock,
  User,
  Search,
} from "lucide-react";
import {
  MOCK_JANJI_TEMU,
  getUserById,
  getLayananById,
} from "@/lib/mockData";

function KelolaJanjiContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "semua";

  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [dateFilter, setDateFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const s = searchParams.get("status");
    if (s) {
      setStatusFilter(s);
    }
  }, [searchParams]);

  // Filter list janji sesuai PRD 4.7
  const filteredJanji = MOCK_JANJI_TEMU.filter((j) => {
    if (statusFilter !== "semua" && j.status !== statusFilter) {
      return false;
    }
    if (dateFilter && j.tanggal !== dateFilter) {
      return false;
    }
    if (searchTerm) {
      const pasien = getUserById(j.pasienId);
      const dokter = getUserById(j.dokterId);
      const matchPasien = pasien?.nama?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDokter = dokter?.nama?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchPasien && !matchDokter) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Kelola Janji Temu</h1>
          <p className="text-xs text-[#5A6B78] mt-1">
            Konfirmasi janji, jadwal ulang, pembatalan, dan tanda kehadiran pasien
          </p>
        </div>
      </div>

      {/* Saringan Status dan Tanggal Sesuai PRD 4.7 */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#0E7490]" />
          <span className="font-semibold text-[#1F2937]">Saring Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg text-xs focus:ring-[#0E7490] focus:border-[#0E7490]"
          >
            <option value="semua">Semua Status</option>
            <option value="menunggu">Menunggu</option>
            <option value="dikonfirmasi">Dikonfirmasi</option>
            <option value="hadir">Hadir</option>
            <option value="selesai">Selesai</option>
            <option value="dibatalkan">Dibatalkan</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#0E7490]" />
          <span className="font-semibold text-[#1F2937]">Tanggal:</span>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg text-xs tabular-nums"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="text-[#0E7490] hover:underline text-[11px]"
            >
              Reset
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama pasien / dokter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-[#0E7490] focus:border-[#0E7490]"
          />
        </div>
      </div>

      {/* Tabel Kelola Janji Sesuai PRD 4.7 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[#5A6B78] font-semibold">
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Jam</th>
                <th className="py-3.5 px-4">Pasien</th>
                <th className="py-3.5 px-4">Dokter</th>
                <th className="py-3.5 px-4">Layanan</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJanji.map((item) => {
                const pasien = getUserById(item.pasienId);
                const dokter = getUserById(item.dokterId);
                const layanan = getLayananById(item.layananId);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition"
                  >
                    <td className="py-3.5 px-4 font-semibold text-[#1F2937] tabular-nums">
                      {item.tanggal}
                    </td>
                    <td className="py-3.5 px-4 tabular-nums text-slate-700">
                      {item.jam} WITA
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#1F2937]">
                      {pasien?.nama || "-"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {dokter?.nama || "-"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {layanan?.nama || "-"}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/resepsionis/janji/${item.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#0E7490] hover:text-cyan-800 hover:underline"
                      >
                        <span>Kelola</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {filteredJanji.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-[#5A6B78]">
                    Tidak ada data janji temu yang sesuai dengan saringan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function KelolaJanjiPage() {
  return (
    <PortalLayout>
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#5A6B78]">Memuat daftar janji...</div>}>
        <KelolaJanjiContent />
      </Suspense>
    </PortalLayout>
  );
}
