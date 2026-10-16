"use client";

import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import StatusBadge from "@/components/StatusBadge";
import {
  Calendar,
  Clock,
  User,
  PlusCircle,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react";
import { MOCK_JANJI_TEMU, getUserById, getLayananById } from "@/lib/mockData";
import { useAuth } from "@/context/AuthContext";

export default function BerandaPage() {
  const { userProfile } = useAuth();
  // Ambil janji milik pasien Andi (pasien aktif demo) yang belum dibatalkan/selesai atau yang terdekat
  const pasienId = "usr_andi";
  const pasien = getUserById(pasienId);
  const namaTampil = userProfile?.nama || pasien?.nama || "Pasien";

  // Cari janji terdekat
  const janjiPasien = MOCK_JANJI_TEMU.filter(
    (j) => j.pasienId === pasienId && j.status !== "dibatalkan"
  );
  const janjiTerdekat = janjiPasien.length > 0 ? janjiPasien[0] : null;

  const dokter = janjiTerdekat ? getUserById(janjiTerdekat.dokterId) : null;
  const layanan = janjiTerdekat ? getLayananById(janjiTerdekat.layananId) : null;

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#0E7490] font-semibold bg-cyan-50 px-2.5 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Portal Pasien</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937]">
              Selamat Datang, {namaTampil}!
            </h1>
            <p className="text-xs text-[#5A6B78] mt-1">
              Klinik Gigi Senyum Rekah Makassar · Jl. Pengayoman, Makassar
            </p>
          </div>

          <Link
            href="/janji/baru"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0E7490] hover:bg-cyan-800 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Buat Janji Baru</span>
          </Link>
        </div>

        {/* Kartu Janji Terdekat sesuai PRD 4.2 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1F2937]">
              Janji Terdekat Anda
            </h2>
            <Link
              href="/janji"
              className="text-xs text-[#0E7490] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua Janji</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {janjiTerdekat ? (
            <Link
              href={`/janji/${janjiTerdekat.id}`}
              className="block bg-white rounded-2xl p-6 border border-slate-200 hover:border-cyan-400 hover:shadow-md transition group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={janjiTerdekat.status} />
                    <span className="text-xs text-[#5A6B78]">
                      Kode Janji: #{janjiTerdekat.id}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#0E7490] transition">
                      {layanan?.nama || "Layanan Gigi"}
                    </h3>
                    <p className="text-xs text-[#5A6B78] mt-0.5">
                      Keluhan: {janjiTerdekat.keluhan}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#1F2937]">
                    <div className="flex items-center gap-1.5 font-medium tabular-nums">
                      <Calendar className="w-4 h-4 text-[#0E7490]" />
                      <span>{janjiTerdekat.tanggal}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium tabular-nums">
                      <Clock className="w-4 h-4 text-[#0E7490]" />
                      <span>{janjiTerdekat.jam} WITA</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <User className="w-4 h-4 text-[#0E7490]" />
                      <span>{dokter?.nama || "Dokter Gigi"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-center text-xs font-semibold text-[#0E7490] bg-cyan-50 px-3.5 py-2 rounded-xl group-hover:bg-[#0E7490] group-hover:text-white transition">
                  <span>Lihat Rincian</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-[#1F2937]">Belum ada janji</p>
              <p className="text-xs text-[#5A6B78] max-w-sm mx-auto">
                Anda belum memiliki jadwal janji temu aktif. Klik tombol di bawah untuk membuat janji temu dengan dokter kami.
              </p>
              <Link
                href="/janji/baru"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0E7490] text-white rounded-lg text-xs font-medium hover:bg-cyan-800 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Buat Janji Sekarang</span>
              </Link>
            </div>
          )}
        </div>

        {/* Informasi Bantuan / Prosedur Kunjungan */}
        <div className="bg-cyan-50/70 border border-cyan-100 rounded-2xl p-5 flex items-start gap-3.5">
          <Info className="w-5 h-5 text-[#0E7490] flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-[#0E7490]">
              Petunjuk Kunjungan Klinik Gigi Senyum Rekah
            </p>
            <p className="text-slate-600">
              Harap datang 10 menit sebelum jam janji temu Anda. Tunjukkan nama Anda kepada resepsionis (Laras) di meja depan agar dapat langsung ditandai <b>Hadir</b> dan siap diperiksa oleh dokter gigi.
            </p>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
