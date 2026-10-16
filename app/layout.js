import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Portal Janji Senyum Rekah - Klinik Gigi Makassar",
  description: "Aplikasi Janji Temu dan Catatan Perawatan Klinik Gigi Senyum Rekah Makassar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-[#F4F7F9] text-[#1F2937]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
