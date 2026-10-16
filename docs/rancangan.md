# Dokumen Rancangan: Portal Janji Senyum Rekah
> Disusun berdasarkan **Product Requirements Document (PRD) Aplikasi Janji Temu dan Catatan Perawatan Klinik Gigi Senyum Rekah** (Makassar). Dokumen ini menjadi acuan tunggal untuk matriks hak akses, peta rute, dan penjagaan halaman tanpa menambahkan asumsi di luar spesifikasi PRD.

---

## 1. Matriks Hak Akses (Empat Peran & Pengunjung)

Matriks berikut mendefinisikan secara rinci halaman dan tindakan yang diizinkan untuk setiap peran:
- **Pengunjung**: Belum masuk ke sistem.
- **Pasien** (`pasien`): Andi dan Maya.
- **Resepsionis** (`resepsionis`): Laras.
- **Dokter** (`dokter`): drg. Bima dan drg. Sinta.
- **Super Admin** (`super_admin`): Bu Ratna (pemilik klinik).

### 1.1 Tabel Matriks Hak Akses Halaman & Fitur

| No | Modul & Fitur (Subbab PRD) | Pengunjung | Pasien (`pasien`) | Resepsionis (`resepsionis`) | Dokter (`dokter`) | Super Admin (`super_admin`) | Dasar Aturan PRD |
|---|---|:---:|:---:|:---:|:---:|:---:|---|
| 1 | **Pendaftaran Akun** (`/daftar`) | ✓ | ✕ *(dialihkan)* | ✕ *(dialihkan)* | ✕ *(dialihkan)* | ✕ *(dialihkan)* | PRD 2.2, 4.1 |
| 2 | **Masuk Akun / Google** (`/masuk`) | ✓ | ✕ *(dialihkan)* | ✕ *(dialihkan)* | ✕ *(dialihkan)* | ✕ *(dialihkan)* | PRD 2.2, 4.1 |
| 3 | **Beranda Pasien** (`/beranda`) | ✕ | ✓ *(hanya miliknya)* | ✕ *(tidak tampil)* | ✕ *(tidak tampil)* | ✓ *(penuh)* | PRD 2.3, 4.2 |
| 4 | **Daftar Janji Saya** (`/janji`) | ✕ | ✓ *(hanya miliknya)* | ✕ *(tidak tampil)* | ✕ *(tidak tampil)* | ✓ *(penuh)* | PRD 2.3, 4.3.2 |
| 5 | **Buat Janji Baru** (`/janji/baru`) | ✕ | ✓ | ✕ *(tidak tampil)* | ✕ *(tidak tampil)* | ✓ *(penuh)* | PRD 2.3, 4.3.1 |
| 6 | **Rincian Janji Pasien** (`/janji/[id]`) | ✕ | ✓ *(hanya miliknya)* | ✕ *(tidak tampil)* | ✕ *(tidak tampil)* | ✓ *(penuh)* | PRD 2.3, 4.3.2 |
| 7 | **Riwayat Perawatan Pasien** (`/riwayat`) | ✕ | ✓ *(hanya miliknya)* | ✕ *(tidak tampil)* | ✕ *(tidak tampil)* | ✓ *(lihat)* | PRD 2.3, 4.4 |
| 8 | **Profil Pengguna** (`/profil`) | ✕ | ✓ *(milik sendiri)* | ✓ *(milik sendiri)* | ✓ *(milik sendiri)* | ✓ *(milik sendiri)* | PRD 2.3, 4.5 |
| 9 | **Dasbor Resepsionis** (`/resepsionis`) | ✕ | ✕ *(tidak tampil)* | ✓ *(penuh)* | ✕ *(tidak tampil)* | ✓ *(penuh)* | PRD 2.3, 4.6 |
| 10 | **Kelola Janji** (`/resepsionis/janji`) | ✕ | ✕ *(tidak tampil)* | ✓ *(penuh)* | ✕ *(tidak tampil)* | ✓ *(penuh)* | PRD 2.3, 4.7 |
| 11 | **Rincian Janji Resepsionis** (`/resepsionis/janji/[id]`) | ✕ | ✕ *(tidak tampil)* | ✓ *(tanpa catatan medis)* | ✕ *(tidak tampil)* | ✓ *(penuh)* | PRD 2.4, 4.7 |
| 12 | **Data Kontak Pasien** (`/resepsionis/pasien`) | ✕ | ✕ *(tidak tampil)* | ✓ *(lihat kontak)* | ✕ *(tidak tampil)* | ✓ *(lihat)* | PRD 2.3, 2.4, 4.8 |
| 13 | **Dasbor Dokter** (`/dokter`) | ✕ | ✕ *(tidak tampil)* | ✕ *(tidak tampil)* | ✓ *(hanya miliknya)* | ✓ *(penuh)* | PRD 2.3, 4.9 |
| 14 | **Pemeriksaan Dokter** (`/dokter/janji/[id]`) | ✕ | ✕ *(tidak tampil)* | ✕ *(tidak tampil)* | ✓ *(hanya janji miliknya)* | ✓ *(penuh)* | PRD 2.3, 4.10 |
| 15 | **Riwayat Pasien Dokter** (`/dokter/pasien/[id]`) | ✕ | ✕ *(tidak tampil)* | ✕ *(tidak tampil)* | ✓ *(hanya yang ditangani)* | ✓ *(lihat)* | PRD 2.3, 4.11 |
| 16 | **Dasbor Super Admin** (`/admin`) | ✕ | ✕ *(tidak tampil)* | ✕ *(tidak tampil)* | ✕ *(tidak tampil)* | ✓ *(penuh)* | PRD 2.3, 3.1, 4.12 |
| 17 | **Kelola Pengguna** (`/admin/pengguna`) | ✕ | ✕ *(tidak tampil)* | ✕ *(tidak tampil)* | ✕ *(tidak tampil)* | ✓ *(penuh)* | PRD 2.3, 4.13 |
| 18 | **Rincian Pengguna** (`/admin/pengguna/[id]`) | ✕ | ✕ *(tidak tampil)* | ✕ *(tidak tampil)* | ✕ *(tidak tampil)* | ✓ *(penuh)* | PRD 2.3, 4.13 |
| 19 | **Kelola Layanan** (`/admin/layanan`) | ✕ | ✕ *(tidak tampil)* | ✕ *(tidak tampil)* | ✕ *(tidak tampil)* | ✓ *(penuh)* | PRD 2.3, 4.14 |
| 20 | **Kelola Jadwal Dokter** (`/admin/jadwal-dokter`) | ✕ | ✕ *(tidak tampil)* | ✕ *(tidak tampil)* | ✕ *(tidak tampil)* | ✓ *(penuh)* | PRD 2.3, 4.15 |
| 21 | **Laporan Kunjungan** (`/admin/laporan`) | ✕ | ✕ *(tidak tampil)* | ✕ *(tidak tampil)* | ✕ *(tidak tampil)* | ✓ *(penuh)* | PRD 2.3, 4.16 |

