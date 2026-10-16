"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PortalLayout from "@/components/PortalLayout";
import { Calendar, Clock, User, Layers, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  MOCK_LAYANAN,
  MOCK_USERS,
  MOCK_JADWAL_DOKTER,
} from "@/lib/mockData";

export default function BuatJanjiBaruPage() {
  const router = useRouter();

  // Dokter yang tersedia
  const doctors = MOCK_USERS.filter((u) => u.role === "dokter");
  // Hanya layanan aktif yang tampil sesuai PRD 4.3.1
  const activeServices = MOCK_LAYANAN.filter((l) => l.aktif);

  const [selectedService, setSelectedService] = useState(activeServices[0]?.id || "");
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState("2026-10-16");
  const [selectedSlot, setSelectedSlot] = useState("10:00");
  const [keluhan, setKeluhan] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Contoh slot jam kosong tersedia (kelipatan 30 menit dari jam praktik)
  const availableSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:30",
    "14:00",
  ];

  // Hari praktik dokter terpilih
  const doctorSchedules = MOCK_JADWAL_DOKTER.filter(
    (j) => j.dokterId === selectedDoctor
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedService || !selectedDoctor || !selectedDate || !selectedSlot || !keluhan) {
      setError("Semua bidang bertanda (*) wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    // Simulasikan penyimpanan dan redirect ke rincian janji (sesuai PRD 4.3.1)
    setTimeout(() => {
      router.push("/janji/jnj_102");
    }, 1000);
  };

  return (
    <PortalLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Buat Janji Temu Baru</h1>
          <p className="text-xs text-[#5A6B78] mt-1">
            Silakan pilih layanan, dokter, tanggal, dan slot jam kosong yang tersedia.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* 1. Pilih Layanan (Hanya aktif) */}
          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#0E7490]" />
              <span>1. Pilih Layanan Gigi <span className="text-red-500">*</span></span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeServices.map((service) => {
                const isSelected = selectedService === service.id;
                return (
                  <label
                    key={service.id}
                    className={`cursor-pointer p-3.5 rounded-xl border text-xs transition flex flex-col justify-between ${
                      isSelected
                        ? "border-[#0E7490] bg-cyan-50/50 ring-1 ring-[#0E7490]"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-semibold text-[#1F2937]">{service.nama}</span>
                      <input
                        type="radio"
                        name="layanan"
                        value={service.id}
                        checked={isSelected}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="text-[#0E7490] focus:ring-[#0E7490]"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[#5A6B78] tabular-nums">
                      <span>{service.durasiMenit} Menit</span>
                      <span className="font-semibold text-[#0E7490]">
                        Rp {service.harga.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 2. Pilih Dokter */}
          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#0E7490]" />
              <span>2. Pilih Dokter Gigi <span className="text-red-500">*</span></span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {doctors.map((doctor) => {
                const isSelected = selectedDoctor === doctor.id;
                return (
                  <label
                    key={doctor.id}
                    className={`cursor-pointer p-3.5 rounded-xl border text-xs transition ${
                      isSelected
                        ? "border-[#0E7490] bg-cyan-50/50 ring-1 ring-[#0E7490]"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[#1F2937]">{doctor.nama}</p>
                        <p className="text-[11px] text-[#5A6B78]">Spesialis Dokter Gigi</p>
                      </div>
                      <input
                        type="radio"
                        name="dokter"
                        value={doctor.id}
                        checked={isSelected}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        className="text-[#0E7490] focus:ring-[#0E7490]"
                      />
                    </div>
                  </label>
                );
              })}
            </div>
            {/* Jadwal Praktik info */}
            <div className="mt-2 text-[11px] text-[#5A6B78]">
              Jadwal Praktik:{" "}
              {doctorSchedules.map((s) => `${s.hari} (${s.jamMulai}-${s.jamSelesai})`).join(", ") || "Senin - Sabtu"}
            </div>
          </div>

          {/* 3. Tanggal Janji */}
          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#0E7490]" />
              <span>3. Tanggal Janji Temu <span className="text-red-500">*</span></span>
            </label>
            <input
              type="date"
              value={selectedDate}
              min="2026-10-16"
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 border border-slate-300 rounded-lg text-xs tabular-nums focus:outline-none focus:ring-2 focus:ring-[#0E7490]"
              required
            />
            <p className="text-[10px] text-[#5A6B78] mt-1">
              Validasi PRD: Tanggal paling cepat besok (H+1). Hanya hari praktik dokter yang bisa dipilih.
            </p>
          </div>

          {/* 4. Slot Jam Kosong (PRD 4.3.1) */}
          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#0E7490]" />
              <span>4. Pilih Slot Jam Kosong <span className="text-red-500">*</span></span>
            </label>
            <p className="text-[11px] text-[#5A6B78] mb-2">
              Slot yang tampil di bawah adalah slot yang belum bertabrakan dengan janji pasien lain.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {availableSlots.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border tabular-nums transition ${
                      isSelected
                        ? "bg-[#0E7490] text-white border-[#0E7490] shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:border-[#0E7490] hover:text-[#0E7490]"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Keluhan Pasien */}
          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-1">
              5. Keluhan yang Dirasakan <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="3"
              placeholder="Contoh: Gigi geraham kiri ngilu saat mengunyah makanan keras..."
              value={keluhan}
              onChange={(e) => setKeluhan(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0E7490]"
              required
            ></textarea>
          </div>

          {/* Tombol Kirim */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-[#5A6B78]">
              Status janji otomatis dibuat menjadi <b>Menunggu</b>.
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#0E7490] hover:bg-cyan-800 text-white rounded-xl text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan Janji..." : "Kirim Janji Temu"}
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  );
}
