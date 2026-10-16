"use client";

import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { Clock, Plus, Calendar, AlertCircle, CheckCircle2, User } from "lucide-react";
import { MOCK_JADWAL_DOKTER, MOCK_USERS, getUserById } from "@/lib/mockData";

export default function JadwalDokterPage() {
  const doctors = MOCK_USERS.filter((u) => u.role === "dokter");
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || "usr_bima");
  const [jadwalList, setJadwalList] = useState(MOCK_JADWAL_DOKTER);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form input
  const [hari, setHari] = useState("senin");
  const [jamMulai, setJamMulai] = useState("09:00");
  const [jamSelesai, setJamSelesai] = useState("15:00");
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  const currentDoctor = getUserById(selectedDoctorId);
  const doctorSchedules = jadwalList.filter((j) => j.dokterId === selectedDoctorId);

  const handleAddSchedule = (e) => {
    e.preventDefault();

    // Validasi: jam selesai setelah jam mulai (PRD 4.15)
    if (jamSelesai <= jamMulai) {
      setError("Validasi PRD 4.15: Jam selesai harus setelah jam mulai.");
      return;
    }

    // Validasi: satu dokter satu jadwal per hari
    const alreadyExists = doctorSchedules.some(
      (j) => j.hari.toLowerCase() === hari.toLowerCase()
    );
    if (alreadyExists) {
      setError(`Validasi PRD 4.15: Dokter sudah memiliki jadwal untuk hari ${hari}.`);
      return;
    }

    const newJadwal = {
      id: `jad_${Date.now()}`,
      dokterId: selectedDoctorId,
      hari,
      jamMulai,
      jamSelesai,
    };

    setJadwalList([...jadwalList, newJadwal]);
    setShowAddModal(false);
    setError("");
    setNotification(`Jadwal hari ${hari} untuk ${currentDoctor?.nama} berhasil ditambahkan!`);
    setTimeout(() => setNotification(""), 3500);
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Jadwal Praktik Dokter</h1>
            <p className="text-xs text-[#5A6B78] mt-1">
              Atur hari kerja (Senin - Sabtu) dan jam operasional praktik dokter gigi
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0E7490] hover:bg-cyan-800 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Hari Praktik</span>
          </button>
        </div>

        {notification && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
        )}

        {/* Pemilihan Dokter */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-[#5A6B78]">Pilih Dokter Gigi:</span>
              <p className="font-bold text-sm text-[#1F2937]">{currentDoctor?.nama}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {doctors.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => setSelectedDoctorId(doc.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedDoctorId === doc.id
                    ? "bg-[#0E7490] text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {doc.nama}
              </button>
            ))}
          </div>
        </div>

        {/* Tabel Jadwal Dokter Terpilih */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Hari & Jam Praktik ({currentDoctor?.nama})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-[#5A6B78] font-semibold">
                  <th className="py-3.5 px-4">Hari Praktik</th>
                  <th className="py-3.5 px-4">Jam Mulai</th>
                  <th className="py-3.5 px-4">Jam Selesai</th>
                  <th className="py-3.5 px-4">Status Pasien</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctorSchedules.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-[#1F2937] uppercase">
                      {item.hari}
                    </td>
                    <td className="py-3.5 px-4 tabular-nums text-slate-700">
                      {item.jamMulai} WITA
                    </td>
                    <td className="py-3.5 px-4 tabular-nums text-slate-700">
                      {item.jamSelesai} WITA
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-cyan-50 text-[#0E7490] border border-cyan-200">
                        Bisa Dipilih Pasien
                      </span>
                    </td>
                  </tr>
                ))}

                {doctorSchedules.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-[#5A6B78]">
                      Belum ada jadwal praktik terdaftar untuk dokter ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Tambah Jadwal Sesuai PRD 4.15 */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-xl">
              <h3 className="font-bold text-base text-[#1F2937]">
                Tambah Hari Praktik Dokter
              </h3>
              <p className="text-xs text-[#5A6B78]">
                Dokter: <b>{currentDoctor?.nama}</b>. Hari hanya Senin sampai Sabtu.
              </p>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleAddSchedule} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-[#1F2937]">
                    Hari Praktik (Senin - Sabtu) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={hari}
                    onChange={(e) => setHari(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  >
                    <option value="senin">Senin</option>
                    <option value="selasa">Selasa</option>
                    <option value="rabu">Rabu</option>
                    <option value="kamis">Kamis</option>
                    <option value="jumat">Jumat</option>
                    <option value="sabtu">Sabtu</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-[#1F2937]">
                      Jam Mulai (Format 09:00) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={jamMulai}
                      onChange={(e) => setJamMulai(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg tabular-nums"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-[#1F2937]">
                      Jam Selesai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={jamSelesai}
                      onChange={(e) => setJamSelesai(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg tabular-nums"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0E7490] text-white rounded-lg font-semibold hover:bg-cyan-800"
                  >
                    Simpan Jadwal
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
