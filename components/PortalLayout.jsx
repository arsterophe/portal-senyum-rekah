"use client";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import RouteGuard from "./RouteGuard";

export default function PortalLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F4F7F9] flex flex-col text-[#1F2937]">
      <Navbar />
      <RouteGuard>
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <Sidebar />
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </RouteGuard>
    </div>
  );
}