---

### 1.2 Rincian Tindakan (Actions) yang Boleh & Tidak Boleh Dilakukan per Peran

#### A. Peran Pasien (`pasien`)
- **Tindakan yang Boleh Diakses:**
  - Melihat kartu janji terdekat di `/beranda`.
  - Melihat daftar seluruh janji miliknya di `/janji` (diurutkan dari tanggal terdekat).
  - Membuat janji temu di `/janji/baru`: memilih layanan aktif, memilih dokter, memilih tanggal praktik dokter (paling cepat H+1), memilih slot kosong per 30 menit, mengisi keluhan, dan mengirim pesanan janji (otomatis berstatus `menunggu`).
  - Melihat rincian janji temu miliknya di `/janji/[id]`.
  - Membatalkan janji temu miliknya secara mandiri di `/janji/[id]` **dengan ketentuan:** hanya untuk status `menunggu` atau `dikonfirmasi`, dan dilakukan paling lambat **H-1**.
  - Melihat riwayat perawatannya di `/riwayat`: membaca tanggal, nama dokter, layanan, tindakan klinis, dan catatan dokter untuk janji yang telah berstatus `selesai` (dari yang terbaru).
  - Memperbarui profil miliknya di `/profil`: mengubah nama lengkap dan nomor HP.
- **Tindakan yang DILARANG (Berdasarkan PRD):**
  - DILARANG melihat janji pasien lain (PRD 2.4).
  - DILARANG melihat kontak (nomor HP/email) pasien lain (PRD 2.4).
  - DILARANG membaca catatan perawatan pasien lain (PRD 2.4).
  - DILARANG melihat slot jam yang sudah terisi oleh pasien lain (hanya slot kosong yang tampil, PRD 1 & 4.3.1).
  - DILARANG membatalkan janji pada hari H atau janji yang sudah berstatus `hadir`, `selesai`, atau `dibatalkan` (PRD 4.3.2).
  - DILARANG mengubah field `role` miliknya sendiri (PRD 2.4, 4.5).
  - DILARANG membuka modul Resepsionis, Dokter, atau Admin (PRD 2.3).

