import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Calendar,
  Clock,
  ShieldCheck,
  User,
  Users,
  Stethoscope,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F4F7F9] flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-cyan-900 to-[#0E7490] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-cyan-800/80 px-3.5 py-1.5 rounded-full text-xs font-medium text-cyan-200 border border-cyan-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Klinik Gigi Senyum Rekah · Makassar</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Portal Janji Temu & Catatan Perawatan
          </h1>
          <p className="text-base sm:text-lg text-cyan-100 max-w-2xl mx-auto">
            Solusi digital praktis tanpa antrean manual dan catatan kertas. Pasien
            bisa memilih slot janji kosong, dokter mengelola jadwal pemeriksaan,
            dan rekam perawatan tersimpan rapi.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/janji/baru"
              className="bg-white text-[#0E7490] font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-cyan-50 transition flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              <span>Buat Janji Temu Sekarang</span>
            </Link>
            <Link
              href="/masuk"
              className="bg-cyan-800/70 hover:bg-cyan-800 border border-cyan-400/30 text-white font-medium px-5 py-3 rounded-xl transition flex items-center gap-2"
            >
              <span>Masuk Akun</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Navigator Modul Berdasarkan PRD Bab 4 */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#1F2937]">
            Eksplorasi Modul Aplikasi (Tahap Kerangka)
          </h2>
          <p className="text-sm text-[#5A6B78] mt-1">
            Sesuai PRD Bab 4, seluruh halaman untuk 4 peran dan alur autentikasi telah
            disiapkan. Klik modul di bawah untuk langsung meninjau tampilannya:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card Pasien */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-[#0E7490] flex items-center justify-center font-bold">
                <User className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#1F2937]">Peran Pasien</h3>
              <p className="text-xs text-[#5A6B78]">
                Membuat janji dari slot kosong, memantau status janji, dan melihat riwayat perawatan setelah selesai.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-600 pt-2 border-t border-slate-100">
                <li>
                  <Link href="/beranda" className="text-[#0E7490] hover:underline font-medium">
                    → /beranda (Janji Terdekat)
                  </Link>
                </li>
                <li>
                  <Link href="/janji" className="text-[#0E7490] hover:underline font-medium">
                    → /janji (Daftar Janji)
                  </Link>
                </li>
                <li>
                  <Link href="/janji/baru" className="text-[#0E7490] hover:underline font-medium">
                    → /janji/baru (Formulir Janji)
                  </Link>
                </li>
                <li>
                  <Link href="/riwayat" className="text-[#0E7490] hover:underline font-medium">
                    → /riwayat (Hasil Perawatan)
                  </Link>
                </li>
              </ul>
            </div>
            <Link
              href="/beranda"
              className="mt-5 w-full block text-center py-2 px-3 bg-[#0E7490] text-white rounded-lg text-xs font-semibold hover:bg-cyan-800 transition"
            >
              Buka Beranda Pasien
            </Link>
          </div>

          {/* Card Resepsionis */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#1F2937]">Resepsionis (Laras)</h3>
              <p className="text-xs text-[#5A6B78]">
                Konfirmasi janji, jadwal ulang, pembatalan dengan alasan, dan menandai pasien Hadir saat tiba di klinik.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-600 pt-2 border-t border-slate-100">
                <li>
                  <Link href="/resepsionis" className="text-blue-700 hover:underline font-medium">
                    → /resepsionis (Dasbor)
                  </Link>
                </li>
                <li>
                  <Link href="/resepsionis/janji" className="text-blue-700 hover:underline font-medium">
                    → /resepsionis/janji (Kelola)
                  </Link>
                </li>
                <li>
                  <Link href="/resepsionis/pasien" className="text-blue-700 hover:underline font-medium">
                    → /resepsionis/pasien (Data Pasien)
                  </Link>
                </li>
              </ul>
            </div>
            <Link
              href="/resepsionis"
              className="mt-5 w-full block text-center py-2 px-3 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
            >
              Buka Dasbor Resepsionis
            </Link>
          </div>

          {/* Card Dokter */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#1F2937]">Dokter Gigi</h3>
              <p className="text-xs text-[#5A6B78]">
                drg. Bima & drg. Sinta: melihat janji hari ini miliknya, mengisi tindakan & catatan pada janji Hadir, lalu menandai Selesai.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-600 pt-2 border-t border-slate-100">
                <li>
                  <Link href="/dokter" className="text-purple-700 hover:underline font-medium">
                    → /dokter (Jadwal Hari Ini)
                  </Link>
                </li>
                <li>
                  <Link href="/dokter/janji/jnj_101" className="text-purple-700 hover:underline font-medium">
                    → /dokter/janji/[id] (Pemeriksaan)
                  </Link>
                </li>
                <li>
                  <Link href="/dokter/pasien/usr_andi" className="text-purple-700 hover:underline font-medium">
                    → /dokter/pasien/[id] (Riwayat Pasien)
                  </Link>
                </li>
              </ul>
            </div>
            <Link
              href="/dokter"
              className="mt-5 w-full block text-center py-2 px-3 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 transition"
            >
              Buka Dasbor Dokter
            </Link>
          </div>

          {/* Card Super Admin */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#1F2937]">Super Admin</h3>
              <p className="text-xs text-[#5A6B78]">
                Bu Ratna: Mengelola akun pengguna & peran, tarif & durasi layanan, jadwal praktik dokter, serta laporan bulanan.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-600 pt-2 border-t border-slate-100">
                <li>
                  <Link href="/admin" className="text-emerald-700 hover:underline font-medium">
                    → /admin (Dasbor Ringkasan)
                  </Link>
                </li>
                <li>
                  <Link href="/admin/pengguna" className="text-emerald-700 hover:underline font-medium">
                    → /admin/pengguna (Kelola Akun)
                  </Link>
                </li>
                <li>
                  <Link href="/admin/layanan" className="text-emerald-700 hover:underline font-medium">
                    → /admin/layanan (Layanan)
                  </Link>
                </li>
                <li>
                  <Link href="/admin/jadwal-dokter" className="text-emerald-700 hover:underline font-medium">
                    → /admin/jadwal-dokter (Praktik)
                  </Link>
                </li>
                <li>
                  <Link href="/admin/laporan" className="text-emerald-700 hover:underline font-medium">
                    → /admin/laporan (Laporan Kunjungan)
                  </Link>
                </li>
              </ul>
            </div>
            <Link
              href="/admin"
              className="mt-5 w-full block text-center py-2 px-3 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition"
            >
              Buka Dasbor Admin
            </Link>
          </div>
        </div>

        {/* Informasi Ringkas Jam Buka & Lokasi */}
        <div className="mt-12 bg-white rounded-xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 text-[#0E7490] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-[#1F2937]">
                Klinik Gigi Senyum Rekah · Makassar
              </p>
              <p className="text-xs text-[#5A6B78]">
                Buka Senin sampai Sabtu · 2 Dokter Gigi (drg. Bima & drg. Sinta)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/masuk"
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Halaman Masuk (/masuk)
            </Link>
            <Link
              href="/daftar"
              className="px-4 py-2 bg-[#0E7490] text-white rounded-lg text-xs font-medium hover:bg-cyan-800 transition"
            >
              Halaman Daftar (/daftar)
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
