"use client";

import { useBlogStore } from "@/store/useBlogStore";
import type { Blog } from "@/types";
import { Sprout, TrendingUp, Star, Search } from "lucide-react";
import { useState } from "react";

const STAGE_CONFIG = {
  seed: { icon: Sprout, color: "#6bcb77", label: "Seed" },
  growing: { icon: TrendingUp, color: "#e8a045", label: "Growing" },
  published: { icon: Star, color: "#9d7cff", label: "Published" },
};

function BlogItem({ blog, isActive, onClick }: { blog: Blog; isActive: boolean; onClick: () => void }) {
  const { icon: Icon, color, label } = STAGE_CONFIG[blog.stage];
  const latestV = blog.versions[blog.versions.length - 1];
  const wordCount = blog.content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;

  return (
    <div
      onClick={onClick}
      className="px-3 py-3 rounded-xl cursor-pointer transition-all duration-150 mb-1 group"
      style={{
        background: isActive ? "rgba(232,160,69,0.08)" : "transparent",
        border: isActive ? "1px solid rgba(232,160,69,0.2)" : "1px solid transparent",
      }}
    >
      <div className="flex items-start gap-2">
        <div
          className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 transition-all"
          style={{ background: isActive ? color : "rgba(255,255,255,0.15)" }}
        />
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm leading-snug truncate transition-colors ${isActive ? "text-ink-primary" : "text-ink-secondary group-hover:text-ink-primary"}`}
            style={{ fontFamily: "var(--font-jakarta)", fontWeight: 500 }}
          >
            {blog.title || "Untitled thought"}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{
                fontFamily: "var(--font-jetbrains)",
                background: `${color}18`,
                color,
              }}
            >
              {latestV.v}
            </span>
            <span className="text-[11px]" style={{ color }}>
              <Icon size={9} style={{ display: "inline", marginRight: 2 }} />
              {label}
            </span>
            <span className="text-[10px] text-ink-muted ml-auto">{wordCount}w</span>
          </div>
          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {blog.tags.slice(0, 3).map((t) => (
                <span key={t} className="text-[10px] text-ink-muted">#{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BlogSidebar() {
  const blogs = useBlogStore((s) => s.blogs);
  const currentId = useBlogStore((s) => s.currentId);
  const setCurrentId = useBlogStore((s) => s.setCurrentId);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "seed" | "growing" | "published">("all");

  const filtered = blogs.filter((b) => {
    const matchSearch =
      search === "" ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.tags.some((t) => t.includes(search.toLowerCase()));
    const matchFilter = filter === "all" || b.stage === filter;
    return matchSearch && matchFilter;
  });

  return (
    <aside
      className="flex flex-col h-full border-r"
      style={{ width: 248, background: "#0a0a0f", borderColor: "rgba(255,255,255,0.07)" }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <h3
          className="text-xs text-ink-muted uppercase tracking-widest mb-3"
          style={{ fontFamily: "var(--font-jetbrains)" }}
        >
          My Blogs ({blogs.length})
        </h3>

        {/* Search */}
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-lg pl-8 pr-3 py-2 text-xs text-ink-secondary placeholder:text-ink-muted outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          />
        </div>

        {/* Filter pills */}
        <div className="flex gap-1 mt-2.5">
          {(["all", "seed", "growing", "published"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="flex-1 text-[10px] py-1 rounded-lg transition-all"
              style={{
                fontFamily: "var(--font-jetbrains)",
                background: filter === f ? "rgba(232,160,69,0.15)" : "rgba(255,255,255,0.04)",
                color: filter === f ? "#e8a045" : "#5e5a55",
                border: filter === f ? "1px solid rgba(232,160,69,0.25)" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Blog list */}
      <div className="flex-1 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <div className="text-center text-ink-muted text-xs py-8">
            No blogs found
          </div>
        ) : (
          filtered.map((blog) => (
            <BlogItem
              key={blog.id}
              blog={blog}
              isActive={blog.id === currentId}
              onClick={() => setCurrentId(blog.id)}
            />
          ))
        )}
      </div>

      {/* Stats footer */}
      <div
        className="p-3 border-t grid grid-cols-3 gap-2"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        {(["seed", "growing", "published"] as const).map((s) => {
          const { color, label, icon: Icon } = STAGE_CONFIG[s];
          const count = blogs.filter((b) => b.stage === s).length;
          return (
            <div key={s} className="text-center">
              <div className="text-base font-semibold" style={{ color, fontFamily: "var(--font-jetbrains)" }}>{count}</div>
              <div className="text-[9px] text-ink-muted">{label}</div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
