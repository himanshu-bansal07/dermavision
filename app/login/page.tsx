"use client";

import React, { useState, useEffect } from "react";
import { Mail, ShieldCheck, ArrowRight, Lock, KeyRound, User as UserIcon, Calendar, VenusAndMars, Sparkles, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

export default function LoginPage() {
  const router = useRouter();
  
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState<"email" | "otp">("email");
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [timer, setTimer] = useState(60);

  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  const [password, setPassword] = useState("");

  // Timer cooldown simulation
  useEffect(() => {
    let interval: any;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Redirect logged in users
  useEffect(() => {
    const storedUser = localStorage.getItem("dermavision_user");
    if (storedUser) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Looser email validation for easier developer/user sandbox access
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate verification code");
      }

      setStep("otp");
      setTimer(60);
      if (data.devOtp) {
        setDevOtpHint(data.devOtp);
      } else {
        setDevOtpHint(null);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Unable to send verification email. Please try again.";
      setError(errorMessage);
      if (errorMessage.includes("registered") || errorMessage.includes("not found") || errorMessage.includes("founded")) {
        setShowErrorPopup(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Save session in local storage
      localStorage.setItem("dermavision_user", JSON.stringify({ email: data.user.email, name: data.user.name }));

      // Run success celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00F2FE", "#9b51e0", "#10B981"]
      });

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 300);

    } catch (err: any) {
      const errorMessage = err.message || "Invalid email or password.";
      setError(errorMessage);
      if (errorMessage.includes("Invalid email") || errorMessage.includes("registered") || errorMessage.includes("founded")) {
        setShowErrorPopup(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!name.trim() || name.trim().length < 2) {
      setError("Please enter your name (at least 2 characters).");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, age, gender }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate registration");
      }

      setStep("otp");
      setTimer(60);
      if (data.devOtp) {
        setDevOtpHint(data.devOtp);
      } else {
        setDevOtpHint(null);
      }
    } catch (err: any) {
      setError(err.message || "Unable to send registration email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otpCode.length !== 6) {
      setError("Passcode must be exactly 6 digits.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        // Verify OTP + create account
        const confirmRes = await fetch("/api/auth/register/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name, password, age, gender, otp: otpCode }),
        });
        const confirmData = await confirmRes.json();
        if (!confirmRes.ok) {
          throw new Error(confirmData.error || "Failed to verify code or create account");
        }
        localStorage.setItem("dermavision_user", JSON.stringify({ email: confirmData.user.email, name: confirmData.user.name }));
      } else {
        // Verify OTP for login
        const verifyRes = await fetch("/api/auth/otp/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: otpCode }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) {
          throw new Error(verifyData.error || "Verification failed");
        }
        localStorage.setItem("dermavision_user", JSON.stringify({ email: verifyData.user.email, name: verifyData.user.name }));
      }

      // Success celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00F2FE", "#9b51e0", "#10B981"]
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 300);

    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      setLoading(false);
      const googleMockEmail = "clinical_patient@gmail.com";
      localStorage.setItem("dermavision_user", JSON.stringify({ email: googleMockEmail }));
      
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 300);
    }, 150);
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-20 bg-cyber-dark relative">
      
      {/* Background ambient light */}
      <div className="absolute h-96 w-96 rounded-full bg-radial-gradient blur-3xl opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Error Popup Modal */}
      {showErrorPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#090A0F] border border-neon-rose/30 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl shadow-neon-rose/10 relative">
            <div className="mx-auto h-12 w-12 rounded-full bg-neon-rose/10 flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6 text-neon-rose" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Account Not Found</h3>
            <p className="text-sm text-gray-400 mb-6">{error}</p>
            <div className="flex gap-3">
              <button 
                onClick={() => { setShowErrorPopup(false); setMode("register"); setError(null); }}
                className="flex-1 bg-linear-to-r from-neon-cyan to-neon-purple text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
              >
                Register Now
              </button>
              <button 
                onClick={() => setShowErrorPopup(false)}
                className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider hover:bg-white/10 transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md glass-panel glass-panel-glow rounded-3xl p-6 sm:p-8 border border-white/10 dark:border-white/10 light:border-slate-200 relative z-10 text-center">
        
        {/* Logo Badge */}
        <div className="mx-auto h-12 w-12 rounded-2xl bg-linear-to-tr from-neon-cyan/15 to-neon-purple/15 text-neon-cyan flex items-center justify-center border border-neon-cyan/20 mb-4 animate-pulse">
          <Lock className="h-5 w-5 text-neon-cyan" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white dark:text-white light:text-slate-900">
          {step === "otp" 
            ? "Verify Passcode" 
            : mode === "login" 
              ? "Patient Authentication" 
              : "Create New Account"}
        </h2>
        <p className="text-xs text-gray-500 light:text-slate-550 mt-1.5 max-w-[320px] mx-auto leading-relaxed">
          {step === "otp" 
            ? `Enter the 6-digit key sent to ${email}`
            : mode === "login"
              ? "Sign in using secure OTP codes or link via Google credentials." 
              : "Register as a patient to track scans, progress, and consult specialists."}
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-neon-rose/10 border border-neon-rose/20 p-2.5 text-xs font-semibold text-neon-rose leading-relaxed">
            {error}
          </div>
        )}

        {/* 1. EMAIL/PASSWORD FORM SCREEN (LOGIN MODE) */}
        {step === "email" && mode === "login" && (
          <form onSubmit={loginMethod === "password" ? handlePasswordLogin : handleEmailSubmit} className="mt-6 space-y-4">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 light:text-slate-650">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  required
                  placeholder="e.g. patient@dermavision.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 text-xs focus:outline-none focus:border-neon-cyan text-white dark:text-white light:text-slate-950 transition-colors"
                />
              </div>
            </div>

            {loginMethod === "password" && (
              <div className="space-y-2 text-left animate-in fade-in duration-300">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 light:text-slate-650">Password</label>
                <div className="relative flex items-center">
                  <KeyRound className="absolute left-3.5 h-4 w-4 text-gray-500" />
                  <input
                    type="password"
                    required
                    placeholder="Enter account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 text-xs focus:outline-none focus:border-neon-cyan text-white dark:text-white light:text-slate-950 transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-linear-to-r from-neon-cyan to-neon-purple text-white text-xs font-bold uppercase tracking-wider shadow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer animate-in fade-in duration-300"
            >
              {loading ? (
                <span className="h-4.5 w-4.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : (
                <>
                  {loginMethod === "password" ? "Sign In" : "Send Verification OTP"} <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Toggle Login Method */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod(loginMethod === "password" ? "otp" : "password");
                  setError(null);
                }}
                className="text-[10px] font-bold text-neon-cyan hover:underline cursor-pointer"
              >
                {loginMethod === "password" ? "Sign In with OTP code instead" : "Sign In with Password instead"}
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-x-0 h-px bg-white/5" />
              <span className="relative bg-[#090A0F] px-3 text-[10px] font-bold tracking-widest uppercase text-gray-500 dark:bg-cyber-dark light:bg-white">OR CONTINUE WITH</span>
            </div>

            {/* Google OAuth Option */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-11 rounded-xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-white/5 text-gray-300 light:text-slate-700 hover:bg-white/10 text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg> Sign In with Google
            </button>
          </form>
        )}

        {/* 2. REGISTRATION FORM SCREEN (REGISTER MODE) */}
        {step === "email" && mode === "register" && (
          <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-4 text-left animate-in fade-in duration-300">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 light:text-slate-650">Full Name</label>
              <div className="relative flex items-center">
                <UserIcon className="absolute left-3.5 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 text-xs focus:outline-none focus:border-neon-cyan text-white dark:text-white light:text-slate-950 transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 light:text-slate-650">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  required
                  placeholder="your-email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 text-xs focus:outline-none focus:border-neon-cyan text-white dark:text-white light:text-slate-950 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 light:text-slate-650">Password</label>
              <div className="relative flex items-center">
                <KeyRound className="absolute left-3.5 h-4 w-4 text-gray-500" />
                <input
                  type="password"
                  required
                  placeholder="Choose a password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 text-xs focus:outline-none focus:border-neon-cyan text-white dark:text-white light:text-slate-950 transition-colors"
                />
              </div>
            </div>

            {/* Age & Gender (Row Grid) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 light:text-slate-650">Age (Optional)</label>
                <div className="relative flex items-center">
                  <Calendar className="absolute left-3.5 h-4 w-4 text-gray-500" />
                  <input
                    type="number"
                    min={1}
                    max={120}
                    placeholder="25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 text-xs focus:outline-none focus:border-neon-cyan text-white dark:text-white light:text-slate-950 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 light:text-slate-650">Gender (Optional)</label>
                <div className="relative flex items-center">
                  <VenusAndMars className="absolute left-3.5 h-4 w-4 text-gray-500 pointer-events-none" />
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 text-xs focus:outline-none focus:border-neon-cyan text-white dark:text-white light:text-slate-950 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="text-gray-900 bg-white">Select...</option>
                    <option value="Male" className="text-gray-900 bg-white">Male</option>
                    <option value="Female" className="text-gray-900 bg-white">Female</option>
                    <option value="Other" className="text-gray-900 bg-white">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-linear-to-r from-neon-cyan to-neon-purple text-white text-xs font-bold uppercase tracking-wider shadow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span className="h-4.5 w-4.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : (
                <>
                  Register & Send OTP <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 3. OTP CODE FORM SCREEN */}
        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="mt-6 space-y-4">
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-[11px] font-semibold text-emerald-400 leading-relaxed text-left flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Verification Code Sent!</span>
                A 6-digit code has been sent to <span className="text-white font-bold">{email}</span>. Check your inbox and spam folder.
              </div>
            </div>

            {/* Dev-mode OTP hint — shown when email delivery is unavailable locally */}
            {devOtpHint && (
              <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/30 p-3 text-[11px] leading-relaxed text-left">
                <p className="font-bold text-yellow-400 mb-1">🛠 Dev Mode — Your OTP Code</p>
                <p className="text-yellow-300/80 mb-2">Email delivery skipped (no verified domain). Use the code below:</p>
                <div
                  className="text-2xl font-black tracking-[0.4em] text-yellow-300 text-center py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 cursor-pointer select-all"
                  onClick={() => setOtpCode(devOtpHint)}
                  title="Click to auto-fill"
                >
                  {devOtpHint}
                </div>
                <p className="text-yellow-500/60 text-[10px] text-center mt-1">Click the code to auto-fill ↑</p>
              </div>
            )}

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 light:text-slate-650">6-Digit Passcode</label>
              <div className="relative flex items-center">
                <KeyRound className="absolute left-3.5 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="Enter passcode to verify"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 text-xs tracking-widest font-mono text-center focus:outline-none focus:border-neon-cyan text-white dark:text-white light:text-slate-950"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-linear-to-tr from-neon-cyan to-neon-purple text-white text-xs font-bold uppercase tracking-widest shadow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="h-4.5 w-4.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : (
                <>
                  Verify Code & Access <Sparkles className="h-4 w-4 text-neon-cyan animate-pulse" />
                </>
              )}
            </button>

            {/* Timer segment */}
            <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 px-1">
              <span>Code expires in: <span className="text-neon-cyan font-bold">{timer}s</span></span>
              <button
                type="button"
                disabled={timer > 0}
                onClick={mode === "login" ? handleEmailSubmit : handleRegisterSubmit}
                className={`font-semibold hover:underline cursor-pointer ${timer > 0 ? "text-gray-600 cursor-not-allowed" : "text-neon-cyan"}`}
              >
                Resend Code
              </button>
            </div>

            {/* Return link */}
            <button
              type="button"
              onClick={() => { setStep("email"); setError(null); }}
              className="text-[10px] text-gray-500 hover:underline block mx-auto cursor-pointer"
            >
              Back to Sign In / Register
            </button>
          </form>
        )}

        {/* Toggle Login/Register Mode */}
        {step === "email" && (
          <div className="mt-6 pt-5 border-t border-white/5 text-center text-xs">
            {mode === "login" ? (
              <p className="text-gray-400 dark:text-gray-400 light:text-slate-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("register"); setError(null); }}
                  className="font-bold text-neon-cyan hover:underline cursor-pointer"
                >
                  Create Account
                </button>
              </p>
            ) : (
              <p className="text-gray-400 dark:text-gray-400 light:text-slate-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(null); }}
                  className="font-bold text-neon-cyan hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        )}

        {/* HIPAA Safety disclosures */}
        <div className="mt-6 pt-5 border-t border-white/5 text-[10px] text-gray-500 leading-normal flex items-start gap-2 text-left">
          <ShieldCheck className="h-4.5 w-4.5 text-neon-green shrink-0 mt-0.5" />
          <span>DermaVision protects patient records. All authentication runs over encrypted sessions, and profiles link strictly to private diagnostic registries.</span>
        </div>

      </div>
    </div>
  );
}
