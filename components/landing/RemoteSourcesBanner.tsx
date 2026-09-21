"use client";

import React from "react";

// Crisp, authentic SVG/HTML logo icons for the 30 remote job marketplace platforms
function ProviderLogoIcon({ id }: { id: string }) {
  switch (id) {
    // 1. Remote OK
    case "remoteok":
      return (
        <div className="w-8 h-8 rounded-full bg-[#000000] border border-white/20 flex items-center justify-center shrink-0 shadow-xs">
          <span className="font-mono text-white text-[10px] font-extrabold tracking-tight">r|OK</span>
        </div>
      );

    // 2. Working Nomads
    case "workingnomads":
      return (
        <div className="w-8 h-8 rounded-full bg-[#06B6D4] border border-cyan-400/30 flex items-center justify-center shrink-0 shadow-xs">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M7 13l3-3 4 4 3-3" />
          </svg>
        </div>
      );

    // 3. PowerToFly
    case "powertofly":
      return (
        <div className="w-8 h-8 rounded-full bg-[#18181B] border border-zinc-700 flex items-center justify-center shrink-0 shadow-xs">
          <span className="font-sans text-white text-xs font-black tracking-tight">P</span>
        </div>
      );

    // 4. Fiverr
    case "fiverr":
      return (
        <div className="w-8 h-8 rounded-full bg-[#1DBF73] border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-xs">
          <span className="font-sans text-white text-[8.5px] font-black tracking-tighter">fiverr<span className="text-emerald-200">.</span></span>
        </div>
      );

    // 5. Designhill
    case "designhill":
      return (
        <div className="w-8 h-8 rounded-full bg-[#0F172A] border border-slate-700 flex flex-col items-center justify-center shrink-0 shadow-xs">
          <span className="font-sans text-amber-400 text-[10px] font-black leading-none">dh</span>
          <span className="font-sans text-cyan-400 text-[6px] font-bold tracking-tighter scale-90">designhill</span>
        </div>
      );

    // 6. Behance
    case "behance":
      return (
        <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-black/20 flex items-center justify-center shrink-0 shadow-xs">
          <span className="font-sans text-black text-[10px] font-black">Bē</span>
        </div>
      );

    // 7. Toptal
    case "toptal":
      return (
        <div className="w-8 h-8 rounded-full bg-[#2563EB] border border-blue-400/30 flex items-center justify-center shrink-0 shadow-xs">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 6l6 6-6 6M13 6l6 6-6 6" />
          </svg>
        </div>
      );

    // 8. Freelancer.com
    case "freelancer":
      return (
        <div className="w-8 h-8 rounded-full bg-[#0F172A] border border-slate-700 flex items-center justify-center shrink-0 shadow-xs">
          <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4 10l8 2 8-2-8-8zm-6 9.5l6 1.5 6-1.5L12 22 6 11.5z" />
          </svg>
        </div>
      );

    // 9. Freelancermap
    case "freelancermap":
      return (
        <div className="w-8 h-8 rounded-full bg-[#18181B] border border-zinc-700 flex items-center justify-center shrink-0 shadow-xs">
          <span className="font-sans text-white text-[11px] font-black tracking-tight">f/</span>
        </div>
      );

    // 10. Gun.io
    case "gunio":
      return (
        <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-black/20 flex items-center justify-center shrink-0 shadow-xs">
          <svg className="w-4 h-4 text-zinc-900" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 10c0-1.1.9-2 2-2h12a2 2 0 012 2v1H4v-1zm18 3H2v-1h20v1zm-15 2h4v3H7v-3zm6 0h4v3h-4v-3z" />
          </svg>
        </div>
      );

    // 11. Career Vault
    case "careervault":
      return (
        <div className="w-8 h-8 rounded-full bg-[#000000] border border-amber-500/30 flex items-center justify-center shrink-0 shadow-xs">
          <span className="font-sans text-amber-400 text-xs font-black tracking-tight">CV</span>
        </div>
      );

    // 12. Authentic Jobs
    case "authenticjobs":
      return (
        <div className="w-8 h-8 rounded-full bg-[#0F172A] border border-slate-700 flex items-center justify-center shrink-0 shadow-xs">
          <div className="flex items-center space-x-0.5">
            <span className="font-serif italic text-white text-[8px] font-bold">Authentic</span>
            <span className="w-1 h-1 rounded-full bg-cyan-400 inline-block" />
          </div>
        </div>
      );

    // 13. Wellfound
    case "wellfound":
      return (
        <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-dashed border-black/40 flex items-center justify-center shrink-0 shadow-xs">
          <div className="flex items-center">
            <span className="font-sans text-black text-[10px] font-black">W</span>
            <span className="font-sans text-red-500 text-[10px] font-black">:</span>
          </div>
        </div>
      );

    // 14. The Muse
    case "themuse":
      return (
        <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-black/20 flex items-center justify-center shrink-0 shadow-xs">
          <div className="border border-black px-0.5 py-0.2 rounded-xs">
            <span className="font-mono text-black text-[7px] font-black tracking-tighter">MUSE</span>
          </div>
        </div>
      );

    // 15. Indeed
    case "indeed":
      return (
        <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-blue-900/20 flex items-center justify-center shrink-0 shadow-xs">
          <svg className="w-4 h-4 text-[#003A9B]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4a2 2 0 100 4 2 2 0 000-4zm-2 6h4v10h-4V10z" />
          </svg>
        </div>
      );

    // 16. LinkedIn
    case "linkedin":
      return (
        <div className="w-8 h-8 rounded-full bg-[#0A66C2] border border-blue-400/30 flex items-center justify-center shrink-0 shadow-xs">
          <span className="font-sans text-white text-[11px] font-black tracking-tight">in</span>
        </div>
      );

    // 17. CareerBuilder
    case "careerbuilder":
      return (
        <div className="w-8 h-8 rounded-full bg-[#0D9488] border border-teal-400/30 flex items-center justify-center shrink-0 shadow-xs">
          <span className="font-sans text-zinc-950 text-[10px] font-black tracking-tighter">CB</span>
        </div>
      );

    // 18. JustRemote
    case "justremote":
      return (
        <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-emerald-600/30 flex items-center justify-center shrink-0 shadow-xs">
          <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 5v10m-5-7v4m10-4v4" />
          </svg>
        </div>
      );

    // 19. FlexJobs
    case "flexjobs":
      return (
        <div className="w-8 h-8 rounded-full bg-[#0284C7] border border-sky-400/40 flex items-center justify-center shrink-0 shadow-xs">
          <span className="font-sans text-white text-[10px] font-black tracking-tighter">fj</span>
        </div>
      );

    // 20. Virtual Vocations
    case "virtualvocations":
      return (
        <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border-2 border-orange-500/40 flex items-center justify-center shrink-0 shadow-xs">
          <span className="font-sans text-orange-600 text-xs font-black">V</span>
        </div>
      );

    // 21. Dribbble
    case "dribbble":
      return (
        <div className="w-8 h-8 rounded-full bg-[#EA4C89] border border-pink-400/30 flex items-center justify-center shrink-0 shadow-xs">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3a13 13 0 014 9M3.5 9.5c4 0 9 2 11.5 7.5M6 19.5c3.5-3.5 8-4.5 14.5-3" />
          </svg>
        </div>
      );

    // 22. Landing.jobs
    case "landingjobs":
      return (
        <div className="w-8 h-8 rounded-full bg-[#000000] border border-white/20 flex items-center justify-center shrink-0 shadow-xs">
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 inline-block" />
          </div>
        </div>
      );

    // 23. Upwork
    case "upwork":
      return (
        <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-emerald-600/30 flex items-center justify-center shrink-0 shadow-xs">
          <span className="font-sans text-[#14A800] text-[8px] font-black tracking-tighter">upwork</span>
        </div>
      );

    // 24. SkipTheDrive
    case "skipthedrive":
      return (
        <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-blue-600/30 flex items-center justify-center shrink-0 shadow-xs">
          <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M7 17a5 5 0 010-10 5 5 0 015 5 5 5 0 005 5 5 5 0 000-10" />
          </svg>
        </div>
      );

    // 25. Remotive
    case "remotive":
      return (
        <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-orange-500/30 flex items-center justify-center shrink-0 shadow-xs">
          <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3a9 9 0 00-9 9v3a3 3 0 003 3h1v-6H5v-0a7 7 0 1114 0v0h-2v6h1a3 3 0 003-3v-3a9 9 0 00-9-9z" />
          </svg>
        </div>
      );

    // 26. We Work Remotely
    case "weworkremotely":
      return (
        <div className="w-8 h-8 rounded-full bg-[#000000] border border-white/20 flex items-center justify-center shrink-0 shadow-xs">
          <div className="flex items-start">
            <span className="font-sans text-white text-[9px] font-black tracking-tighter">WWR</span>
            <span className="text-red-500 text-[8px] font-bold leading-none">°</span>
          </div>
        </div>
      );

    // 27. ARC
    case "arc":
      return (
        <div className="w-8 h-8 rounded-full bg-[#000000] border border-white/20 flex items-center justify-center shrink-0 shadow-xs">
          <span className="font-mono text-white text-[9px] font-bold tracking-tight">arc()</span>
        </div>
      );

    // 28. Jobspresso
    case "jobspresso":
      return (
        <div className="w-8 h-8 rounded-full bg-[#EA580C] border border-orange-400/30 flex items-center justify-center shrink-0 shadow-xs">
          <span className="font-serif italic text-white text-xs font-black">J</span>
        </div>
      );

    // 29. Remote.co
    case "remoteco":
      return (
        <div className="w-8 h-8 rounded-full bg-[#1E293B] border border-slate-700 flex flex-col items-center justify-center shrink-0 shadow-xs">
          <span className="font-sans text-white text-xs font-black leading-none">R</span>
          <span className="w-3 h-0.5 bg-cyan-400 rounded-full mt-0.5" />
        </div>
      );

    // 30. Pangian
    case "pangian":
      return (
        <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-black/20 flex items-center justify-center shrink-0 shadow-xs">
          <div className="flex flex-col items-center">
            <svg className="w-2.5 h-2.5 text-zinc-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" />
            </svg>
            <span className="font-sans text-black text-[5px] font-black tracking-tight scale-90">PANGIAN</span>
          </div>
        </div>
      );

    default:
      return (
        <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-muted-foreground">?</span>
        </div>
      );
  }
}

