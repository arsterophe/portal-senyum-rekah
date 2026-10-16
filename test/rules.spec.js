const {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} = require("@firebase/rules-unit-testing");
const { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, addDoc } = require("firebase/firestore");
const fs = require("fs");
const path = require("path");

const PROJECT_ID = "demo-portal-senyum-rekah";

describe("Pengujian Otomatis Firestore Security Rules (Draft)", function () {
  this.timeout(60000);

  let testEnv;

  before(async function () {
    this.timeout(60000);
    // Hindari discovery hub emulator yang menyebabkan network timeout 20-40 detik di Windows
    delete process.env.FIREBASE_EMULATOR_HUB;

    // Membaca aturan draft yang terisolasi tanpa menyentuh rules produksi
    const rulesPath = path.resolve(__dirname, "../firestore.rules.draft");
    const rules = fs.readFileSync(rulesPath, "utf8");

    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules: rules,
        host: "127.0.0.1",
        port: 8080,
      },
    });
  });

  after(async function () {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  beforeEach(async function () {
    await testEnv.clearFirestore();

    // Seed data pengujian terisolasi menggunakan hak istimewa admin (bypassing rules)
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();

      // 1. Super Admin Aktif (Bu Ratna)
      await setDoc(doc(db, "users", "usr_superadmin"), {
        nama: "Bu Ratna",
        email: "ratna@senyumrekah.id",
        noHp: "081234567890",
        role: "super_admin",
        aktif: true,
        dibuatPada: "2026-10-15T10:00:00.000Z",
      });

      // 2. Pasien Aktif (Andi)
      await setDoc(doc(db, "users", "usr_pasien_aktif"), {
        nama: "Andi Wijaya",
        email: "andi@example.com",
        noHp: "081298765432",
        role: "pasien",
        aktif: true,
        dibuatPada: "2026-10-15T11:00:00.000Z",
      });

      // 3. Pasien Nonaktif (Akun Terblokir)
      await setDoc(doc(db, "users", "usr_pasien_nonaktif"), {
        nama: "Budi Nonaktif",
        email: "budi@example.com",
        noHp: "081211112222",
        role: "pasien",
        aktif: false,
        dibuatPada: "2026-10-15T11:30:00.000Z",
      });

      // 4. Dokter Aktif (drg. Siti Aminah)
      await setDoc(doc(db, "users", "usr_dokter_aktif"), {
        nama: "drg. Siti Aminah",
        email: "siti@senyumrekah.id",
        noHp: "081233445566",
        role: "dokter",
        aktif: true,
        dibuatPada: "2026-10-15T08:00:00.000Z",
      });

      // 5. Dokter Nonaktif (drg. Anton)
      await setDoc(doc(db, "users", "usr_dokter_nonaktif"), {
        nama: "drg. Anton Nonaktif",
        email: "anton@senyumrekah.id",
        noHp: "081277889900",
        role: "dokter",
        aktif: false,
        dibuatPada: "2026-10-15T08:30:00.000Z",
      });

      // 6. Resepsionis Aktif (Rina)
      await setDoc(doc(db, "users", "usr_resepsionis_aktif"), {
        nama: "Rina Resepsionis",
        email: "rina@senyumrekah.id",
        noHp: "081255667788",
        role: "resepsionis",
        aktif: true,
        dibuatPada: "2026-10-15T08:15:00.000Z",
      });

      // 7. Layanan Aktif
      await setDoc(doc(db, "layanan", "lay_scaling"), {
        nama: "Pembersihan Karang Gigi",
        durasiMenit: 30,
        harga: 250000,
        aktif: true,
        dibuatPada: "2026-10-15T09:00:00.000Z",
      });

      // 8. Layanan Nonaktif
      await setDoc(doc(db, "layanan", "lay_nonaktif"), {
        nama: "Layanan Lama Nonaktif",
        durasiMenit: 60,
        harga: 500000,
        aktif: false,
        dibuatPada: "2026-10-15T09:00:00.000Z",
      });
    });
  });

  // =========================================================================
  // KELOMPOK 1: REGISTRASI & PENGELOLAAN PROFIL OLEH PASIEN
  // =========================================================================

  it("1. Registrasi Pasien yang valid harus DIIZINKAN (create dengan role pasien & aktif true)", async function () {
    const unauthDb = testEnv.authenticatedContext("usr_baru_123").firestore();
    const newDoc = doc(unauthDb, "users", "usr_baru_123");

    await assertSucceeds(
      setDoc(newDoc, {
        nama: "Maya Sari",
        email: "maya@example.com",
        noHp: "081233334444",
        role: "pasien",
        aktif: true,
        dibuatPada: "2026-10-15T12:00:00.000Z",
      })
    );
  });

  it("2. Registrasi yang mencoba memakai role 'super_admin' harus DITOLAK", async function () {
    const fakeAdminDb = testEnv.authenticatedContext("usr_hacker").firestore();
    const newDoc = doc(fakeAdminDb, "users", "usr_hacker");

    await assertFails(
      setDoc(newDoc, {
        nama: "Hacker Role",
        email: "hacker@example.com",
        noHp: "081299998888",
        role: "super_admin",
        aktif: true,
        dibuatPada: "2026-10-15T12:00:00.000Z",
      })
    );
  });

  it("3. Pasien membaca daftar seluruh users (users.list()) harus DITOLAK", async function () {
    const pasienDb = testEnv.authenticatedContext("usr_pasien_aktif").firestore();
    const usersCol = collection(pasienDb, "users");

    await assertFails(getDocs(usersCol));
  });

  it("4. Pasien mencoba mengubah role miliknya sendiri ke 'super_admin' harus DITOLAK", async function () {
    const pasienDb = testEnv.authenticatedContext("usr_pasien_aktif").firestore();
    const myDoc = doc(pasienDb, "users", "usr_pasien_aktif");

    await assertFails(updateDoc(myDoc, { role: "super_admin" }));
  });

  it("5. Pasien aktif memperbarui nama dan noHp miliknya sendiri harus DIIZINKAN", async function () {
    const pasienDb = testEnv.authenticatedContext("usr_pasien_aktif").firestore();
    const myDoc = doc(pasienDb, "users", "usr_pasien_aktif");

    await assertSucceeds(
      updateDoc(myDoc, {
        nama: "Andi Wijaya Terupdate",
        noHp: "081298765999",
      })
    );
  });

  // =========================================================================
  // KELOMPOK 2: AKSES LAYANAN OLEH PASIEN & PASIEN NONAKTIF
  // =========================================================================

  it("6. Pasien aktif membaca layanan AKTIF harus DIIZINKAN", async function () {
    const pasienDb = testEnv.authenticatedContext("usr_pasien_aktif").firestore();
    
    // get layanan aktif
    const layRef = doc(pasienDb, "layanan", "lay_scaling");
    await assertSucceeds(getDoc(layRef));

    // query list layanan aktif dengan where('aktif', '==', true)
    const q = query(collection(pasienDb, "layanan"), where("aktif", "==", true));
    await assertSucceeds(getDocs(q));
  });

  it("7. Pasien aktif membaca layanan NONAKTIF harus DITOLAK", async function () {
    const pasienDb = testEnv.authenticatedContext("usr_pasien_aktif").firestore();
    const layRef = doc(pasienDb, "layanan", "lay_nonaktif");

    await assertFails(getDoc(layRef));
  });

  it("8. Pasien aktif mencoba membaca seluruh layanan tanpa filter aktif harus DITOLAK", async function () {
    const pasienDb = testEnv.authenticatedContext("usr_pasien_aktif").firestore();
    const layCol = collection(pasienDb, "layanan");

    await assertFails(getDocs(layCol));
  });

  it("9. Pasien mencoba menambah layanan baru ke koleksi layanan harus DITOLAK", async function () {
    const pasienDb = testEnv.authenticatedContext("usr_pasien_aktif").firestore();
    const layCol = collection(pasienDb, "layanan");

    await assertFails(
      addDoc(layCol, {
        nama: "Layanan Liar",
        durasiMenit: 30,
        harga: 100000,
        aktif: true,
        dibuatPada: "2026-10-15T12:00:00.000Z",
      })
    );
  });

  it("10. Pasien NONAKTIF membaca layanan aktif harus DITOLAK (isActiveUser false)", async function () {
    const nonaktifDb = testEnv.authenticatedContext("usr_pasien_nonaktif").firestore();
    const layRef = doc(nonaktifDb, "layanan", "lay_scaling");

    await assertFails(getDoc(layRef));
  });

  // =========================================================================
  // KELOMPOK 3: HAK AKSES SUPER ADMIN AKTIF
  // =========================================================================

  it("11. Super Admin aktif membaca daftar seluruh users harus DIIZINKAN", async function () {
    const adminDb = testEnv.authenticatedContext("usr_superadmin").firestore();
    const usersCol = collection(adminDb, "users");

    await assertSucceeds(getDocs(usersCol));
  });

  it("12. Super Admin aktif mengubah role pengguna lain menjadi 'dokter' harus DIIZINKAN", async function () {
    const adminDb = testEnv.authenticatedContext("usr_superadmin").firestore();
    const targetDoc = doc(adminDb, "users", "usr_pasien_aktif");

    await assertSucceeds(updateDoc(targetDoc, { role: "dokter" }));
  });

  it("13. Super Admin aktif menonaktifkan akun pengguna lain harus DIIZINKAN", async function () {
    const adminDb = testEnv.authenticatedContext("usr_superadmin").firestore();
    const targetDoc = doc(adminDb, "users", "usr_pasien_aktif");

    await assertSucceeds(updateDoc(targetDoc, { aktif: false }));
  });

  it("14. Super Admin mencoba menurunkan role akunnya sendiri harus DITOLAK (PRD 4.13)", async function () {
    const adminDb = testEnv.authenticatedContext("usr_superadmin").firestore();
    const myDoc = doc(adminDb, "users", "usr_superadmin");

    await assertFails(updateDoc(myDoc, { role: "pasien" }));
  });

  it("15. Super Admin mencoba menonaktifkan akunnya sendiri harus DITOLAK (PRD 4.13)", async function () {
    const adminDb = testEnv.authenticatedContext("usr_superadmin").firestore();
    const myDoc = doc(adminDb, "users", "usr_superadmin");

    await assertFails(updateDoc(myDoc, { aktif: false }));
  });

  it("16. Super Admin aktif menambah layanan baru kelipatan 30 menit harus DIIZINKAN", async function () {
    const adminDb = testEnv.authenticatedContext("usr_superadmin").firestore();
    const layCol = collection(adminDb, "layanan");

    await assertSucceeds(
      addDoc(layCol, {
        nama: "Penambalan Komposit",
        durasiMenit: 60,
        harga: 350000,
        aktif: true,
        dibuatPada: "2026-10-15T12:00:00.000Z",
      })
    );
  });

  it("17. Super Admin mencoba menambah layanan dengan durasi bukan kelipatan 30 menit harus DITOLAK", async function () {
    const adminDb = testEnv.authenticatedContext("usr_superadmin").firestore();
    const layCol = collection(adminDb, "layanan");

    await assertFails(
      addDoc(layCol, {
        nama: "Durasi Salah",
        durasiMenit: 45,
        harga: 350000,
        aktif: true,
        dibuatPada: "2026-10-15T12:00:00.000Z",
      })
    );
  });

  it("18. Super Admin aktif mengubah status layanan menjadi nonaktif harus DIIZINKAN", async function () {
    const adminDb = testEnv.authenticatedContext("usr_superadmin").firestore();
    const layDoc = doc(adminDb, "layanan", "lay_scaling");

    await assertSucceeds(updateDoc(layDoc, { aktif: false }));
  });

  // =========================================================================
  // KELOMPOK 4: PENGUNJUNG TANPA LOGIN
  // =========================================================================

  it("19. Pengunjung tanpa login membaca layanan harus DITOLAK", async function () {
    const unauthDb = testEnv.unauthenticatedContext().firestore();
    const layRef = doc(unauthDb, "layanan", "lay_scaling");

    await assertFails(getDoc(layRef));
  });

  it("20. Pengunjung tanpa login membaca data pengguna harus DITOLAK", async function () {
    const unauthDb = testEnv.unauthenticatedContext().firestore();
    const userRef = doc(unauthDb, "users", "usr_pasien_aktif");

    await assertFails(getDoc(userRef));
  });

  // =========================================================================
  // KELOMPOK 5: HAK AKSES STAF KLINIK (DOKTER & RESEPSIONIS - PRD 2.3 & 4.8)
  // =========================================================================

  it("21. Dokter aktif membaca profil pasien harus DIIZINKAN (PRD 2.3 & 4.10)", async function () {
    const dokterDb = testEnv.authenticatedContext("usr_dokter_aktif").firestore();
    const pasienRef = doc(dokterDb, "users", "usr_pasien_aktif");

    await assertSucceeds(getDoc(pasienRef));
  });

  it("22. Resepsionis aktif membaca profil pasien harus DIIZINKAN (PRD 4.8)", async function () {
    const resepsionisDb = testEnv.authenticatedContext("usr_resepsionis_aktif").firestore();
    const pasienRef = doc(resepsionisDb, "users", "usr_pasien_aktif");

    await assertSucceeds(getDoc(pasienRef));
  });

  it("23. Resepsionis aktif membaca daftar pasien dengan query role == 'pasien' harus DIIZINKAN (PRD 4.8 Buku Kontak)", async function () {
    const resepsionisDb = testEnv.authenticatedContext("usr_resepsionis_aktif").firestore();
    const q = query(collection(resepsionisDb, "users"), where("role", "==", "pasien"));

    await assertSucceeds(getDocs(q));
  });

  it("24. Resepsionis aktif mencoba membaca seluruh pengguna tanpa filter harus DITOLAK (hanya Super Admin)", async function () {
    const resepsionisDb = testEnv.authenticatedContext("usr_resepsionis_aktif").firestore();
    const usersCol = collection(resepsionisDb, "users");

    await assertFails(getDocs(usersCol));
  });

  it("25. Dokter nonaktif membaca profil pasien harus DITOLAK (isActiveUser false)", async function () {
    const dokterNonaktifDb = testEnv.authenticatedContext("usr_dokter_nonaktif").firestore();
    const pasienRef = doc(dokterNonaktifDb, "users", "usr_pasien_aktif");

    await assertFails(getDoc(pasienRef));
  });

  it("26. Dokter aktif membaca profil Super Admin harus DITOLAK (privasi terlindungi)", async function () {
    const dokterDb = testEnv.authenticatedContext("usr_dokter_aktif").firestore();
    const adminRef = doc(dokterDb, "users", "usr_superadmin");

    await assertFails(getDoc(adminRef));
  });

  // =========================================================================
  // KELOMPOK 6: AKSES DIREKTORI DOKTER OLEH PASIEN & INTEGRITAS AKUN NONAKTIF
  // =========================================================================

  it("27. Pasien aktif membaca profil dokter aktif harus DIIZINKAN (PRD 4.3.1 pemilihan dokter)", async function () {
    const pasienDb = testEnv.authenticatedContext("usr_pasien_aktif").firestore();
    const dokterRef = doc(pasienDb, "users", "usr_dokter_aktif");

    await assertSucceeds(getDoc(dokterRef));
  });

  it("28. Pasien aktif membaca daftar dokter dengan query role == 'dokter' harus DIIZINKAN", async function () {
    const pasienDb = testEnv.authenticatedContext("usr_pasien_aktif").firestore();
    const q = query(collection(pasienDb, "users"), where("role", "==", "dokter"));

    await assertSucceeds(getDocs(q));
  });

  it("29. Pasien aktif mencoba membaca profil pasien lain harus DITOLAK (privasi pasien)", async function () {
    const pasienDb = testEnv.authenticatedContext("usr_pasien_aktif").firestore();
    const otherPatientRef = doc(pasienDb, "users", "usr_pasien_nonaktif");

    await assertFails(getDoc(otherPatientRef));
  });

  it("30. Pasien nonaktif mencoba memperbarui profil akunnya sendiri harus DITOLAK (isActiveUser false)", async function () {
    const nonaktifDb = testEnv.authenticatedContext("usr_pasien_nonaktif").firestore();
    const myDoc = doc(nonaktifDb, "users", "usr_pasien_nonaktif");

    await assertFails(updateDoc(myDoc, { nama: "Upaya Ubah Nama" }));
  });

  // =========================================================================
  // KELOMPOK 7: INTEGRITAS UPDATE LAYANAN OLEH SUPER ADMIN (PRIORITAS 1)
  // =========================================================================

  it("31. Super Admin mencoba update layanan dengan menyuntikkan field asing ('diskon') harus DITOLAK", async function () {
    const adminDb = testEnv.authenticatedContext("usr_superadmin").firestore();
    const layDoc = doc(adminDb, "layanan", "lay_scaling");

    await assertFails(updateDoc(layDoc, { diskon: 50 }));
  });

  it("32. Super Admin mencoba update layanan dengan mengubah dibuatPada harus DITOLAK", async function () {
    const adminDb = testEnv.authenticatedContext("usr_superadmin").firestore();
    const layDoc = doc(adminDb, "layanan", "lay_scaling");

    await assertFails(updateDoc(layDoc, { dibuatPada: "2099-01-01T00:00:00.000Z" }));
  });

  it("33. Super Admin aktif mengubah tarif harga layanan dengan field sah harus DIIZINKAN", async function () {
    const adminDb = testEnv.authenticatedContext("usr_superadmin").firestore();
    const layDoc = doc(adminDb, "layanan", "lay_scaling");

    await assertSucceeds(updateDoc(layDoc, { harga: 300000 }));
  });
});
