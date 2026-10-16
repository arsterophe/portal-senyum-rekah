"use client";

import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { Users, Search, Phone, Mail, ShieldAlert } from "lucide-react";
import { MOCK_USERS } from "@/lib/mockData";

export default function DataPasienPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const allPatients = MOCK_USERS.filter((u) => u.role === "pasien");

  const filteredPatients = allPatients.filter((p) =>
    p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.noHp.includes(searchTerm)
  );

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Data Pasien Klinik</h1>
          <p className="text-xs text-[#5A6B78] mt-1">
            Buku kontak nama, email, dan nomor WhatsApp pasien untuk keperluan konfirmasi dan informasi layanan
          </p>
        </div>

        {/* Pencarian Nama Sesuai PRD 4.8 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Ketik nama pasien (contoh: Andi)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs outline-none bg-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Tabel Data Pasien */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[#5A6B78] font-semibold">
                  <th className="py-3.5 px-4">Nama Pasien</th>
                  <th className="py-3.5 px-4">Alamat Email</th>
                  <th className="py-3.5 px-4">Nomor WhatsApp / HP</th>
                  <th className="py-3.5 px-4 text-right">Status Akun</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-semibold text-[#1F2937]">
                      {patient.nama}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{patient.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 tabular-nums text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-medium">{patient.noHp || "Belum diisi"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Aktif
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-[#5A6B78]">
                      Pasien dengan nama "{searchTerm}" tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Batasan Privasi v1 */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#5A6B78] flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span>
            <b>Catatan Batasan PRD 4.8:</b> Resepsionis hanya memiliki hak akses melihat informasi kontak pasien (nama, email, no HP), dan tidak memiliki akses ke rekam medis atau catatan perawatan.
          </span>
        </div>
      </div>
    </PortalLayout>
  );
}
