"use client";

import React from "react";
import { Brain, ShieldCheck, HeartPulse, Sparkles, Activity, Users, Target, Award } from "lucide-react";

export default function AboutPage() {
  const doctors = [
    {
      name: "Dr. Evelyn Vance, MD",
      specialty: "Clinical Dermatology & Photobiology",
      school: "Stanford Medical School",
      desc: "Evelyn specializes in computer-assisted skin cancer screenings and clinical imaging, validating the mathematical logic of the DermaVision AI scoring algorithms."
    },
    {
      name: "Dr. Raymond Shaw, PhD",
      specialty: "Biomedical Neural Networks & Computer Vision",
      school: "MIT Artificial Intelligence Lab",
      desc: "Raymond leads our browser-side TensorFlow.js integration, optimizing local tensor processing loops to deliver secure pixel-level analysis without server latency."
    },
    {
      name: "Dr. Marcus Thorne, MD, FAAD",
      specialty: "Ethnic & Cosmetic Dermatology",
      school: "Harvard Medical School",
      desc: "Marcus guides our multi-ethnic skin metric modeling, ensuring redness index algorithms and pigmentation ratings maintain clinical precision across all Fitzpatrick skin types."
    }
  ];

  const milestones = [
    {
      icon: <Target className="h-5 w-5 text-neon-cyan" />,
      title: "Our Mission",
      desc: "Democratizing dermatological insights by providing instant, private, and mathematically sound skincare analysis to anyone with a browser."
    },
    {
      icon: <Brain className="h-5 w-5 text-neon-purple" />,
      title: "Advanced ML Integration",
      desc: "Harnessing client-side neural preprocessors to isolate red/RGB channels and compute structural texture variance right on the user's device."
    },
    {
      icon: <Award className="h-5 w-5 text-emerald-550 dark:text-emerald-400" />,
      title: "Clinical Excellence",
      desc: "Translating complex skin metric calculations into highly personalized, budget-conscious ingredient blueprints verified by clinical research."
    }
  ];

  return (
    <div className="flex-1 w-full mx-auto max-w-6xl px-4 py-16 sm:px-6 space-y-16 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-neon-cyan/10 to-neon-purple/10 px-3.5 py-1 border border-neon-cyan/15 text-[10px] font-bold uppercase tracking-wider text-neon-cyan">
          <Sparkles className="h-3.5 w-3.5" /> Empowering Scientific Skincare
        </div>
        
        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-white dark:text-white light:text-slate-900">
          About <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">DermaVision AI</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-500 light:text-slate-500 leading-relaxed">
          We bridge the gap between advanced browser-side neural computer vision and evidence-based dermatological routines, creating a private-first analysis pipeline.
        </p>
      </div>

      {/* Pillars Milestone Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {milestones.map((m, idx) => (
          <div 
            key={idx} 
            className="rounded-3xl glass-panel bg-[#0d0e15]/40 dark:bg-[#0d0e15]/40 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200/90 p-6 text-left space-y-4 shadow-sm hover:scale-[1.02] transition-all duration-300"
          >
            <div className="h-10 w-10 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 flex items-center justify-center border border-white/10 dark:border-white/10 light:border-slate-200">
              {m.icon}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-extrabold text-white dark:text-white light:text-slate-900">{m.title}</h3>
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-400 light:text-slate-650 leading-relaxed">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tech Blueprint & Architecture Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
        <div className="lg:col-span-3 space-y-6 text-left flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-slate-900 tracking-tight">Our Technological Blueprint</h2>
          <p className="text-xs sm:text-sm leading-relaxed text-gray-400 dark:text-gray-400 light:text-slate-650">
            DermaVision AI represents a paradigm shift in cosmetic diagnostics. Traditional skincare engines force users to upload high-resolution facial images to remote databases, exposing private biometric photos and generating bandwidth bottleneck lag.
          </p>
          <p className="text-xs sm:text-sm leading-relaxed text-gray-400 dark:text-gray-400 light:text-slate-650">
            We engineered a secure solution: loading lightweight, WebGL-accelerated convolutional analyzers directly into the patient's local browser canvas. We isolate RGB pixel channels, calculate Mean Erythema (micro-redness levels), and measure standard deviation density grids to deliver instant, client-side insights.
          </p>
        </div>

        <div className="lg:col-span-2 rounded-3xl glass-panel bg-[#0d0e15]/40 dark:bg-[#0d0e15]/40 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200/90 p-6 sm:p-8 space-y-6 text-left flex flex-col justify-center shadow-lg">
          <h3 className="text-sm sm:text-base font-black text-white dark:text-white light:text-slate-900 flex items-center gap-2 border-b border-white/5 dark:border-white/5 light:border-slate-100 pb-3">
            <Activity className="h-4.5 w-4.5 text-neon-cyan animate-pulse" /> Core Architecture
          </h3>
          
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="h-8 w-8 rounded-lg bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/20 flex items-center justify-center shrink-0">
                <Brain className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-200 dark:text-gray-200 light:text-slate-900">TensorFlow.js Engine</h4>
                <span className="text-[10px] sm:text-xs text-gray-500 light:text-slate-500 block mt-0.5">WebGL-accelerated local pixel-level channel matrices.</span>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="h-8 w-8 rounded-lg bg-neon-purple/15 text-neon-purple border border-neon-purple/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-200 dark:text-gray-200 light:text-slate-900">Privacy First Sandbox</h4>
                <span className="text-[10px] sm:text-xs text-gray-500 light:text-slate-500 block mt-0.5">Zero persistent database photo storage logs.</span>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="h-8 w-8 rounded-lg bg-neon-rose/15 text-neon-rose border border-neon-rose/20 flex items-center justify-center shrink-0">
                <HeartPulse className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-200 dark:text-gray-200 light:text-slate-900">Rule-Based Active Matching</h4>
                <span className="text-[10px] sm:text-xs text-gray-500 light:text-slate-500 block mt-0.5">OTC ingredient pairings aligned to primary skin types.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advisory Board */}
      <div className="space-y-8 pt-4">
        <div className="text-left border-b border-white/5 dark:border-white/5 light:border-slate-200 pb-3 flex items-center gap-2.5">
          <Users className="h-5 w-5 text-neon-cyan" />
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white dark:text-white light:text-slate-900 tracking-tight">Our Clinical Advisory Board</h2>
            <span className="text-[10px] sm:text-xs text-gray-500 block mt-0.5">Certified board dermatologists and PhD researchers guiding our algorithmic models.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {doctors.map((doc, idx) => (
            <div 
              key={idx} 
              className="rounded-3xl glass-panel bg-[#0d0e15]/40 dark:bg-[#0d0e15]/40 light:bg-white p-6 border border-white/10 dark:border-white/10 light:border-slate-200/90 text-left space-y-4 shadow-md hover:border-neon-cyan/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white dark:text-white light:text-slate-900">{doc.name}</h3>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-neon-cyan font-bold block">{doc.specialty}</span>
                  <span className="text-[9px] text-gray-500 dark:text-gray-500 light:text-slate-550 font-mono uppercase tracking-widest">{doc.school}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-400 light:text-slate-650 leading-relaxed pt-2 border-t border-white/5 dark:border-white/5 light:border-slate-100">{doc.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