#### B. Peran Resepsionis (`resepsionis`)
- **Tindakan yang Boleh Diakses:**
  - Membuka dasbor di `/resepsionis`: melihat ringkasan janji hari ini per dokter (jam, pasien, layanan, status) dan jumlah janji yang berstatus `menunggu`.
  - Membuka kelola janji di `/resepsionis/janji`: melihat daftar semua janji pasien, menerapkan saringan status dan tanggal, serta mencari pasien.
  - Membuka rincian janji di `/resepsionis/janji/[id]` untuk melakukan 4 tindakan operasional:
    1. **Konfirmasi Janji**: mengubah status dari `menunggu` menjadi `dikonfirmasi` (PRD 4.7).
    2. **Jadwal Ulang**: memilih tanggal baru dan slot kosong baru lalu menyimpan (PRD 4.7).
    3. **Batalkan Janji**: membatalkan janji dengan wajib mengisi alasan pembatalan (`alasanBatal`) sehingga status menjadi `dibatalkan` (PRD 4.7).
    4. **Tandai Hadir**: menandai pasien yang tiba di klinik pada hari H dari status `dikonfirmasi` menjadi `hadir` agar muncul di dasbor dokter (PRD 4.7).
  - Membuka data pasien di `/resepsionis/pasien`: melihat tabel nama, email, nomor HP, dan mencari nama pasien (PRD 4.8).
  - Memperbarui profil miliknya di `/profil`: mengubah nama dan nomor HP.
- **Tindakan yang DILARANG (Berdasarkan PRD):**
  - **DILARANG KERAS membaca catatan perawatan atau rekam medis pasien dari halaman mana pun** (PRD 1, 2.4, 4.7, 4.8). Halaman rincian resepsionis tidak menampilkan tindakan atau catatan dokter.
  - DILARANG menandai Hadir pada janji yang bukan berstatus Dikonfirmasi atau bukan pada hari janji temu (PRD 4.7).
  - DILARANG mengubah janji yang sudah berstatus `selesai` atau `dibatalkan` (PRD 4.7).
  - DILARANG mengubah field `role` (PRD 2.4, 4.5).
  - DILARANG membuka modul Dokter atau Super Admin (PRD 2.3).

#### C. Peran Dokter (`dokter`)
- **Tindakan yang Boleh Diakses:**
  - Membuka dasbor jadwalnya di `/dokter`: melihat daftar janji hari ini khusus yang ditugaskan kepada dirinya (`dokterId` cocok) dengan kolom jam, pasien, layanan, keluhan, status, dan label "Siap diperiksa" pada pasien berstatus `hadir` (PRD 4.9).
  - Membuka lembar pemeriksaan di `/dokter/janji/[id]`: hanya untuk janji miliknya yang berstatus `hadir`, melihat identitas pasien, layanan, keluhan; mengisi formulir `tindakan` dan `catatan`; lalu menandai `selesai` (PRD 4.10).
  - Membuka riwayat pasien di `/dokter/pasien/[id]`: melihat riwayat catatan perawatan pasien yang **pernah ia tangani sendiri** (PRD 4.11).
  - Memperbarui profil miliknya di `/profil`: mengubah nama dan nomor HP.
