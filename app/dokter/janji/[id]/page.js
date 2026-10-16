"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PortalLayout from "@/components/PortalLayout";
import StatusBadge from "@/components/StatusBadge";
import {
  Stethoscope,
  User,
  Clock,
  Layers,
  FileText,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  History,
  Sparkles,
} from "lucide-react";
import {
  getJanjiById,
  getUserById,
  getLayananById,
  getCatatanByJanjiId,
} from "@/lib/mockData";

function PemeriksaanDokterContent() {
  const params = useParams();
  const janjiId = params?.id;

  const initialJanji = getJanjiById(janjiId);
  const existingCatatan = getCatatanByJanjiId(janjiId);

  const [janji, setJanji] = useState(initialJanji);
  const [tindakan, setTindakan] = useState(existingCatatan?.tindakan || "");
  const [catatan, setCatatan] = useState(existingCatatan?.catatan || "");
  const [error, setError] = useState("");
  const [isDone, setIsDone] = useState(janji?.status === "selesai");

  if (!janji) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4 max-w-md mx-auto my-12">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h1 className="text-lg font-bold text-[#1F2937]">Janji tidak ditemukan</h1>
        <p className="text-xs text-[#5A6B78]">
          Janji ini tidak terdaftar atau bukan janji yang ditugaskan kepada Anda.
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

  const pasien = getUserById(janji.pasienId);
  const dokter = getUserById(janji.dokterId);
  const layanan = getLayananById(janji.layananId);

  const handleSelesai = (e) => {
    e.preventDefault();
    if (!tindakan.trim() || !catatan.trim()) {
      setError("Tindakan dan Catatan dokter wajib diisi sebelum menandai selesai.");
      return;
    }

    setJanji({ ...janji, status: "selesai" });
    setIsDone(true);
    setError("");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dokter"
          className="inline-flex items-center gap-1.5 text-xs text-purple-700 font-semibold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Jadwal Dokter</span>
        </Link>

        {/* Tombol Lihat Riwayat Pasien Sesuai PRD 4.10 & 4.11 */}
        <Link
          href={`/dokter/pasien/${janji.pasienId}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-300 text-purple-700 hover:bg-purple-50 text-xs font-semibold transition"
        >
          <History className="w-3.5 h-3.5" />
          <span>Lihat Riwayat Pasien Ini</span>
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isDone && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Pemeriksaan Telah Ditandai Selesai!</span>
          </p>
          <p className="text-emerald-700">
            Catatan perawatan telah disimpan secara permanen. Pasien ({pasien?.nama}) sekarang dapat membaca hasil perawatan di menu Riwayat Perawatan miliknya.
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-purple-700 font-semibold bg-purple-50 px-2.5 py-1 rounded-full mb-1">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Formulir Pemeriksaan Medis Gigi</span>
            </div>
            <h1 className="text-xl font-bold text-[#1F2937]">Janji #{janji.id}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5A6B78]">Status Janji:</span>
            <StatusBadge status={janji.status} />
          </div>
        </div>

        {/* Rincian Pasien & Keluhan (PRD 4.10) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[#5A6B78]">Nama Pasien</span>
            <p className="text-sm font-semibold text-[#1F2937]">{pasien?.nama}</p>
            <p className="text-[11px] text-[#5A6B78] tabular-nums">Kontak: {pasien?.noHp}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[#5A6B78]">Layanan Perawatan</span>
            <p className="text-sm font-semibold text-[#1F2937]">{layanan?.nama}</p>
            <p className="text-[11px] text-[#5A6B78] tabular-nums">{janji.tanggal} · {janji.jam} WITA</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
          <span className="font-semibold text-[#1F2937] flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-purple-600" />
            <span>Keluhan Pasien:</span>
          </span>
          <p className="text-slate-700">{janji.keluhan || "-"}</p>
        </div>

        {/* Form Pengisian Tindakan & Catatan Dokter (PRD 4.10) */}
        <form onSubmit={handleSelesai} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-1">
              Tindakan Medis yang Dilakukan <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="3"
              placeholder="Contoh: Tambal gigi dengan komposit resin shade A2 pada gigi 36..."
              value={tindakan}
              onChange={(e) => setTindakan(e.target.value)}
              disabled={isDone}
              className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 disabled:bg-slate-50 disabled:text-slate-600"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-1">
              Catatan Dokter & Instruksi Pasca Perawatan <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="3"
              placeholder="Contoh: Hindari makanan dan minuman keras atau terlalu dingin selama 24 jam ke depan..."
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              disabled={isDone}
              className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-600 disabled:bg-slate-50 disabled:text-slate-600"
              required
            ></textarea>
          </div>

          {!isDone ? (
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-[#5A6B78]">
                Menandai selesai akan memperbarui status janji ke <b>Selesai</b>.
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Tandai Selesai</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-semibold">
                ✓ Rekam pemeriksaan telah terkunci.
              </span>
              <Link
                href="/dokter"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
              >
                Kembali ke Dasbor Dokter
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default function PemeriksaanDokterPage() {
  return (
    <PortalLayout>
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#5A6B78]">Memuat formulir pemeriksaan...</div>}>
        <PemeriksaanDokterContent />
      </Suspense>
    </PortalLayout>
  );
}
