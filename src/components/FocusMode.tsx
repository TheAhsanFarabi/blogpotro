"use client";

import { useState, useEffect } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

interface Props {
  onToggle?: (focused: boolean) => void;
}

export default function FocusMode({ onToggle }: Props) {
  const [focused, setFocused] = useState(false);

  const toggle = () => {
    const next = !focused;
    setFocused(next);
    onToggle?.(next);

    if (next) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  // Exit focus mode on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && focused) { setFocused(false); onToggle?.(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [focused, onToggle]);

  // Watch fullscreen change
  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement && focused) { setFocused(false); onToggle?.(false); }
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [focused, onToggle]);

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
        focused
          ? "bg-pastel-violet-solid text-ink-primary neo-border-sm neo-shadow-xs"
          : "bg-paper-200 text-ink-primary neo-border-sm hover:bg-paper-300 neo-shadow-xs"
      }`}
      style={{ fontFamily: "var(--font-jetbrains)" }}
      title={focused ? "Exit Focus Mode (Esc)" : "Distraction-Free Focus Mode"}
    >
      {focused ? <Minimize2 size={13} strokeWidth={2.4} /> : <Maximize2 size={13} strokeWidth={2.4} />}
      <span className="hidden sm:inline">{focused ? "Exit Focus" : "Focus"}</span>
    </button>
  );
}

