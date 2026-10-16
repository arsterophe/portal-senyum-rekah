"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PortalLayout from "@/components/PortalLayout";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  PowerOff,
  Loader2,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

function RincianPenggunaContent() {
  const params = useParams();
  const userId = params?.id;
  const { user: authUser } = useAuth();

  const [user, setUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("pasien");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");

  const fetchUserData = async () => {
    if (!userId) return;
    setIsLoading(true);
    setError("");
    try {
      const userRef = doc(db, "users", userId);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();
        const userData = {
          id: snap.id,
          ...data,
          aktif: data.aktif !== false,
        };
        setUser(userData);
        setSelectedRole(userData.role || "pasien");
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Gagal mengambil detail pengguna:", err);
      setError(`Gagal memuat pengguna dari Firestore: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-xs text-[#5A6B78] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0E7490]" />
        <p className="font-medium">Memuat rincian pengguna dari Cloud Firestore...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4 max-w-md mx-auto my-12">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h1 className="text-lg font-bold text-[#1F2937]">Pengguna Tidak Ditemukan</h1>
        <p className="text-xs text-[#5A6B78]">
          Dokumen pengguna dengan ID <code>{userId}</code> tidak ditemukan di koleksi <code>users</code> Cloud Firestore.
        </p>
        <Link
          href="/admin/pengguna"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0E7490] text-white rounded-lg text-xs font-semibold hover:bg-cyan-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Kelola Pengguna</span>
        </Link>
      </div>
    );
  }

  // Super Admin tidak bisa menurunkan peran atau menonaktifkan akunnya sendiri (PRD 4.13)
  const isSelf = authUser?.uid === user.id;

  const handleSaveRole = async (e) => {
    e.preventDefault();
    setError("");
    setNotification("");

    if (isSelf && selectedRole !== "super_admin") {
      setError("Validasi PRD 4.13: Anda tidak bisa menurunkan peran akun Super Admin Anda sendiri.");
      return;
    }

    const validRoles = ["pasien", "resepsionis", "dokter", "super_admin"];
    if (!validRoles.includes(selectedRole)) {
      setError("Pilihan peran tidak valid.");
      return;
    }

    setIsSaving(true);
    try {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, { role: selectedRole });

      setUser({ ...user, role: selectedRole });
      setNotification(`Peran ${user.nama || user.email} berhasil diubah menjadi "${selectedRole}".`);
      setTimeout(() => setNotification(""), 3500);
    } catch (err) {
      console.error("Gagal menyimpan peran pengguna:", err);
      setError(`Gagal menyimpan peran ke Firestore: ${err.message}.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleAktif = async () => {
    setError("");
    setNotification("");

    if (isSelf) {
      setError("Validasi PRD 4.13: Anda tidak bisa menonaktifkan akun Anda sendiri.");
      return;
    }

    const nextState = !user.aktif;
    setIsSaving(true);
    try {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, { aktif: nextState });

      setUser({ ...user, aktif: nextState });
      setNotification(
        nextState
          ? `Akun ${user.nama || user.email} telah diaktifkan kembali.`
          : `Akun ${user.nama || user.email} telah dinonaktifkan.`
      );
      setTimeout(() => setNotification(""), 3500);
    } catch (err) {
      console.error("Gagal mengubah status aktif pengguna:", err);
      setError(`Gagal memperbarui status akun di Firestore: ${err.message}.`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Link
        href="/admin/pengguna"
        className="inline-flex items-center gap-1.5 text-xs text-[#0E7490] font-semibold hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Daftar Pengguna</span>
      </Link>

      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-100 text-[#0E7490] flex items-center justify-center font-bold text-xl">
              {(user.nama || user.email || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-[11px] text-[#5A6B78]">Kelola Akun Pengguna</span>
              <h1 className="text-xl font-bold text-[#1F2937]">{user.nama || "Tanpa Nama"}</h1>
              <p className="text-xs text-[#5A6B78]">{user.email || "-"}</p>
              {user.noHp && (
                <p className="text-[11px] text-slate-500 tabular-nums">HP: {user.noHp}</p>
              )}
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              user.aktif
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {user.aktif ? "Akun Aktif" : "Akun Nonaktif"}
          </span>
        </div>

        {isSelf && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs">
            <b>Catatan Akun Sendiri:</b> Ini adalah akun Super Admin Anda yang sedang login. Sesuai aturan PRD 4.13, peran dan status akun ini tidak dapat diturunkan atau dinonaktifkan sendiri.
          </div>
        )}

        {/* Form Ubah Peran Sesuai PRD 4.13 */}
        <form onSubmit={handleSaveRole} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#1F2937] mb-1">
              Pilih Peran Akun (Role) <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              disabled={isSaving || (isSelf && user.role === "super_admin")}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0E7490] disabled:bg-slate-100 disabled:opacity-70"
            >
              <option value="pasien">pasien (Pasien Klinik)</option>
              <option value="resepsionis">resepsionis (Staf Meja Depan)</option>
              <option value="dokter">dokter (Dokter Gigi)</option>
              <option value="super_admin">super_admin (Pemilik / Super Admin)</option>
            </select>
            <p className="text-[10px] text-[#5A6B78] mt-1">
              Peran menentukan hak akses modul saat pengguna masuk ke portal.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              disabled={isSaving || selectedRole === user.role}
              className="px-5 py-2.5 bg-[#0E7490] hover:bg-cyan-800 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition shadow-sm flex items-center gap-1.5"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>{isSaving ? "Menyimpan..." : "Simpan Peran"}</span>
            </button>
          </div>
        </form>

        {/* Tombol Nonaktifkan Akun (PRD 4.13) */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="font-semibold text-xs text-[#1F2937]">Status Akses Akun</p>
            <p className="text-[11px] text-[#5A6B78]">
              Akun yang dinonaktifkan tidak dapat membuka halaman mana pun.
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleAktif}
            disabled={isSelf || isSaving}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 ${
              user.aktif
                ? "border-red-300 text-red-600 hover:bg-red-50"
                : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <PowerOff className="w-3.5 h-3.5" />
            )}
            <span>{user.aktif ? "Nonaktifkan Akun" : "Aktifkan Akun"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RincianPenggunaAdminPage() {
  return (
    <PortalLayout>
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#5A6B78]">Memuat data pengguna...</div>}>
        <RincianPenggunaContent />
      </Suspense>
    </PortalLayout>
  );
}
