"use client";

import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import StatusBadge from "@/components/StatusBadge";
import {
  Calendar,
  Clock,
  User,
  Users,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  MOCK_JANJI_TEMU,
  MOCK_USERS,
  getUserById,
  getLayananById,
} from "@/lib/mockData";

export default function DasborResepsionisPage() {
  const doctors = MOCK_USERS.filter((u) => u.role === "dokter");

  // Hitung jumlah janji menunggu konfirmasi (PRD 4.6)
  const janjiMenunggu = MOCK_JANJI_TEMU.filter((j) => j.status === "menunggu");
  const jumlahMenunggu = janjiMenunggu.length;

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header Resepsionis */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-blue-700 font-semibold bg-blue-50 px-2.5 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dasbor Resepsionis · Laras</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937]">
              Jadwal Meja Depan Hari Ini
            </h1>
            <p className="text-xs text-[#5A6B78] mt-1">
              Kamis, 15 Oktober 2026 · Klinik Gigi Senyum Rekah Makassar
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/resepsionis/janji"
              className="px-4 py-2.5 bg-[#0E7490] hover:bg-cyan-800 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Buka Kelola Janji</span>
            </Link>
          </div>
        </div>

        {/* Kartu Menunggu Konfirmasi (PRD 4.6) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/resepsionis/janji?status=menunggu"
            className="bg-white rounded-2xl p-5 border border-amber-200 hover:border-amber-400 shadow-sm transition hover:shadow group flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-medium text-amber-800 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Menunggu Konfirmasi</span>
              </span>
              <p className="text-3xl font-extrabold text-[#1F2937] tabular-nums">
                {jumlahMenunggu}
              </p>
              <p className="text-[11px] text-amber-700">
                Klik untuk memfilter daftar janji menunggu
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-medium text-slate-500">
              Total Janji Terjadwal Hari Ini
            </span>
            <p className="text-3xl font-extrabold text-[#1F2937] tabular-nums">
              {MOCK_JANJI_TEMU.filter((j) => j.status !== "dibatalkan").length}
            </p>
            <p className="text-[11px] text-slate-400">
              Di 2 dokter praktik aktif
            </p>
          </div>

          <Link
            href="/resepsionis/pasien"
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 shadow-sm transition hover:shadow group flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-medium text-blue-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Buku Kontak Pasien</span>
              </span>
              <p className="text-3xl font-extrabold text-[#1F2937] tabular-nums">
                {MOCK_USERS.filter((u) => u.role === "pasien").length}
              </p>
              <p className="text-[11px] text-slate-400">
                Lihat kontak & nomor WhatsApp
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </div>

        {/* Janji Hari Ini: Satu Kolom per Dokter (PRD 4.6) */}
        <div>
          <h2 className="text-base font-bold text-[#1F2937] mb-3">
            Janji Hari Ini Berdasarkan Dokter Praktik
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {doctors.map((doc) => {
              // Janji untuk dokter ini
              const janjiDokter = MOCK_JANJI_TEMU.filter(
                (j) => j.dokterId === doc.id
              );

              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
                >
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-cyan-100 text-[#0E7490] flex items-center justify-center font-bold text-xs">
                        {doc.nama.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#1F2937]">
                          {doc.nama}
                        </h3>
                        <p className="text-[11px] text-[#5A6B78]">
                          {doc.email}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 tabular-nums">
                      {janjiDokter.length} Janji
                    </span>
                  </div>

                  <div className="p-4 divide-y divide-slate-100 flex-1">
                    {janjiDokter.map((j) => {
                      const pasien = getUserById(j.pasienId);
                      const layanan = getLayananById(j.layananId);

                      return (
                        <div
                          key={j.id}
                          className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#1F2937] tabular-nums">
                                {j.jam} WITA
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="font-semibold text-slate-800">
                                {pasien?.nama || "Pasien"}
                              </span>
                            </div>
                            <p className="text-[#5A6B78] text-[11px]">
                              {layanan?.nama || "Layanan Gigi"}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <StatusBadge status={j.status} />
                            <Link
                              href={`/resepsionis/janji/${j.id}`}
                              className="text-[11px] font-semibold text-[#0E7490] hover:underline"
                            >
                              Kelola
                            </Link>
                          </div>
                        </div>
                      );
                    })}

                    {janjiDokter.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-6">
                        Tidak ada jadwal janji temu untuk dokter ini hari ini.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
