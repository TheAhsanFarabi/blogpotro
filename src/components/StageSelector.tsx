"use client";

import { useBlogStore } from "@/store/useBlogStore";
import type { BlogStage } from "@/types";
import { Sprout, TrendingUp, Star } from "lucide-react";

const STAGES: { value: BlogStage; label: string; icon: React.ElementType; activeBg: string; activeColor: string }[] = [
  { value: "seed", label: "Seed", icon: Sprout, activeBg: "bg-pastel-mint-solid", activeColor: "text-ink-primary" },
  { value: "growing", label: "Growing", icon: TrendingUp, activeBg: "bg-pastel-amber-solid", activeColor: "text-ink-primary" },
  { value: "published", label: "Published", icon: Star, activeBg: "bg-pastel-violet-solid", activeColor: "text-ink-primary" },
];

export default function StageSelector() {
  const blog = useBlogStore((s) => s.currentBlog());
  const setStage = useBlogStore((s) => s.setStage);
  const currentId = useBlogStore((s) => s.currentId);

  if (!blog || !currentId) return null;

  return (
    <div className="flex items-center gap-1.5 bg-paper-200 p-1 rounded-xl neo-border-sm">
      {STAGES.map(({ value, label, icon: Icon, activeBg, activeColor }) => {
        const isSelected = blog.stage === value;
        return (
          <button
            key={value}
            onClick={() => setStage(currentId, value)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              isSelected
                ? `${activeBg} ${activeColor} neo-border-sm neo-shadow-xs`
                : "text-ink-secondary hover:text-ink-primary hover:bg-paper-100"
            }`}
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            <Icon size={12} strokeWidth={2.5} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

