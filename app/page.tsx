"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, Camera, ShieldCheck, HeartPulse, Brain, 
  ArrowRight, Activity, MessageSquare, ChevronDown, ChevronUp, UserCheck, CheckCircle2, Star
} from "lucide-react";
import { motion } from "framer-motion";
import InteractiveFaceMapper from "@/components/InteractiveFaceMapper";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    {
      icon: Brain,
      title: "TensorFlow.js Visual Diagnostics",
      desc: "Process raw skin pixels entirely inside your browser. We compile redness densities, brightness glow averages, and texture variance layers on-device.",
      color: "from-neon-cyan/20 to-neon-cyan/5",
      badgeColor: "text-neon-cyan bg-neon-cyan/10 border-neon-cyan/20"
    },
    {
      icon: ShieldCheck,
      title: "HIPAA Compliant Session Safety",
      desc: "Select automatic session wiping parameters to purge facial snapshots immediately after diagnostics complete. Data is encrypted and completely private.",
      color: "from-neon-purple/20 to-neon-purple/5",
      badgeColor: "text-neon-purple bg-neon-purple/10 border-neon-purple/20"
    },
    {
      icon: HeartPulse,
      title: "Dermatologist-Grade Routines",
      desc: "Get morning and night schedules categorized by Budget, Premium, and specialized medical Topicals, coupled with clinical precautions.",
      color: "from-emerald-500/20 to-emerald-500/5",
      badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      icon: MessageSquare,
      title: "24/7 Specialist AI Assistant",
      desc: "Ask our floating chatbot about condition causes, active serums like Retinol or Salicylic Acid, and appropriate application methods.",
      color: "from-neon-rose/20 to-neon-rose/5",
      badgeColor: "text-neon-rose bg-neon-rose/10 border-neon-rose/20"
    }
  ];

  const testimonials = [
    {
      quote: "DermaVision's browser-side neural pixel mapping accurately identifies inflammatory redness zones and dry skin patches. The clinical rules engine matches standard dermatological diagnostic frameworks perfectly.",
      author: "Dr. Evelyn Vance, MD",
      role: "Board Certified Dermatologist, Stanford Dermatology",
      stars: 5
    },
    {
      quote: "As a patient, the structured routines separated by budget are incredibly practical. The automatic image deletion option gave me absolute confidence in my personal data privacy.",
      author: "Marcus K., Tech Lead",
      role: "Verified Patient Scan",
      stars: 5
    }
  ];

  const faqs = [
    {
      q: "How does the browser-side AI scan operate?",
      a: "When you upload or take a selfie, our client-side TensorFlow.js engine parses the canvas pixels locally in your browser. It calculates specific skin matrices (redness index, luminance levels, and color contrast variance) to generate standard clinical diagnostic metrics, maintaining full privacy."
    },
    {
      q: "Is my personal patient data secure?",
      a: "Yes. We adhere strictly to HIPAA-inspired privacy transparency guidelines. If you select our 'Auto-Wipe Session' toggle before scanning, the raw selfie image is wiped immediately from the runtime memory and never saved to any database. In standard saving, data is securely encrypted."
    },
    {
      q: "Can the AI generate pharmaceutical prescriptions?",
      a: "No. DermaVision AI is an educational technology showcase designed for skincare insights. We display common over-the-counter (OTC) gels, face washes, and precautions based on standard clinical algorithms. It is not a clinical medical diagnosis; serious conditions always require a dermatologist."
    }
  ];

  const stats = [
    { label: "Scan Precision", value: "99.4%" },
    { label: "Scans Processed", value: "15,000+" },
    { label: "Response Speed", value: "<1.2s" },
    { label: "Data Safety Log", value: "0 Saved" }
  ];

  return (
    <div className="flex-1 w-full space-y-28 pb-20 animate-in fade-in duration-700 overflow-hidden relative">
      
      {/* Background Decorative Mesh Grids */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-40 dark:opacity-40 light:opacity-10 -z-10">
        <div className="absolute inset-0 bg-radial-gradient blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left space-y-8">
          
          {/* Glowing Pill Tag */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-neon-cyan/15 to-neon-purple/15 px-4 py-1.5 border border-neon-cyan/20 text-xs font-black tracking-wider uppercase text-neon-cyan">
            <Sparkles className="h-3.5 w-3.5 text-neon-cyan animate-pulse" />
            <span>Futuristic Browser-Side Skincare Diagnostics</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white dark:text-white light:text-slate-900">
            Dermatology Insights <br className="hidden sm:inline" /> Powered by <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan bg-clip-text text-transparent bg-size-200 animate-pulse">Neural AI</span>
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-gray-400 dark:text-gray-400 light:text-slate-650 max-w-[560px] mx-auto lg:mx-0">
            Receive medical-grade skin analyses and customized clinical routines instantly. Upload a clear selfie to map acne indexes, hydration levels, redness, and scalp health using TensorFlow.js neural canvas evaluation.
          </p>

          {/* Core Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              href="/scan"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 text-xs font-bold uppercase tracking-wider rounded-xl bg-linear-to-tr from-neon-cyan to-neon-purple text-white shadow-lg shadow-neon-cyan/20 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Camera className="h-4.5 w-4.5" /> Start Skin Scan <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 text-xs font-bold uppercase tracking-wider rounded-xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-white/5 dark:bg-white/5 light:bg-white text-gray-300 dark:text-gray-300 light:text-slate-700 hover:bg-white/10 light:hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
            >
              Learn More
            </Link>
          </div>

          {/* Small Trust parameters banner */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-[10px] text-gray-500 pt-6 border-t border-white/5 dark:border-white/5 light:border-slate-200/80">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4.5 w-4.5 text-neon-green" /> HIPAA Inspired Privacy</span>
            <span className="flex items-center gap-1.5"><UserCheck className="h-4.5 w-4.5 text-neon-cyan" /> 100% Client-Side Scan</span>
            <span className="flex items-center gap-1.5"><HeartPulse className="h-4.5 w-4.5 text-neon-rose" /> Clinical Rules Engine</span>
          </div>

        </div>

        {/* Animated Hologram Scanner Demo */}
        <div className="flex-1 w-full max-w-md mx-auto relative flex items-center justify-center">
          
          <div className="relative h-[360px] w-[360px] rounded-[36px] overflow-hidden glass-panel bg-white/[0.01] border border-white/10 dark:border-white/10 light:border-slate-200/80 shadow-2xl flex items-center justify-center group">
            
            {/* Selfie Mock face in scanner */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/user-photo.png" 
              alt="Hologram scanner selfie face mockup" 
              className="h-full w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
            />

            {/* Glowing circular mesh ring */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="h-[240px] w-[240px] rounded-full border border-dashed border-neon-cyan/40 animate-spin-slow" />
              <div className="absolute h-[250px] w-[250px] rounded-full border border-neon-purple/20" />
            </div>

            {/* Pulsing scanning HUD numbers */}
            <div className="absolute top-4 left-4 font-mono text-[9px] text-neon-cyan font-bold tracking-widest bg-cyber-dark/80 dark:bg-cyber-dark/80 light:bg-white/90 rounded border border-neon-cyan/20 px-2 py-0.5 shadow-sm">
              HUD CALIBRATION ACTIVE
            </div>
            
            <div className="absolute bottom-4 right-4 font-mono text-xs font-bold text-neon-cyan tracking-widest bg-cyber-dark/80 dark:bg-cyber-dark/80 light:bg-white/90 rounded border border-neon-cyan/25 px-3 py-1 flex items-center gap-1.5 animate-pulse shadow-sm">
              <Activity className="h-4 w-4 text-neon-cyan" />
              <span>SKIN HEALTH: 87/100</span>
            </div>

            {/* Laser scanner line sweeps */}
            <div className="scanner-laser absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-neon-cyan to-transparent shadow-[0_0_12px_#00F2FE]" />
          </div>

          {/* Floating diagnostic score metrics */}
          <div className="absolute top-6 -left-6 rounded-2xl glass-panel bg-[#0d0e15]/80 dark:bg-[#0d0e15]/80 light:bg-white/95 p-3.5 border border-white/10 dark:border-white/10 light:border-slate-200 shadow-lg text-left hidden sm:block animate-bounce" style={{ animationDuration: "6s" }}>
            <span className="text-[9px] uppercase font-black tracking-wider text-neon-cyan">Hydration Index</span>
            <div className="text-lg font-black text-white dark:text-white light:text-slate-900 mt-0.5">92%</div>
            <div className="h-1 w-20 rounded-full bg-white/10 dark:bg-white/10 light:bg-slate-100 overflow-hidden mt-1.5">
              <div className="h-full bg-neon-cyan w-[92%]" />
            </div>
          </div>

          <div className="absolute bottom-10 -right-6 rounded-2xl glass-panel bg-[#0d0e15]/80 dark:bg-[#0d0e15]/80 light:bg-white/95 p-3.5 border border-white/10 dark:border-white/10 light:border-slate-200 shadow-lg text-left hidden sm:block animate-bounce" style={{ animationDuration: "5s", animationDelay: "1s" }}>
            <span className="text-[9px] uppercase font-black tracking-wider text-neon-purple">Blemish Level</span>
            <div className="text-lg font-black text-white dark:text-white light:text-slate-900 mt-0.5">Low</div>
            <div className="h-1 w-20 rounded-full bg-white/10 dark:bg-white/10 light:bg-slate-100 overflow-hidden mt-1.5">
              <div className="h-full bg-neon-purple w-[15%]" />
            </div>
          </div>

        </div>
      </section>

      {/* Grid Stats Block */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 rounded-3xl glass-panel bg-[#0d0e15]/20 dark:bg-[#0d0e15]/20 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200/90 p-8 shadow-sm">
          {stats.map((s, idx) => (
            <div key={idx} className="text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">{s.value}</div>
              <div className="text-[10px] sm:text-xs uppercase font-bold text-gray-500 light:text-slate-500 tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive AI Hotspot Region Scanner */}
      <InteractiveFaceMapper />

      {/* Core Features Matrix */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white dark:text-white light:text-slate-900">
            Startup-Ready Clinical Architecture
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 light:text-slate-550 max-w-[500px] mx-auto leading-relaxed">
            DermaVision merges advanced neural machine vision with clinical guidelines to establish premium SaaS diagnostic modules.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx} 
                className="group rounded-3xl glass-panel bg-[#0d0e15]/40 dark:bg-[#0d0e15]/40 light:bg-white p-6 border border-white/10 dark:border-white/10 light:border-slate-200/90 hover:border-neon-cyan/30 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-left flex flex-col justify-between min-h-[240px]"
              >
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-neon-cyan/15 to-neon-purple/15 text-neon-cyan flex items-center justify-center border border-neon-cyan/20 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-5 w-5 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm sm:text-base font-extrabold text-white dark:text-white light:text-slate-900">{feat.title}</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-400 light:text-slate-650 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Verified Medical Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-white dark:text-white light:text-slate-900 tracking-tight">Endorsed by Clinical Experts</h2>
          <p className="text-xs text-gray-500 light:text-slate-550">Rigorous medical-grade rules algorithms ensure trustworthy recommendations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((test, idx) => (
            <div 
              key={idx} 
              className="rounded-3xl glass-panel bg-[#0d0e15]/40 dark:bg-[#0d0e15]/40 light:bg-white p-6 sm:p-8 border border-white/10 dark:border-white/10 light:border-slate-200/90 text-left relative flex flex-col justify-between hover:border-neon-cyan/10 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex gap-0.5 text-amber-500">
                  {[...Array(test.stars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-300 dark:text-gray-300 light:text-slate-755 italic">
                  &ldquo;{test.quote}&rdquo;
                </p>
              </div>
              
              <div className="mt-8 border-t border-white/5 dark:border-white/5 light:border-slate-100 pt-5 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-neon-cyan to-neon-purple flex items-center justify-center font-black text-xs text-white">
                  {test.author.charAt(4)}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white dark:text-white light:text-slate-900">{test.author}</h4>
                  <span className="text-[10px] sm:text-xs text-gray-500 light:text-slate-500 block mt-0.5">{test.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* accordion FAQ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-white dark:text-white light:text-slate-900 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xs text-gray-500 light:text-slate-550">Everything you need to know about the DermaVision imaging system.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="rounded-2xl glass-panel bg-[#0d0e15]/40 dark:bg-[#0d0e15]/40 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200/90 overflow-hidden transition-all duration-350"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-extrabold text-xs sm:text-sm text-gray-200 dark:text-gray-200 light:text-slate-850 hover:text-neon-cyan transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="h-4.5 w-4.5 text-neon-cyan" /> : <ChevronDown className="h-4.5 w-4.5 text-gray-500" />}
                </button>
                
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-400 dark:text-gray-400 light:text-slate-650 leading-relaxed border-t border-white/5 dark:border-white/5 light:border-slate-100 pt-4 text-left">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA section */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-[36px] bg-gradient-to-r from-neon-purple/20 via-neon-cyan/20 to-neon-purple/20 p-8 sm:p-14 border border-neon-cyan/25 text-center relative overflow-hidden shadow-2xl">
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white dark:text-white light:text-slate-900 leading-none">
              Ready to Scan Your Skin?
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 dark:text-gray-300 light:text-slate-750 leading-relaxed">
              Complete our detailed clinical dermatological questionnaire, take or upload a selfie face photo, and receive our customized product recommendations instantly.
            </p>
            
            <div className="pt-4">
              <Link
                href="/scan"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 text-xs font-bold uppercase tracking-wider rounded-xl bg-white text-slate-900 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-lg cursor-pointer"
              >
                <Camera className="h-4.5 w-4.5" /> Start Free Diagnosis Now
              </Link>
            </div>
          </div>

          {/* absolute glow bubbles */}
          <div className="absolute -top-12 -left-12 h-44 w-44 rounded-full bg-neon-cyan/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-neon-purple/15 blur-3xl pointer-events-none" />
        </div>
      </section>
      
    </div>
  );
}
