# PRODUCT REQUIREMENTS DOCUMENT
## Aplikasi Janji Temu dan Catatan Perawatan Klinik Gigi: PORTAL JANJI SENYUM REKAH

### 1. Ringkasan Eksekutif
Klinik Gigi Senyum Rekah adalah klinik gigi kecil di Makassar dengan 2 dokter gigi dan 1 resepsionis, buka Senin sampai Sabtu. Janji temu diterima lewat telepon dan WhatsApp, lalu dicatat di buku. Akibatnya jam janji sering bentrok, pasien lupa jadwalnya, dan catatan perawatan tersimpan di kertas yang sulit dicari.

Portal Janji Senyum Rekah menggantikan buku janji dan catatan kertas dengan satu aplikasi web di `janji.senyumrekah.id`. Aplikasi dipakai lewat peramban, dari ponsel maupun laptop.

Yang membuat aplikasi ini pas untuk Senyum Rekah:
- Janji tidak bentrok lagi. Pasien hanya bisa memilih slot jam yang masih kosong.
- Pasien membuat janji sendiri, tanpa menunggu balasan WhatsApp.
- Masuk tanpa membuat kata sandi baru. Pasien bisa masuk dengan akun Google.
- Setiap peran langsung tiba di halamannya.
- Catatan perawatan tetap rahasia. Resepsionis tidak bisa membacanya, dan dokter hanya membaca catatan pasien yang ia tangani.
- Laporan kunjungan tersusun sendiri dari data janji.

Yang tidak dibangun di v1: pembayaran dan kasir online, pengingat WhatsApp atau email, rekam medis lengkap dan odontogram, stok bahan, aplikasi seluler, BPJS dan asuransi, serta unggah foto rontgen.

---

### 2. Pengguna & Peran

#### 2.1 Empat Pemegang Akun
| Peran | Nilai role | Siapa | Tugas utama |
|---|---|---|---|
| Pasien | `pasien` | Andi dan Maya | Membuat dan membatalkan janji miliknya, membaca riwayat perawatannya |
| Resepsionis | `resepsionis` | Laras | Mengonfirmasi, menjadwal ulang, membatalkan janji, menandai pasien hadir |
| Dokter | `dokter` | drg. Bima dan drg. Sinta | Melihat jadwalnya, mengisi tindakan dan catatan perawatan |
| Super Admin | `super_admin` | Bu Ratna, pemilik klinik | Semua hak tiga peran lain, ditambah mengelola pengguna, layanan, jadwal dokter, dan laporan |

**Alur kerjanya:** pasien membuat janji berstatus Menunggu. Resepsionis mengonfirmasinya. Saat pasien tiba, resepsionis menandainya Hadir. Dokter memeriksa, mengisi catatan, lalu menandai Selesai. Pasien membaca hasilnya di Riwayat Perawatan.

#### 2.2 Pengunjung dan Cara Mendapat Peran
- Pengunjung hanya bisa membuka halaman Daftar (`/daftar`) dan Masuk (`/masuk`).
- Setiap akun baru otomatis berperan `pasien`.
- Peran `resepsionis`, `dokter`, dan `super_admin` hanya bisa diberikan Super Admin lewat menu Kelola Pengguna.
- Akun Super Admin pertama: Bu Ratna mendaftar lewat `/daftar`, lalu diubah role-nya menjadi `super_admin`.
- Kata sandi tidak pernah disimpan di Firestore.

#### 2.3 Hak Akses per Modul
| Modul | Pasien | Resepsionis | Dokter | Super Admin |
|---|---|---|---|---|
| Beranda, Janji Saya | Penuh, hanya miliknya | Tidak tampil | Tidak tampil | Penuh |
| Riwayat Perawatan | Lihat, hanya miliknya | Tidak tampil | Tidak tampil | Lihat |
| Profil | Ubah nama dan no HP | Ubah nama dan no HP | Ubah nama dan no HP | Ubah nama dan no HP |
| Dasbor Resepsionis, Kelola Janji | Tidak tampil | Penuh | Tidak tampil | Penuh |
| Data Pasien | Tidak tampil | Lihat kontak | Tidak tampil | Lihat |
| Dasbor Dokter, Pemeriksaan | Tidak tampil | Tidak tampil | Penuh, hanya janji miliknya | Penuh |
| Riwayat Pasien | Tidak tampil | Tidak tampil | Lihat, hanya pasien yang ditangani | Lihat |
| Dasbor Admin, Layanan, Jadwal Dokter, Laporan | Tidak tampil | Tidak tampil | Tidak tampil | Penuh |
| Kelola Pengguna | Tidak tampil | Tidak tampil | Tidak tampil | Penuh, termasuk ubah peran |

