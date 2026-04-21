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
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:brightness-110"
      style={{
        background: focused ? "rgba(157,124,255,0.12)" : "rgba(255,255,255,0.04)",
        border: focused ? "1px solid rgba(157,124,255,0.3)" : "1px solid rgba(255,255,255,0.08)",
        color: focused ? "#9d7cff" : "#6b6880",
      }}
      title={focused ? "Exit Focus Mode (Esc)" : "Focus Mode"}
    >
      {focused ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
      <span className="hidden sm:inline">{focused ? "Exit Focus" : "Focus"}</span>
    </button>
  );
}
