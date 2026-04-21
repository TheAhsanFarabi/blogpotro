"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { useBlogStore } from "@/store/useBlogStore";
import { Network } from "lucide-react";

// D3 must be client-only
const ThoughtGraph = dynamic(() => import("@/components/ThoughtGraph"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-ink-muted text-sm gap-2">
      <Network size={16} className="animate-pulse" />
      Building your thought graph…
    </div>
  ),
});

export default function FeedPage() {
  const blogs = useBlogStore((s) => s.blogs);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "#07070a" }}>
      <Navbar />

      {/* Header bar */}
      <div
        className="flex items-center gap-3 px-6 py-3 border-b flex-shrink-0"
        style={{ background: "#0a0a0f", borderColor: "rgba(255,255,255,0.07)" }}
      >
        <Network size={15} style={{ color: "#9d7cff" }} />
        <span
          className="text-sm font-medium text-ink-secondary"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          Thought Graph
        </span>
        <span className="text-xs text-ink-muted">
          — {blogs.length} blog{blogs.length !== 1 ? "s" : ""}, connected by shared tags
        </span>

        {/* Mini stats */}
        <div className="ml-auto flex items-center gap-4">
          {[
            { label: "Seed", color: "#6bcb77", count: blogs.filter((b) => b.stage === "seed").length },
            { label: "Growing", color: "#e8a045", count: blogs.filter((b) => b.stage === "growing").length },
            { label: "Published", color: "#9d7cff", count: blogs.filter((b) => b.stage === "published").length },
          ].map(({ label, color, count }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="text-xs text-ink-muted">
                {count} {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Graph canvas */}
      <div className="flex-1 overflow-hidden relative">
        {blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <Network size={40} className="text-ink-muted opacity-30" />
            <p className="text-ink-muted text-sm">No blogs yet. Create one to see your thought graph.</p>
          </div>
        ) : (
          <ThoughtGraph />
        )}
      </div>
    </div>
  );
}
