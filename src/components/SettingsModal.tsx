"use client";

import { X, AlertTriangle, Trash2, Sliders } from "lucide-react";
import { useBlogStore } from "@/store/useBlogStore";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: Props) {
  const resetAllData = useBlogStore((s) => s.resetAllData);
  const router = useRouter();

  if (!open) return null;

  const handleReset = () => {
    if (confirm("Are you absolutely sure? This will wipe all manuscripts, snapshots, API keys, and writing streaks from your browser.")) {
      resetAllData();
      onClose();
      router.push("/editor"); 
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(24, 24, 27, 0.65)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-sm bg-paper-50 rounded-2xl p-6 sm:p-7 neo-border neo-shadow-xl animate-slide-up"
      >
        <div className="flex items-center justify-between mb-5 border-b-2 border-ink pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-paper-200 neo-border-sm flex items-center justify-center text-ink-primary">
              <Sliders size={16} strokeWidth={2.4} />
            </div>
            <h2 style={{ fontFamily: "var(--font-cormorant)" }} className="text-2xl font-bold text-ink-primary">
              Settings & Storage
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg bg-paper-200 neo-border-sm text-ink-secondary hover:text-ink-primary neo-shadow-xs transition-colors"
          >
            <X size={16} strokeWidth={2.4} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Danger Zone */}
          <div className="p-4 rounded-xl bg-pastel-rose-light neo-border-sm">
            <div className="flex items-center gap-2 mb-2 text-ink-primary">
              <AlertTriangle size={16} strokeWidth={2.4} className="text-rose" />
              <h3 className="font-bold text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                Danger Zone
              </h3>
            </div>
            <p className="text-xs text-ink-secondary mb-4 leading-relaxed font-medium">
              Permanently delete all manuscripts, version histories, Gemini evaluations, and daily writing streaks from this browser.
            </p>
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-pastel-rose-solid text-ink-primary neo-btn-sm"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              <Trash2 size={14} strokeWidth={2.4} /> Erase All Local Data
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}