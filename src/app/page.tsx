"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  Sparkles, ArrowRight, Lock, Mail, User, AtSign, 
  AlertCircle, ShieldCheck, Feather, Compass, Network, 
  BookOpen, GitBranch, Flame, CheckCircle2, Globe, Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PILLARS = [
  {
    id: "studio",
    tag: "01 / STUDIO",
    title: "Local-First Drafting",
    desc: "Your drafts, notes, and revision snapshots stay stored in your browser. Write with complete psychological safety.",
    icon: Feather,
    color: "#047857",
    bg: "bg-pastel-mint-light",
    solidBg: "bg-pastel-mint-solid",
  },
  {
    id: "publishing",
    tag: "02 / PUBLISHING",
    title: "Public by Choice",
    desc: "Mint finished essays to your public author profile, receive thoughtful reader reflections, and build your readership.",
    icon: Globe,
    color: "#B45309",
    bg: "bg-pastel-amber-light",
    solidBg: "bg-pastel-amber-solid",
  },
  {
    id: "constellation",
    tag: "03 / NETWORK",
    title: "Living Constellation",
    desc: "Explore a dynamic 3D associative graph connecting essays, concepts, and writers across shared philosophical tags.",
    icon: Network,
    color: "#6D28D9",
    bg: "bg-pastel-violet-light",
    solidBg: "bg-pastel-violet-solid",
  },
];

