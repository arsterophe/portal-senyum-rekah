import Link from "next/link";
import Navbar from "@/components/Navbar";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F4F7F9] flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 border border-slate-200 shadow-sm text-center space-y-5">
          <div className="w-14 h-14 bg-amber-50 text-[#F59E0B] rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
            <AlertCircle className="w-7 h-7" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
              Halaman Tidak Ditemukan (404)
            </span>
            <h1 className="text-xl font-bold text-[#1F2937] mt-3">
              Alamat yang Anda Tuju Tidak Tersedia
            </h1>
            <p className="text-xs text-[#5A6B78] mt-2 leading-relaxed">
              Alamat URL yang Anda ketik salah, telah dipindahkan, atau Anda tidak memiliki akses ke halaman tersebut.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0E7490] hover:bg-cyan-800 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Beranda Utama</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
