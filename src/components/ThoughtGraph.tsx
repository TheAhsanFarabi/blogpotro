"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useBlogStore } from "@/store/useBlogStore";
import type { Blog } from "@/types";
import { Post } from "@/types/database";
import { Sprout, TrendingUp, Star, Sparkles, ArrowRight, X, Compass, Globe, User, BookOpen } from "lucide-react";
import Link from "next/link";

const STAGE_CONFIG: Record<string, { color: string; bg: string; fill: string; border: string; label: string }> = {
  seed: { color: "#047857", bg: "#ECFDF5", fill: "#A7F3D0", border: "#047857", label: "Seed" },
  growing: { color: "#B45309", bg: "#FEF3C7", fill: "#FDE68A", border: "#B45309", label: "Growing" },
  published: { color: "#6D28D9", bg: "#F3E8FF", fill: "#DDD6FE", border: "#6D28D9", label: "Published" },
};

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  item: any;
  isGlobal?: boolean;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  sharedTags: string[];
}

function PreviewPanel({ item, isGlobal, onClose }: { item: any; isGlobal?: boolean; onClose: () => void }) {
  const stage = STAGE_CONFIG[item.stage] || STAGE_CONFIG.published;
  const preview = item.excerpt || item.content?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 240);
  const totalScore = item.scores ? Math.round((item.scores.human + item.scores.clarity + item.scores.accuracy) / 3) : null;
  const setCurrentId = useBlogStore((s) => s.setCurrentId);
  const author = item.author;

  return (
    <div
      className="absolute right-6 top-6 bottom-6 w-84 max-w-[90vw] bg-paper-50 rounded-2xl neo-border neo-shadow-xl flex flex-col overflow-hidden animate-slide-up z-20"
    >
      {/* Header */}
      <div className="p-5 border-b-2 border-ink bg-paper-200">
        <div className="flex items-start justify-between gap-3">
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: 22, lineHeight: 1.2 }} className="font-bold text-ink-primary">
            {item.title || "Untitled Thought"}
          </h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg bg-paper-50 neo-border-sm text-ink-secondary hover:text-ink-primary neo-shadow-xs flex-shrink-0"
          >
            <X size={14} strokeWidth={2.4} />
          </button>
        </div>

        {isGlobal && author && (
          <div className="flex items-center gap-2 mt-2">
            {author.avatar_url ? (
              <img src={author.avatar_url} alt="" className="w-5 h-5 rounded-full neo-border-sm object-cover" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-pastel-amber-solid neo-border-sm flex items-center justify-center text-[9px] font-bold text-ink-primary">
                {author.display_name?.charAt(0)}
              </div>
            )}
            <Link href={`/@${author.username}`} className="text-xs font-bold text-ink-primary hover:underline">
              {author.display_name} (@{author.username})
            </Link>
          </div>
        )}

        <div className="flex items-center gap-2 mt-2.5" style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11 }}>
          <span className="flex items-center gap-1 font-bold px-2 py-0.5 rounded neo-border-sm bg-paper-50" style={{ color: stage.color }}>
            {item.stage || "published"}
          </span>
          {totalScore !== null && (
            <>
              <span className="text-ink-muted">•</span>
              <span className="flex items-center gap-1 font-bold px-2 py-0.5 rounded neo-border-sm bg-pastel-violet-solid text-ink-primary">
                <Sparkles size={10} strokeWidth={2.5} /> {totalScore}/100
              </span>
            </>
          )}
        </div>

        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {item.tags.map((t: string) => (
              <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-full neo-border-sm bg-pastel-amber-solid text-ink-primary" style={{ fontFamily: "var(--font-jetbrains)" }}>
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Manuscript Preview */}
      <div className="flex-1 p-5 overflow-y-auto bg-white paper-ruled">
        <p className="text-sm leading-relaxed text-ink-secondary p-4 bg-paper-50 rounded-xl neo-border-sm font-medium" style={{ fontFamily: "var(--font-jakarta)" }}>
          {preview || "No content written yet."}{preview?.length >= 240 ? "…" : ""}
        </p>

        {/* Score bars */}
        {item.scores && (
          <div className="mt-4 space-y-2 p-3 bg-paper-100 rounded-xl neo-border-sm">
            <div className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1" style={{ fontFamily: "var(--font-jetbrains)" }}>
              Editorial Craft Breakdown
            </div>
            {[
              ["Voice", item.scores.human, "#10B981"],
              ["Clarity", item.scores.clarity, "#F59E0B"],
              ["Coherence", item.scores.accuracy, "#8B5CF6"],
            ].map(([label, val, color]) => (
              <div key={label as string}>
                <div className="flex justify-between text-[10px] font-bold mb-0.5" style={{ fontFamily: "var(--font-jetbrains)" }}>
                  <span className="text-ink-secondary">{label as string}</span>
                  <span className="text-ink-primary">{val as number}%</span>
                </div>
                <div className="h-2 rounded-full neo-border-sm bg-paper-200 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${val as number}%`, background: color as string }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t-2 border-ink bg-paper-100">
        {isGlobal ? (
          <Link
            href={`/@${author?.username || "author"}/${item.slug}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-ink-primary bg-pastel-amber-solid neo-btn"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            <span>Read Full Essay</span> <ArrowRight size={13} strokeWidth={2.4} />
          </Link>
        ) : (
          <Link
            href="/editor"
            onClick={() => setCurrentId(item.id)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-ink-primary bg-pastel-amber-solid neo-btn"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            <span>Open in Studio</span> <ArrowRight size={13} strokeWidth={2.4} />
          </Link>
        )}
      </div>
    </div>
  );
}

interface ThoughtGraphProps {
  customItems?: (Blog | Post)[];
  isGlobalMode?: boolean;
}

export default function ThoughtGraph({ customItems, isGlobalMode = false }: ThoughtGraphProps) {
  const localBlogs = useBlogStore((s) => s.blogs);
  const items = customItems || localBlogs;
  const svgRef = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    if (!svgRef.current || items.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const W = svgRef.current.clientWidth || 800;
    const H = svgRef.current.clientHeight || 600;

    // Subtle paper stipple points in background
    const patternGroup = svg.append("g").attr("class", "paper-dots");
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const r = Math.random() * 1.5;
      patternGroup.append("circle")
        .attr("cx", x).attr("cy", y).attr("r", r)
        .attr("fill", "#D6CEBD");
    }

    const nodes: GraphNode[] = items.map((b) => ({ id: b.id, item: b, isGlobal: isGlobalMode }));
    const links: GraphLink[] = [];

    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const shared = (items[i].tags || []).filter((t: string) => (items[j].tags || []).includes(t));
        if (shared.length > 0) {
          links.push({ source: items[i].id, target: items[j].id, sharedTags: shared });
        }
      }
    }

    const sim = d3.forceSimulation(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links).id((d) => d.id).distance(220))
      .force("charge", d3.forceManyBody().strength(-380))
      .force("center", d3.forceCenter(W / 2, H / 2))
      .force("collision", d3.forceCollide(85));

    const g = svg.append("g");

    // Zoom setup
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (e) => g.attr("transform", e.transform.toString()));
    svg.call(zoom);

    // Links
    const link = g.append("g").selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#18181B")
      .attr("stroke-width", 1.8)
      .attr("stroke-dasharray", "4,3")
      .attr("opacity", 0.45);

    // Node groups
    const node = g.append("g").selectAll<SVGGElement, GraphNode>("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .call(
        d3.drag<SVGGElement, GraphNode>()
          .on("start", (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
          .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
          .on("end", (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
      );

    // Drop Shadow
    node.append("circle")
      .attr("r", 40)
      .attr("cx", 3)
      .attr("cy", 3)
      .attr("fill", "#18181B")
      .attr("stroke", "none");

    // Main Circle
    node.append("circle")
      .attr("r", 40)
      .attr("fill", (d) => STAGE_CONFIG[d.item.stage]?.fill || "#FDE68A")
      .attr("stroke", "#18181B")
      .attr("stroke-width", 2);

    // Title Text
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-6")
      .attr("fill", "#18181B")
      .attr("font-size", "12")
      .attr("font-weight", "700")
      .attr("font-family", "var(--font-cormorant)")
      .text((d) => d.item.title?.length > 14 ? d.item.title.slice(0, 13) + "…" : d.item.title || "Untitled");

    // Author / Stage Tag
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "10")
      .attr("fill", "#18181B")
      .attr("font-size", "9.5")
      .attr("font-weight", "700")
      .attr("font-family", "var(--font-jetbrains)")
      .text((d) => isGlobalMode ? `@${d.item.author?.username || "writer"}` : (d.item.stage === "seed" ? "🌱 SEED" : d.item.stage === "growing" ? "🌿 GROWING" : "✦ PUBLISHED"));

    // Score Tag
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "23")
      .attr("fill", "#52525B")
      .attr("font-size", "9")
      .attr("font-weight", "600")
      .attr("font-family", "var(--font-jetbrains)")
      .text((d) => d.item.scores ? `Score: ${Math.round((d.item.scores.human + d.item.scores.clarity + d.item.scores.accuracy) / 3)}` : `${d.item.tags?.length || 0} tags`);

    node.on("click", (_, d) => setSelected(d.item));
    node.on("mouseenter", function () {
      d3.select(this).select("circle:nth-child(2)")
        .transition().duration(100)
        .attr("transform", "translate(-1, -1)");
    });
    node.on("mouseleave", function () {
      d3.select(this).select("circle:nth-child(2)")
        .transition().duration(100)
        .attr("transform", "translate(0, 0)");
    });

    sim.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as GraphNode).x ?? 0)
        .attr("y1", (d) => (d.source as GraphNode).y ?? 0)
        .attr("x2", (d) => (d.target as GraphNode).x ?? 0)
        .attr("y2", (d) => (d.target as GraphNode).y ?? 0);
      node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => { sim.stop(); };
  }, [items, isGlobalMode]);

  return (
    <div className="relative w-full h-full bg-paper-100">
      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 p-3.5 rounded-xl bg-paper-50 neo-border neo-shadow-sm flex flex-col gap-2">
        <div className="text-[10px] font-bold text-ink-primary uppercase tracking-wider mb-0.5" style={{ fontFamily: "var(--font-jetbrains)" }}>
          {isGlobalMode ? "Global Network Key" : "Private Garden Key"}
        </div>
        {[
          ["seed", "🌱 Seed Draft", "bg-pastel-mint-solid"],
          ["growing", "🌿 Growing Thought", "bg-pastel-amber-solid"],
          ["published", "✦ Published Work", "bg-pastel-violet-solid"]
        ].map(([s, label, bg]) => (
          <div key={s} className="flex items-center gap-2 text-xs font-bold text-ink-primary" style={{ fontFamily: "var(--font-jetbrains)" }}>
            <div className={`w-3.5 h-3.5 rounded-[3px] neo-border-sm ${bg}`} />
            <span>{label}</span>
          </div>
        ))}
        <div className="text-[10px] font-medium text-ink-muted mt-1 pt-1.5 border-t border-paper-300" style={{ fontFamily: "var(--font-jetbrains)" }}>
          Drag nodes · Scroll to zoom
        </div>
      </div>

      <div className="absolute bottom-4 left-4 z-10 px-3.5 py-2 rounded-xl text-[10px] font-bold text-ink-primary bg-paper-50 neo-border neo-shadow-sm" style={{ fontFamily: "var(--font-jetbrains)" }}>
        Dashed lines = shared tags connecting manuscripts
      </div>

      <svg ref={svgRef} className="w-full h-full" />

      {selected && <PreviewPanel item={selected} isGlobal={isGlobalMode} onClose={() => setSelected(null)} />}
    </div>
  );
}


