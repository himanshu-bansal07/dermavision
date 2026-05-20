"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Eye, Info } from "lucide-react";

interface BeforeAfterSliderProps {
  imageSrc?: string;
}

export default function BeforeAfterSlider({ imageSrc }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Default elegant medical portrait face if user uploaded image is wiped/empty due to autodelete
  const defaultMockFace = "/images/user-photo.png";

  const activeImage = imageSrc || defaultMockFace;

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-1.5">
          <Sparkles className="h-4.5 w-4.5 text-neon-cyan animate-pulse" /> 4-Week Skin Recovery Projection
        </h4>
        <div className="flex items-center gap-1 text-[10px] text-gray-500">
          <Info className="h-3 w-3 text-neon-cyan" />
          <span>Drag slider to preview clear skin prediction</span>
        </div>
      </div>

      {/* Split Slider Viewport */}
      <div 
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 dark:border-white/10 light:border-slate-200 select-none cursor-ew-resize bg-slate-950"
      >
        {/* Left Side: Original Image (Shows full viewport) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeImage}
          alt="Original Selfie"
          className="absolute inset-0 h-full w-full object-cover"
          draggable="false"
        />
        <div className="absolute top-3 left-3 z-30 rounded-lg bg-cyber-dark/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-neon-rose border border-neon-rose/25">
          Day 0: Original
        </div>

        {/* Right Side: Projections (Masked based on sliderPosition using clip-path) */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
        >
          {/* Masked predicted outcome image with custom beauty filters: desaturate redness, blur bump details */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImage}
            alt="Skin projection outcome"
            className="absolute inset-0 h-full w-full object-cover filter contrast-[1.05] brightness-[1.03] saturate-[0.9] blur-[0.4px]"
            draggable="false"
          />
          {/* Subtle skin clarity overlay */}
          <div className="absolute inset-0 bg-neon-cyan/[0.03] mix-blend-overlay" />
          
          <div className="absolute top-3 right-3 z-30 rounded-lg bg-linear-to-r from-neon-cyan/80 to-neon-purple/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow border border-neon-cyan/20">
            Day 30: Clear Projection
          </div>
        </div>

        {/* Vertical Split Line Handle */}
        <div 
          className="absolute inset-y-0 w-0.5 bg-linear-to-b from-neon-cyan via-neon-purple to-neon-cyan shadow-[0_0_10px_#00F2FE]"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neon-cyan bg-cyber-dark dark:bg-cyber-dark light:bg-white flex items-center justify-center shadow-lg cursor-grab">
            <Eye className="h-4 w-4 text-neon-cyan animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
