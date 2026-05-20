"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, ShieldAlert, Sparkles, Activity, User } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Avoid hydration mismatches by mounting on client first
  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("dermavision_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserEmail(parsed.email);
      } catch {
        // Safe skip
      }
    }
  }, [pathname]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const logout = () => {
    localStorage.removeItem("dermavision_user");
    setUserEmail(null);
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Scan Skin", href: "/scan" },
    { name: "Ask Derma AI", href: "/chat" },
    { name: "Pricing", href: "/pricing" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-cyber-dark/85 backdrop-blur-md dark:border-white/[0.06] light:border-slate-900/[0.08] light:bg-slate-50/85">


      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Branding Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-neon-cyan to-neon-purple p-0.5 shadow-md shadow-neon-cyan/20 transition-all duration-300 group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-cyber-dark dark:bg-cyber-dark light:bg-white text-white dark:text-white light:text-slate-950 font-bold text-lg">
              <Activity className="h-5 w-5 text-neon-cyan group-hover:animate-pulse" />
            </div>
            <div className="absolute inset-0 -z-10 rounded-xl bg-linear-to-tr from-neon-cyan to-neon-purple opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-75" />
          </div>
          <span className="font-display text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent dark:from-white dark:to-gray-400 light:from-slate-900 light:to-slate-700">
            DermaVision<span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent ml-0.5">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const isChat = link.href === "/chat";
            
            if (isChat) {
              return (
                <button
                  key={link.name}
                  onClick={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent("open_derma_chat"));
                  }}
                  className="relative py-1 text-sm font-medium transition-colors hover:text-neon-cyan text-gray-400 dark:text-gray-400 light:text-slate-600 cursor-pointer"
                >
                  {link.name}
                </button>
              );
            }
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative py-1 text-sm font-medium transition-colors hover:text-neon-cyan ${
                  isActive
                    ? "text-neon-cyan font-bold"
                    : "text-gray-400 dark:text-gray-400 light:text-slate-600"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-linear-to-r from-neon-cyan to-neon-purple rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Light/Dark Toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 dark:border-white/10 light:border-slate-200 bg-white/5 dark:bg-white/5 light:bg-slate-100 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-slate-200 transition-colors text-gray-400 dark:text-gray-400 light:text-slate-600 cursor-pointer"
              title="Toggle Appearance"
            >
              {theme === "dark" ? <Sun className="h-4.5 w-4.5 text-yellow-400" /> : <Moon className="h-4.5 w-4.5 text-slate-800" />}
            </button>
          )}

          {/* Authentication State */}
          {userEmail ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-linear-to-r from-neon-cyan/10 to-neon-purple/10 px-3 py-1 border border-neon-cyan/20">
                <User className="h-3.5 w-3.5 text-neon-cyan" />
                <span className="text-xs font-semibold max-w-[120px] truncate text-neon-cyan">
                  {userEmail}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-xs font-medium text-neon-rose hover:underline cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="relative inline-flex h-9 items-center justify-center rounded-lg px-4 text-xs font-bold tracking-wide uppercase transition-all duration-300 bg-white text-slate-950 dark:bg-white dark:text-slate-950 light:bg-slate-900 light:text-white hover:shadow-md hover:shadow-neon-cyan/10 hover:scale-[1.02]"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Menu Actions */}
        <div className="flex md:hidden items-center gap-3">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 dark:bg-white/5 light:bg-slate-100 text-gray-400 light:text-slate-600 cursor-pointer"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-slate-800" />}
            </button>
          )}
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 dark:bg-white/5 light:bg-slate-100 text-gray-400 light:text-slate-600 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-cyber-dark/95 dark:bg-cyber-dark/95 light:bg-slate-50/95 p-4 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isChat = link.href === "/chat";
              
              if (isChat) {
                return (
                  <button
                    key={link.name}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      window.dispatchEvent(new CustomEvent("open_derma_chat"));
                    }}
                    className="block w-full text-left rounded-lg px-3 py-2 text-sm font-semibold transition-colors text-gray-400 dark:text-gray-400 light:text-slate-600 hover:bg-white/5 cursor-pointer"
                  >
                    {link.name}
                  </button>
                );
              }
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-linear-to-r from-neon-cyan/10 to-neon-purple/10 text-neon-cyan"
                      : "text-gray-400 dark:text-gray-400 light:text-slate-600 hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            <div className="border-t border-white/5 pt-3 mt-1">
              {userEmail ? (
                <div className="flex flex-col gap-2.5 px-3">
                  <div className="text-xs text-gray-400 truncate">Signed in as: <span className="text-neon-cyan font-semibold">{userEmail}</span></div>
                  <button
                    onClick={() => { setMobileMenuOpen(false); logout(); }}
                    className="w-full text-center rounded-lg bg-neon-rose/10 py-2 text-xs font-bold text-neon-rose border border-neon-rose/15"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center rounded-lg bg-linear-to-r from-neon-cyan to-neon-purple py-2 text-xs font-bold uppercase tracking-wider text-white"
                >
                  Get Started
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