- **Tindakan yang DILARANG (Berdasarkan PRD):**
  - DILARANG melihat jadwal atau janji milik dokter lain (contoh: drg. Bima tidak boleh melihat janji drg. Sinta, PRD 4.9).
  - DILARANG membuka atau mengisi pemeriksaan janji milik dokter lain (PRD 4.10).
  - DILARANG mengisi pemeriksaan untuk janji yang belum berstatus `hadir` (PRD 4.10).
  - DILARANG membuka riwayat pasien yang belum pernah ia tangani (PRD 4.11).
  - DILARANG mengubah field `role` (PRD 2.4, 4.5).
  - DILARANG membuka modul Resepsionis atau Super Admin (PRD 2.3).

#### D. Peran Super Admin (`super_admin`)
- **Tindakan yang Boleh Diakses:**
  - Membuka seluruh modul dan halaman yang dimiliki oleh Pasien, Resepsionis, dan Dokter (PRD 2.1, 3.1, 4.12).
  - Membuka dasbor admin di `/admin`: melihat kartu Kunjungan Hari Ini, Kunjungan Bulan Ini (jumlah janji selesai), dan Menunggu Konfirmasi (PRD 4.12).
  - Membuka kelola pengguna di `/admin/pengguna`: melihat tabel seluruh pengguna, peran, status akun, dan pencarian nama (PRD 4.13).
  - Membuka rincian pengguna di `/admin/pengguna/[id]`: mengubah peran pengguna lain (`pasien`, `resepsionis`, `dokter`, `super_admin`) dan menonaktifkan akun pengguna lain (PRD 4.13).
  - Mengelola layanan di `/admin/layanan`: melihat layanan, menambah layanan baru (nama, durasi menit kelipatan 30, harga dalam rupiah, status aktif), serta menonaktifkan layanan (layanan yang pernah dipakai tidak dihapus, PRD 4.14).
  - Mengelola jadwal dokter di `/admin/jadwal-dokter`: memilih dokter, menambah hari praktik (Senin sampai Sabtu, jam selesai setelah jam mulai, satu dokter satu jadwal per hari, PRD 4.15).
  - Membaca laporan di `/admin/laporan`: memilih bulan periode, melihat Tabel 1 (jumlah kunjungan per dokter) dan Tabel 2 (jumlah kunjungan per layanan) dihitung dari janji berstatus `selesai` (PRD 4.16).
  - Memperbarui profil miliknya di `/profil`: mengubah nama dan nomor HP.
- **Tindakan yang DILARANG (Berdasarkan PRD):**
  - DILARANG menonaktifkan akun miliknya sendiri (PRD 4.13).
  - DILARANG menurunkan peran akun miliknya sendiri (PRD 4.13).
  - DILARANG mengisi durasi layanan yang bukan kelipatan 30 menit (PRD 4.14).
  - DILARANG mengisi hari praktik di luar Senin sampai Sabtu (PRD 4.15).
  - DILARANG mengisi jam selesai praktik yang mendahului atau sama dengan jam mulai (PRD 4.15).

---

## 2. Peta Rute (Route Map) Aplikasi Persis Sesuai PRD

Seluruh alamat halaman berikut wajib sama persis dengan yang tertulis di PRD Bab 3 dan Bab 4.

