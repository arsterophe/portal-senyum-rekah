"use client";

import PortalLayout from "@/components/PortalLayout";
import StatusBadge from "@/components/StatusBadge";
import { ClipboardList, Calendar, User, Clock, FileText, CheckCircle } from "lucide-react";
import {
  MOCK_JANJI_TEMU,
  MOCK_CATATAN_PERAWATAN,
  getUserById,
  getLayananById,
} from "@/lib/mockData";

export default function RiwayatPerawatanPage() {
  const pasienId = "usr_andi";

  // Sesuai PRD 4.4: daftar janji berstatus Selesai dengan Tanggal, Dokter, Layanan, Tindakan, dan Catatan dokter, dari yang terbaru.
  const janjiSelesai = MOCK_JANJI_TEMU.filter(
    (j) => j.pasienId === pasienId && j.status === "selesai"
  ).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Riwayat Perawatan</h1>
          <p className="text-xs text-[#5A6B78] mt-1">
            Catatan medis, tindakan klinis, dan instruksi perawatan dari kunjungan Anda yang telah selesai.
          </p>
        </div>

        <div className="space-y-4">
          {janjiSelesai.map((item) => {
            const dokter = getUserById(item.dokterId);
            const layanan = getLayananById(item.layananId);
            const catatan = MOCK_CATATAN_PERAWATAN.find((c) => c.janjiId === item.id);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-[#1F2937]">
                      {layanan?.nama || "Perawatan Gigi"}
                    </span>
                    <StatusBadge status="selesai" />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#5A6B78]">
                    <span className="flex items-center gap-1 font-medium tabular-nums">
                      <Calendar className="w-3.5 h-3.5 text-[#0E7490]" />
                      {item.tanggal}
                    </span>
                    <span className="flex items-center gap-1 font-medium tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-[#0E7490]" />
                      {item.jam} WITA
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-[#1F2937]">
                      <User className="w-4 h-4 text-[#0E7490]" />
                      <span>Dokter Pemeriksa:</span>
                    </div>
                    <p className="text-slate-700">{dokter?.nama || "-"}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-[#1F2937]">
                      <FileText className="w-4 h-4 text-[#0E7490]" />
                      <span>Keluhan Awal:</span>
                    </div>
                    <p className="text-slate-700">{item.keluhan || "-"}</p>
                  </div>
                </div>

                {/* Tindakan & Catatan Dokter Sesuai PRD 4.4 */}
                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-900 text-xs">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Tindakan Medis Dokter:</span>
                    </div>
                    <p className="text-xs text-emerald-950">
                      {catatan?.tindakan || "Pemeriksaan dan perawatan gigi selesai."}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-cyan-50/60 border border-cyan-200/60 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-semibold text-[#0E7490] text-xs">
                      <FileText className="w-4 h-4 text-[#0E7490]" />
                      <span>Instruksi & Catatan Perawatan Pasca Tindakan:</span>
                    </div>
                    <p className="text-xs text-slate-800">
                      {catatan?.catatan || "Tidak ada catatan tambahan."}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {janjiSelesai.length === 0 && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
              <ClipboardList className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-[#1F2937]">
                Belum Ada Riwayat Perawatan
              </p>
              <p className="text-xs text-[#5A6B78] max-w-sm mx-auto">
                Setelah kunjungan Anda diperiksa oleh dokter gigi dan ditandai selesai, catatan tindakan medis akan tampil di halaman ini.
              </p>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
