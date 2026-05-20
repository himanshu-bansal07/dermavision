"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, CheckCircle2, Sparkles, Move } from "lucide-react";

export default function InteractiveFaceMapper() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const faceImage = "/images/user-photo.png";

  const hotspots = [
    {
      id: "acne",
      side: "left",
      label: "Acne",
      desc: "Inflammatory sebum blocks",
      x: 45,
      y: 30,
      color: "bg-red-500",
      cropFilter: "saturate-[1.8] contrast-[1.1] hue-rotate-[-10deg]",
      dotColor: "border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]",
    },
    {
      id: "dark-circles",
      side: "left",
      label: "Dark Circles",
      desc: "Under-eye hyperpigmentation",
      x: 38,
      y: 48,
      color: "bg-amber-700",
      cropFilter: "brightness-[0.7] saturate-[0.8]",
      dotColor: "border-amber-600 shadow-[0_0_12px_rgba(217,119,6,0.5)]",
    },
    {
      id: "dark-spots",
      side: "left",
      label: "Dark Spots",
      desc: "Sun damage freckle cells",
      x: 34,
      y: 68,
      color: "bg-orange-800",
      cropFilter: "contrast-[1.3] brightness-[0.85] sepia-[0.3]",
      dotColor: "border-orange-700 shadow-[0_0_12px_rgba(194,65,12,0.5)]",
    },
    {
      id: "no-dark-circles",
      side: "right",
      label: "No Dark Circles",
      desc: "Rejuvenated healthy tone",
      x: 62,
      y: 48,
      color: "bg-emerald-500",
      cropFilter: "brightness-[1.15] contrast-[1.05] saturate-[0.95]",
      dotColor: "border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]",
    },
    {
      id: "clear-skin",
      side: "right",
      label: "Clear Skin",
      desc: "Hydrated collagen texture",
      x: 66,
      y: 68,
      color: "bg-sky-500",
      cropFilter: "brightness-[1.08] contrast-[1.02]",
      dotColor: "border-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.5)]",
    },
  ];

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(10, Math.min(90, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 space-y-12">
      
      {/* Title block */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-neon-cyan/15 to-neon-purple/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-neon-cyan border border-neon-cyan/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Interactive Diagnosis Mapping</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white dark:text-white light:text-slate-900">
          AI Dermatological Target Scanner
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 light:text-slate-500 max-w-[550px] mx-auto leading-relaxed">
          Hover or click on concerns to inspect region-specific metrics, and slide the slider to observe recovery projections.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-12 pt-4">
        
        {/* LEFT COLUMN: CONCERNS */}
        <div className="flex-1 w-full max-w-md lg:max-w-[280px] flex flex-col justify-center gap-4 order-2 lg:order-1">
          {hotspots.filter(h => h.side === "left").map((hotspot) => (
            <motion.div
              key={hotspot.id}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer bg-white/5 dark:bg-white/5 light:bg-white ${
                activeHotspot === hotspot.id 
                  ? "border-red-500 dark:border-red-500 light:border-red-500 shadow-lg dark:shadow-red-500/10 light:shadow-red-500/10 scale-[1.03]" 
                  : "border-white/10 dark:border-white/10 light:border-slate-200 shadow-xs hover:border-white/20 light:hover:border-slate-350 hover:scale-[1.01]"
              }`}
              onMouseEnter={() => setActiveHotspot(hotspot.id)}
              onMouseLeave={() => setActiveHotspot(null)}
              onClick={() => setActiveHotspot(hotspot.id)}
            >
              {/* Cropped thumbnail with unique concern filters */}
              <div className="relative h-12 w-12 rounded-full overflow-hidden border border-white/10 dark:border-white/10 light:border-slate-200 flex-shrink-0 bg-slate-100 dark:bg-slate-900">
                <img
                  src={faceImage}
                  alt={hotspot.label}
                  className={`absolute h-[300%] w-[300%] object-cover max-w-none filter ${hotspot.cropFilter} transition-transform duration-350 group-hover:scale-110`}
                  style={{
                    left: `${-hotspot.x * 2.2}%`,
                    top: `${-hotspot.y * 2.2}%`,
                  }}
                />
                <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay" />
              </div>

              <div className="text-left">
                <h4 className="text-xs font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
                  {hotspot.label}
                </h4>
                <p className="text-[10px] sm:text-xs text-gray-500 light:text-slate-500 leading-tight mt-0.5">{hotspot.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* MIDDLE COLUMN: FACE SCANNER VIEWPORT */}
        <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-[32px] overflow-hidden border border-white/15 dark:border-white/15 light:border-slate-200/90 shadow-2xl bg-slate-950 order-1 lg:order-2 self-center">
          
          {/* Base Face (Left Side Overlay - Dirty/Concerns) */}
          <div className="absolute inset-0 select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={faceImage}
              alt="Skin concerns baseline"
              className="h-full w-full object-cover filter contrast-[1.02] saturate-[1.1]"
              draggable="false"
            />
            {/* Overlay Simulated Redness/Imperfections on Left Side only */}
            <div className="absolute inset-y-0 left-0 w-1/2 bg-red-500/[0.04] mix-blend-multiply pointer-events-none" />
            <div className="absolute top-[30%] left-[45%] h-3 w-3 rounded-full bg-red-400/30 blur-[1px] pointer-events-none" />
            <div className="absolute top-[32%] left-[43%] h-2 w-2 rounded-full bg-red-400/25 blur-[1px] pointer-events-none" />
            <div className="absolute top-[48%] left-[38%] h-4 w-12 rounded-full bg-amber-950/25 blur-[3px] pointer-events-none" />
            <div className="absolute top-[68%] left-[34%] h-3.5 w-3.5 rounded-full bg-orange-900/35 blur-[1.5px] pointer-events-none" />
            <div className="absolute top-[70%] left-[36%] h-2.5 w-2.5 rounded-full bg-orange-950/25 blur-[1px] pointer-events-none" />
          </div>

          {/* Right Side Overlay (Clean/Recovery) masked dynamically */}
          <div 
            className="absolute inset-0 pointer-events-none select-none"
            style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={faceImage}
              alt="Skin concerns recovered"
              className="absolute inset-0 h-full w-full object-cover filter contrast-[0.98] saturate-[0.94] brightness-[1.02]"
              draggable="false"
            />
            {/* Subtle light glow on the clear skin side */}
            <div className="absolute inset-0 bg-emerald-500/[0.015] mix-blend-overlay" />
          </div>

          {/* Interactive Spot Markers (Hotspots) */}
          <div ref={containerRef} className="absolute inset-0 pointer-events-none">
            {hotspots.map((hotspot) => {
              // Hide left hotspots if the slider has swept past them, and vice versa
              const isVisible = hotspot.side === "left" 
                ? hotspot.x < sliderPosition 
                : hotspot.x > sliderPosition;

              return (
                <div
                  key={hotspot.id}
                  className={`absolute pointer-events-auto cursor-pointer transition-all duration-300 ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
                  }`}
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, transform: "translate(-50%, -50%)" }}
                  onMouseEnter={() => setActiveHotspot(hotspot.id)}
                  onMouseLeave={() => setActiveHotspot(null)}
                >
                  <div className={`h-6 w-6 rounded-full border-2 bg-white/80 dark:bg-white/80 flex items-center justify-center transition-all ${
                    activeHotspot === hotspot.id 
                      ? "scale-125 border-neon-cyan shadow-[0_0_12px_#00F2FE]" 
                      : hotspot.dotColor
                  }`}>
                    <div className={`h-2 w-2 rounded-full ${hotspot.color}`} />
                  </div>
                  
                  {/* Dynamic dashed connector link (visual cue) */}
                  {activeHotspot === hotspot.id && (
                    <div className="absolute h-[1px] border-t border-dashed border-neon-cyan/50 w-16 top-1/2 left-6 pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Draggable Vertical Slider Handle */}
          <div 
            className="absolute inset-y-0 w-0.5 bg-neon-cyan/60 dark:bg-neon-cyan/60 light:bg-slate-400 cursor-ew-resize flex items-center justify-center"
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
          >
            <div className="h-8 w-8 rounded-full border border-neon-cyan/30 bg-cyber-dark dark:bg-cyber-dark light:bg-white shadow-lg flex items-center justify-center text-neon-cyan hover:scale-105 active:scale-95 transition-all">
              <Move className="h-4 w-4" />
            </div>
            {/* Side-by-side indicator banners inside scanner */}
            <div className="absolute top-4 right-3 rounded bg-neon-cyan/80 px-1.5 py-0.5 text-[8px] font-bold text-white tracking-widest pointer-events-none select-none">
              RECOVERED
            </div>
            <div className="absolute top-4 left-3 rounded bg-red-600/80 px-1.5 py-0.5 text-[8px] font-bold text-white tracking-widest pointer-events-none select-none">
              BASELINE
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECOVERED */}
        <div className="flex-1 w-full max-w-md lg:max-w-[280px] flex flex-col justify-center gap-4 order-3">
          {hotspots.filter(h => h.side === "right").map((hotspot) => (
            <motion.div
              key={hotspot.id}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer bg-white/5 dark:bg-white/5 light:bg-white ${
                activeHotspot === hotspot.id 
                  ? "border-emerald-500 dark:border-emerald-500 light:border-emerald-500 shadow-lg dark:shadow-emerald-500/10 light:shadow-emerald-500/10 scale-[1.03]" 
                  : "border-white/10 dark:border-white/10 light:border-slate-200 shadow-xs hover:border-white/20 light:hover:border-slate-350 hover:scale-[1.01]"
              }`}
              onMouseEnter={() => setActiveHotspot(hotspot.id)}
              onMouseLeave={() => setActiveHotspot(null)}
              onClick={() => setActiveHotspot(hotspot.id)}
            >
              {/* Cropped thumbnail with clear skin details */}
              <div className="relative h-12 w-12 rounded-full overflow-hidden border border-white/10 dark:border-white/10 light:border-slate-200 flex-shrink-0 bg-slate-100 dark:bg-slate-900">
                <img
                  src={faceImage}
                  alt={hotspot.label}
                  className={`absolute h-[300%] w-[300%] object-cover max-w-none filter ${hotspot.cropFilter}`}
                  style={{
                    left: `${-hotspot.x * 2.2}%`,
                    top: `${-hotspot.y * 2.2}%`,
                  }}
                />
                <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay" />
              </div>

              <div className="text-left">
                <h4 className="text-xs font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  {hotspot.label}
                </h4>
                <p className="text-[10px] sm:text-xs text-gray-500 light:text-slate-500 leading-tight mt-0.5">{hotspot.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
