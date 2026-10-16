"use client";

import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import StatusBadge from "@/components/StatusBadge";
import { Calendar, PlusCircle, ArrowRight, Clock, User } from "lucide-react";
import { MOCK_JANJI_TEMU, getUserById, getLayananById } from "@/lib/mockData";

export default function DaftarJanjiPage() {
  const pasienId = "usr_andi";
  // Filter janji milik pasien andi dan urutkan tanggal
  const daftarJanji = MOCK_JANJI_TEMU.filter(
    (j) => j.pasienId === pasienId
  ).sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Janji Temu Saya</h1>
            <p className="text-xs text-[#5A6B78] mt-1">
              Daftar seluruh jadwal janji temu dan status konfirmasi Anda
            </p>
          </div>
          <Link
            href="/janji/baru"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0E7490] hover:bg-cyan-800 text-white rounded-xl text-xs font-semibold shadow-sm transition self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Buat Janji Baru</span>
          </Link>
        </div>

        {/* Tabel / List Janji Temu sesuai PRD 4.3.2 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[#5A6B78] font-semibold">
                  <th className="py-3.5 px-4">Tanggal</th>
                  <th className="py-3.5 px-4">Jam</th>
                  <th className="py-3.5 px-4">Dokter</th>
                  <th className="py-3.5 px-4">Layanan</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {daftarJanji.map((item) => {
                  const dokter = getUserById(item.dokterId);
                  const layanan = getLayananById(item.layananId);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition group"
                    >
                      <td className="py-3.5 px-4 font-semibold text-[#1F2937] tabular-nums">
                        {item.tanggal}
                      </td>
                      <td className="py-3.5 px-4 tabular-nums text-slate-700">
                        {item.jam} WITA
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {dokter?.nama || "-"}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#1F2937]">
                        {layanan?.nama || "-"}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/janji/${item.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0E7490] hover:text-cyan-800 hover:underline"
                        >
                          <span>Rincian</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}

                {daftarJanji.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-[#5A6B78]">
                      Belum ada catatan janji temu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
