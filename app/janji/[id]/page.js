"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PortalLayout from "@/components/PortalLayout";
import StatusBadge from "@/components/StatusBadge";
import {
  Calendar,
  Clock,
  User,
  Layers,
  ArrowLeft,
  AlertTriangle,
  XCircle,
  FileText,
} from "lucide-react";
import { getJanjiById, getUserById, getLayananById } from "@/lib/mockData";

function RincianJanjiContent() {
  const params = useParams();
  const janjiId = params?.id;

  const initialJanji = getJanjiById(janjiId);
  const [janji, setJanji] = useState(initialJanji);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  if (!janji) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4 max-w-md mx-auto my-12">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h1 className="text-lg font-bold text-[#1F2937]">Janji tidak ditemukan</h1>
        <p className="text-xs text-[#5A6B78]">
          ID janji yang Anda buka tidak valid atau bukan milik akun Anda.
        </p>
        <Link
          href="/janji"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0E7490] text-white rounded-lg text-xs font-semibold hover:bg-cyan-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Janji Saya</span>
        </Link>
      </div>
    );
  }

  const dokter = getUserById(janji.dokterId);
  const layanan = getLayananById(janji.layananId);

  // Validasi pembatalan H-1 dan hanya untuk status Menunggu / Dikonfirmasi
  const canCancel =
    (janji.status === "menunggu" || janji.status === "dikonfirmasi") && !isCancelled;

  const handleConfirmCancel = () => {
    setJanji({
      ...janji,
      status: "dibatalkan",
      alasanBatal: "Dibatalkan oleh pasien mandiri",
    });
    setIsCancelled(true);
    setShowCancelModal(false);
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Breadcrumb / Back button */}
      <Link
        href="/janji"
        className="inline-flex items-center gap-1.5 text-xs text-[#0E7490] font-semibold hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Daftar Janji</span>
      </Link>

      {/* Header & Status */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-3">
          <div>
            <span className="text-xs text-[#5A6B78]">Rincian Janji Temu</span>
            <h1 className="text-xl font-bold text-[#1F2937]">#{janji.id}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5A6B78]">Status:</span>
            <StatusBadge status={janji.status} />
          </div>
        </div>

        {/* Alasan Batal jika ada (Sesuai PRD 4.3.2) */}
        {janji.status === "dibatalkan" && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs space-y-1">
            <p className="font-semibold text-red-800 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-red-600" />
              <span>Janji Dibatalkan</span>
            </p>
            <p className="text-red-700">
              Alasan pembatalan: {janji.alasanBatal || "Tidak ada keterangan."}
            </p>
          </div>
        )}

        {/* Grid Informasi Rincian */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 text-[#5A6B78] font-medium">
              <Calendar className="w-4 h-4 text-[#0E7490]" />
              <span>Tanggal Janji</span>
            </div>
            <p className="text-sm font-semibold text-[#1F2937] tabular-nums">
              {janji.tanggal}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 text-[#5A6B78] font-medium">
              <Clock className="w-4 h-4 text-[#0E7490]" />
              <span>Jam Praktik</span>
            </div>
            <p className="text-sm font-semibold text-[#1F2937] tabular-nums">
              {janji.jam} WITA
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 text-[#5A6B78] font-medium">
              <User className="w-4 h-4 text-[#0E7490]" />
              <span>Dokter Pemeriksa</span>
            </div>
            <p className="text-sm font-semibold text-[#1F2937]">
              {dokter?.nama || "-"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 text-[#5A6B78] font-medium">
              <Layers className="w-4 h-4 text-[#0E7490]" />
              <span>Layanan & Estimasi Tarif</span>
            </div>
            <p className="text-sm font-semibold text-[#1F2937]">
              {layanan?.nama || "-"}
            </p>
            <p className="text-[11px] text-[#0E7490] font-medium tabular-nums">
              Rp {layanan?.harga?.toLocaleString("id-ID") || "-"} ({layanan?.durasiMenit} Menit)
            </p>
          </div>
        </div>

        {/* Keluhan Pasien */}
        <div className="space-y-1 pt-2">
          <span className="text-xs font-semibold text-[#1F2937] flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#0E7490]" />
            <span>Keluhan Pasien</span>
          </span>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
            {janji.keluhan || "Tidak ada catatan keluhan."}
          </div>
        </div>

        {/* Tombol Aksi Pembatalan Janji (PRD 4.3.2) */}
        {canCancel && (
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-[11px] text-[#5A6B78]">
              Pembatalan dapat dilakukan mandiri paling lambat H-1 jadwal janji temu.
            </p>
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-50 transition"
            >
              Batalkan Janji Temu
            </button>
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Pembatalan */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#1F2937]">
              Batalkan Janji Temu?
            </h3>
            <p className="text-xs text-[#5A6B78]">
              Apakah Anda yakin ingin membatalkan janji temu ini? Slot jam yang telah Anda pilih akan kembali tersedia untuk pasien lain.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Ya, Batalkan Janji
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RincianJanjiPage() {
  return (
    <PortalLayout>
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#5A6B78]">Memuat rincian janji...</div>}>
        <RincianJanjiContent />
      </Suspense>
    </PortalLayout>
  );
}
