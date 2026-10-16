"use client";

import { useState } from "react";
import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import StatusBadge from "@/components/StatusBadge";
import {
  Stethoscope,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import {
  MOCK_JANJI_TEMU,
  MOCK_USERS,
  getUserById,
  getLayananById,
} from "@/lib/mockData";

export default function DasborDokterPage() {
  // Simulasi dokter yang sedang masuk (default drg. Bima, bisa dipilih drg. Sinta untuk pengujian)
  const [selectedDoctorId, setSelectedDoctorId] = useState("usr_bima");

  const currentDoctor = getUserById(selectedDoctorId);
  const doctors = MOCK_USERS.filter((u) => u.role === "dokter");

  // Perilaku otomatis PRD 4.9: Hanya janji dengan dokterId miliknya yang tampil
  const janjiDokter = MOCK_JANJI_TEMU.filter(
    (j) => j.dokterId === selectedDoctorId
  );

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Banner Dokter */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-purple-700 font-semibold bg-purple-50 px-2.5 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dasbor Dokter Praktik</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937]">
              Jadwal Praktik: {currentDoctor?.nama}
            </h1>
            <p className="text-xs text-[#5A6B78] mt-1">
              Kamis, 15 Oktober 2026 · Ruang Praktik Gigi Senyum Rekah Makassar
            </p>
          </div>

          {/* Pengalih Akun Dokter untuk Pengujian PRD */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-xs">
            <span className="text-[#5A6B78] text-[11px] pl-2">Ganti Dokter Uji:</span>
            {doctors.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => setSelectedDoctorId(doc.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  selectedDoctorId === doc.id
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                {doc.nama.split(" ")[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Tabel Janji Hari Ini Milik Dokter (PRD 4.9) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Daftar Pasien Hari Ini ({janjiDokter.length} Pasien)
            </h2>
            <span className="text-[11px] text-[#5A6B78]">
              Janji berstatus Hadir ditandai <b>Siap Diperiksa</b>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-[#5A6B78] font-semibold">
                  <th className="py-3.5 px-4">Jam</th>
                  <th className="py-3.5 px-4">Nama Pasien</th>
                  <th className="py-3.5 px-4">Layanan</th>
                  <th className="py-3.5 px-4">Keluhan</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Tindakan Medis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {janjiDokter.map((item) => {
                  const pasien = getUserById(item.pasienId);
                  const layanan = getLayananById(item.layananId);
                  const isReady = item.status === "hadir";

                  return (
                    <tr
                      key={item.id}
                      className={`transition ${
                        isReady ? "bg-purple-50/40 hover:bg-purple-50/70" : "hover:bg-slate-50/70"
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-[#1F2937] tabular-nums">
                        {item.jam} WITA
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#1F2937]">
                        {pasien?.nama || "Pasien"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {layanan?.nama || "-"}
                      </td>
                      <td className="py-3.5 px-4 text-[#5A6B78] max-w-xs truncate">
                        {item.keluhan}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isReady ? (
                          <Link
                            href={`/dokter/janji/${item.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>Mulai Pemeriksaan</span>
                          </Link>
                        ) : item.status === "selesai" ? (
                          <Link
                            href={`/dokter/janji/${item.id}`}
                            className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:underline font-semibold"
                          >
                            <span>Lihat Catatan</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            Menunggu Pasien Hadir
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {janjiDokter.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-[#5A6B78]">
                      Belum ada jadwal janji temu untuk dokter ini.
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