// 30 Verified Remote Job Marketplace Platforms
const VERIFIED_PROVIDERS = [
  // Column 1
  { id: "remoteok", name: "Remote OK" },
  { id: "workingnomads", name: "Working Nomads" },
  { id: "powertofly", name: "PowerToFly" },
  { id: "fiverr", name: "Fiverr" },
  { id: "designhill", name: "Designhill" },
  { id: "behance", name: "Behance" },
  { id: "toptal", name: "Toptal" },
  { id: "freelancer", name: "Freelancer.com" },
  { id: "freelancermap", name: "Freelancermap" },
  { id: "gunio", name: "Gun.io" },

  // Column 2
  { id: "careervault", name: "Career Vault" },
  { id: "authenticjobs", name: "Authentic Jobs" },
  { id: "wellfound", name: "Wellfound" },
  { id: "themuse", name: "The Muse" },
  { id: "indeed", name: "Indeed" },
  { id: "linkedin", name: "LinkedIn" },
  { id: "careerbuilder", name: "CareerBuilder" },
  { id: "justremote", name: "JustRemote" },
  { id: "flexjobs", name: "FlexJobs" },
  { id: "virtualvocations", name: "Virtual Vocations" },

  // Column 3
  { id: "dribbble", name: "Dribbble" },
  { id: "landingjobs", name: "Landing.jobs" },
  { id: "upwork", name: "Upwork" },
  { id: "skipthedrive", name: "SkipTheDrive" },
  { id: "remotive", name: "Remotive" },
  { id: "weworkremotely", name: "We Work Remotely" },
  { id: "arc", name: "ARC" },
  { id: "jobspresso", name: "Jobspresso" },
  { id: "remoteco", name: "Remote.co" },
  { id: "pangian", name: "Pangian" },
];

