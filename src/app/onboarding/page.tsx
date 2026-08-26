"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Feather, ArrowRight, Shield, Check, Sparkles } from "lucide-react";

export default function OnboardingPage() {
  const { user, profile, completeOnboarding } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name || profile?.display_name || "");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.toLowerCase().trim().replace(/^@/, "");

    if (!cleanUsername || cleanUsername.length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      setError("Username can only contain letters, numbers, and underscores.");
      return;
    }
    if (!displayName.trim()) {
      setError("Please provide a pen name / display name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const success = await completeOnboarding(cleanUsername, displayName, bio);
      if (success) {
        router.push("/home");
      } else {
        setError("Failed to create profile. That username might already be taken.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper-100 flex flex-col justify-center items-center p-4 paper-grid">
      <div className="w-full max-w-lg bg-paper-50 neo-border neo-shadow-xl rounded-2xl p-6 sm:p-10 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-pastel-amber-solid neo-border flex items-center justify-center text-ink-primary neo-shadow-sm">
            <Feather size={28} strokeWidth={2.2} />
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold text-ink-primary tracking-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Claim Your Writer's Identity
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary mt-2 font-medium">
            Welcome to BlogPotro. Pick your unique handle to participate in the global literary network.
          </p>
        </div>

        {/* Philosophy Badge */}
        <div className="mb-6 p-4 rounded-xl neo-border-sm bg-[#FEFCE8] flex gap-3 items-start neo-shadow-xs">
          <Shield size={18} className="mt-0.5 text-amber flex-shrink-0" strokeWidth={2.4} />
          <div>
            <h4 className="text-xs font-bold text-ink-primary uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
              Private by default. Public by choice.
            </h4>
            <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
              Your drafts and version histories remain strictly private on your device. Only articles you explicitly publish become public.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-pastel-rose-light neo-border-sm text-xs font-bold text-rose">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink-primary mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
              Handle / Username <span className="text-rose">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>
                @
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                placeholder="penname"
                maxLength={30}
                required
                className="w-full rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold text-ink-primary bg-paper-100 neo-border outline-none focus:bg-white transition-all"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              />
            </div>
            <p className="text-[11px] text-ink-muted mt-1" style={{ fontFamily: "var(--font-jetbrains)" }}>
              Your profile URL will be blogpotro.com/@{username || "penname"}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink-primary mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
              Pen Name / Display Name <span className="text-rose">*</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Virginia Woolf or Ahsan Farabi"
              required
              className="w-full rounded-xl px-4 py-2.5 text-sm font-bold text-ink-primary bg-paper-100 neo-border outline-none focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink-primary mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
              Bio / Literary Statement <span className="text-ink-muted font-normal">(Optional)</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="What questions, philosophies, or topics do you explore in your writing?"
              rows={3}
              maxLength={240}
              className="w-full rounded-xl px-4 py-2.5 text-xs font-medium text-ink-primary bg-paper-100 neo-border outline-none focus:bg-white transition-all resize-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl text-xs font-bold text-ink-primary bg-pastel-amber-solid neo-btn flex items-center justify-center gap-2"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            <span>{loading ? "Creating Profile..." : "Enter Literary Sanctuary"}</span>
            <ArrowRight size={14} strokeWidth={2.4} />
          </button>
        </form>
      </div>
    </div>
  );
}
