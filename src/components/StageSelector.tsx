"use client";

import { useBlogStore } from "@/store/useBlogStore";
import type { BlogStage } from "@/types";
import { Sprout, TrendingUp, Star } from "lucide-react";

const STAGES: { value: BlogStage; label: string; icon: React.ElementType; color: string; bg: string; border: string }[] = [
  { value: "seed", label: "Seed", icon: Sprout, color: "#6bcb77", bg: "rgba(107,203,119,0.1)", border: "rgba(107,203,119,0.25)" },
  { value: "growing", label: "Growing", icon: TrendingUp, color: "#e8a045", bg: "rgba(232,160,69,0.1)", border: "rgba(232,160,69,0.25)" },
  { value: "published", label: "Published", icon: Star, color: "#9d7cff", bg: "rgba(157,124,255,0.1)", border: "rgba(157,124,255,0.25)" },
];

export default function StageSelector() {
  const blog = useBlogStore((s) => s.currentBlog());
  const setStage = useBlogStore((s) => s.setStage);
  const currentId = useBlogStore((s) => s.currentId);

  if (!blog || !currentId) return null;

  return (
    <div className="flex items-center gap-2">
      {STAGES.map(({ value, label, icon: Icon, color, bg, border }) => (
        <button
          key={value}
          onClick={() => setStage(currentId, value)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-150"
          style={
            blog.stage === value
              ? { background: bg, color, border: `1px solid ${border}` }
              : { background: "transparent", color: "#5e5a55", border: "1px solid rgba(255,255,255,0.07)" }
          }
        >
          <Icon size={11} />
          {label}
        </button>
      ))}
    </div>
  );
}
