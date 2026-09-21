"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Radar, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  ArrowRight, 
  LogIn, 
  LayoutDashboard
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";

interface LandingHeaderProps {
  isAuthenticated?: boolean;
}

export default function LandingHeader({ isAuthenticated = false }: LandingHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#capabilities", label: "Capabilities" },
    { href: "#workflow", label: "Workflow" },
  ];

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth", block: "start" });
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-xs"
          : "bg-background/80 backdrop-blur-xs border-b border-border-subtle"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-foreground group-hover:border-primary transition-all duration-200 shadow-xs">
              <Radar className="w-5 h-5 text-primary group-hover:scale-105 transition-transform" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg sm:text-xl text-foreground tracking-tight">WebHunt</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  Delta
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">Opportunity Intelligence</p>
            </div>
          </Link>

          {/* Minimal Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-surface px-3 py-1.5 rounded-full border border-border">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center space-x-2.5">
            {isAuthenticated ? (
              <Link
                href="/?view=app"
                className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground transition-all duration-200"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Open Workspace</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/auth?mode=signin"
                  className="hidden sm:inline-flex items-center px-3.5 py-2 text-xs font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 mr-1.5" />
                  <span>Sign In</span>
                </Link>

                <Link
                  href="/auth?mode=signup"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground transition-all duration-200"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 rounded-xl bg-surface border border-border text-foreground flex items-center justify-center"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background/95 backdrop-blur-xl px-4 pt-3 pb-6">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="md:hidden px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="md:hidden pt-3 border-t border-border flex flex-col gap-2">
              {isAuthenticated ? (
                <Link
                  href="/?view=app"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Open Workspace</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth?mode=signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center py-2.5 rounded-xl bg-surface border border-border text-foreground font-semibold text-xs"
                  >
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/auth?mode=signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-primary" />}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
