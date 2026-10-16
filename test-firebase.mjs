import fs from "fs";

// Baca file .env.local
if (fs.existsSync(".env.local")) {
  const envContent = fs.readFileSync(".env.local", "utf8");
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        process.env[match[1].trim()] = match[2].trim();
      }
    }
  }
}

try {
  const { app, db } = await import("./lib/firebase.js");
  console.log("=========================================");
  console.log("  Firebase Berhasil Diinisialisasi!");
  console.log("  Project ID :", app.options.projectId);
  console.log("  Auth Domain:", app.options.authDomain);
  console.log("  Firestore  :", db ? "Siap Digunakan" : "Belum Aktif");
  console.log("=========================================");
} catch (err) {
  console.error("Gagal inisialisasi Firebase:", err);
}