| No | Alamat URL Persis | Nama Halaman | Peran yang Boleh Mengakses | Belum Masuk (*Unauthenticated*) | Peran Lain (*Unauthorized*) | Tujuan & Perilaku Halaman Sesuai PRD |
|:--:|---|---|---|---|---|---|
| 1 | `/daftar` | Pendaftaran Pasien Baru | Pengunjung | Halaman terbuka | Dialihkan ke halaman peran masing-masing | Pendaftaran mandiri pasien baru dengan Nama, Email, No HP (08..), Kata Sandi (min 6 kar.), atau tombol Google. Akun otomatis menjadi `pasien` (PRD 4.1). |
| 2 | `/masuk` | Masuk Akun | Pengunjung | Halaman terbuka | Dialihkan ke halaman peran masing-masing | Masuk dengan email & kata sandi atau akun Google. Pengguna diarahkan ke halamannya sesuai peran. Akun nonaktif menampilkan pesan penolakan (PRD 4.1). |
| 3 | `/beranda` | Beranda Pasien | `pasien`, `super_admin` | Dialihkan ke `/masuk` | Tampil "Akses Ditolak" | Menampilkan kartu janji terdekat miliknya (tanggal, jam, dokter, layanan, status) dan tombol cepat Buat Janji (PRD 4.2). |
| 4 | `/janji` | Daftar Janji Saya | `pasien`, `super_admin` | Dialihkan ke `/masuk` | Tampil "Akses Ditolak" | Menampilkan tabel daftar janji milik pasien terurut dari tanggal terdekat, status dalam pil berwarna, dan tautan rincian (PRD 4.3.2). |
| 5 | `/janji/baru` | Form Buat Janji Temu | `pasien`, `super_admin` | Dialihkan ke `/masuk` | Tampil "Akses Ditolak" | Formulir pembuatan janji: pilih layanan aktif, pilih dokter, pilih tanggal praktik (min. H+1), pilih slot kosong per 30 mnt, isi keluhan, lalu simpan (PRD 4.3.1). |
| 6 | `/janji/[id]` | Rincian Janji Pasien | `pasien`, `super_admin` | Dialihkan ke `/masuk` | Tampil "Akses Ditolak" | Menampilkan rincian janji milik pasien. Tombol Batalkan Janji hanya aktif untuk status `menunggu`/`dikonfirmasi` paling lambat H-1 (PRD 4.3.2). |
| 7 | `/riwayat` | Riwayat Perawatan | `pasien`, `super_admin` | Dialihkan ke `/masuk` | Tampil "Akses Ditolak" | Menampilkan riwayat janji berstatus `selesai` milik pasien beserta tindakan medis dan catatan dokter dari yang terbaru (PRD 4.4). |
| 8 | `/profil` | Profil Pengguna | `pasien`, `resepsionis`, `dokter`, `super_admin` | Dialihkan ke `/masuk` | Tidak ada *(semua peran berhak)* | Menampilkan nama, email, no HP, dan peran. Nama dan no HP bisa diubah; email dan peran tidak bisa diubah (PRD 4.5). |
| 9 | `/resepsionis` | Dasbor Resepsionis | `resepsionis`, `super_admin` | Dialihkan ke `/masuk` | Tampil "Akses Ditolak" | Halaman awal resepsionis: kartu janji hari ini per dokter dan kartu jumlah janji menunggu konfirmasi (PRD 4.6). |
| 10 | `/resepsionis/janji` | Kelola Janji | `resepsionis`, `super_admin` | Dialihkan ke `/masuk` | Tampil "Akses Ditolak" | Menampilkan seluruh janji klinik dengan saringan status dan tanggal (tersimpan di URL query), serta pencarian nama (PRD 4.7). |
| 11 | `/resepsionis/janji/[id]` | Rincian Kelola Janji | `resepsionis`, `super_admin` | Dialihkan ke `/masuk` | Tampil "Akses Ditolak" | Aksi resepsionis: Konfirmasi, Jadwal Ulang, Batalkan (wajib isi alasan), dan Tandai Hadir. **Catatan perawatan tidak tampil** (PRD 4.7). |
| 12 | `/resepsionis/pasien` | Data Pasien | `resepsionis`, `super_admin` | Dialihkan ke `/masuk` | Tampil "Akses Ditolak" | Tabel kontak pasien (nama, email, no HP) dengan pencarian nama. Tanpa catatan perawatan (PRD 4.8). |
| 13 | `/dokter` | Dasbor Dokter | `dokter`, `super_admin` | Dialihkan ke `/masuk` | Tampil "Akses Ditolak" | Halaman awal dokter: tabel janji hari ini milik dokter tersebut. Janji `hadir` bertanda "Siap diperiksa" (PRD 4.9). |
| 14 | `/dokter/janji/[id]` | Pemeriksaan Dokter | `dokter`, `super_admin` | Dialihkan ke `/masuk` | Tampil "Akses Ditolak" | Mengisi formulir tindakan dan catatan perawatan untuk janji `hadir` miliknya, lalu menandai `selesai` (PRD 4.10). |
| 15 | `/dokter/pasien/[id]` | Riwayat Pasien Dokter | `dokter`, `super_admin` | Dialihkan ke `/masuk` | Tampil "Akses Ditolak" | Menampilkan catatan perawatan pasien yang pernah ditulis oleh dokter tersebut. Pasien yang belum pernah ditangani ditolak (PRD 4.11). |
| 16 | `/admin` | Dasbor Super Admin | `super_admin` | Dialihkan ke `/masuk` | Tampil "Akses Ditolak" | Ringkasan operasional: kunjungan hari ini, kunjungan bulan ini, dan menunggu konfirmasi. Menu samping memuat seluruh peran lain (PRD 4.12). |
| 17 | `/admin/pengguna` | Kelola Pengguna | `super_admin` | Dialihkan ke `/masuk` | Tampil "Akses Ditolak" | Tabel seluruh akun pengguna, peran, status aktif, dan pencarian nama (PRD 4.13). |
| 18 | `/admin/pengguna/[id]` | Rincian Pengguna | `super_admin` | Dialihkan ke `/masuk` | Tampil "Akses Ditolak" | Mengubah peran pengguna (`pasien`, `resepsionis`, `dokter`, `super_admin`) dan menonaktifkan akun (PRD 4.13). |
| 19 | `/admin/layanan` | Kelola Layanan | `super_admin` | Dialihkan ke `/masuk` | Tampil "Akses Ditolak" | Menambah layanan (nama, durasi kelipatan 30 mnt, harga, aktif) dan menonaktifkan layanan (PRD 4.14). |
| 20 | `/admin/jadwal-dokter` | Jadwal Dokter | `super_admin` | Dialihkan ke `/masuk` | Tampil "Akses Ditolak" | Mengatur hari praktik dokter (Senin-Sabtu), jam mulai, dan jam selesai (PRD 4.15). |
| 21 | `/admin/laporan` | Laporan Kunjungan | `super_admin` | Dialihkan ke `/masuk` | Tampil "Akses Ditolak" | Rekapitulasi bulanan: Tabel 1 (kunjungan per dokter) dan Tabel 2 (kunjungan per layanan) dari janji `selesai` (PRD 4.16). |

