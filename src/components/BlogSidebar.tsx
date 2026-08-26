"use client";

import { useBlogStore } from "@/store/useBlogStore";
import type { Blog } from "@/types";
import { Sprout, TrendingUp, Star, Search, Plus } from "lucide-react";
import { useState } from "react";

const STAGE_CONFIG = {
  seed: { 
    icon: Sprout, 
    color: "#047857", 
    label: "Seed",
    bg: "bg-pastel-mint-light",
    badgeBg: "bg-pastel-mint-solid",
    border: "border-[#047857]"
  },
  growing: { 
    icon: TrendingUp, 
    color: "#B45309", 
    label: "Growing",
    bg: "bg-pastel-amber-light",
    badgeBg: "bg-pastel-amber-solid",
    border: "border-[#B45309]"
  },
  published: { 
    icon: Star, 
    color: "#6D28D9", 
    label: "Published",
    bg: "bg-pastel-violet-light",
    badgeBg: "bg-pastel-violet-solid",
    border: "border-[#6D28D9]"
  },
};

function BlogItem({ blog, isActive, onClick }: { blog: Blog; isActive: boolean; onClick: () => void }) {
  const { icon: Icon, color, label, badgeBg } = STAGE_CONFIG[blog.stage];
  const latestV = blog.versions[blog.versions.length - 1];
  const wordCount = blog.content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;

  return (
    <div
      onClick={onClick}
      className={`p-3.5 rounded-xl cursor-pointer transition-all duration-150 mb-2.5 group ${
        isActive 
          ? "bg-[#FEFCE8] neo-border neo-shadow-sm translate-x-0.5" 
          : "bg-paper-50 neo-border-sm hover:bg-paper-200 hover:neo-shadow-xs"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div
          className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 neo-border-sm transition-all"
          style={{ background: color }}
        />
        <div className="min-w-0 flex-1">
          <p
            className="text-sm leading-snug truncate font-bold text-ink-primary"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: 17 }}
          >
            {blog.title || "Untitled thought"}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded neo-border-sm bg-paper-100 text-ink-primary"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              {latestV?.v || "v1"}
            </span>
            <span 
              className={`text-[10px] font-bold px-2 py-0.5 rounded neo-border-sm ${badgeBg} text-ink-primary flex items-center gap-1`}
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              <Icon size={9} strokeWidth={2.5} />
              {label}
            </span>
            <span className="text-[10px] font-bold text-ink-muted ml-auto" style={{ fontFamily: "var(--font-jetbrains)" }}>
              {wordCount}w
            </span>
          </div>

          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {blog.tags.slice(0, 3).map((t) => (
                <span 
                  key={t} 
                  className="text-[9.5px] font-semibold text-ink-secondary bg-paper-200 px-1.5 py-0.5 rounded border border-paper-300"
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                >
                  #{t}
                </span>
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
      className="flex flex-col h-full bg-paper-100 border-r-2 border-ink"
      style={{ width: 268 }}
    >
      {/* Header */}
      <div className="p-4 border-b-2 border-ink bg-paper-50">
        <div className="flex items-center justify-between mb-3">
          <h3
            className="text-xs font-bold text-ink-primary uppercase tracking-wider flex items-center gap-1.5"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            <span>Manuscripts</span>
            <span className="px-1.5 py-0.2 rounded-full neo-border-sm bg-pastel-amber-solid text-[10px]">
              {blogs.length}
            </span>
          </h3>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" strokeWidth={2.2} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search thoughts & tags..."
            className="w-full rounded-xl pl-8 pr-3 py-2 text-xs font-medium text-ink-primary placeholder:text-ink-muted bg-paper-100 neo-border outline-none focus:bg-white transition-colors"
          />
        </div>

        {/* Filter pills */}
        <div className="grid grid-cols-4 gap-1">
          {(["all", "seed", "growing", "published"] as const).map((f) => {
            const isSelected = filter === f;
            const bgClass = f === "seed" ? "bg-pastel-mint-solid" : f === "growing" ? "bg-pastel-amber-solid" : f === "published" ? "bg-pastel-violet-solid" : "bg-paper-200";
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] font-bold py-1.5 rounded-lg transition-all capitalize ${
                  isSelected 
                    ? `${bgClass} text-ink-primary neo-border-sm neo-shadow-xs` 
                    : "bg-paper-100 text-ink-secondary hover:bg-paper-200 border border-paper-300"
                }`}
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Blog list */}
      <div className="flex-1 overflow-y-auto p-3">
        {filtered.length === 0 ? (
          <div className="text-center text-ink-muted text-xs py-10 bg-paper-50 rounded-xl neo-border-sm border-dashed p-4" style={{ fontFamily: "var(--font-jetbrains)" }}>
            No thoughts match your query
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
        className="p-3 border-t-2 border-ink bg-paper-50 grid grid-cols-3 gap-2"
      >
        {(["seed", "growing", "published"] as const).map((s) => {
          const { color, label, badgeBg } = STAGE_CONFIG[s];
          const count = blogs.filter((b) => b.stage === s).length;
          return (
            <div 
              key={s} 
              className={`text-center py-1.5 px-1 rounded-lg neo-border-sm ${badgeBg} neo-shadow-xs`}
            >
              <div className="text-sm font-black text-ink-primary" style={{ fontFamily: "var(--font-jetbrains)" }}>
                {count}
              </div>
              <div className="text-[9px] font-bold text-ink-primary uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

