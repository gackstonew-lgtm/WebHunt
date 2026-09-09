import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Gacks Leads | Worldwide Local Businesses & Remote Job Radar",
  description: "Find local businesses without websites across Kenya & worldwide + discover remote tech opportunities via public APIs.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} Gacks Leads • Worldwide B2B & Remote Tech Discovery</span>
            <div className="flex items-center space-x-3 text-slate-400">
              <span>OpenStreetMap Overpass</span>
              <span>•</span>
              <span>Remotive API</span>
              <span>•</span>
              <span>Arbeitnow API</span>
              <span>•</span>
              <span>Google Places</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
