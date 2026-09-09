import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import prisma from "@/lib/db";

export const metadata: Metadata = {
  title: "Gacks Leads | Find High-Value Local Businesses Without Websites",
  description: "B2B lead generation radar querying Google Places, Yelp, and OSM for local businesses without websites.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let pipelineCount = 0;
  try {
    pipelineCount = await prisma.lead.count();
  } catch (e) {
    // ignore if table not created yet
  }

  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white">
        <Navbar pipelineCount={pipelineCount} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} Gacks Leads • High-Converting B2B Lead Radar</span>
            <div className="flex items-center space-x-4">
              <span>Google Places API</span>
              <span>•</span>
              <span>Yelp Fusion</span>
              <span>•</span>
              <span>OpenStreetMap</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
