"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { PenLine, Network, Sparkles, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// --- Background Effect Component ---
const BackgroundGlow = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <motion.div
      animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0] }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
      style={{ background: "radial-gradient(circle, rgba(157,124,255,0.8) 0%, rgba(0,0,0,0) 70%)" }}
    />
    <motion.div
      animate={{ x: [0, -50, 50, 0], y: [0, 50, -50, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10"
      style={{ background: "radial-gradient(circle, rgba(232,160,69,0.8) 0%, rgba(0,0,0,0) 70%)" }}
    />
  </div>
);

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [name, setName] = useState("");
  const [step, setStep] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("blogpotro_user");
    if (savedName) {
      setName(savedName);
      setHasOnboarded(true);
    }
    setMounted(true);
  }, []);

  const completeOnboarding = () => {
    setIsTransitioning(true);
    const finalName = name.trim() || "Writer";
    localStorage.setItem("blogpotro_user", finalName);
    setName(finalName);

    // Fire the confetti effect using BlogPotro brand colors!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#e8a045', '#9d7cff', '#6bcb77'],
      zIndex: 99999,
      disableForReducedMotion: true
    });

    // Wait 1.5 seconds so they can see the confetti before the screen changes
    setTimeout(() => {
      setHasOnboarded(true);
      setIsTransitioning(false);
    }, 1500);
  };

  if (!mounted) return <div className="min-h-screen bg-[#07070a]" />;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen" style={{ background: "#07070a" }}>
      <BackgroundGlow />

      <div className="relative z-10 w-full max-w-2xl px-6">
        <AnimatePresence mode="wait">
          
          {/* =========================================
              FIRST TIMER FLOW (ONBOARDING)
              ========================================= */}
          {!hasOnboarded && step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative w-24 h-24 mb-6"><Image src="/logo.png" alt="Logo" fill className="object-contain" priority /></div>
              <h1 className="text-4xl md:text-5xl font-bold text-ink-primary mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
                Welcome to BlogPotro.
              </h1>
              <p className="text-ink-secondary mb-8">Before we begin, what should we call you?</p>
              
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep(2)}
                placeholder="Your name..."
                className="w-full max-w-sm px-5 py-3 rounded-xl bg-ink-elevated border border-ink-border text-ink-primary outline-none focus:border-amber transition-colors mb-6 text-center"
                style={{ fontFamily: "var(--font-jakarta)" }}
                autoFocus
              />
              <button
                onClick={() => setStep(2)}
                disabled={!name.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                style={{ background: "linear-gradient(135deg, #e8a045, #c87d2a)", color: "#07070a" }}
              >
                Continue <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {!hasOnboarded && step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <h2 className="text-3xl font-bold text-ink-primary mb-8 text-center" style={{ fontFamily: "var(--font-cormorant)" }}>
                How it works
              </h2>
              <div className="space-y-4 mb-10">
                {[
                  { icon: PenLine, title: "Write Freely", desc: "A distraction-free editor with built-in version control.", color: "#e8a045" },
                  { icon: Sparkles, title: "AI Scoring", desc: "Get feedback on human depth, clarity, and accuracy.", color: "#9d7cff" },
                  { icon: Network, title: "Connect Thoughts", desc: "Watch your tags automatically build a 3D mind map.", color: "#6bcb77" },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-ink-elevated border border-ink-border">
                    <div className="p-3 rounded-xl" style={{ background: `${feature.color}15`, color: feature.color }}>
                      <feature.icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-ink-primary font-medium">{feature.title}</h3>
                      <p className="text-sm text-ink-secondary">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #e8a045, #c87d2a)", color: "#07070a" }}
                >
                  Almost there <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {!hasOnboarded && step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center text-center"
            >
              <ShieldCheck size={48} className="mb-4" style={{ color: "#6bcb77" }} />
              <h2 className="text-3xl font-bold text-ink-primary mb-6" style={{ fontFamily: "var(--font-cormorant)" }}>
                Privacy First
              </h2>
              
              {/* Detailed Terms Box */}
              <div className="text-left p-6 rounded-2xl border mb-8 max-w-lg bg-ink-elevated" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <p className="text-sm text-ink-primary font-medium mb-3">Before you start writing, please note:</p>
                <ul className="space-y-3 text-sm text-ink-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-amber mt-0.5">•</span>
                    <span><strong>100% Local Storage:</strong> Your drafts, streaks, and version history never leave your device. We have no backend database and cannot read your work.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet mt-0.5">•</span>
                    <span><strong>AI Processing:</strong> Only when you explicitly click "Analyze with Gemini" is your current draft securely sent to Google's API to generate your BlogScore.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-seed mt-0.5">•</span>
                    <span><strong>Your Data, Your Rules:</strong> Because everything lives in your browser, clearing your cache will delete your blogs. Remember to back up your favorites!</span>
                  </li>
                </ul>

                {/* Interactive Checkbox */}
                <div 
                  className="flex items-center gap-3 mt-6 p-3 rounded-xl cursor-pointer transition-colors border"
                  style={{ 
                    background: termsAccepted ? "rgba(107,203,119,0.1)" : "rgba(255,255,255,0.02)",
                    borderColor: termsAccepted ? "rgba(107,203,119,0.3)" : "rgba(255,255,255,0.08)"
                  }}
                  onClick={() => setTermsAccepted(!termsAccepted)}
                >
                  <div className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-all ${termsAccepted ? 'bg-seed border-seed' : 'border-ink-muted bg-ink-base'}`}>
                    {termsAccepted && <Check size={12} color="#07070a" />}
                  </div>
                  <p className="text-xs text-ink-primary font-medium">
                    I agree to the Terms & Conditions and Privacy Policy.
                  </p>
                </div>
              </div>
              
              <button
                onClick={completeOnboarding}
                disabled={!termsAccepted || isTransitioning}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                style={{ background: "linear-gradient(135deg, #9d7cff, #7b5ce6)", color: "#fff" }}
              >
                {isTransitioning ? (
                  <span className="animate-pulse">Setting things up...</span>
                ) : (
                  <>
                    <Sparkles size={16} /> Enter BlogPotro
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* =========================================
              RETURNING USER FLOW (STANDARD HERO)
              ========================================= */}
          {hasOnboarded && (
            <motion.div 
              key="hero"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative w-24 h-24 mb-6"><Image src="/logo.png" alt="Logo" fill className="object-contain" priority /></div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-ink-primary mb-3" style={{ fontFamily: "var(--font-cormorant)", letterSpacing: "-0.02em" }}>
                Welcome back, {name}.
              </h1>
              <p className="text-ink-secondary text-lg mb-10" style={{ fontFamily: "var(--font-jakarta)" }}>
                Ready to continue your thoughts?
              </p>

              <div className="flex items-center gap-4">
                <Link
                  href="/editor"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all hover:scale-105 shadow-lg"
                  style={{ background: "linear-gradient(135deg, #e8a045, #c87d2a)", color: "#07070a" }}
                >
                  <PenLine size={16} /> Open Editor
                </Link>
                <Link
                  href="/feed"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all hover:brightness-110"
                  style={{ background: "rgba(157,124,255,0.1)", border: "1px solid rgba(157,124,255,0.2)", color: "#9d7cff" }}
                >
                  <Network size={16} /> View Graph
                </Link>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}