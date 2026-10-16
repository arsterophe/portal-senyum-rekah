"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PortalLayout from "@/components/PortalLayout";
import {
  FileText,
  Calendar,
  User,
  Layers,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import {
  MOCK_JANJI_TEMU,
  MOCK_USERS,
  MOCK_LAYANAN,
} from "@/lib/mockData";

function LaporanContent() {
  const searchParams = useSearchParams();
  const initialBulan = searchParams.get("bulan") || "2026-10";
  const [selectedBulan, setSelectedBulan] = useState(initialBulan);

  // Kunjungan dihitung dari janji berstatus Selesai (PRD 4.16)
  const janjiSelesai = MOCK_JANJI_TEMU.filter((j) => j.status === "selesai");
  const totalKunjungan = janjiSelesai.length;

  const doctors = MOCK_USERS.filter((u) => u.role === "dokter");
  const layananList = MOCK_LAYANAN;

  // Rekap per Dokter
  const rekapDokter = doctors.map((doc) => {
    const count = janjiSelesai.filter((j) => j.dokterId === doc.id).length;
    return {
      dokter: doc,
      jumlahKunjungan: count,
    };
  });

  // Rekap per Layanan
  const rekapLayanan = layananList.map((lay) => {
    const count = janjiSelesai.filter((j) => j.layananId === lay.id).length;
    return {
      layanan: lay,
      jumlahKunjungan: count,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Laporan Kunjungan Klinik</h1>
          <p className="text-xs text-[#5A6B78] mt-1">
            Rekapitulasi jumlah pasien dan layanan gigi berstatus Selesai per bulan
          </p>
        </div>

        {/* Pemilihan Bulan Sesuai PRD 4.16 */}
        <div className="flex items-center gap-2 bg-white p-2 border border-slate-200 rounded-xl shadow-sm text-xs">
          <Calendar className="w-4 h-4 text-[#0E7490]" />
          <span className="font-semibold text-[#1F2937]">Pilih Periode:</span>
          <select
            value={selectedBulan}
            onChange={(e) => setSelectedBulan(e.target.value)}
            className="p-1.5 border border-slate-300 rounded-lg text-xs font-medium"
          >
            <option value="2026-10">Oktober 2026 (Bulan Berjalan)</option>
            <option value="2026-09">September 2026</option>
            <option value="2026-08">Agustus 2026</option>
          </select>
        </div>
      </div>

      {/* Ringkasan Total */}
      <div className="bg-gradient-to-r from-cyan-900 to-[#0E7490] text-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-cyan-200 font-medium">
            Total Kunjungan Pasien Selesai ({selectedBulan === "2026-10" ? "Oktober 2026" : selectedBulan})
          </span>
          <p className="text-3xl font-extrabold mt-1 tabular-nums">
            {totalKunjungan} Kunjungan
          </p>
          <p className="text-xs text-cyan-100 mt-0.5">
            Dihitung otomatis dari rekam janji temu berstatus <b>Selesai</b>
          </p>
        </div>
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-cyan-200" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TABEL PERTAMA: Jumlah Kunjungan per Dokter (PRD 4.16) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
            <User className="w-4 h-4 text-[#0E7490]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Tabel 1: Jumlah Kunjungan per Dokter
            </h2>
          </div>

          <div className="p-2 flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[#5A6B78] font-semibold">
                  <th className="py-3 px-4">Nama Dokter</th>
                  <th className="py-3 px-4 text-right">Jumlah Kunjungan</th>
                  <th className="py-3 px-4 text-right">Persentase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rekapDokter.map((item) => {
                  const pct = totalKunjungan > 0 ? Math.round((item.jumlahKunjungan / totalKunjungan) * 100) : 0;
                  return (
                    <tr key={item.dokter.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-semibold text-[#1F2937]">
                        {item.dokter.nama}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums font-bold text-slate-800">
                        {item.jumlahKunjungan} Pasien
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-[#5A6B78]">
                        {pct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABEL KEDUA: Jumlah Kunjungan per Layanan (PRD 4.16) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0E7490]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Tabel 2: Jumlah Kunjungan per Layanan
            </h2>
          </div>

          <div className="p-2 flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[#5A6B78] font-semibold">
                  <th className="py-3 px-4">Jenis Tindakan / Layanan</th>
                  <th className="py-3 px-4 text-right">Jumlah Dilakukan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rekapLayanan.map((item) => (
                  <tr key={item.layanan.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-medium text-[#1F2937]">
                      {item.layanan.nama}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-[#0E7490]">
                      {item.jumlahKunjungan} Kali
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#5A6B78]">
        <b>Catatan Batasan PRD 4.16:</b> Ekspor Excel dan PDF serta kalkulasi omzet pendapatan keuangan tidak termasuk dalam lingkup versi 1 (v1).
      </div>
    </div>
  );
}

export default function LaporanPage() {
  return (
    <PortalLayout>
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#5A6B78]">Memuat laporan...</div>}>
        <LaporanContent />
      </Suspense>
    </PortalLayout>
  );
}
