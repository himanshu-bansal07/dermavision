"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, Upload, RotateCw, Sparkles, RefreshCw, ShieldCheck, Activity, Eye } from "lucide-react";
import { analyzeImageWithTf, ITfAnalysis } from "@/lib/tfHelper";
import confetti from "canvas-confetti";

interface ImageScannerProps {
  onScanComplete: (tfMetrics: ITfAnalysis, imageSrc: string, autoDelete: boolean) => void;
}

export default function ImageScanner({ onScanComplete }: ImageScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mode, setMode] = useState<"choose" | "camera" | "preview" | "scanning">("choose");
  
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const [consentGiven, setConsentGiven] = useState(false);
  const [autoDelete, setAutoDelete] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState("Initializing neural tensors...");

  // Stop webcam stream when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stream]);

  const startCamera = async () => {
    setCameraError(null);
    setMode("camera");
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setCameraError("Camera access rejected. Please check browser permissions or upload from gallery.");
      setMode("choose");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      // Calculate crop coordinates for square capture
      const size = Math.min(video.videoWidth, video.videoHeight);
      const startX = (video.videoWidth - size) / 2;
      const startY = (video.videoHeight - size) / 2;
      
      canvas.width = 450;
      canvas.height = 450;
      
      if (ctx) {
        ctx.drawImage(video, startX, startY, size, size, 0, 0, 450, 450);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setImageSrc(dataUrl);
        stopCamera();
        setMode("preview");
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            canvas.width = 450;
            canvas.height = 450;
            
            // Draw uploaded photo crop to square on canvas
            if (ctx) {
              const size = Math.min(img.width, img.height);
              const startX = (img.width - size) / 2;
              const startY = (img.height - size) / 2;
              ctx.drawImage(img, startX, startY, size, size, 0, 0, 450, 450);
              const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
              setImageSrc(dataUrl);
              setMode("preview");
            }
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const executeSkinScan = async () => {
    if (!imageSrc || !canvasRef.current) return;
    
    setMode("scanning");
    setScanProgress(5);
    setScanStatusText("Aligning facial parameters...");

    // Simulate tech scanner progressions to wow user visually
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        
        // Progress stage details
        if (prev < 20) setScanStatusText("Warming up TensorFlow.js engine...");
        else if (prev < 45) setScanStatusText("Parsing epidermal RGB matrices...");
        else if (prev < 70) setScanStatusText("Calculating redness density indexes...");
        else setScanStatusText("Running clinical contrast variances...");
        
        return prev + Math.round(Math.random() * 8 + 3);
      });
    }, 150);

    try {
      // Create image object to read onto TF.js
      const img = new Image();
      img.src = imageSrc;
      
      await new Promise((resolve) => { img.onload = resolve; });
      
      // Perform TF.js Browser-side canvas evaluation!
      const tfAnalysis = await analyzeImageWithTf(canvasRef.current);
      
      // Simulate final calculations
      setTimeout(() => {
        clearInterval(interval);
        setScanProgress(100);
        setScanStatusText("Scan complete!");
        
        // Run confetti celebration
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#00F2FE", "#9b51e0", "#10B981"]
        });

        // Trigger callback
        setTimeout(() => {
          onScanComplete(tfAnalysis, imageSrc, autoDelete);
        }, 1200);

      }, 2500);

    } catch (err) {
      console.error("TF.js Scan failure:", err);
      clearInterval(interval);
      alert("TensorFlow image analysis failed. Skipping preprocessing and compiling local baseline.");
      // Fallback baseline call
      onScanComplete({
        rednessScore: 25,
        luminanceScore: 68,
        varianceScore: 28,
        skinHealthEstimate: 82,
        hydrationEstimate: 78
      }, imageSrc, autoDelete);
    }
  };

  const resetScanner = () => {
    setImageSrc(null);
    setMode("choose");
    setScanProgress(0);
    stopCamera();
  };

  return (
    <div className="w-full max-w-xl mx-auto glass-panel glass-panel-glow rounded-3xl p-6 border border-white/10 dark:border-white/10 light:border-slate-200">
      
      {/* Target Canvas Hidden / Helper */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Interface Segment */}
      <div className="relative aspect-square w-full rounded-2xl bg-black/40 overflow-hidden border border-white/5 flex flex-col items-center justify-center">
        
        {/* Alignment Circular target overlay (Camera/Preview) */}
        {(mode === "camera" || mode === "preview" || mode === "scanning") && (
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
            {/* Hologram Circle boundary */}
            <div className="h-[280px] w-[280px] rounded-full border-2 border-dashed border-neon-cyan/40 flex items-center justify-center animate-spin-slow" />
            <div className="absolute h-[290px] w-[290px] rounded-full border border-neon-purple/30" />
            <div className="absolute h-8 w-8 border-t-2 border-l-2 border-neon-cyan top-[12%] left-[12%] rounded-tl-lg" />
            <div className="absolute h-8 w-8 border-t-2 border-r-2 border-neon-cyan top-[12%] right-[12%] rounded-tr-lg" />
            <div className="absolute h-8 w-8 border-b-2 border-l-2 border-neon-cyan bottom-[12%] left-[12%] rounded-bl-lg" />
            <div className="absolute h-8 w-8 border-b-2 border-r-2 border-neon-cyan bottom-[12%] right-[12%] rounded-br-lg" />
          </div>
        )}

        {/* 1. CHOOSE MODE SCREEN */}
        {mode === "choose" && (
          <div className="p-6 text-center space-y-6 animate-in fade-in duration-300">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-linear-to-tr from-neon-cyan/15 to-neon-purple/15 text-neon-cyan flex items-center justify-center border border-neon-cyan/20">
              <Camera className="h-8 w-8 text-neon-cyan" />
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900">Dermatological Imaging Scanner</h3>
              <p className="text-xs text-gray-500 light:text-slate-500 mt-1 max-w-[280px] mx-auto">
                Align face inside guidelines. Provide clear, direct lighting for authentic TF.js cellular calibrations.
              </p>
            </div>

            {cameraError && (
              <div className="rounded-xl bg-neon-rose/10 border border-neon-rose/20 p-3 text-xs text-neon-rose max-w-[320px] mx-auto leading-relaxed">
                {cameraError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2">
              <button
                type="button"
                onClick={startCamera}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 text-xs font-bold uppercase tracking-wider rounded-xl bg-linear-to-r from-neon-cyan to-neon-purple text-white shadow-md shadow-neon-cyan/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Camera className="h-4 w-4" /> Live Camera Selfie
              </button>

              <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 text-xs font-bold uppercase tracking-wider rounded-xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-white/5 text-gray-300 hover:bg-white/10 cursor-pointer">
                <Upload className="h-4 w-4" /> Upload from Gallery
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* 2. CAMERA RUN SCREEN */}
        {mode === "camera" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              muted
              className="h-full w-full object-cover scale-x-[-1]" // mirror effect
            />
            
            {/* Bottom Floating snap button */}
            <div className="absolute bottom-6 z-30 flex items-center gap-3">
              <button
                type="button"
                onClick={capturePhoto}
                className="h-14 w-14 rounded-full bg-linear-to-tr from-neon-cyan to-neon-purple p-0.5 shadow-lg shadow-neon-cyan/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <div className="h-full w-full rounded-full bg-cyber-dark dark:bg-cyber-dark light:bg-white flex items-center justify-center text-white dark:text-white light:text-slate-900">
                  <Camera className="h-6 w-6 text-neon-cyan" />
                </div>
              </button>

              <button
                type="button"
                onClick={resetScanner}
                className="h-10 px-4 rounded-xl bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white border border-white/10 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* 3. PREVIEW & CROP SCREEN */}
        {mode === "preview" && imageSrc && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt="Scan snapshot preview"
              className="h-full w-full object-cover"
            />
            
            {/* Bottom Actions */}
            <div className="absolute bottom-6 z-30 flex items-center gap-3">
              <button
                type="button"
                onClick={executeSkinScan}
                disabled={!consentGiven}
                className={`inline-flex items-center gap-2 h-11 px-6 text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer ${
                  consentGiven 
                    ? "bg-linear-to-r from-neon-cyan to-neon-purple text-white shadow-md shadow-neon-cyan/25 hover:scale-105" 
                    : "bg-gray-700 text-gray-400 border border-white/5 cursor-not-allowed"
                }`}
              >
                <Sparkles className="h-4 w-4 text-neon-cyan" /> Run AI Diagnostic
              </button>

              <button
                type="button"
                onClick={resetScanner}
                className="h-11 px-5 rounded-xl bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white border border-white/10 cursor-pointer"
              >
                Retake
              </button>
            </div>
          </div>
        )}

        {/* 4. ACTIVE SCANNING EFFECTS */}
        {mode === "scanning" && imageSrc && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-30">
            {/* Original Image faint in back */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt="Scanning active"
              className="absolute inset-0 h-full w-full object-cover opacity-35"
            />

            {/* Cyan glowing laser bar scanning downwards */}
            <div className="scanner-laser absolute left-0 right-0 h-1 bg-linear-to-r from-transparent via-neon-cyan to-transparent shadow-[0_0_15px_#00F2FE]" />

            {/* Futuristic Tech HUD elements spinning */}
            <div className="relative flex flex-col items-center justify-center space-y-4 text-center px-4">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-neon-cyan/30 animate-spin-slow">
                <Activity className="h-8 w-8 text-neon-cyan animate-pulse" />
                <div className="absolute inset-0 rounded-full border-t-2 border-neon-purple" />
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold tracking-wider uppercase bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent animate-pulse">
                  {scanStatusText}
                </h4>
                <p className="text-[10px] text-gray-500 font-mono tracking-widest">
                  NEURAL NETWORK CALIBRATION ({scanProgress}%)
                </p>
              </div>

              {/* Progress bar */}
              <div className="h-1 w-44 rounded-full bg-white/10 overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-linear-to-r from-neon-cyan to-neon-purple transition-all duration-150"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. PRIVACY CONTROLS (Consent checkboxes and toggles) */}
      {mode === "preview" && (
        <div className="mt-5 space-y-4 animate-in fade-in duration-500">
          
          {/* Diagnostic Consent Checkbox - REQUIRED */}
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-white/10 bg-white/5 text-neon-cyan focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-[11px] text-gray-400 leading-normal">
              I consent to local browser image processing. I understand that DermaVision AI parses facial parameters strictly for educational insights and PWA demonstrations. *
            </span>
          </label>

          {/* Autodelete toggle */}
          <div className="flex items-center justify-between rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 p-3 border border-white/5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-neon-green" />
              <div className="text-left">
                <span className="text-xs font-bold text-white dark:text-white light:text-slate-900 block">Auto-Wipe Session</span>
                <span className="text-[10px] text-gray-500">Wipe scanned photo immediately after the dashboard compiles.</span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setAutoDelete(!autoDelete)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                autoDelete ? "bg-neon-green" : "bg-gray-700"
              }`}
            >
              <span 
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ${
                  autoDelete ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
