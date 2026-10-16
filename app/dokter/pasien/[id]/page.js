"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PortalLayout from "@/components/PortalLayout";
import StatusBadge from "@/components/StatusBadge";
import {
  History,
  User,
  Calendar,
  Layers,
  FileText,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import {
  getUserById,
  MOCK_CATATAN_PERAWATAN,
  MOCK_JANJI_TEMU,
  getLayananById,
} from "@/lib/mockData";

function RiwayatPasienDokterContent() {
  const params = useParams();
  const pasienId = params?.id;
  const currentDoctorId = "usr_bima"; // default drg. Bima

  const pasien = getUserById(pasienId);

  // Cari catatan perawatan pasien yang pernah ditulis dokter ini (PRD 4.11)
  const catatanList = MOCK_CATATAN_PERAWATAN.filter(
    (c) => c.pasienId === pasienId && c.dokterId === currentDoctorId
  );

  // Jika pasien tidak valid atau belum pernah ditangani dokter ini:
  const isFound = pasien && (catatanList.length > 0 || pasien.role === "pasien");

  if (!isFound) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4 max-w-md mx-auto my-12">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h1 className="text-lg font-bold text-[#1F2937]">Pasien tidak ditemukan</h1>
        <p className="text-xs text-[#5A6B78]">
          Sesuai aturan PRD 4.11, Anda hanya dapat melihat riwayat pasien yang pernah Anda tangani sebelumnya.
        </p>
        <Link
          href="/dokter"
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dasbor Dokter</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/dokter"
        className="inline-flex items-center gap-1.5 text-xs text-purple-700 font-semibold hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Dasbor Dokter</span>
      </Link>

      {/* Info Pasien */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg">
            {pasien.nama.charAt(0)}
          </div>
          <div>
            <span className="text-[11px] text-[#5A6B78]">Arsip Riwayat Pasien</span>
            <h1 className="text-xl font-bold text-[#1F2937]">{pasien.nama}</h1>
            <p className="text-xs text-[#5A6B78] tabular-nums">Kontak: {pasien.noHp || "-"}</p>
          </div>
        </div>

        <div className="text-right text-xs">
          <span className="text-[#5A6B78] block">Dokter Peninjau:</span>
          <span className="font-semibold text-purple-800">drg. Bima Sakti</span>
        </div>
      </div>

      {/* Daftar Catatan Riwayat Pasien (PRD 4.11) */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-[#1F2937] flex items-center gap-2">
          <History className="w-4 h-4 text-purple-600" />
          <span>Tindakan & Catatan Perawatan yang Pernah Anda Tulis</span>
        </h2>

        {catatanList.map((catatan) => {
          const janji = MOCK_JANJI_TEMU.find((j) => j.id === catatan.janjiId);
          const layanan = janji ? getLayananById(janji.layananId) : null;

          return (
            <div
              key={catatan.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#1F2937]">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span>{layanan?.nama || "Perawatan Gigi"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#5A6B78] tabular-nums">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  <span>{janji?.tanggal || "2026-10-05"}</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1">
                  <span className="font-semibold text-purple-900 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span>Tindakan Medis yang Diberikan:</span>
                  </span>
                  <p className="text-slate-800">{catatan.tindakan}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-semibold text-[#1F2937] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#0E7490]" />
                    <span>Catatan Dokter:</span>
                  </span>
                  <p className="text-slate-700">{catatan.catatan}</p>
                </div>
              </div>
            </div>
          );
        })}

        {catatanList.length === 0 && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-xs text-[#5A6B78]">
            Belum ada riwayat tindakan klinis yang tercatat oleh Anda untuk pasien ini.
          </div>
        )}
      </div>
    </div>
  );
}

export default function RiwayatPasienDokterPage() {
  return (
    <PortalLayout>
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#5A6B78]">Memuat riwayat pasien...</div>}>
        <RiwayatPasienDokterContent />
      </Suspense>
    </PortalLayout>
  );
}
