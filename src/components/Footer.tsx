"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, HeartPulse, Scale, Check } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-white/[0.06] bg-cyber-dark dark:border-white/[0.06] light:border-slate-900/[0.06] light:bg-slate-50">
      
      {/* Privacy / Medical Compliance Highlights Bar */}
      <div className="border-b border-white/[0.04] bg-white/[0.01] px-4 py-8 dark:bg-white/[0.01] light:bg-slate-900/[0.01]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-200 dark:text-gray-200 light:text-slate-900">Encrypted Processing</h4>
              <p className="mt-1 text-xs text-gray-500 light:text-slate-500">All scanned selfies are processed locally or over highly secure, encrypted HTTPS channels.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neon-purple/15 text-neon-purple border border-neon-purple/20">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-200 dark:text-gray-200 light:text-slate-900">Auto-Delete Images</h4>
              <p className="mt-1 text-xs text-gray-500 light:text-slate-500">Toggle immediate data deletion options to wipe uploaded files from diagnostic registries.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neon-green/15 text-neon-green border border-neon-green/20">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-200 dark:text-gray-200 light:text-slate-900">Dermatologist Verified</h4>
              <p className="mt-1 text-xs text-gray-500 light:text-slate-500">Local diagnostics compiled using guidelines from standard dermatological rules engines.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neon-rose/15 text-neon-rose border border-neon-rose/20">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-200 dark:text-gray-200 light:text-slate-900">HIPAA Compliant Protocol</h4>
              <p className="mt-1 text-xs text-gray-500 light:text-slate-500">Adhering strictly to patient data protection guidelines and privacy transparency codes.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          {/* Logo & Intro */}
          <div className="md:col-span-2">
            <Link href="/" className="font-display text-lg font-black tracking-tight text-white dark:text-white light:text-slate-950">
              DermaVision<span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent ml-0.5">AI</span>
            </Link>
            <p className="mt-4 text-xs leading-relaxed text-gray-500 light:text-slate-500">
              DermaVision AI is a premium SaaS dermatology analytical platform. We combine browser-side neural computer vision, via TensorFlow.js, with advanced clinical rules modeling to provide direct, intelligent feedback on skin health metrics.
            </p>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-400 light:text-slate-800">Skincare Portal</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs text-gray-500 light:text-slate-500">
              <li><Link href="/scan" className="hover:text-neon-cyan transition-colors">Start Face Scan</Link></li>
              <li><Link href="/dashboard" className="hover:text-neon-cyan transition-colors">Patient Dashboard</Link></li>
              <li>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent("open_derma_chat"))}
                  className="hover:text-neon-cyan transition-colors cursor-pointer text-left bg-transparent border-none p-0 text-xs text-gray-500 light:text-slate-500"
                >
                  Consult Derma AI
                </button>
              </li>
              <li><Link href="/pricing" className="hover:text-neon-cyan transition-colors">Premium Subscriptions</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-400 light:text-slate-800">Support & Info</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs text-gray-500 light:text-slate-500">
              <li><Link href="/about" className="hover:text-neon-cyan transition-colors">Dermatologist Team</Link></li>
              <li><Link href="/contact" className="hover:text-neon-cyan transition-colors">Help Center</Link></li>
              <li><Link href="/login" className="hover:text-neon-cyan transition-colors">Patient Login</Link></li>
              <li><span className="text-neon-cyan font-semibold">Version 1.2.6 (Live)</span></li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-400 light:text-slate-800">Clinical Focus</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs text-gray-500 light:text-slate-500">
              <li><span className="text-gray-400 dark:text-gray-400 light:text-slate-800">TF.js Neural Grids</span></li>
              <li><span className="text-gray-400 dark:text-gray-400 light:text-slate-800">Gemini Clinical API</span></li>
              <li><span className="text-gray-400 dark:text-gray-400 light:text-slate-800">Derm-Grade OTC specs</span></li>
              <li><span className="text-gray-400 dark:text-gray-400 light:text-slate-800">PWA Active Module</span></li>
            </ul>
          </div>
        </div>


        {/* copyright and legal */}
        <div className="mt-8 border-t border-white/[0.04] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 light:text-slate-500">
          <span>&copy; {new Date().getFullYear()} DermaVision AI Inc. All clinical patient data encrypted.</span>
          <div className="flex gap-4">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Protocol</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Use</span>
            <span className="hover:text-gray-400 cursor-pointer">HIPAA Disclosures</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
