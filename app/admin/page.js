"use client";

import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import {
  ShieldCheck,
  Calendar,
  Users,
  Layers,
  Clock,
  FileText,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { MOCK_JANJI_TEMU, MOCK_USERS, MOCK_LAYANAN } from "@/lib/mockData";

export default function DasborAdminPage() {
  // Hitung metrik sesuai PRD 4.12
  const kunjunganSelesai = MOCK_JANJI_TEMU.filter((j) => j.status === "selesai");
  const kunjunganHariIni = 1; // Sesuai mock data hari ini
  const kunjunganBulanIni = kunjunganSelesai.length;
  const menungguKonfirmasi = MOCK_JANJI_TEMU.filter((j) => j.status === "menunggu").length;

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Banner Admin */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dasbor Manajemen Pemilik Klinik</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937]">
              Portal Super Admin · Bu Ratna
            </h1>
            <p className="text-xs text-[#5A6B78] mt-1">
              Kendali penuh operasional Klinik Gigi Senyum Rekah Makassar
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/laporan"
              className="px-4 py-2.5 bg-[#0E7490] hover:bg-cyan-800 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Buka Laporan Bulanan</span>
            </Link>
          </div>
        </div>

        {/* Kartu Ringkasan Sesuai PRD 4.12 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* 1. Kunjungan Hari Ini */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-[#5A6B78] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Kunjungan Hari Ini (Selesai)</span>
            </span>
            <p className="text-3xl font-extrabold text-[#1F2937] tabular-nums">
              {kunjunganHariIni}
            </p>
            <p className="text-[11px] text-[#5A6B78]">
              Pasien selesai ditangani hari ini
            </p>
          </div>

          {/* 2. Kunjungan Bulan Ini (Bisa diklik membuka Laporan) */}
          <Link
            href="/admin/laporan"
            className="bg-white rounded-2xl p-6 border border-emerald-200 hover:border-emerald-400 shadow-sm transition hover:shadow group space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Kunjungan Bulan Ini (Selesai)</span>
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition" />
            </div>
            <p className="text-3xl font-extrabold text-[#1F2937] tabular-nums">
              {kunjunganBulanIni}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium">
              Klik untuk melihat rincian laporan bulan berjalan →
            </p>
          </Link>

          {/* 3. Menunggu Konfirmasi */}
          <Link
            href="/resepsionis/janji?status=menunggu"
            className="bg-white rounded-2xl p-6 border border-amber-200 hover:border-amber-400 shadow-sm transition hover:shadow group space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Menunggu Konfirmasi</span>
              </span>
              <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition" />
            </div>
            <p className="text-3xl font-extrabold text-[#1F2937] tabular-nums">
              {menungguKonfirmasi}
            </p>
            <p className="text-[11px] text-amber-700 font-medium">
              Memerlukan tindak lanjut staf meja depan
            </p>
          </Link>
        </div>

        {/* Menu Cepat Manajemen Admin */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-[#1F2937]">
            Modul Manajemen Super Admin
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/pengguna"
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#0E7490] shadow-sm transition space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-[#0E7490] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#1F2937] group-hover:text-[#0E7490]">
                Kelola Pengguna
              </h3>
              <p className="text-xs text-[#5A6B78]">
                Atur peran (resepsionis, dokter, admin) dan status aktifitas akun.
              </p>
            </Link>

            <Link
              href="/admin/layanan"
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#0E7490] shadow-sm transition space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#1F2937] group-hover:text-[#0E7490]">
                Kelola Layanan
              </h3>
              <p className="text-xs text-[#5A6B78]">
                Atur nama layanan, durasi menit (kelipatan 30), tarif, dan status aktif.
              </p>
            </Link>

            <Link
              href="/admin/jadwal-dokter"
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#0E7490] shadow-sm transition space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#1F2937] group-hover:text-[#0E7490]">
                Jadwal Praktik
              </h3>
              <p className="text-xs text-[#5A6B78]">
                Konfigurasi hari (Senin-Sabtu) dan jam praktik untuk masing-masing dokter.
              </p>
            </Link>

            <Link
              href="/admin/laporan"
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#0E7490] shadow-sm transition space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#1F2937] group-hover:text-[#0E7490]">
                Laporan Kunjungan
              </h3>
              <p className="text-xs text-[#5A6B78]">
                Rekap bulanan jumlah kunjungan per dokter dan per jenis layanan gigi.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
