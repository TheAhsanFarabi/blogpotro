"use client";

import { useState } from "react";
import { X, Copy, Check, Share2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export default function ShareModal({ open, onClose, title, url }: Props) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(`"${title}" — on BlogPotro`);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(24, 24, 27, 0.65)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-sm bg-paper-50 rounded-2xl p-6 neo-border neo-shadow-xl animate-slide-up">
        <div className="flex items-center justify-between mb-4 border-b-2 border-ink pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-pastel-amber-solid neo-border-sm flex items-center justify-center text-ink-primary">
              <Share2 size={14} strokeWidth={2.4} />
            </div>
            <h3 style={{ fontFamily: "var(--font-cormorant)" }} className="text-xl font-bold text-ink-primary">
              Share Manuscript
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-paper-200 neo-border-sm text-ink-secondary hover:text-ink-primary"
          >
            <X size={15} strokeWidth={2.4} />
          </button>
        </div>

        {/* Copy Link Input */}
        <div className="mb-4 p-2.5 bg-paper-100 rounded-xl neo-border-sm flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={url}
            className="flex-1 bg-transparent text-xs font-bold text-ink-primary outline-none truncate"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          />
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-lg bg-pastel-amber-solid neo-border-sm text-xs font-bold text-ink-primary neo-shadow-xs flex items-center gap-1 flex-shrink-0"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            {copied ? <Check size={11} strokeWidth={2.5} /> : <Copy size={11} strokeWidth={2.4} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

        {/* Social Share Buttons Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-paper-100 neo-border-sm hover:bg-paper-200 text-xs font-bold text-ink-primary transition-all"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            <span>𝕏 Twitter</span>
          </a>

          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-paper-100 neo-border-sm hover:bg-paper-200 text-xs font-bold text-ink-primary transition-all"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            <span>LinkedIn</span>
          </a>

          <a
            href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-paper-100 neo-border-sm hover:bg-paper-200 text-xs font-bold text-ink-primary transition-all"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            <span>WhatsApp</span>
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-paper-100 neo-border-sm hover:bg-paper-200 text-xs font-bold text-ink-primary transition-all"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            <span>Facebook</span>
          </a>
        </div>

        {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
          <button
            onClick={handleNativeShare}
            className="w-full py-2 rounded-xl bg-paper-200 neo-border-sm text-xs font-bold text-ink-primary hover:bg-paper-300 transition-all"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            More System Share Options…
          </button>
        )}
      </div>
    </div>
  );
}
