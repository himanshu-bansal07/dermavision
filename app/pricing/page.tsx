"use client";

import React from "react";
import { Check, ShieldAlert, Sparkles } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const tiers = [
    {
      name: "Free Diagnostic Scan",
      price: "$0",
      period: "forever",
      desc: "Perfect for local browser testing and baseline skincare evaluations.",
      features: [
        "Client-side TensorFlow.js evaluations",
        "Onboarding Questionnaire profile",
        "Overall Health & Glow metrics",
        "Morning/Night baseline checklists",
        "Access to Ask Derma AI (Local engine)",
        "HIPAA Auto-Delete session toggle"
      ],
      cta: "Start Free Scan",
      href: "/scan",
      highlighted: false
    },
    {
      name: "Premium Active Care",
      price: "$19",
      period: "monthly",
      desc: "Unlock comprehensive analysis reports powered by Generative AI.",
      features: [
        "Everything in Free Scan tier",
        "Generative Vision AI clinical diagnoses",
        "Unlimited PDF Report downloads",
        "Weekly progress timelines & charts",
        "Advanced Ask Derma AI Chat (Generative)",
        "Specific OTC ingredient listings",
        "Auto-delete image storage safety"
      ],
      cta: "Subscribe to Premium",
      href: "/scan",
      highlighted: true
    },
    {
      name: "Clinical Derm-Pro",
      price: "$49",
      period: "monthly",
      desc: "Complete tele-dermatology integration for certified clinical diagnostics.",
      features: [
        "Everything in Premium Active Care",
        "Certified Dermatologist visual reviews",
        "Customized pharmaceutical prescriptions",
        "1-on-1 monthly video consultations",
        "Priority 2-hour report turnaround",
        "Unlimited weekly scan history logs",
        "Direct family timeline comparisons"
      ],
      cta: "Purchase Derm-Pro",
      href: "/scan",
      highlighted: false
    }
  ];

  return (
    <div className="flex-1 w-full mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-neon-cyan/15 to-neon-purple/15 px-3.5 py-1.5 border border-neon-cyan/20 text-[10px] font-bold uppercase tracking-wider text-neon-cyan">
          <Sparkles className="h-3.5 w-3.5" /> Flexible SaaS subscriptions
        </div>
        
        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-white dark:text-white light:text-slate-900">
          Premium Clinical Care Plans
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 light:text-slate-500 max-w-[500px] mx-auto leading-relaxed">
          Start for free using on-device computer vision, then upgrade to compile complete AI clinical reports.
        </p>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {tiers.map((tier, idx) => (
          <div
            key={idx}
            className={`rounded-[32px] p-6 sm:p-8 flex flex-col justify-between min-h-[560px] transition-all relative overflow-hidden ${
              tier.highlighted
                ? "glass-panel bg-linear-to-b from-neon-purple/10 via-[#0d0e15]/95 to-[#0d0e15]/95 dark:from-neon-purple/10 dark:via-[#0d0e15]/95 dark:to-[#0d0e15]/95 light:from-neon-purple/10 light:via-white light:to-white border border-neon-cyan dark:border-neon-cyan light:border-neon-purple shadow-xl shadow-neon-cyan/5 scale-[1.03]"
                : "glass-panel bg-white/[0.02] dark:bg-white/[0.02] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200/90 shadow-md hover:scale-[1.01]"
            }`}
          >
            {/* Glowing Accent for premium tier */}
            {tier.highlighted && (
              <div className="absolute top-0 right-0 rounded-bl-2xl bg-gradient-to-r from-neon-cyan to-neon-purple px-4 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-md animate-pulse">
                MOST POPULAR
              </div>
            )}

            <div className="space-y-6 text-left">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white dark:text-white light:text-slate-900">{tier.name}</h3>
                <p className="mt-2 text-xs text-gray-500 light:text-slate-550 leading-relaxed">{tier.desc}</p>
              </div>

              {/* Price segment */}
              <div className="flex items-baseline gap-1 text-white dark:text-white light:text-slate-900">
                <span className="text-4xl sm:text-5xl font-black tracking-tight">{tier.price}</span>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-500 light:text-slate-400 uppercase tracking-widest">/ {tier.period}</span>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/5 dark:bg-white/5 light:bg-slate-100" />

              {/* Features checklist */}
              <ul className="space-y-3">
                {tier.features.map((feat, fidx) => (
                  <li key={fidx} className="flex items-start gap-2.5 text-xs text-gray-400 dark:text-gray-400 light:text-slate-700 leading-normal">
                    <Check className="h-4 w-4 text-neon-green shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href={tier.href}
                className={`w-full h-11 inline-flex items-center justify-center rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  tier.highlighted
                    ? "bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-lg shadow-neon-cyan/20 hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-white/5 dark:bg-white/5 light:bg-slate-550 text-gray-300 dark:text-gray-300 light:text-white hover:bg-white/10 dark:hover:bg-white/10 light:bg-slate-900 light:hover:bg-slate-800"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Disclosures */}
      <div className="rounded-2xl border border-neon-cyan/20 bg-neon-cyan/5 dark:bg-neon-cyan/5 light:bg-slate-100 p-5 text-xs leading-relaxed text-gray-400 dark:text-gray-400 light:text-slate-650 max-w-3xl mx-auto flex items-start gap-3 text-left shadow-xs">
        <ShieldAlert className="h-5 w-5 text-neon-cyan shrink-0 mt-0.5 animate-pulse" />
        <div>
          <span className="font-bold text-gray-200 dark:text-gray-200 light:text-slate-900 block mb-1">Subscription Security & Clinical Standards</span>
          Subscriptions run over fully encrypted Stripe sandbox integrations. Active diagnostic scans are verified by clinical rules modeling, but remain educational technological insights. You are protected by a 14-day direct satisfaction clinical money-back guarantee. Wiped/Auto-deleted session documents contain zero permanent trace logs.
        </div>
      </div>
      
    </div>
  );
}
