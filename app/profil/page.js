"use client";

import { useState, useEffect } from "react";
import PortalLayout from "@/components/PortalLayout";
import { User, Mail, Phone, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";

export default function ProfilPage() {
  const { user, userProfile, role } = useAuth();
  const [nama, setNama] = useState("");
  const [noHp, setNoHp] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setNama(userProfile.nama || user?.displayName || "");
      setNoHp(userProfile.noHp || "");
    } else if (user) {
      setNama(user.displayName || "");
      setNoHp("");
    }
  }, [user, userProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSavedSuccess(false);

    if (!user) {
      setError("Sesi login Anda telah berakhir. Silakan masuk kembali.");
      return;
    }

    if (!nama.trim()) {
      setError("Nama lengkap tidak boleh kosong.");
      return;
    }

    if (!noHp.trim().startsWith("08")) {
      setError("Nomor HP harus diawali dengan 08.");
      return;
    }

    setSaving(true);

    try {
      const docRef = doc(db, "users", user.uid);
      // Sesuai PRD 4.5: Hanya boleh memperbarui nama dan noHp
      await updateDoc(docRef, {
        nama: nama.trim(),
        noHp: noHp.trim(),
      });

      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Gagal menyimpan perubahan profil:", err);
      if (err.code === "permission-denied") {
        setError("Perubahan ditolak oleh aturan keamanan Firestore (hanya pemilik dokumen yang dapat mengubah nama dan noHp).");
      } else {
        setError(`Gagal menyimpan perubahan: ${err.message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const displayName = nama || userProfile?.nama || user?.displayName || user?.email || "Pengguna";
  const displayEmail = userProfile?.email || user?.email || "";
  const displayRole = role || userProfile?.role || "pasien";
  const initialChar = displayName ? displayName.trim().charAt(0).toUpperCase() : "U";

  return (
    <PortalLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Profil Pengguna</h1>
          <p className="text-xs text-[#5A6B78] mt-1">
            Informasi akun dan data kontak Anda di Klinik Gigi Senyum Rekah
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Perubahan profil berhasil disimpan ke database!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          {/* Foto & Status Peran */}
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-cyan-100 text-[#0E7490] flex items-center justify-center font-bold text-2xl">
              {initialChar}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1F2937]">{displayName}</h2>
              <p className="text-xs text-[#5A6B78]">{displayEmail}</p>
              <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-[#0E7490] border border-cyan-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider text-[10px]">
                  Peran: {displayRole}
                </span>
              </div>
            </div>
          </div>

          {/* Form Fields Sesuai PRD 4.5 */}
          <div className="space-y-4 text-xs">
            {/* Nama Lengkap (Bisa diubah) */}
            <div>
              <label className="block font-semibold text-[#1F2937] mb-1">
                Nama Lengkap (Bisa diubah)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E7490]"
                  required
                />
              </div>
            </div>

            {/* Nomor HP (Bisa diubah) */}
            <div>
              <label className="block font-semibold text-[#1F2937] mb-1">
                Nomor WhatsApp / HP (Bisa diubah)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-[#0E7490]"
                  required
                />
              </div>
              <p className="text-[10px] text-[#5A6B78] mt-1">
                Format nomor HP diawali 08 (contoh: 081234567890).
              </p>
            </div>

            {/* Email (Terkunci / Read only) */}
            <div>
              <label className="block font-semibold text-[#1F2937] mb-1">
                Alamat Email (Terkunci)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={displayEmail}
                  disabled
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-[#5A6B78] mt-1">
                Sesuai PRD 4.5: Email tidak dapat diubah dari halaman ini.
              </p>
            </div>

            {/* Peran (Terkunci / Read only) */}
            <div>
              <label className="block font-semibold text-[#1F2937] mb-1">
                Peran Akun (Terkunci)
              </label>
              <input
                type="text"
                value={displayRole}
                disabled
                className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed uppercase"
              />
              <p className="text-[10px] text-[#5A6B78] mt-1">
                Sesuai PRD 4.5: Peran hanya bisa diubah oleh Super Admin lewat menu Kelola Pengguna.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-[#0E7490] hover:bg-cyan-800 disabled:opacity-60 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Perubahan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  );
}