export default function RemoteSourcesBanner() {
  return (
    <div 
      className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-6 py-2.5 bg-surface-subtle/40 border-y border-border/50 overflow-hidden select-none"
      aria-label="Verified Remote Opportunity Radar Sources"
    >
      <div className="flex items-center justify-center gap-3">
        
        {/* Subtle Live Green Status Pulse Indicator (No visible text label) */}
        <div className="shrink-0 flex items-center justify-center px-2 py-1 rounded-full bg-surface border border-border" title="Live Online Radar Connected">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Continuous Right-to-Left Sliding Marquee with Logo Tiles spanning full width */}
        <div className="overflow-hidden relative w-full group">
          <div className="marquee-track flex items-center space-x-3.5 w-max hover:[animation-play-state:paused]">
            
            {/* Set A */}
            <div className="flex items-center space-x-3.5 shrink-0">
              {VERIFIED_PROVIDERS.map((provider) => (
                <div
                  key={`a-${provider.id}`}
                  title={provider.name}
                  aria-label={provider.name}
                  className="p-0.5 rounded-full bg-surface hover:bg-surface-elevated border border-border hover:border-primary/50 transition-all duration-200 cursor-pointer shadow-xs"
                >
                  <ProviderLogoIcon id={provider.id} />
                </div>
              ))}
            </div>

            {/* Duplicate Set A for Seamless Infinite Loop */}
            <div className="flex items-center space-x-3.5 shrink-0" aria-hidden="true">
              {VERIFIED_PROVIDERS.map((provider) => (
                <div
                  key={`b-${provider.id}`}
                  title={provider.name}
                  aria-label={provider.name}
                  className="p-0.5 rounded-full bg-surface hover:bg-surface-elevated border border-border hover:border-primary/50 transition-all duration-200 cursor-pointer shadow-xs"
                >
                  <ProviderLogoIcon id={provider.id} />
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* Embedded CSS for smooth right-to-left linear marquee & reduced-motion fallback */}
      <style jsx>{`
        @keyframes marqueeRightToLeft {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-track {
          animation: marqueeRightToLeft 36s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none !important;
            transform: none !important;
            flex-wrap: wrap !important;
            width: auto !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
}
