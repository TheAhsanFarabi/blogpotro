"use client";

import { X, AlertTriangle, Trash2 } from "lucide-react";
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
    if (confirm("Are you absolutely sure? This will wipe all blogs, API keys, and writing streaks permanently.")) {
      resetAllData();
      onClose();
      router.push("/editor"); 
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-slide-up"
        style={{ background: "#0d0d12", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontFamily: "var(--font-cormorant)" }} className="text-2xl font-semibold text-ink-primary">
            Settings
          </h2>
          <button onClick={onClose} className="text-ink-muted hover:text-ink-primary transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Danger Zone */}
          <div className="p-4 rounded-xl" style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.15)" }}>
            <div className="flex items-center gap-2 mb-2 text-red-400">
              <AlertTriangle size={16} />
              <h3 className="font-medium text-sm">Danger Zone</h3>
            </div>
            <p className="text-xs text-ink-secondary mb-4 leading-relaxed">
              This will permanently delete all your blogs, version histories, AI scores, and writing streaks from this browser. This action cannot be undone.
            </p>
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all hover:brightness-110"
              style={{ background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }}
            >
              <Trash2 size={14} /> Erase All Data
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}