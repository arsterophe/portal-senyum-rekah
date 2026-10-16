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
  Check,
  RefreshCw,
  XCircle,
  UserCheck,
  AlertTriangle,
  FileText,
  ShieldAlert,
} from "lucide-react";
import {
  getJanjiById,
  getUserById,
  getLayananById,
} from "@/lib/mockData";

function RincianJanjiResepsionisContent() {
  const params = useParams();
  const janjiId = params?.id;

  const initialJanji = getJanjiById(janjiId);
  const [janji, setJanji] = useState(initialJanji);

  // Modal states
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDate, setNewDate] = useState("2026-10-17");
  const [newSlot, setNewSlot] = useState("11:00");

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [alasanBatal, setAlasanBatal] = useState("");
  const [notification, setNotification] = useState("");

  if (!janji) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4 max-w-md mx-auto my-12">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h1 className="text-lg font-bold text-[#1F2937]">Janji tidak ditemukan</h1>
        <p className="text-xs text-[#5A6B78]">
          ID janji yang Anda cari tidak ada dalam database.
        </p>
        <Link
          href="/resepsionis/janji"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0E7490] text-white rounded-lg text-xs font-semibold hover:bg-cyan-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Kelola Janji</span>
        </Link>
      </div>
    );
  }

  const pasien = getUserById(janji.pasienId);
  const dokter = getUserById(janji.dokterId);
  const layanan = getLayananById(janji.layananId);

  const isFinalState = janji.status === "selesai" || janji.status === "dibatalkan";

  // Aksi 1: Konfirmasi Janji (PRD 4.7)
  const handleKonfirmasi = () => {
    setJanji({ ...janji, status: "dikonfirmasi" });
    setNotification("Janji berhasil dikonfirmasi!");
    setTimeout(() => setNotification(""), 3000);
  };

  // Aksi 2: Jadwal Ulang (PRD 4.7)
  const handleSaveReschedule = (e) => {
    e.preventDefault();
    setJanji({
      ...janji,
      tanggal: newDate,
      jam: newSlot,
    });
    setShowRescheduleModal(false);
    setNotification("Jadwal janji berhasil diperbarui!");
    setTimeout(() => setNotification(""), 3000);
  };

  // Aksi 3: Batalkan dengan alasan (PRD 4.7)
  const handleConfirmCancel = (e) => {
    e.preventDefault();
    if (!alasanBatal.trim()) return;
    setJanji({
      ...janji,
      status: "dibatalkan",
      alasanBatal: alasanBatal,
    });
    setShowCancelModal(false);
    setNotification("Janji temu telah dibatalkan dengan alasan tersimpan.");
    setTimeout(() => setNotification(""), 3000);
  };

  // Aksi 4: Tandai Hadir (PRD 4.7)
  const handleTandaiHadir = () => {
    setJanji({ ...janji, status: "hadir" });
    setNotification("Pasien ditandai Hadir! Sekarang siap diperiksa di Dasbor Dokter.");
    setTimeout(() => setNotification(""), 4000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/resepsionis/janji"
        className="inline-flex items-center gap-1.5 text-xs text-[#0E7490] font-semibold hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Daftar Kelola Janji</span>
      </Link>

      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
          {notification}
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-3">
          <div>
            <span className="text-xs text-[#5A6B78]">Kelola Janji Pasien</span>
            <h1 className="text-xl font-bold text-[#1F2937]">#{janji.id}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5A6B78]">Status:</span>
            <StatusBadge status={janji.status} />
          </div>
        </div>

        {/* Alasan Batal jika status Dibatalkan */}
        {janji.status === "dibatalkan" && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs space-y-1">
            <p className="font-semibold text-red-800 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-red-600" />
              <span>Janji Dibatalkan</span>
            </p>
            <p className="text-red-700">
              Alasan: {janji.alasanBatal || "Tidak ada alasan spesifik."}
            </p>
          </div>
        )}

        {/* Detail Informasi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[#5A6B78]">Nama Pasien</span>
            <p className="text-sm font-semibold text-[#1F2937]">
              {pasien?.nama || "Pasien"}
            </p>
            <p className="text-[11px] text-[#0E7490] tabular-nums">
              WhatsApp: {pasien?.noHp || "-"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[#5A6B78]">Dokter Dituju</span>
            <p className="text-sm font-semibold text-[#1F2937]">
              {dokter?.nama || "Dokter Gigi"}
            </p>
            <p className="text-[11px] text-[#5A6B78]">{dokter?.email}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[#5A6B78]">Tanggal & Jam Praktik</span>
            <p className="text-sm font-semibold text-[#1F2937] tabular-nums">
              {janji.tanggal} · {janji.jam} WITA
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[#5A6B78]">Layanan Dipilih</span>
            <p className="text-sm font-semibold text-[#1F2937]">
              {layanan?.nama || "-"}
            </p>
            <p className="text-[11px] text-[#5A6B78] tabular-nums">
              Durasi: {layanan?.durasiMenit} Menit · Tarif: Rp {layanan?.harga?.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Keluhan Pasien */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
          <span className="font-semibold text-[#1F2937] flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#0E7490]" />
            <span>Keluhan Pasien:</span>
          </span>
          <p className="text-slate-700">{janji.keluhan || "-"}</p>
        </div>

        {/* CATATAN KERAHASIAAN SESUAI PRD 4.7: Resepsionis TIDAK menampilkan catatan perawatan */}
        <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-[11px] text-[#5A6B78] flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span>
            Privasi Medis: Sesuai aturan PRD 4.7 & 4.8, rincian resepsionis tidak menampilkan catatan perawatan atau rekam medis.
          </span>
        </div>

        {/* Baris Tombol Aksi Resepsionis (PRD 4.7) */}
        {!isFinalState ? (
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
            {/* Tombol Konfirmasi (hanya untuk Menunggu) */}
            {janji.status === "menunggu" && (
              <button
                type="button"
                onClick={handleKonfirmasi}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Konfirmasi Janji</span>
              </button>
            )}

            {/* Tombol Jadwal Ulang */}
            <button
              type="button"
              onClick={() => setShowRescheduleModal(true)}
              className="px-4 py-2.5 bg-white border border-slate-300 hover:border-[#0E7490] hover:text-[#0E7490] text-slate-700 rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Jadwal Ulang</span>
            </button>

            {/* Tombol Tandai Hadir (PRD: Untuk janji dikonfirmasi pada hari kunjungan) */}
            {janji.status === "dikonfirmasi" && (
              <button
                type="button"
                onClick={handleTandaiHadir}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Tandai Pasien Hadir</span>
              </button>
            )}

            {/* Tombol Batalkan Janji */}
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2.5 border border-red-300 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ml-auto"
            >
              <XCircle className="w-4 h-4" />
              <span>Batalkan Janji</span>
            </button>
          </div>
        ) : (
          <p className="text-xs text-[#5A6B78] pt-4 border-t border-slate-100">
            Janji dengan status <b>{janji.status}</b> tidak dapat diubah lagi.
          </p>
        )}
      </div>

      {/* Modal Jadwal Ulang */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-[#1F2937]">Jadwal Ulang Janji</h3>
            <p className="text-xs text-[#5A6B78]">
              Pilih tanggal dan slot jam kosong baru untuk pasien {pasien?.nama}.
            </p>

            <form onSubmit={handleSaveReschedule} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[#1F2937]">
                  Tanggal Baru
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg tabular-nums"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#1F2937]">
                  Slot Jam Kosong Baru
                </label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg tabular-nums"
                >
                  <option value="09:00">09:00 WITA</option>
                  <option value="09:30">09:30 WITA</option>
                  <option value="10:00">10:00 WITA</option>
                  <option value="11:00">11:00 WITA</option>
                  <option value="14:00">14:00 WITA</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0E7490] text-white rounded-lg font-semibold hover:bg-cyan-800"
                >
                  Simpan Jadwal Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Batalkan dengan Alasan */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-red-600">Batalkan Janji Temu</h3>
            <p className="text-xs text-[#5A6B78]">
              Harap cantumkan alasan pembatalan janji temu pasien (wajib diisi).
            </p>

            <form onSubmit={handleConfirmCancel} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[#1F2937]">
                  Alasan Pembatalan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="3"
                  placeholder="Contoh: Pasien berhalangan hadir karena sakit, minta jadwal dibatalkan."
                  value={alasanBatal}
                  onChange={(e) => setAlasanBatal(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                  required
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                >
                  Konfirmasi Pembatalan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RincianJanjiResepsionisPage() {
  return (
    <PortalLayout>
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#5A6B78]">Memuat data janji...</div>}>
        <RincianJanjiResepsionisContent />
      </Suspense>
    </PortalLayout>
  );
}
