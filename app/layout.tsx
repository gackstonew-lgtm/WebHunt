import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import PwaRegister from "@/components/pwa/PwaRegister";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "WebHunt | Worldwide Local Businesses & Remote Job Radar",
  description: "Find local businesses without websites across Kenya & worldwide + discover remote tech opportunities via public APIs.",
  manifest: "/manifest.json",
  applicationName: "WebHunt",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WebHunt",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#000000] text-[#F6F4F1] min-h-screen flex flex-col antialiased selection:bg-[#F95C4B] selection:text-white">
        <PwaRegister />
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-[rgba(228,222,210,0.12)] bg-[#000000] py-6 text-center text-xs text-[#A8A196]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} WebHunt • Worldwide B2B & Remote Tech Discovery</span>
            <div className="flex items-center space-x-3 text-[#A8A196]">
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