---

## 3. Jawaban 4 Keputusan Kunci Wajib (Dengan Rujukan Subbab PRD)

### Keputusan 1: Bolehkah resepsionis membaca catatan perawatan?
- **Jawaban:** **TIDAK BOLEH.**
- **Dasar PRD:**
  - **Bab 1 (Ringkasan Eksekutif):** *"Catatan perawatan tetap rahasia. Resepsionis tidak bisa membacanya, dan dokter hanya membaca catatan pasien yang ia tangani."*
  - **Subbab 2.4 (Yang Tidak Boleh Dilihat Tiap Peran):** Pada baris Catatan perawatan untuk Resepsionis tertulis tegas: *"Tidak tampil"*.
  - **Subbab 4.7 (Kelola Janji):** *"Rincian untuk resepsionis tidak menampilkan catatan perawatan."*
  - **Subbab 4.8 (Data Pasien):** *"Batasan v1: resepsionis tidak bisa membaca catatan perawatan dari halaman mana pun."*

### Keputusan 2: Bolehkah drg. Bima membuka pemeriksaan janji drg. Sinta?
- **Jawaban:** **TIDAK BOLEH.**
- **Dasar PRD:**
  - **Subbab 2.4 (Yang Tidak Boleh Dilihat Tiap Peran):** Janji pasien lain untuk Dokter: *"Hanya janji yang ia tangani"*.
  - **Subbab 4.9 (Dasbor Dokter):** *"Perilaku otomatis: hanya janji dengan dokterId miliknya yang tampil. Janji drg. Sinta tidak terlihat oleh drg. Bima."*
  - **Subbab 4.10 (Pemeriksaan):** *"Validasi: hanya janji milik dokter itu yang berstatus Hadir yang bisa diisi. Bila ID diganti dengan janji dokter lain, tampil 'Janji tidak ditemukan'."*

