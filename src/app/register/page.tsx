"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, ArrowRight, Lock, Mail, User, AtSign, AlertCircle, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, signInWithGoogle, signUpWithPassword } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && (user || profile)) {
      router.replace("/home");
    }
  }, [user, profile, authLoading, router]);


  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (e: any) {
      setError(e.message || "Failed to sign up with Google.");
      setLoading(false);
    }
  };

  const handlePasswordRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !username || !email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    if (username.length < 3) {
      setError("Handle must be at least 3 characters.");
      return;
    }

    setLoading(true);
    setError(null);
    const res = await signUpWithPassword(email, password, displayName, username);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      router.push("/home");
    }
  };

  return (
    <div className="min-h-screen bg-paper-100 paper-grid flex flex-col justify-center items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-10 h-10 relative flex items-center justify-center bg-pastel-cream-solid rounded-xl neo-border-sm neo-shadow-xs group-hover:rotate-3 transition-transform">
              <Image src="/logo.png" alt="Logo" fill className="object-contain p-1.5" priority />
            </div>
            <span className="font-bold text-3xl text-ink-primary tracking-tight" style={{ fontFamily: "var(--font-cormorant)" }}>
              blogpotro
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary" style={{ fontFamily: "var(--font-cormorant)" }}>
            Claim Your Writer's Seat
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary font-medium mt-1">
            Private drafts on your device. Public essays on your terms.
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-paper-50 p-6 sm:p-8 rounded-2xl neo-border neo-shadow-lg">
          
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-pastel-rose-solid neo-border-sm text-xs font-bold text-rose mb-5">
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-white text-ink-primary neo-border hover:bg-paper-100 neo-shadow-sm flex items-center justify-center gap-3 transition-all mb-5"
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
            <span>Sign up with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-paper-300 w-full" />
            <span className="bg-paper-50 px-3 text-[10px] font-bold text-ink-muted uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
              or register with email
            </span>
            <div className="border-t border-paper-300 w-full" />
          </div>

          {/* Registration Form */}
          <form onSubmit={handlePasswordRegister} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-ink-primary mb-1 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                  Pen Name
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Virginia Woolf"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-paper-100 neo-border text-xs font-medium text-ink-primary outline-none focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-primary mb-1 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                  Handle
                </label>
                <div className="relative">
                  <AtSign size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    placeholder="virginia"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-paper-100 neo-border text-xs font-medium text-ink-primary outline-none focus:bg-white"
                    style={{ fontFamily: "var(--font-jetbrains)" }}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-primary mb-1 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="writer@domain.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-paper-100 neo-border text-xs font-medium text-ink-primary outline-none focus:bg-white"
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-primary mb-1 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-paper-100 neo-border text-xs font-medium text-ink-primary outline-none focus:bg-white"
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold bg-pastel-amber-solid text-ink-primary neo-btn flex items-center justify-center gap-2 mt-3"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              <Sparkles size={14} strokeWidth={2.4} />
              <span>{loading ? "Creating Profile..." : "Create Writer Profile"}</span>
            </button>
          </form>

          {/* Privacy Note */}
          <div className="mt-4 p-2.5 rounded-xl bg-paper-100 neo-border-sm flex items-center gap-2 text-[10px] text-ink-secondary font-medium">
            <ShieldCheck size={14} className="text-emerald-700 flex-shrink-0" />
            <span>Unpublished drafts remain strictly local on your device.</span>
          </div>

          {/* Footer Link */}
          <div className="text-center pt-5 mt-4 border-t border-paper-200 text-xs font-medium text-ink-secondary">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-ink-primary hover:underline">
              Sign In
            </Link>
          </div>
        </div>

        {/* Legal Links */}
        <div className="flex justify-center gap-4 mt-6 text-xs font-bold text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>
          <Link href="/privacy_policy" className="hover:text-ink-primary underline">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-ink-primary underline">Terms</Link>
          <span>•</span>
          <Link href="/explore" className="hover:text-ink-primary underline">Explore</Link>
        </div>

      </div>
    </div>
  );
}

