"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Sparkles, Activity, FileText, CheckCircle, 
  ArrowRight, ArrowLeft, Heart, Info, ClipboardList, ShieldAlert
} from "lucide-react";

export interface ISurveyData {
  name: string;
  age: number;
  gender: string;
  skinType: string;
  problemDuration: string;
  primaryConcerns: string[];
  lifestyle: {
    waterIntake: string;
    sleepDuration: string;
    stressLevel: string;
    smokingOrAlcohol: string;
    dailyScreenTime: string;
    foodHabits: string;
  };
  medicalBackground: {
    pregnancy: string;
    hormonalImbalance: string;
    pcos: string;
    diabetes: string;
    thyroid: string;
    skinAllergies: string;
    currentMedications: string;
    familySkinDiseaseHistory: string;
  };
  hairAndScalp: {
    dandruff: string;
    hairThinning: string;
    hairFallSeverity: string;
    scalpItching: string;
  };
  acknowledgements: {
    privacyPolicy: boolean;
    termsOfService: boolean;
    aiConsent: boolean;
  };
}

interface OnboardingFormProps {
  onComplete: (data: ISurveyData) => void;
}

const steps = [
  { id: "personal", title: "Demographics", icon: User },
  { id: "skin", title: "Skin Profile", icon: Sparkles },
  { id: "lifestyle", title: "Lifestyle", icon: Activity },
  { id: "medical", title: "Medical History", icon: ClipboardList },
  { id: "hair", title: "Hair & Scalp", icon: Heart },
  { id: "consent", title: "Consent", icon: ShieldAlert }
];

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ISurveyData>({
    name: "",
    age: 25,
    gender: "Female",
    skinType: "Normal",
    problemDuration: "Few days",
    primaryConcerns: [],
    lifestyle: {
      waterIntake: "2L - 3L",
      sleepDuration: "7-8 hours",
      stressLevel: "Moderate",
      smokingOrAlcohol: "None",
      dailyScreenTime: "3-6 hours",
      foodHabits: "Balanced"
    },
    medicalBackground: {
      pregnancy: "No",
      hormonalImbalance: "No",
      pcos: "No",
      diabetes: "No",
      thyroid: "No",
      skinAllergies: "No",
      currentMedications: "",
      familySkinDiseaseHistory: ""
    },
    hairAndScalp: {
      dandruff: "None",
      hairThinning: "No",
      hairFallSeverity: "Low",
      scalpItching: "No"
    },
    acknowledgements: {
      privacyPolicy: false,
      termsOfService: false,
      aiConsent: false
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (stepIndex: number): boolean => {
    const tempErrors: Record<string, string> = {};
    if (stepIndex === 0) {
      if (!formData.name.trim()) tempErrors.name = "Full name is required";
      if (!formData.age || formData.age <= 0 || formData.age > 110) tempErrors.age = "Please provide a valid age";
    }
    if (stepIndex === 5) {
      if (!formData.acknowledgements.privacyPolicy || !formData.acknowledgements.termsOfService || !formData.acknowledgements.aiConsent) {
        tempErrors.acknowledgements = "All acknowledgements are required to proceed.";
      }
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        onComplete(formData);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const toggleConcern = (concern: string) => {
    setFormData((prev) => {
      const concerns = [...prev.primaryConcerns];
      const index = concerns.indexOf(concern);
      if (index > -1) {
        concerns.splice(index, 1);
      } else {
        concerns.push(concern);
      }
      return { ...prev, primaryConcerns: concerns };
    });
  };

  const concernsList = [
    "Acne", "Pimples", "Dark spots", "Pigmentation", "Wrinkles", "Dry skin", 
    "Oily skin", "Redness", "Itching", "Hair fall", "Dandruff", 
    "Blackheads", "Whiteheads", "Skin allergy", "Rashes", "Uneven skin tone"
  ];

  return (
    <div className="w-full max-w-5xl mx-auto glass-panel glass-panel-glow rounded-3xl overflow-hidden border border-white/10 dark:border-white/10 light:border-slate-200 flex flex-col sm:flex-row min-h-[560px]">

      {/* ── LEFT SIDEBAR: Step Navigation ── */}
      <div className="sm:w-64 shrink-0 bg-slate-50/50 dark:bg-white/[0.02] border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-white/5 p-6 flex flex-row sm:flex-col gap-2 overflow-x-auto sm:overflow-visible">
        {/* Branding */}
        <div className="hidden sm:block mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500">Clinical Survey</p>
          <p className="text-xs text-slate-500 dark:text-gray-600 mt-0.5">{currentStep + 1} of {steps.length} completed</p>
          {/* Progress bar */}
          <div className="mt-3 h-1 w-full rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-linear-to-r from-neon-cyan to-neon-purple transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => { if (idx < currentStep) setCurrentStep(idx); }}
              disabled={idx > currentStep}
              className={`group flex items-center gap-3 shrink-0 sm:shrink sm:w-full px-3 py-2.5 rounded-xl transition-all duration-300 text-left focus:outline-none cursor-pointer ${
                isActive
                  ? "bg-neon-cyan/10 border border-neon-cyan/25 shadow-sm shadow-neon-cyan/10"
                  : isCompleted
                    ? "hover:bg-slate-100 dark:hover:bg-white/5 opacity-80"
                    : "opacity-40 cursor-not-allowed"
              }`}
            >
              {/* Step icon bubble */}
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 ${
                isActive
                  ? "bg-linear-to-tr from-neon-cyan to-neon-purple border-none text-white shadow-md shadow-neon-cyan/30"
                  : isCompleted
                    ? "bg-neon-green/10 border-neon-green/30 text-neon-green"
                    : "bg-slate-50 border-slate-200 text-slate-400 dark:bg-white/5 dark:border-white/10 dark:text-gray-500"
              }`}>
                {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <div className="hidden sm:block min-w-0">
                <p className={`text-[11px] font-bold uppercase tracking-widest truncate ${isActive ? "text-neon-cyan" : isCompleted ? "text-neon-green" : "text-slate-500 dark:text-gray-500"}`}>
                  {step.title}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-gray-600 mt-0.5">Step {idx + 1}</p>
              </div>
              {/* Active indicator dot */}
              {isActive && <div className="hidden sm:block ml-auto h-2 w-2 rounded-full bg-neon-cyan shadow-[0_0_6px_#06b6d4] shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* ── RIGHT PANEL: Form Content ── */}
      <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
        <div className="flex-1">


      {/* Forms Segment container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex-1"
          >
            {/* STEP 1: PERSONAL DETAILS */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-neon-cyan" /> Patient Information
                  </h3>
                  <p className="text-xs text-gray-500 light:text-slate-500 mt-1">Please provide basic clinical parameters for age and gender calibration.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={`w-full h-11 px-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border text-sm focus:outline-none focus:border-neon-cyan transition-all text-white dark:text-white light:text-slate-950 ${
                        errors.name ? "border-neon-rose" : "border-white/10 dark:border-white/10 light:border-slate-200"
                      }`}
                    />
                    {errors.name && <p className="text-xs text-neon-rose font-medium mt-1">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Biological Age *</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 28"
                      value={formData.age || ""}
                      onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 0})}
                      className={`w-full h-11 px-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border text-sm focus:outline-none focus:border-neon-cyan transition-all text-white dark:text-white light:text-slate-950 ${
                        errors.age ? "border-neon-rose" : "border-white/10 dark:border-white/10 light:border-slate-200"
                      }`}
                    />
                    {errors.age && <p className="text-xs text-neon-rose font-medium mt-1">{errors.age}</p>}
                  </div>

                  <div className="sm:col-span-2 space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Identified Gender</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {["Female", "Male", "Non-Binary", "Prefer Not to Say"].map((g) => (
                        <button
                          type="button"
                          key={g}
                          onClick={() => setFormData({...formData, gender: g})}
                          className={`h-11 rounded-xl text-xs font-bold tracking-wide border transition-all cursor-pointer ${
                            formData.gender === g
                              ? "bg-linear-to-tr from-neon-cyan to-neon-purple text-white border-none shadow-md shadow-neon-cyan/15"
                              : "bg-white/5 text-gray-400 border-white/10 dark:border-white/10 light:border-slate-200 light:text-slate-700 hover:bg-white/10"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: SKIN PROFILE & CONCERNS */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-neon-cyan" /> Skin Characteristics & Concerns
                  </h3>
                  <p className="text-xs text-gray-500 light:text-slate-500 mt-1">Select your skin type, concern duration, and check all symptoms currently active.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2.5">Your Core Skin Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {["Oily", "Dry", "Combination", "Sensitive", "Normal"].map((type) => (
                        <button
                          type="button"
                          key={type}
                          onClick={() => setFormData({...formData, skinType: type})}
                          className={`h-11 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            formData.skinType === type
                              ? "bg-linear-to-tr from-neon-cyan to-neon-purple text-white border-none shadow-md shadow-neon-cyan/15"
                              : "bg-white/5 text-gray-400 border-white/10 dark:border-white/10 light:border-slate-200 light:text-slate-700 hover:bg-white/10"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2.5">Problem Duration</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {["Few days", "Few weeks", "Few months", "More than 1 year"].map((dur) => (
                        <button
                          type="button"
                          key={dur}
                          onClick={() => setFormData({...formData, problemDuration: dur})}
                          className={`h-11 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            formData.problemDuration === dur
                              ? "bg-linear-to-tr from-neon-cyan to-neon-purple text-white border-none shadow shadow-neon-cyan/15"
                              : "bg-white/5 text-gray-400 border-white/10 dark:border-white/10 light:border-slate-200 light:text-slate-700 hover:bg-white/10"
                          }`}
                        >
                          {dur}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Primary Skin Concerns (Select all that apply)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {concernsList.map((concern) => {
                        const selected = formData.primaryConcerns.includes(concern);
                        return (
                          <button
                            type="button"
                            key={concern}
                            onClick={() => toggleConcern(concern)}
                            className={`h-9 px-3 rounded-lg text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                              selected
                                ? "bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow shadow-neon-cyan/10"
                                : "bg-white/5 text-gray-400 border-white/5 dark:border-white/5 light:border-slate-200 light:text-slate-600 hover:bg-white/10"
                            }`}
                          >
                            <span>{concern}</span>
                            {selected && <CheckCircle className="h-3.5 w-3.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: LIFESTYLE QUESTIONS */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-neon-cyan" /> Lifestyle & Daily Habits
                  </h3>
                  <p className="text-xs text-gray-500 light:text-slate-500 mt-1">Lifestyle conditions heavily govern cellular skin regeneration and sebum excretion.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Water Intake Per Day</label>
                    <select
                      value={formData.lifestyle.waterIntake}
                      onChange={(e) => setFormData({...formData, lifestyle: {...formData.lifestyle, waterIntake: e.target.value}})}
                      className="w-full h-11 px-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 text-sm focus:outline-none focus:border-neon-cyan text-white dark:text-white light:text-slate-950"
                    >
                      <option className="text-slate-950" value="Less than 1L">Less than 1 Litre</option>
                      <option className="text-slate-950" value="1L - 2L">1 to 2 Litres</option>
                      <option className="text-slate-950" value="2L - 3L">2 to 3 Litres</option>
                      <option className="text-slate-950" value="3L+">3 Litres or More</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Sleep Duration</label>
                    <select
                      value={formData.lifestyle.sleepDuration}
                      onChange={(e) => setFormData({...formData, lifestyle: {...formData.lifestyle, sleepDuration: e.target.value}})}
                      className="w-full h-11 px-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 text-sm focus:outline-none focus:border-neon-cyan text-white dark:text-white light:text-slate-950"
                    >
                      <option className="text-slate-950" value="Less than 5 hours">Less than 5 hours</option>
                      <option className="text-slate-950" value="5-6 hours">5 to 6 hours</option>
                      <option className="text-slate-950" value="7-8 hours">7 to 8 hours (Recommended)</option>
                      <option className="text-slate-950" value="9+ hours">9+ hours</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Current Stress Level</label>
                    <select
                      value={formData.lifestyle.stressLevel}
                      onChange={(e) => setFormData({...formData, lifestyle: {...formData.lifestyle, stressLevel: e.target.value}})}
                      className="w-full h-11 px-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 text-sm focus:outline-none focus:border-neon-cyan text-white dark:text-white light:text-slate-950"
                    >
                      <option className="text-slate-950" value="Low">Low Stress</option>
                      <option className="text-slate-950" value="Moderate">Moderate / Managed</option>
                      <option className="text-slate-950" value="High">High Stress Levels</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Smoking or Alcohol Intake</label>
                    <select
                      value={formData.lifestyle.smokingOrAlcohol}
                      onChange={(e) => setFormData({...formData, lifestyle: {...formData.lifestyle, smokingOrAlcohol: e.target.value}})}
                      className="w-full h-11 px-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 text-sm focus:outline-none focus:border-neon-cyan text-white dark:text-white light:text-slate-950"
                    >
                      <option className="text-slate-950" value="None">None / Abstinent</option>
                      <option className="text-slate-950" value="Occasional">Occasional / Social</option>
                      <option className="text-slate-950" value="Regular">Regular Intake</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Daily Screen Exposure</label>
                    <select
                      value={formData.lifestyle.dailyScreenTime}
                      onChange={(e) => setFormData({...formData, lifestyle: {...formData.lifestyle, dailyScreenTime: e.target.value}})}
                      className="w-full h-11 px-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 text-sm focus:outline-none focus:border-neon-cyan text-white dark:text-white light:text-slate-950"
                    >
                      <option className="text-slate-950" value="Less than 3 hours">Less than 3 hours</option>
                      <option className="text-slate-950" value="3-6 hours">3 to 6 hours</option>
                      <option className="text-slate-950" value="6-9 hours">6 to 9 hours</option>
                      <option className="text-slate-950" value="9+ hours">9+ hours (High Exposure)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Food & Diet habits</label>
                    <select
                      value={formData.lifestyle.foodHabits}
                      onChange={(e) => setFormData({...formData, lifestyle: {...formData.lifestyle, foodHabits: e.target.value}})}
                      className="w-full h-11 px-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 text-sm focus:outline-none focus:border-neon-cyan text-white dark:text-white light:text-slate-950"
                    >
                      <option className="text-slate-950" value="Balanced">Balanced (Proteins, Veggies, Fibers)</option>
                      <option className="text-slate-950" value="High sugar/dairy">High Sugar / Milk Products</option>
                      <option className="text-slate-950" value="Oily/Junk">Fast Food / Spicy Oily dishes</option>
                      <option className="text-slate-950" value="Vegan/Vegetarian">Strictly Vegetarian / Plant-based</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: MEDICAL BACKGROUND */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-neon-cyan" /> Medical Profiles & History
                  </h3>
                  <p className="text-xs text-gray-500 light:text-slate-500 mt-1">Medical background, thyroid cycles, and medications are essential safety indicators.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Pregnancy Status</label>
                    <div className="flex gap-2">
                      {["No", "Yes", "N/A"].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setFormData({...formData, medicalBackground: {...formData.medicalBackground, pregnancy: val}})}
                          className={`flex-1 h-9 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            formData.medicalBackground.pregnancy === val
                              ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                              : "bg-white/5 text-gray-400 border-white/10"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Hormonal Imbalance</label>
                    <div className="flex gap-2">
                      {["No", "Yes"].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setFormData({...formData, medicalBackground: {...formData.medicalBackground, hormonalImbalance: val}})}
                          className={`flex-1 h-9 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            formData.medicalBackground.hormonalImbalance === val
                              ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                              : "bg-white/5 text-gray-400 border-white/10"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">PCOS / PCOD Diagnosis</label>
                    <div className="flex gap-2">
                      {["No", "Yes", "N/A"].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setFormData({...formData, medicalBackground: {...formData.medicalBackground, pcos: val}})}
                          className={`flex-1 h-9 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            formData.medicalBackground.pcos === val
                              ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                              : "bg-white/5 text-gray-400 border-white/10"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Diabetes (Type 1 or 2)</label>
                    <div className="flex gap-2">
                      {["No", "Yes"].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setFormData({...formData, medicalBackground: {...formData.medicalBackground, diabetes: val}})}
                          className={`flex-1 h-9 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            formData.medicalBackground.diabetes === val
                              ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                              : "bg-white/5 text-gray-400 border-white/10"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Thyroid Condition</label>
                    <div className="flex gap-2">
                      {["No", "Yes"].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setFormData({...formData, medicalBackground: {...formData.medicalBackground, thyroid: val}})}
                          className={`flex-1 h-9 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            formData.medicalBackground.thyroid === val
                              ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                              : "bg-white/5 text-gray-400 border-white/10"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Active Skin Allergies</label>
                    <div className="flex gap-2">
                      {["No", "Yes"].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setFormData({...formData, medicalBackground: {...formData.medicalBackground, skinAllergies: val}})}
                          className={`flex-1 h-9 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            formData.medicalBackground.skinAllergies === val
                              ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                              : "bg-white/5 text-gray-400 border-white/10"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Current Active Medications</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Accutane, Spironolactone, None"
                      value={formData.medicalBackground.currentMedications}
                      onChange={(e) => setFormData({...formData, medicalBackground: {...formData.medicalBackground, currentMedications: e.target.value}})}
                      className="w-full h-11 px-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 text-sm focus:outline-none focus:border-neon-cyan text-white dark:text-white light:text-slate-950"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Family Skin Disease History</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Eczema, Psoriasis, Melanoma, None"
                      value={formData.medicalBackground.familySkinDiseaseHistory}
                      onChange={(e) => setFormData({...formData, medicalBackground: {...formData.medicalBackground, familySkinDiseaseHistory: e.target.value}})}
                      className="w-full h-11 px-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 text-sm focus:outline-none focus:border-neon-cyan text-white dark:text-white light:text-slate-950"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: HAIR & SCALP QUESTIONS */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-neon-cyan" /> Scalp Health & Hair Assessment
                  </h3>
                  <p className="text-xs text-gray-500 light:text-slate-500 mt-1">Dermatology encompasses trichology. Scalp sebum rates strongly link to facial profiles.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Scalp Dandruff Visibility</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["None", "Mild", "Moderate", "Severe"].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setFormData({...formData, hairAndScalp: {...formData.hairAndScalp, dandruff: val}})}
                          className={`h-10 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            formData.hairAndScalp.dandruff === val
                              ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                              : "bg-white/5 text-gray-400 border-white/10"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Hair Thinning / Receding</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["No", "Mild", "Severe"].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setFormData({...formData, hairAndScalp: {...formData.hairAndScalp, hairThinning: val}})}
                          className={`h-10 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            formData.hairAndScalp.hairThinning === val
                              ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                              : "bg-white/5 text-gray-400 border-white/10"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Hair Fall Severity (Daily shedding)</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Low", "Moderate", "High"].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setFormData({...formData, hairAndScalp: {...formData.hairAndScalp, hairFallSeverity: val}})}
                          className={`h-10 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            formData.hairAndScalp.hairFallSeverity === val
                              ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                              : "bg-white/5 text-gray-400 border-white/10"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Scalp Itchiness / Redness</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["No", "Mild", "Severe"].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setFormData({...formData, hairAndScalp: {...formData.hairAndScalp, scalpItching: val}})}
                          className={`h-10 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            formData.hairAndScalp.scalpItching === val
                              ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                              : "bg-white/5 text-gray-400 border-white/10"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* HIPAA Privacy agreement checklist before proceeding */}
                <div className="mt-4 rounded-xl border border-neon-cyan/15 bg-neon-cyan/[0.01] p-4 text-xs text-gray-400 flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 text-neon-cyan shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-200 block mb-0.5">HIPAA Consent & Data Processing</span>
                    By proceeding to the next step, you'll review and consent to our processing agreements before the camera scan.
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: CONSENT & ACKNOWLEDGEMENTS */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-neon-cyan" /> Acknowledgements & Consent
                  </h3>
                  <p className="text-xs text-gray-500 light:text-slate-500 mt-1">Please review and acknowledge the following terms before proceeding to the face scanner.</p>
                </div>

                <div className="space-y-4 pt-2">
                  <label className="flex items-start gap-4 cursor-pointer p-4 rounded-xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-white/5 hover:bg-white/10 transition-colors">
                    <input 
                      type="checkbox" 
                      className="mt-1 h-4 w-4 rounded border-gray-400 text-neon-cyan focus:ring-neon-cyan"
                      checked={formData.acknowledgements.privacyPolicy}
                      onChange={(e) => setFormData({...formData, acknowledgements: {...formData.acknowledgements, privacyPolicy: e.target.checked}})}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-gray-200 light:text-slate-800">Privacy Policy Agreement</h4>
                      <p className="text-[10px] sm:text-xs text-gray-400 mt-1">I acknowledge that DermaVision AI processes my facial scan locally on my device and securely handles my data in compliance with standard privacy laws.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 cursor-pointer p-4 rounded-xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-white/5 hover:bg-white/10 transition-colors">
                    <input 
                      type="checkbox" 
                      className="mt-1 h-4 w-4 rounded border-gray-400 text-neon-cyan focus:ring-neon-cyan"
                      checked={formData.acknowledgements.termsOfService}
                      onChange={(e) => setFormData({...formData, acknowledgements: {...formData.acknowledgements, termsOfService: e.target.checked}})}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-gray-200 light:text-slate-800">Terms of Service</h4>
                      <p className="text-[10px] sm:text-xs text-gray-400 mt-1">I agree to the Terms of Service and understand that this application is for educational and illustrative purposes, not professional medical advice.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 cursor-pointer p-4 rounded-xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-white/5 hover:bg-white/10 transition-colors">
                    <input 
                      type="checkbox" 
                      className="mt-1 h-4 w-4 rounded border-gray-400 text-neon-cyan focus:ring-neon-cyan"
                      checked={formData.acknowledgements.aiConsent}
                      onChange={(e) => setFormData({...formData, acknowledgements: {...formData.acknowledgements, aiConsent: e.target.checked}})}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-gray-200 light:text-slate-800">AI Analysis Consent</h4>
                      <p className="text-[10px] sm:text-xs text-gray-400 mt-1">I consent to the use of Artificial Intelligence algorithms to analyze my provided data and facial image for generating a mock clinical report.</p>
                    </div>
                  </label>

                  {errors.acknowledgements && (
                    <div className="text-center p-3 rounded-lg bg-neon-rose/10 border border-neon-rose/30 text-neon-rose text-xs font-bold">
                      {errors.acknowledgements}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-8 border-t border-white/5 pt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center gap-1.5 px-4 h-10 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              currentStep === 0 
                ? "opacity-0 pointer-events-none" 
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 h-10 text-xs font-bold uppercase tracking-widest rounded-xl bg-linear-to-r from-neon-cyan to-neon-purple text-white shadow-md shadow-neon-cyan/10 hover:shadow-neon-cyan/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            {currentStep === steps.length - 1 ? "Submit & Upload" : "Next Step"} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