---

### 3. Peta Modul & Batas Fitur
- Pasien: Beranda (`/beranda`), Janji Saya (`/janji`, `/janji/baru`, `/janji/[id]`), Riwayat Perawatan (`/riwayat`), Profil (`/profil`).
- Resepsionis: Dasbor Resepsionis (`/resepsionis`), Kelola Janji (`/resepsionis/janji`, `/resepsionis/janji/[id]`), Data Pasien (`/resepsionis/pasien`), Profil (`/profil`).
- Dokter: Dasbor Dokter (`/dokter`), Pemeriksaan (`/dokter/janji/[id]`), Riwayat Pasien (`/dokter/pasien/[id]`), Profil (`/profil`).
- Super Admin: Semua menu peran lain ditambah Dasbor Admin (`/admin`), Kelola Pengguna (`/admin/pengguna`, `/admin/pengguna/[id]`), Layanan (`/admin/layanan`), Jadwal Dokter (`/admin/jadwal-dokter`), Laporan (`/admin/laporan`).

---

### 4. Kebutuhan Fungsional & Alur Layanan
4.1 **Daftar & Masuk** (`/daftar`, `/masuk`)
4.2 **Beranda Pasien** (`/beranda`)
4.3 **Janji Saya** (`/janji`, `/janji/baru`, `/janji/[id]`)
4.4 **Riwayat Perawatan** (`/riwayat`)
4.5 **Profil** (`/profil`)
4.6 **Dasbor Resepsionis** (`/resepsionis`)
4.7 **Kelola Janji Resepsionis** (`/resepsionis/janji`, `/resepsionis/janji/[id]`)
4.8 **Data Pasien Resepsionis** (`/resepsionis/pasien`)
4.9 **Dasbor Dokter** (`/dokter`)
4.10 **Pemeriksaan Dokter** (`/dokter/janji/[id]`)
4.11 **Riwayat Pasien Dokter** (`/dokter/pasien/[id]`)
4.12 **Dasbor Admin** (`/admin`)
4.13 **Kelola Pengguna Admin** (`/admin/pengguna`, `/admin/pengguna/[id]`)
4.14 **Layanan Admin** (`/admin/layanan`)
4.15 **Jadwal Dokter Admin** (`/admin/jadwal-dokter`)
4.16 **Laporan Admin** (`/admin/laporan`)

---

### 5. Identitas Visual & Prinsip Antarmuka
- **Biru Rekah**: `#0E7490` (cyan-700)
- **Latar Aplikasi**: `#F4F7F9`
- **Panel**: `#FFFFFF`
- **Teks**: `#1F2937`
- **Teks Redup**: `#5A6B78`
- **Warna Status Janji**:
  - Menunggu: `#F59E0B`
  - Dikonfirmasi: `#2563EB`
  - Hadir: `#7C3AED`
  - Selesai: `#15A66A`
  - Dibatalkan: `#E53935`
- **Tipografi**: Inter UI font, tabular-nums untuk angka/harga/jam/tanggal.

---

### 7.1 Struktur Data Firestore
- `users`: `{ nama, email, noHp, role, aktif, dibuatPada }`
- `layanan`: `{ nama, durasiMenit, harga, aktif }`
- `jadwal_dokter`: `{ dokterId, hari, jamMulai, jamSelesai }`
- `janji_temu`: `{ pasienId, dokterId, layananId, tanggal, jam, keluhan, status, alasanBatal, dibuatPada }`
- `catatan_perawatan`: `{ janjiId, pasienId, dokterId, tindakan, catatan, dibuatPada }`
- `slot_terisi`: `{ dokterId, tanggal, jam, durasiMenit }` (ID dokumen = janjiId)
