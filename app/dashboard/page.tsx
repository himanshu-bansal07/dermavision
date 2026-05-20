"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  HeartPulse, ShieldCheck, FileDown, Camera, CheckSquare, 
  Square, RefreshCw, Sparkles, TrendingUp, AlertTriangle, AlertCircle, 
  Plus, Calendar, Trash2, Clock
} from "lucide-react";
import { generateLocalReport } from "@/lib/analyzer";

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"budget" | "premium" | "dermatologist">("budget");
  const [morningDone, setMorningDone] = useState<Record<number, boolean>>({});
  const [nightDone, setNightDone] = useState<Record<number, boolean>>({});
  const [historyReports, setHistoryReports] = useState<any[]>([]);

  // Default gorgeous clinical mock dataset if local storage empty
  const defaultSurvey = {
    name: "Jane Doe",
    age: 26,
    gender: "Female",
    skinType: "Combination",
    problemDuration: "Few weeks",
    primaryConcerns: ["Acne", "Redness", "Uneven skin tone"],
    lifestyle: {
      waterIntake: "1L - 2L",
      sleepDuration: "5-6 hours",
      stressLevel: "High",
      smokingOrAlcohol: "None",
      dailyScreenTime: "9+ hours",
      foodHabits: "High sugar/dairy"
    },
    medicalBackground: {
      pregnancy: "No",
      hormonalImbalance: "Yes",
      pcos: "No",
      diabetes: "No",
      thyroid: "No",
      skinAllergies: "No",
      currentMedications: "None",
      familySkinDiseaseHistory: "Minor Eczema"
    },
    hairAndScalp: {
      dandruff: "Mild",
      hairThinning: "No",
      hairFallSeverity: "Moderate",
      scalpItching: "Mild"
    }
  };

  const defaultTf = {
    rednessScore: 48,
    luminanceScore: 62,
    varianceScore: 42,
    skinHealthEstimate: 74,
    hydrationEstimate: 66
  };

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("dermavision_user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    let parsedUser: any = null;
    try {
      parsedUser = JSON.parse(storedUser);
      setUserProfile(parsedUser);
    } catch {
      // skip
    }

    // 1. Attempt to load active scan report
    const activeReportStr = localStorage.getItem("dermavision_active_report");
    let activeReport: any = null;

    if (activeReportStr) {
      try {
        activeReport = JSON.parse(activeReportStr);
        // Correct and sanitize scores if questionnaire data is available
        if (activeReport.questionnaire) {
          const concerns = activeReport.questionnaire.primaryConcerns || [];
          const hasAcne = concerns.includes("Acne") || concerns.includes("Pimples");
          const hasPigment = concerns.includes("Dark spots") || concerns.includes("Pigmentation");
          const hasRedness = concerns.includes("Redness") || concerns.includes("Itching") || concerns.includes("Rashes");

          // Safely scale down severity if the user did not check the concern
          if (!hasAcne && activeReport.scores.acneScore > 30) {
            activeReport.scores.acneScore = Math.round(10 + (activeReport.scores.acneScore % 15));
            activeReport.diagnostics.detectedIssues = activeReport.diagnostics.detectedIssues.filter(
              (issue: any) => issue.name !== "Acne & Inflammatory Papules"
            );
          }
          if (!hasPigment) {
            activeReport.diagnostics.detectedIssues = activeReport.diagnostics.detectedIssues.filter(
              (issue: any) => issue.name !== "Epidermal Hyperpigmentation"
            );
          }
          if (!hasRedness && activeReport.scores.sensitivityScore > 35) {
            activeReport.scores.sensitivityScore = Math.round(12 + (activeReport.scores.sensitivityScore % 12));
            activeReport.diagnostics.detectedIssues = activeReport.diagnostics.detectedIssues.filter(
              (issue: any) => issue.name !== "Erythema & Skin Irritation"
            );
          }
          
          // Recompute Skin Health
          const acnePurity = 100 - activeReport.scores.acneScore;
          activeReport.scores.skinHealthScore = Math.round(
            (activeReport.scores.hydrationScore * 0.3) +
            (acnePurity * 0.35) +
            (activeReport.scores.glowScore * 0.2) +
            ((100 - activeReport.scores.sensitivityScore) * 0.15)
          );
        }
        setReport(activeReport);
      } catch (err) {
        console.error("Error parsing stored report:", err);
      }
    }

    // If empty, don't generate mock report - user must scan first
    if (!activeReport) {
      setReport(null);
    }

    // 2. Load historic timeline reports
    const storedHistory = localStorage.getItem("dermavision_scan_history");
    if (storedHistory) {
      try {
        setHistoryReports(JSON.parse(storedHistory));
      } catch {
        // skip
      }
    } else {
      // Mock history records
      const activeName = parsedUser?.name || "Jane Doe";
      const activeAge = parsedUser?.age ? parseInt(parsedUser.age.toString()) : 26;
      const activeGender = parsedUser?.gender || "Female";
      
      const personalizedSurvey = {
        ...defaultSurvey,
        name: activeName,
        age: activeAge,
        gender: activeGender
      };

      const mockHist1 = generateLocalReport(personalizedSurvey, { ...defaultTf, rednessScore: 60, varianceScore: 55, skinHealthEstimate: 62 });
      const mockHist2 = generateLocalReport(personalizedSurvey, { ...defaultTf, rednessScore: 52, varianceScore: 48, skinHealthEstimate: 68 });
      
      const compileHist = [
        {
          _id: "hist_1",
          scores: mockHist1.scores,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days ago
        },
        {
          _id: "hist_2",
          scores: mockHist2.scores,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
        }
      ];
      setHistoryReports(compileHist);
      localStorage.setItem("dermavision_scan_history", JSON.stringify(compileHist));
    }
  }, [router]);

  const triggerPDFDownload = () => {
    // Standard print triggering (leveraging optimized print CSS selectors inside globals.css)
    window.print();
  };

  const wipeReport = () => {
    localStorage.removeItem("dermavision_active_report");
    window.location.reload();
  };

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="h-8 w-8 rounded-full border-4 border-white/20 border-t-neon-cyan animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex-1 w-full mx-auto max-w-4xl px-4 py-12 sm:px-6 flex flex-col items-center justify-center">
        <div className="glass-panel rounded-3xl p-8 max-w-md mx-auto border border-white/10 text-center space-y-6">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-neon-cyan/20 mx-auto">
            <Camera className="h-8 w-8 text-neon-cyan" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-black text-white dark:text-white light:text-slate-900">
              No Scan Yet
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Complete your first skin analysis scan to view your personalized clinical dashboard with AI-powered predictions.
            </p>
          </div>

          <Link
            href="/scan"
            className="inline-flex items-center justify-center gap-1.5 h-12 px-8 rounded-xl bg-linear-to-r from-neon-cyan to-neon-purple text-sm font-bold text-white shadow-md shadow-neon-cyan/15 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Camera className="h-5 w-5" /> Start Your First Scan
          </Link>
        </div>
      </div>
    );
  }

  // Visual helper for circular SVG dials
  const renderDial = (title: string, value: number, colorClass: string, strokeHex: string) => {
    const radius = 32;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (value / 100) * circ;

    return (
      <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/[0.02] border border-white/5 relative z-10 text-center">
        <div className="relative h-18 w-18 flex items-center justify-center">
          <svg className="h-full w-full transform -rotate-90">
            {/* Background base path */}
            <circle
              cx="36"
              cy="36"
              r={radius}
              className="stroke-white/5 dark:stroke-white/5 light:stroke-slate-200 fill-none"
              strokeWidth="5"
            />
            {/* Dynamic visual path */}
            <circle
              cx="36"
              cy="36"
              r={radius}
              stroke={strokeHex}
              strokeDasharray={circ}
              strokeDashoffset={offset}
              className="fill-none transition-all duration-500 ease-out"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-sm font-black text-white dark:text-white light:text-slate-900">{value}</span>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">{title}</span>
      </div>
    );
  };

  return (
    <div className="flex-1 w-full mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-700">
      
      {/* 1. Patient Metadata Summary Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6 no-print">
        <div className="text-left">
          <span className="text-[10px] uppercase font-bold tracking-widest text-neon-cyan flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-neon-green" /> Sandboxed HIPAA Patient Record
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white dark:text-white light:text-slate-900 mt-1">
            Clinical Dashboard
          </h1>
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1 flex-wrap">
            <span>Patient: <strong className="text-gray-300 dark:text-gray-300 light:text-slate-700">{report.patientDetails.name}</strong></span>
            <span>Age: <strong className="text-gray-300 dark:text-gray-300 light:text-slate-700">{report.patientDetails.age}</strong></span>
            <span>Gender: <strong className="text-gray-300 dark:text-gray-300 light:text-slate-700">{report.patientDetails.gender}</strong></span>
            <span>Skin: <strong className="text-gray-300 dark:text-gray-300 light:text-slate-700">{report.questionnaire.skinType}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={triggerPDFDownload}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-white/5 text-xs font-bold text-gray-300 light:text-slate-700 hover:bg-white/10 transition-all cursor-pointer"
          >
            <FileDown className="h-4 w-4" /> Download PDF Report
          </button>

          <Link
            href="/scan"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-linear-to-r from-neon-cyan to-neon-purple text-xs font-bold text-white shadow-md shadow-neon-cyan/15 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Camera className="h-4 w-4" /> New Scan
          </Link>
          
          <button
            onClick={wipeReport}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-neon-rose/10 hover:bg-neon-rose/20 text-neon-rose border border-neon-rose/15 cursor-pointer"
            title="Reset Active Session"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. Diagnostic Core Scores HUD Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {renderDial("Skin Health", report.scores.skinHealthScore, "text-neon-cyan", "#00F2FE")}
        {renderDial("Hydration", report.scores.hydrationScore, "text-neon-cyan", "#00F2FE")}
        {renderDial("Acne Severity", report.scores.acneScore, "text-neon-purple", "#9b51e0")}
        {renderDial("Skin Glow", report.scores.glowScore, "text-neon-cyan", "#00F2FE")}
        {renderDial("Sensitivity", report.scores.sensitivityScore, "text-neon-rose", "#FF4B72")}
      </div>

      {/* 3. Findings, Slider & Age Estimator Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Diagnostic Findings & Age */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 text-left space-y-5">
            <div className="border-b border-white/5 pb-3 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-extrabold text-white dark:text-white light:text-slate-900">Clinical Diagnostic Findings</h3>
                <span className="text-[10px] text-gray-500 block mt-0.5 font-mono">NEURAL COMPUTER VISION DETECTIONS</span>
              </div>
              <div className="rounded-lg bg-neon-cyan/10 px-2 py-0.5 text-[9px] font-bold text-neon-cyan tracking-wider border border-neon-cyan/20">
                Confidence: {report.diagnostics.confidencePercentage}%
              </div>
            </div>

            {/* List Detections */}
            <div className="space-y-4">
              {report.diagnostics.detectedIssues.map((issue: any, idx: number) => {
                const isSevere = issue.severity === "Severe";
                const isMod = issue.severity === "Moderate";
                return (
                  <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-white/[0.01] border border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-200 dark:text-gray-200 light:text-slate-800">{issue.name}</span>
                      
                      <div className="flex items-center gap-2">
                        <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold tracking-widest uppercase ${
                          isSevere 
                            ? "bg-neon-rose/10 text-neon-rose border border-neon-rose/15" 
                            : isMod 
                              ? "bg-neon-amber/10 text-neon-amber border border-neon-amber/15" 
                              : "bg-neon-green/10 text-neon-green border border-neon-green/15"
                        }`}>
                          {issue.severity} Severity
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar for Confidence */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div 
                          className="h-full bg-linear-to-r from-neon-cyan to-neon-purple transition-all duration-500"
                          style={{ width: `${issue.confidence}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-gray-500">{issue.confidence}% Match</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Skin age estimator block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/5">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-neon-cyan/[0.01] border border-neon-cyan/10">
                <Clock className="h-5 w-5 text-neon-cyan shrink-0" />
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Estimated Skin Age</span>
                  <span className="text-base font-black text-white dark:text-white light:text-slate-900 block">
                    {report.diagnostics.skinAgeEstimation} Years
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-neon-purple/[0.01] border border-neon-purple/10">
                <TrendingUp className="h-5 w-5 text-neon-purple shrink-0" />
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Target Biological Age</span>
                  <span className="text-base font-black text-white dark:text-white light:text-slate-900 block">
                    {report.patientDetails.age} Years
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Routines checklists */}
        <div className="space-y-6">
          
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 text-left space-y-4 min-h-[460px]">
            <div className="border-b border-white/5 pb-2">
              <h3 className="text-base font-extrabold text-white dark:text-white light:text-slate-900 flex items-center gap-1.5">
                <Calendar className="h-4.5 w-4.5 text-neon-cyan" /> Actionable Skincare Routine
              </h3>
              <span className="text-[10px] text-gray-500 font-mono block mt-0.5">DAILY CLINICAL SCHEDULE CHECKLISTS</span>
            </div>

            {/* Morning routines */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-neon-cyan border-b border-neon-cyan/10 pb-1">
                Morning Schedule
              </h4>
              <ul className="space-y-2">
                {report.recommendations.morningRoutine.map((item: string, idx: number) => {
                  const done = morningDone[idx] || false;
                  return (
                    <li 
                      key={idx}
                      onClick={() => setMorningDone({...morningDone, [idx]: !done})}
                      className="flex items-start gap-2.5 text-xs text-gray-400 leading-normal hover:text-white transition-colors cursor-pointer select-none"
                    >
                      {done 
                        ? <CheckSquare className="h-4 w-4 text-neon-green shrink-0 mt-0.5" /> 
                        : <Square className="h-4 w-4 text-white/20 shrink-0 mt-0.5" />
                      }
                      <span className={done ? "line-through text-gray-600" : ""}>{item}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Night routines */}
            <div className="space-y-3 pt-3 border-t border-white/5">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-neon-purple border-b border-neon-purple/10 pb-1">
                Night Schedule
              </h4>
              <ul className="space-y-2">
                {report.recommendations.nightRoutine.map((item: string, idx: number) => {
                  const done = nightDone[idx] || false;
                  return (
                    <li 
                      key={idx}
                      onClick={() => setNightDone({...nightDone, [idx]: !done})}
                      className="flex items-start gap-2.5 text-xs text-gray-400 leading-normal hover:text-white transition-colors cursor-pointer select-none"
                    >
                      {done 
                        ? <CheckSquare className="h-4 w-4 text-neon-green shrink-0 mt-0.5" /> 
                        : <Square className="h-4 w-4 text-white/20 shrink-0 mt-0.5" />
                      }
                      <span className={done ? "line-through text-gray-600" : ""}>{item}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Historic Scans Timeline */}
          <div className="glass-panel rounded-3xl p-5 border border-white/10 text-left space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-neon-cyan" /> Patient Timeline Comparison
            </h4>
            
            <div className="space-y-3">
              {historyReports.map((hist, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.01] border border-white/5 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-neon-cyan" />
                    <span className="font-bold text-gray-300">Skin Health: {hist.scores?.skinHealthScore || 70}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {new Date(hist.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 4. Price-Segmented Recommended Products Section */}
      <div className="glass-panel rounded-3xl p-5 sm:p-8 border border-white/10 text-left space-y-6">
        <div className="border-b border-white/5 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-base font-extrabold text-white dark:text-white light:text-slate-900">Customized Product Catalog</h3>
            <span className="text-[10px] text-gray-500 font-mono block mt-0.5">INGREDIENT MATCHED TOPICALS</span>
          </div>

          {/* Toggles for segment brackets */}
          <div className="flex rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 p-1 border border-white/10 w-full sm:w-auto">
            {(["budget", "premium", "dermatologist"] as const).map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-none h-8 px-5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-linear-to-tr from-neon-cyan to-neon-purple text-white shadow-md shadow-neon-cyan/20 scale-105"
                    : "text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white light:text-slate-650 light:hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {report.recommendations.products[activeTab].map((prod: any, idx: number) => {
            const isCleanser = prod.type?.toLowerCase().includes("cleanse");
            const isSerum = prod.type?.toLowerCase().includes("serum");
            const badgeClass = isCleanser
              ? "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20"
              : isSerum
              ? "bg-neon-purple/10 text-neon-purple border-neon-purple/20"
              : "bg-emerald-500/10 text-emerald-550 border-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/20";

            return (
              <div 
                key={idx} 
                className="group rounded-2xl bg-white/[0.02] dark:bg-white/[0.02] light:bg-slate-100/60 border border-white/10 dark:border-white/10 light:border-slate-200/90 p-5 hover:border-neon-cyan/30 hover:shadow-lg dark:hover:shadow-neon-cyan/5 hover:scale-[1.03] transition-all duration-300 flex flex-col justify-between min-h-[220px]"
              >
                <div className="space-y-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider border inline-block ${badgeClass}`}>
                    {prod.type}
                  </span>

                  <div className="space-y-1">
                    <h4 className="text-sm sm:text-base font-extrabold text-white dark:text-white light:text-slate-900 group-hover:text-neon-cyan transition-colors truncate">
                      {prod.name}
                    </h4>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-500 light:text-slate-500 block">
                      {prod.brand}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {prod.activeIngredients.map((ing: string, iidx: number) => (
                      <span 
                        key={iidx} 
                        className="rounded-lg bg-white/5 dark:bg-white/5 light:bg-slate-200/65 px-2 py-0.5 text-[8px] sm:text-[9px] font-semibold text-gray-300 dark:text-gray-300 light:text-slate-700 border border-white/5 dark:border-white/5 light:border-slate-300/40"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 dark:border-white/5 light:border-slate-200 text-[10px] text-gray-400 dark:text-gray-400 light:text-slate-650 leading-relaxed flex items-start gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-neon-cyan shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white dark:text-white light:text-slate-900 block text-[9px] uppercase tracking-wider mb-0.5">Clinical Usage</span>
                    {prod.usage}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Precaution and Medicines Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Medicines OTC creep solutions */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 text-left space-y-4">
          <div className="border-b border-white/5 pb-2">
            <h3 className="text-base font-extrabold text-neon-cyan flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 animate-pulse" /> Possible Helpful OTC Medicines
            </h3>
            <span className="text-[10px] text-gray-500 font-mono block mt-0.5">DRUG AND MEDICATED TOPICAL CATALOGS</span>
          </div>

          <div className="space-y-3">
            {report.medicinesAndPrecautions.possibleHelpfulMedicines.map((med: string, idx: number) => (
              <div key={idx} className="flex gap-2.5 items-start p-3 rounded-xl bg-neon-cyan/[0.01] border border-neon-cyan/10">
                <AlertCircle className="h-4.5 w-4.5 text-neon-cyan shrink-0 mt-0.5" />
                <span className="text-xs text-gray-300 dark:text-gray-300 light:text-slate-700 leading-relaxed font-semibold">{med}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Precaution grids lists */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 text-left space-y-5">
          <div className="border-b border-white/5 pb-2">
            <h3 className="text-base font-extrabold text-white dark:text-white light:text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="h-4.5 w-4.5 text-neon-cyan animate-pulse" /> Clinical Guidelines & Diet
            </h3>
            <span className="text-[10px] text-gray-500 font-mono block mt-0.5">AVOIDANCE AND HYGIENE BLUEPRINTS</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-neon-cyan">Dermatological Guidelines</h4>
              <ul className="space-y-1 text-xs text-gray-400 dark:text-gray-400 light:text-slate-700">
                {report.medicinesAndPrecautions.precautions.map((p: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-normal">
                    <span className="h-1.5 w-1.5 rounded-full bg-neon-rose shrink-0 mt-1.5" /> <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-neon-purple">Foods & Drinks to Avoid</h4>
              <ul className="space-y-1 text-xs text-gray-400 dark:text-gray-400 light:text-slate-700">
                {report.medicinesAndPrecautions.foodsToAvoid.map((f: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-normal">
                    <span className="h-1.5 w-1.5 rounded-full bg-neon-purple shrink-0 mt-1.5" /> <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-neon-cyan">Hygiene & Pillowcase Guidelines</h4>
              <ul className="space-y-1 text-xs text-gray-400 dark:text-gray-400 light:text-slate-700">
                {report.medicinesAndPrecautions.hygieneRecommendations.map((h: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-normal">
                    <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan shrink-0 mt-1.5" /> <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
