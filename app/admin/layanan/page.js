"use client";

import { useState, useEffect } from "react";
import PortalLayout from "@/components/PortalLayout";
import { Layers, Plus, Check, PowerOff, AlertCircle, Sparkles, Loader2, RefreshCw } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

export default function KelolaLayananPage() {
  const [layananList, setLayananList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  // Form tambah layanan
  const [nama, setNama] = useState("");
  const [durasiMenit, setDurasiMenit] = useState(30);
  const [harga, setHarga] = useState(250000);
  const [aktif, setAktif] = useState(true);
  const [modalError, setModalError] = useState("");

  const fetchLayanan = async () => {
    setIsLoading(true);
    setError("");
    try {
      const snap = await getDocs(collection(db, "layanan"));
      const list = [];
      snap.forEach((docSnap) => {
        list.push({
          id: docSnap.id,
          ...docSnap.data(),
        });
      });

      // Urutkan: layanan aktif terlebih dahulu, lalu menurut nama abjad
      list.sort((a, b) => {
        if (a.aktif !== b.aktif) {
          return a.aktif ? -1 : 1;
        }
        return (a.nama || "").localeCompare(b.nama || "");
      });

      setLayananList(list);
    } catch (err) {
      console.error("Gagal memuat layanan dari Firestore:", err);
      setError(`Gagal memuat daftar layanan dari Cloud Firestore: ${err.message}.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLayanan();
  }, []);

  const handleAddLayanan = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!nama.trim()) {
      setModalError("Nama layanan wajib diisi.");
      return;
    }

    const durasi = Number(durasiMenit);
    if (isNaN(durasi) || durasi % 30 !== 0 || durasi <= 0) {
      setModalError("Validasi PRD 4.14: Durasi harus kelipatan 30 menit (30, 60, 90, dst).");
      return;
    }

    const tarif = Number(harga);
    if (isNaN(tarif) || tarif < 0) {
      setModalError("Tarif biaya tidak valid (harus angka positif).");
      return;
    }

    setIsSubmitting(true);
    try {
      const newLayananData = {
        nama: nama.trim(),
        durasiMenit: durasi,
        harga: tarif,
        aktif: Boolean(aktif),
        dibuatPada: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "layanan"), newLayananData);

      setShowAddModal(false);
      setNama("");
      setDurasiMenit(30);
      setHarga(250000);
      setAktif(true);
      setModalError("");

      setNotification(`Layanan "${newLayananData.nama}" berhasil ditambahkan ke database!`);
      setTimeout(() => setNotification(""), 3500);

      // Perbarui daftar layanan dari Firestore
      await fetchLayanan();
    } catch (err) {
      console.error("Gagal menambah layanan:", err);
      setModalError(`Gagal menyimpan layanan ke Firestore: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAktif = async (item) => {
    setError("");
    setNotification("");
    const nextState = !item.aktif;

    try {
      const layRef = doc(db, "layanan", item.id);
      await updateDoc(layRef, { aktif: nextState });

      // Perbarui state lokal
      setLayananList((prev) =>
        prev.map((l) => (l.id === item.id ? { ...l, aktif: nextState } : l))
      );

      setNotification(
        nextState
          ? `Layanan "${item.nama}" telah diaktifkan kembali (dapat dipilih di Buat Janji).`
          : `Layanan "${item.nama}" telah dinonaktifkan.`
      );
      setTimeout(() => setNotification(""), 3500);
    } catch (err) {
      console.error("Gagal mengubah status layanan:", err);
      setError(`Gagal mengubah status layanan di Firestore: ${err.message}`);
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Kelola Layanan Gigi</h1>
            <p className="text-xs text-[#5A6B78] mt-1">
              Daftar tindakan klinis, tarif rupiah, dan durasi slot pemeriksaan dari Cloud Firestore
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchLayanan}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#1F2937] rounded-xl text-xs font-semibold transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Segarkan</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setModalError("");
                setShowAddModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0E7490] hover:bg-cyan-800 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Layanan Baru</span>
            </button>
          </div>
        </div>

        {notification && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchLayanan}
              className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Tabel Layanan */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="py-16 text-center text-xs text-[#5A6B78] space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0E7490]" />
              <p className="font-medium">Memuat data layanan dari Cloud Firestore...</p>
            </div>
          ) : layananList.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#5A6B78] space-y-2">
              <Layers className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">Belum Ada Layanan Terdaftar</p>
              <p>Belum ada data di koleksi <code>layanan</code> Cloud Firestore. Klik tombol Tambah Layanan Baru di atas untuk mulai menambahkan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[#5A6B78] font-semibold">
                    <th className="py-3.5 px-4">Nama Layanan</th>
                    <th className="py-3.5 px-4">Durasi Pengerjaan</th>
                    <th className="py-3.5 px-4">Tarif (Rupiah)</th>
                    <th className="py-3.5 px-4">Status Layanan</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {layananList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-semibold text-[#1F2937]">
                        {item.nama}
                      </td>
                      <td className="py-3.5 px-4 tabular-nums text-slate-700">
                        {item.durasiMenit} Menit
                      </td>
                      <td className="py-3.5 px-4 tabular-nums font-medium text-[#0E7490]">
                        Rp {Number(item.harga || 0).toLocaleString("id-ID")}
                      </td>
                      <td className="py-3.5 px-4">
                        {item.aktif ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Aktif (Tampil di Janji)
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                            Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => toggleAktif(item)}
                          className={`text-xs font-semibold hover:underline ${
                            item.aktif ? "text-amber-600" : "text-emerald-600"
                          }`}
                        >
                          {item.aktif ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Tambah Layanan Sesuai PRD 4.14 */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-xl">
              <h3 className="font-bold text-base text-[#1F2937]">
                Tambah Layanan Klinik Baru
              </h3>
              <p className="text-xs text-[#5A6B78]">
                Sesuai PRD 4.14: Durasi harus kelipatan 30 menit (30, 60, 90, 120 menit).
              </p>

              {modalError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <form onSubmit={handleAddLayanan} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-[#1F2937]">
                    Nama Layanan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Pembersihan Karang Gigi"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#0E7490]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#1F2937]">
                    Durasi Menit (Kelipatan 30) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={durasiMenit}
                    onChange={(e) => setDurasiMenit(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs tabular-nums focus:ring-2 focus:ring-[#0E7490]"
                  >
                    <option value={30}>30 Menit (1 Slot)</option>
                    <option value={60}>60 Menit (2 Slot)</option>
                    <option value={90}>90 Menit (3 Slot)</option>
                    <option value={120}>120 Menit (4 Slot)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#1F2937]">
                    Tarif Biaya (Rupiah) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="5000"
                    min="0"
                    placeholder="250000"
                    value={harga}
                    onChange={(e) => setHarga(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs tabular-nums focus:ring-2 focus:ring-[#0E7490]"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="aktifCheckbox"
                    checked={aktif}
                    onChange={(e) => setAktif(e.target.checked)}
                    className="rounded text-[#0E7490] focus:ring-[#0E7490]"
                  />
                  <label htmlFor="aktifCheckbox" className="font-semibold text-slate-700">
                    Layanan langsung aktif dan dapat dipilih di Buat Janji
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    disabled={isSubmitting}
                    className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-[#0E7490] text-white rounded-lg font-semibold hover:bg-cyan-800 transition flex items-center gap-1.5 shadow-sm"
                  >
                    {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>{isSubmitting ? "Menyimpan..." : "Simpan Layanan"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
