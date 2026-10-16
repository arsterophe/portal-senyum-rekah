// Mock data sesuai dengan skema Firestore di PRD Bab 7.1

export const MOCK_USERS = [
  {
    id: "usr_andi",
    nama: "Andi Wijaya",
    email: "andi@example.com",
    noHp: "081234567891",
    role: "pasien",
    aktif: true,
    dibuatPada: "2026-10-01T08:00:00Z",
  },
  {
    id: "usr_maya",
    nama: "Maya Putri",
    email: "maya@example.com",
    noHp: "081234567892",
    role: "pasien",
    aktif: true,
    dibuatPada: "2026-10-02T09:30:00Z",
  },
  {
    id: "usr_laras",
    nama: "Laras Resepsionis",
    email: "laras@senyumrekah.id",
    noHp: "081234567893",
    role: "resepsionis",
    aktif: true,
    dibuatPada: "2026-09-15T08:00:00Z",
  },
  {
    id: "usr_bima",
    nama: "drg. Bima Sakti",
    email: "bima@senyumrekah.id",
    noHp: "081234567894",
    role: "dokter",
    aktif: true,
    dibuatPada: "2026-09-01T08:00:00Z",
  },
  {
    id: "usr_sinta",
    nama: "drg. Sinta Maharani",
    email: "sinta@senyumrekah.id",
    noHp: "081234567895",
    role: "dokter",
    aktif: true,
    dibuatPada: "2026-09-01T08:00:00Z",
  },
  {
    id: "usr_ratna",
    nama: "Bu Ratna (Pemilik)",
    email: "ratna@senyumrekah.id",
    noHp: "081234567890",
    role: "super_admin",
    aktif: true,
    dibuatPada: "2026-08-01T08:00:00Z",
  },
];

export const MOCK_LAYANAN = [
  {
    id: "lay_1",
    nama: "Pembersihan Karang Gigi (Scaling)",
    durasiMenit: 30,
    harga: 250000,
    aktif: true,
  },
  {
    id: "lay_2",
    nama: "Tambal Gigi Komposit",
    durasiMenit: 30,
    harga: 300000,
    aktif: true,
  },
  {
    id: "lay_3",
    nama: "Cabut Gigi",
    durasiMenit: 30,
    harga: 250000,
    aktif: true,
  },
  {
    id: "lay_4",
    nama: "Perawatan Saluran Akar",
    durasiMenit: 60,
    harga: 500000,
    aktif: true,
  },
  {
    id: "lay_5",
    nama: "Bleaching / Pemutihan Gigi",
    durasiMenit: 60,
    harga: 1500000,
    aktif: false,
  },
];

export const MOCK_JADWAL_DOKTER = [
  {
    id: "jad_1",
    dokterId: "usr_bima",
    hari: "senin",
    jamMulai: "09:00",
    jamSelesai: "15:00",
  },
  {
    id: "jad_2",
    dokterId: "usr_bima",
    hari: "selasa",
    jamMulai: "09:00",
    jamSelesai: "15:00",
  },
  {
    id: "jad_3",
    dokterId: "usr_bima",
    hari: "rabu",
    jamMulai: "09:00",
    jamSelesai: "15:00",
  },
  {
    id: "jad_4",
    dokterId: "usr_bima",
    hari: "kamis",
    jamMulai: "09:00",
    jamSelesai: "15:00",
  },
  {
    id: "jad_5",
    dokterId: "usr_sinta",
    hari: "senin",
    jamMulai: "13:00",
    jamSelesai: "19:00",
  },
  {
    id: "jad_6",
    dokterId: "usr_sinta",
    hari: "rabu",
    jamMulai: "13:00",
    jamSelesai: "19:00",
  },
  {
    id: "jad_7",
    dokterId: "usr_sinta",
    hari: "jumat",
    jamMulai: "13:00",
    jamSelesai: "19:00",
  },
  {
    id: "jad_8",
    dokterId: "usr_sinta",
    hari: "sabtu",
    jamMulai: "09:00",
    jamSelesai: "14:00",
  },
];

