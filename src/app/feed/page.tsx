"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { useBlogStore } from "@/store/useBlogStore";
import { postsService } from "@/lib/services/postsService";
import { Post } from "@/types/database";
import { Network, Sparkles, Sprout, TrendingUp, Star, Globe, Lock } from "lucide-react";

// D3 must be client-only
const ThoughtGraph = dynamic(() => import("@/components/ThoughtGraph"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-ink-muted text-sm gap-2" style={{ fontFamily: "var(--font-jetbrains)" }}>
      <Network size={16} className="animate-spin text-ink-primary" />
      Rendering thought constellation…
    </div>
  ),
});

export default function FeedPage() {
  const localBlogs = useBlogStore((s) => s.blogs);
  const [mode, setMode] = useState<"local" | "global">("local");
  const [globalPosts, setGlobalPosts] = useState<Post[]>([]);
  const [loadingGlobal, setLoadingGlobal] = useState(false);

  useEffect(() => {
    if (mode === "global") {
      setLoadingGlobal(true);
      postsService.fetchForYou().then((posts) => {
        setGlobalPosts(posts);
        setLoadingGlobal(false);
      });
    }
  }, [mode]);

  const activeItems = mode === "local" ? localBlogs : globalPosts;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-paper-100">
      <Navbar />

      {/* Header bar */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-2 bg-paper-50 border-b-2 border-ink flex-shrink-0 min-h-[54px]"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-pastel-violet-solid neo-border-sm flex items-center justify-center text-ink-primary">
              <Network size={14} strokeWidth={2.4} />
            </div>
            <span
              className="text-base font-bold text-ink-primary hidden sm:inline"
              style={{ fontFamily: "var(--font-cormorant)", fontSize: 20 }}
            >
              Thought Constellation
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center rounded-xl bg-paper-200 neo-border-sm p-0.5 neo-shadow-xs">
            <button
              onClick={() => setMode("local")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                mode === "local"
                  ? "bg-pastel-amber-solid text-ink-primary neo-border-sm neo-shadow-xs"
                  : "text-ink-secondary hover:text-ink-primary"
              }`}
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              <Lock size={11} strokeWidth={2.5} />
              <span>My Garden ({localBlogs.length})</span>
            </button>

            <button
              onClick={() => setMode("global")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                mode === "global"
                  ? "bg-pastel-violet-solid text-ink-primary neo-border-sm neo-shadow-xs"
                  : "text-ink-secondary hover:text-ink-primary"
              }`}
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              <Globe size={11} strokeWidth={2.5} />
              <span>Global Network ({globalPosts.length || 4})</span>
            </button>
          </div>
        </div>

        {/* Mini stats */}
        <div className="flex items-center gap-2">
          {mode === "local" ? (
            [
              { label: "Seed", count: localBlogs.filter((b) => b.stage === "seed").length, bg: "bg-pastel-mint-solid", icon: Sprout },
              { label: "Growing", count: localBlogs.filter((b) => b.stage === "growing").length, bg: "bg-pastel-amber-solid", icon: TrendingUp },
              { label: "Published", count: localBlogs.filter((b) => b.stage === "published").length, bg: "bg-pastel-violet-solid", icon: Star },
            ].map(({ label, count, bg, icon: Icon }) => (
              <div key={label} className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg neo-border-sm ${bg} neo-shadow-xs`}>
                <Icon size={11} strokeWidth={2.5} className="text-ink-primary" />
                <span className="text-xs font-bold text-ink-primary" style={{ fontFamily: "var(--font-jetbrains)" }}>
                  {count} <span className="hidden md:inline">{label}</span>
                </span>
              </div>
            ))
          ) : (
            <span className="text-xs font-bold text-ink-muted px-2.5 py-1 rounded-lg bg-paper-200 neo-border-sm" style={{ fontFamily: "var(--font-jetbrains)" }}>
              ✦ Global ideas connected by shared tags
            </span>
          )}
        </div>
      </div>

      {/* Graph canvas */}
      <div className="flex-1 overflow-hidden relative paper-grid">
        {activeItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-paper-200 neo-border flex items-center justify-center text-ink-muted neo-shadow-sm">
              <Network size={32} />
            </div>
            <h3 className="text-2xl font-bold text-ink-primary" style={{ fontFamily: "var(--font-cormorant)" }}>
              {mode === "local" ? "Empty Private Constellation" : "Empty Global Network"}
            </h3>
            <p className="text-xs text-ink-muted max-w-sm" style={{ fontFamily: "var(--font-jetbrains)" }}>
              {mode === "local"
                ? "Draft manuscripts with tags in your writing studio to watch your private thoughts interconnect."
                : "Public essays published with tags will automatically connect here."}
            </p>
          </div>
        ) : (
          <ThoughtGraph customItems={activeItems} isGlobalMode={mode === "global"} />
        )}
      </div>
    </div>
  );
}


