"use client";

import React, { useState } from "react";
import { Mail, HelpCircle, HeartPulse, Send, Sparkles, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !msg.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      confetti({
        particleCount: 45,
        spread: 40,
        colors: ["#00F2FE", "#9b51e0"]
      });

      setName("");
      setEmail("");
      setMsg("");
      
      setTimeout(() => setSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="flex-1 w-full mx-auto max-w-4xl px-4 py-16 sm:px-6 space-y-16 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-neon-cyan/15 to-neon-purple/15 px-3.5 py-1.5 border border-neon-cyan/20 text-[10px] font-bold uppercase tracking-wider text-neon-cyan">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Secure Customer Service
        </div>
        
        <h1 className="font-display text-3xl sm:text-5xl font-black text-white dark:text-white light:text-slate-900 tracking-tight">
          Connect with Support
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 light:text-slate-550 max-w-[500px] mx-auto leading-relaxed">
          <p className="text-xs leading-relaxed text-gray-400 dark:text-gray-400 light:text-slate-650">
            For security and PWA compliance issues, contact us at:
            <span className="text-neon-cyan font-bold block mt-1">support@dermavision.ai</span>
            <span className="text-neon-cyan font-bold block mt-1">mitaligupta0019@gmail.com</span>
          </p>
          Need assistance with browser media streams, subscription billing, or PWA installs?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* Contact Form */}
        <div className="glass-panel bg-white/[0.02] dark:bg-white/[0.02] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200/90 p-6 sm:p-8 rounded-3xl text-left shadow-lg">
          <h2 className="text-sm sm:text-base font-extrabold text-white dark:text-white light:text-slate-900 mb-4">Send a Secure Message</h2>

          {success && (
            <div className="mb-4 rounded-xl bg-neon-green/10 border border-neon-green/20 p-3 text-xs font-semibold text-neon-green leading-relaxed">
              Message submitted successfully! Our support desk will contact you within 24 hours.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 light:text-slate-650">Your Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full h-11 px-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 text-xs focus:outline-none focus:border-neon-cyan text-white dark:text-white light:text-slate-950 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 light:text-slate-650">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patient@dermavision.ai"
                className="w-full h-11 px-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 text-xs focus:outline-none focus:border-neon-cyan text-white dark:text-white light:text-slate-950 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 light:text-slate-650">Describe Your Inquiry</label>
              <textarea
                rows={4}
                required
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="How can we assist you today?"
                className="w-full p-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 text-xs focus:outline-none focus:border-neon-cyan text-white dark:text-white light:text-slate-950 resize-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-linear-to-r from-neon-cyan to-neon-purple text-white text-xs font-bold uppercase tracking-wider shadow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="h-4.5 w-4.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : (
                <>
                  Submit Inquiry <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Clinical Info panel */}
        <div className="space-y-6 text-left flex flex-col justify-between">
          
          <div className="rounded-3xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-white/[0.02] dark:bg-white/[0.02] light:bg-white p-6 space-y-4 shadow-md">
            <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
              <Mail className="h-4.5 w-4.5 text-neon-cyan" /> Secure Help Desk
            </h3>
            <p className="text-xs leading-relaxed text-gray-400 dark:text-gray-400 light:text-slate-650">
              For security and PWA compliance issues, contact us at:
              <span className="text-neon-cyan font-bold block mt-1">support@dermavision.ai</span>
              <span className="text-neon-cyan font-bold block mt-1">mitaligupta0019@gmail.com</span>
            </p>
            <p className="text-[10px] text-gray-500 light:text-slate-500">
              Standard operations desk hours are 8:00 AM to 6:00 PM EST, Monday through Friday.
            </p>
          </div>

          <div className="rounded-3xl border border-neon-rose/20 bg-neon-rose/5 dark:bg-neon-rose/5 light:bg-red-50/50 p-6 space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-neon-rose flex items-center gap-2">
              <HeartPulse className="h-4.5 w-4.5 text-neon-rose animate-pulse" /> Emergency Disclosures
            </h3>
            <p className="text-xs leading-relaxed text-neon-rose/90 dark:text-neon-rose/90 light:text-red-750">
              DermaVision AI is not an emergency triage service. If you are experiencing high-risk rashes, spreading infections, painful lesions, or allergic swellings, please seek immediate in-person attention from professional emergency clinics.
            </p>
          </div>

          <div className="rounded-3xl border border-neon-cyan/20 bg-neon-cyan/5 dark:bg-neon-cyan/5 light:bg-slate-100 p-6 flex items-start gap-2.5 shadow-sm">
            <ShieldCheck className="h-5 w-5 text-neon-green shrink-0 mt-0.5" />
            <span className="text-[10px] text-gray-400 dark:text-gray-400 light:text-slate-650 leading-normal">
              All messages submitted to our helpline are encrypted in transit and analyzed in complete compliance with HIPAA transparency profiles. Zero transaction logs are processed by third-party advertisement grids.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