export const MOCK_JANJI_TEMU = [
  {
    id: "jnj_101",
    pasienId: "usr_andi",
    dokterId: "usr_bima",
    layananId: "lay_2",
    tanggal: "2026-10-15",
    jam: "09:30",
    keluhan: "Gigi geraham bawah ngilu saat minum dingin",
    status: "hadir",
    alasanBatal: "",
    dibuatPada: "2026-10-12T10:00:00Z",
  },
  {
    id: "jnj_102",
    pasienId: "usr_maya",
    dokterId: "usr_sinta",
    layananId: "lay_1",
    tanggal: "2026-10-15",
    jam: "14:00",
    keluhan: "Pembersihan rutin karang gigi",
    status: "menunggu",
    alasanBatal: "",
    dibuatPada: "2026-10-13T11:15:00Z",
  },
  {
    id: "jnj_103",
    pasienId: "usr_andi",
    dokterId: "usr_bima",
    layananId: "lay_1",
    tanggal: "2026-10-16",
    jam: "10:00",
    keluhan: "Konsultasi pembersihan karang gigi berkala",
    status: "dikonfirmasi",
    alasanBatal: "",
    dibuatPada: "2026-10-10T14:20:00Z",
  },
  {
    id: "jnj_104",
    pasienId: "usr_andi",
    dokterId: "usr_bima",
    layananId: "lay_2",
    tanggal: "2026-10-05",
    jam: "11:00",
    keluhan: "Tambalan lama terlepas",
    status: "selesai",
    alasanBatal: "",
    dibuatPada: "2026-10-02T08:00:00Z",
  },
  {
    id: "jnj_105",
    pasienId: "usr_maya",
    dokterId: "usr_sinta",
    layananId: "lay_3",
    tanggal: "2026-10-08",
    jam: "15:30",
    keluhan: "Gigi bungsu sakit tidak tertahankan",
    status: "selesai",
    alasanBatal: "",
    dibuatPada: "2026-10-06T09:00:00Z",
  },
  {
    id: "jnj_106",
    pasienId: "usr_maya",
    dokterId: "usr_bima",
    layananId: "lay_1",
    tanggal: "2026-10-11",
    jam: "10:30",
    keluhan: "Scaling karang gigi",
    status: "dibatalkan",
    alasanBatal: "Pasien ada keperluan mendadak di luar kota",
    dibuatPada: "2026-10-09T10:00:00Z",
  },
];

export const MOCK_CATATAN_PERAWATAN = [
  {
    id: "cat_1",
    janjiId: "jnj_104",
    pasienId: "usr_andi",
    dokterId: "usr_bima",
    tindakan: "Tambal gigi dengan resin komposit kelas II pada gigi 36",
    catatan: "Hindari makanan keras dan lengket selama 24 jam. Kontrol bila ada rasa nyeri.",
    dibuatPada: "2026-10-05T11:40:00Z",
  },
  {
    id: "cat_2",
    janjiId: "jnj_105",
    pasienId: "usr_maya",
    dokterId: "usr_sinta",
    tindakan: "Ekstraksi gigi molar ketiga kiri bawah tanpa komplikasi",
    catatan: "Gigit tampon selama 1 jam. Jangan berkumur keras atau merokok. Minum analgesik asam mefenamat 500mg bila sakit.",
    dibuatPada: "2026-10-08T16:15:00Z",
  },
];

// Helper functions untuk mengambil data terhubung
export function getUserById(id) {
  return MOCK_USERS.find((u) => u.id === id) || null;
}

export function getLayananById(id) {
  return MOCK_LAYANAN.find((l) => l.id === id) || null;
}

export function getJanjiById(id) {
  return MOCK_JANJI_TEMU.find((j) => j.id === id) || null;
}

export function getCatatanByJanjiId(janjiId) {
  return MOCK_CATATAN_PERAWATAN.find((c) => c.janjiId === janjiId) || null;
}