### Keputusan 3: Bolehkah pasien melihat jam yang sudah terisi pasien lain?
- **Jawaban:** **TIDAK BOLEH.** Pasien hanya diizinkan melihat slot jam yang **masih kosong**.
- **Dasar PRD:**
  - **Bab 1 (Ringkasan Eksekutif):** *"Janji tidak bentrok lagi. Pasien hanya bisa memilih slot jam yang masih kosong."*
  - **Subbab 4.3.1 (Buat Janji):** *"Sistem menampilkan slot jam yang masih kosong... Slot yang bertabrakan dengan janji lain dokter itu yang belum dibatalkan tidak ditampilkan... tanpa nama atau keluhan pasien."*

### Keputusan 4: Halaman mana saja yang boleh dibuka Bu Ratna?
- **Jawaban:** **SEMUA HALAMAN** dalam aplikasi. Bu Ratna adalah pemegang akun tunggal `super_admin`.
- **Dasar PRD:**
  - **Subbab 2.1 (Empat Pemegang Akun):** *"Super Admin: Bu Ratna, pemilik klinik. Tugas utama: Semua hak tiga peran lain, ditambah mengelola pengguna, layanan, jadwal dokter, dan laporan."*
  - **Subbab 2.3 (Hak Akses per Modul):** Kolom Super Admin bernilai *"Penuh"* atau *"Lihat"* di seluruh modul aplikasi.
  - **Subbab 3.1 & 4.12:** *"Super Admin (semua menu peran lain, ditambah) Dasbor Admin, Kelola Pengguna, Layanan, Jadwal Dokter, Laporan. Menu samping Super Admin juga memuat semua menu peran lain."*

---

## 4. Status Verifikasi & Catatan Konfirmasi (Tanpa Asumsi)

Seluruh rancangan di atas disusun secara ketat berdasarkan PRD tanpa ada penambahan fitur dari asumsi pribadi. Berikut poin-poin penegasan batasan sesuai **Bab 9 PRD (Batas Lingkup Pekerjaan v1)**:

1. **Pembayaran & Kasir Online**: Tidak dibangun pada v1. Pembayaran tetap dilakukan langsung di meja kasir/resepsionis klinik.
2. **Notifikasi WhatsApp / Email**: Tidak ada integrasi gateway pengiriman pesan berbayar pada v1. Pasien dan resepsionis memantau perubahan status langsung di aplikasi.
3. **Rekam Medis Lengkap & Odontogram**: Pada v1 tidak ada odontogram grafis. Catatan perawatan klinik dibatasi pada formulir teks `tindakan` dan `catatan`.
4. **Lupa Kata Sandi (*Forgot Password*)**: Sesuai PRD 4.1, alur lupa kata sandi tidak termasuk dalam batas v1.
5. **Ekspor File (Excel/PDF) & Laporan Keuangan**: Sesuai PRD 4.16, laporan hanya menampilkan tabel frekuensi kunjungan pasien (per dokter dan per layanan). Tidak ada ekspor Excel/PDF maupun kalkulasi omzet uang.
6. **Penanganan Halaman Tidak Ditemukan**: Sesuai PRD 6.3, setiap alamat URL yang tidak dikenal menampilkan halaman 404 ramah pengguna dengan tombol kembali tanpa kode teknis.