export default function RootPage() {
  const router = useRouter();
  const { user, profile, loading, signInWithGoogle, signInWithPassword, signUpWithPassword } = useAuth();
  
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePillar, setActivePillar] = useState(0);

  // Auto-cycle through pillars every 5 seconds if idle
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePillar((prev) => (prev + 1) % PILLARS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // If user is already logged in, redirect straight to /home
  useEffect(() => {
    if (!loading && (user || profile)) {
      router.replace("/home");
    }
  }, [user, profile, loading, router]);

  const handleGoogleAuth = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await signInWithGoogle();
    } catch (e: any) {
      setError(e.message || "Failed to authenticate with Google.");
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (tab === "login") {
      if (!email || !password) {
        setError("Please enter your email and password.");
        setIsSubmitting(false);
        return;
      }
      const res = await signInWithPassword(email, password);
      setIsSubmitting(false);
      if (res.error) {
        setError(res.error);
      } else {
        router.push("/home");
      }
    } else {
      if (!displayName || !username || !email || !password) {
        setError("Please complete all registration fields.");
        setIsSubmitting(false);
        return;
      }
      if (username.length < 3) {
        setError("Handle must be at least 3 characters.");
        setIsSubmitting(false);
        return;
      }
      const res = await signUpWithPassword(email, password, displayName, username);
      setIsSubmitting(false);
      if (res.error) {
        setError(res.error);
      } else {
        router.push("/home");
      }
    }
  };

  if (loading || user || profile) {
    return (
      <div className="min-h-screen bg-paper-100 flex items-center justify-center">
        <div className="text-xs font-bold text-ink-muted flex items-center gap-2" style={{ fontFamily: "var(--font-jetbrains)" }}>
          <Feather size={16} className="animate-spin text-ink-primary" />
          <span>Opening BlogPotro...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-100 paper-grid flex flex-col justify-between">
      
      {/* Top Minimal Header */}
      <header className="px-4 sm:px-8 py-4 flex items-center justify-between border-b-2 border-ink bg-paper-50/80 backdrop-blur-sm sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 relative flex items-center justify-center bg-pastel-cream-solid rounded-xl neo-border-sm neo-shadow-xs group-hover:rotate-3 transition-transform">
            <Image src="/logo.png" alt="Logo" fill className="object-contain p-1.5" priority />
          </div>
          <span className="font-bold text-2xl text-ink-primary tracking-tight" style={{ fontFamily: "var(--font-cormorant)" }}>
            blogpotro
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/explore"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-ink-primary bg-paper-100 neo-border-sm hover:bg-paper-200 transition-colors"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            <Compass size={13} strokeWidth={2.4} />
            <span className="hidden sm:inline">Explore Essays</span>
          </Link>
          <button
            onClick={() => { setTab("login"); setError(null); }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-ink-primary bg-pastel-amber-solid neo-border-sm hover:bg-pastel-amber-light neo-shadow-xs transition-all"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Main Split-Screen Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center w-full">
          
          {/* =========================================
              LEFT COLUMN: HERO & INTERACTIVE PILLARS
              ========================================= */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full neo-border-sm bg-pastel-violet-light text-ink-primary text-xs font-bold uppercase tracking-wider w-fit" style={{ fontFamily: "var(--font-jetbrains)" }}>
              <Sparkles size={12} className="text-violet" />
              <span>The Social Writing Platform</span>
            </div>

            {/* Hero Main Headline */}
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-primary tracking-tight leading-[1.08]" 
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              A Sanctuary for Slow Thought & Published Conviction.
            </h1>

            {/* Narrative Subtitle */}
            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-medium max-w-xl">
              Draft privately on your machine with distraction-free typography and version snapshots. When you’re ready, publish your essays to an interconnected network of discerning thinkers.
            </p>

            {/* Interactive Feature Pillars */}
            <div className="space-y-3 pt-2">
              {PILLARS.map((p, idx) => {
                const isSelected = activePillar === idx;
                const Icon = p.icon;

                return (
                  <div
                    key={p.id}
                    onClick={() => setActivePillar(idx)}
                    className={`p-4 sm:p-4.5 rounded-2xl cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? `${p.bg} neo-border neo-shadow-sm translate-x-1` 
                        : "bg-paper-50 neo-border-sm hover:bg-paper-200"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`p-2.5 rounded-xl neo-border-sm ${p.solidBg} text-ink-primary flex-shrink-0 mt-0.5`}>
                        <Icon size={18} strokeWidth={2.4} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="text-sm sm:text-base font-bold text-ink-primary truncate">{p.title}</h3>
                          <span className="text-[10px] font-bold text-ink-muted tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                            {p.tag}
                          </span>
                        </div>
                        <p className="text-xs text-ink-secondary leading-relaxed font-medium">
                          {p.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-700" strokeWidth={2.5} />
                <span>Zero Trackers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-700" strokeWidth={2.5} />
                <span>Local-First Drafts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-700" strokeWidth={2.5} />
                <span>Free-First Platform</span>
              </div>
            </div>

          </div>

          {/* =========================================
              RIGHT COLUMN: DUAL AUTHENTICATION CARD
              ========================================= */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-paper-50 p-6 sm:p-8 rounded-3xl neo-border neo-shadow-xl relative overflow-hidden">
              
              {/* Header Title inside card */}
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-ink-primary" style={{ fontFamily: "var(--font-cormorant)" }}>
                  {tab === "login" ? "Welcome to the Desk" : "Claim Your Writer's Seat"}
                </h2>
                <p className="text-xs text-ink-secondary font-medium mt-1">
                  {tab === "login" 
                    ? "Access your private studio and published essays."
                    : "Create your author profile in seconds."}
                </p>
              </div>

              {/* Tab Switcher */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-paper-200 rounded-xl neo-border-sm mb-5">
                <button
                  type="button"
                  onClick={() => { setTab("login"); setError(null); }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    tab === "login"
                      ? "bg-pastel-amber-solid text-ink-primary neo-border-sm neo-shadow-xs"
                      : "text-ink-secondary hover:text-ink-primary"
                  }`}
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setTab("register"); setError(null); }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    tab === "register"
                      ? "bg-pastel-amber-solid text-ink-primary neo-border-sm neo-shadow-xs"
                      : "text-ink-secondary hover:text-ink-primary"
                  }`}
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                >
                  Create Account
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-pastel-rose-solid neo-border-sm text-xs font-bold text-rose mb-4">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1. Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-white text-ink-primary neo-border hover:bg-paper-100 neo-shadow-sm flex items-center justify-center gap-3 transition-all mb-4"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{tab === "login" ? "Continue with Google" : "Sign up with Google"}</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center mb-4">
                <div className="border-t border-paper-300 w-full" />
                <span className="bg-paper-50 px-3 text-[10px] font-bold text-ink-muted uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                  or with email
                </span>
                <div className="border-t border-paper-300 w-full" />
              </div>

              {/* Email / Password Form */}
              <form onSubmit={handleFormSubmit} className="space-y-3">
                {tab === "register" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-ink-primary mb-1 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                        Pen Name
                      </label>
                      <div className="relative">
                        <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Virginia Woolf"
                          className="w-full pl-8 pr-3 py-2 rounded-xl bg-paper-100 neo-border text-xs font-medium text-ink-primary outline-none focus:bg-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-ink-primary mb-1 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                        Handle
                      </label>
                      <div className="relative">
                        <AtSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                          placeholder="virginia"
                          className="w-full pl-8 pr-3 py-2 rounded-xl bg-paper-100 neo-border text-xs font-medium text-ink-primary outline-none focus:bg-white"
                          style={{ fontFamily: "var(--font-jetbrains)" }}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-ink-primary mb-1 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="writer@domain.com"
                      className="w-full pl-8 pr-4 py-2 rounded-xl bg-paper-100 neo-border text-xs font-medium text-ink-primary outline-none focus:bg-white"
                      style={{ fontFamily: "var(--font-jetbrains)" }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-ink-primary mb-1 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={tab === "register" ? "At least 6 characters" : "••••••••"}
                      className="w-full pl-8 pr-4 py-2 rounded-xl bg-paper-100 neo-border text-xs font-medium text-ink-primary outline-none focus:bg-white"
                      style={{ fontFamily: "var(--font-jetbrains)" }}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-pastel-amber-solid text-ink-primary neo-btn flex items-center justify-center gap-2 mt-2"
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                >
                  <Sparkles size={14} strokeWidth={2.4} />
                  <span>
                    {isSubmitting
                      ? (tab === "login" ? "Signing In..." : "Creating Profile...")
                      : (tab === "login" ? "Enter Studio" : "Claim Profile")}
                  </span>
                </button>
              </form>

              {/* Privacy Guarantee Note */}
              <div className="mt-4 p-2.5 rounded-xl bg-paper-100 neo-border-sm flex items-center gap-2 text-[10px] text-ink-secondary font-medium">
                <ShieldCheck size={14} className="text-emerald-700 flex-shrink-0" />
                <span>Unpublished drafts remain strictly local on your device.</span>
              </div>

            </div>

            {/* Guest Explore Quick Link */}
            <div className="text-center mt-4">
              <Link
                href="/explore"
                className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted hover:text-ink-primary transition-colors"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                <span>Or read public essays without signing in</span>
                <ArrowRight size={12} strokeWidth={2.4} />
              </Link>
            </div>

          </div>

        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-6 border-t-2 border-ink bg-paper-50 text-center text-xs font-bold text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>
        <div className="flex justify-center gap-6 mb-2">
          <Link href="/privacy_policy" className="hover:text-ink-primary underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-ink-primary underline">Terms & Conditions</Link>
          <Link href="/explore" className="hover:text-ink-primary underline">Explore Essays</Link>
        </div>
        <span>✦ BLOGPOTRO — PRIVATE BY DEFAULT. PUBLIC BY CHOICE. ✦</span>
      </footer>

    </div>
  );
}