"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useBlogStore } from "@/store/useBlogStore";
import type { Blog } from "@/types";
import { Sprout, TrendingUp, Star, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const STAGE_COLOR: Record<string, string> = {
  seed: "#6bcb77",
  growing: "#e8a045",
  published: "#9d7cff",
};

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  blog: Blog;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  sharedTags: string[];
}

function PreviewPanel({ blog, onClose }: { blog: Blog; onClose: () => void }) {
  const stageColor = STAGE_COLOR[blog.stage];
  const StageIcon = blog.stage === "seed" ? Sprout : blog.stage === "growing" ? TrendingUp : Star;
  const preview = blog.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 220);
  const totalScore = blog.scores ? Math.round((blog.scores.human + blog.scores.clarity + blog.scores.accuracy) / 3) : null;
  const setCurrentId = useBlogStore((s) => s.setCurrentId);

  return (
    <div
      className="absolute right-6 top-6 bottom-6 w-80 rounded-2xl flex flex-col overflow-hidden animate-slide-up"
      style={{ background: "#0d0d12", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}
    >
      {/* Header */}
      <div className="p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="flex items-start justify-between gap-3">
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: 20, lineHeight: 1.2, color: "#f4f1eb", fontWeight: 600 }}>
            {blog.title || "Untitled"}
          </h2>
          <button onClick={onClose} className="text-ink-muted hover:text-ink-primary mt-0.5 flex-shrink-0 text-lg leading-none">×</button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="flex items-center gap-1 text-xs" style={{ color: stageColor }}>
            <StageIcon size={11} /> {blog.stage}
          </span>
          <span className="text-xs text-ink-muted">•</span>
          <span className="text-xs text-ink-muted">{blog.versions.length} versions</span>
          {totalScore !== null && (
            <>
              <span className="text-xs text-ink-muted">•</span>
              <span className="flex items-center gap-1 text-xs" style={{ color: "#9d7cff" }}>
                <Sparkles size={10} /> {totalScore}/100
              </span>
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {blog.tags.map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(232,160,69,0.1)", color: "#e8a045" }}>
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 p-5 overflow-y-auto">
        <p className="text-sm leading-relaxed text-ink-secondary">{preview}{preview.length >= 220 ? "…" : ""}</p>

        {/* Score bars */}
        {blog.scores && (
          <div className="mt-4 space-y-2">
            {[
              ["Human", blog.scores.human, "#6bcb77"],
              ["Clarity", blog.scores.clarity, "#e8a045"],
              ["Accuracy", blog.scores.accuracy, "#9d7cff"],
            ].map(([label, val, color]) => (
              <div key={label as string}>
                <div className="flex justify-between text-[10px] mb-1" style={{ fontFamily: "var(--font-jetbrains)" }}>
                  <span className="text-ink-muted">{label as string}</span>
                  <span style={{ color: color as string }}>{val as number}</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full" style={{ width: `${val as number}%`, background: color as string }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <Link
          href="/editor"
          onClick={() => setCurrentId(blog.id)}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all hover:brightness-110"
          style={{ background: "rgba(232,160,69,0.12)", color: "#e8a045", border: "1px solid rgba(232,160,69,0.2)" }}
        >
          Open in Editor <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function ThoughtGraph() {
  const blogs = useBlogStore((s) => s.blogs);
  const svgRef = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<Blog | null>(null);

  useEffect(() => {
    if (!svgRef.current || blogs.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const W = svgRef.current.clientWidth || 800;
    const H = svgRef.current.clientHeight || 600;

    // Star field background
    const starGroup = svg.append("g").attr("class", "stars");
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const r = Math.random() * 1.2;
      starGroup.append("circle")
        .attr("cx", x).attr("cy", y).attr("r", r)
        .attr("fill", `rgba(255,255,255,${0.03 + Math.random() * 0.08})`);
    }

    const nodes: GraphNode[] = blogs.map((b) => ({ id: b.id, blog: b }));
    const links: GraphLink[] = [];

    for (let i = 0; i < blogs.length; i++) {
      for (let j = i + 1; j < blogs.length; j++) {
        const shared = blogs[i].tags.filter((t) => blogs[j].tags.includes(t));
        if (shared.length > 0) {
          links.push({ source: blogs[i].id, target: blogs[j].id, sharedTags: shared });
        }
      }
    }

    const sim = d3.forceSimulation(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links).id((d) => d.id).distance(180))
      .force("charge", d3.forceManyBody().strength(-320))
      .force("center", d3.forceCenter(W / 2, H / 2))
      .force("collision", d3.forceCollide(70));

    const g = svg.append("g");

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (e) => g.attr("transform", e.transform.toString()));
    svg.call(zoom);

    // Links
    const link = g.append("g").selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "rgba(255,255,255,0.06)")
      .attr("stroke-width", 1);

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

    // Glow halo
    node.append("circle")
      .attr("r", (d) => 44 + (d.blog.scores ? (d.blog.scores.human / 100) * 14 : 0))
      .attr("fill", (d) => STAGE_COLOR[d.blog.stage] + "18")
      .attr("stroke", "none");

    // Main circle
    node.append("circle")
      .attr("r", (d) => 36 + (d.blog.scores ? (d.blog.scores.human / 100) * 10 : 0))
      .attr("fill", "#0d0d12")
      .attr("stroke", (d) => STAGE_COLOR[d.blog.stage])
      .attr("stroke-width", 1.5);

    // Ring for published
    node.filter((d) => d.blog.stage === "published")
      .append("circle")
      .attr("r", (d) => 42 + (d.blog.scores ? (d.blog.scores.human / 100) * 10 : 0))
      .attr("fill", "none")
      .attr("stroke", (d) => STAGE_COLOR[d.blog.stage])
      .attr("stroke-width", 0.5)
      .attr("stroke-dasharray", "3,3")
      .attr("opacity", 0.4);

    // Title text
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-8")
      .attr("fill", "#f4f1eb")
      .attr("font-size", "11")
      .attr("font-weight", "500")
      .attr("font-family", "var(--font-jakarta)")
      .text((d) => d.blog.title.length > 14 ? d.blog.title.slice(0, 13) + "…" : d.blog.title);

    // Stage label
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "8")
      .attr("fill", (d) => STAGE_COLOR[d.blog.stage])
      .attr("font-size", "9.5")
      .attr("font-family", "var(--font-jetbrains)")
      .text((d) => d.blog.stage === "seed" ? "🌱 seed" : d.blog.stage === "growing" ? "🌿 growing" : "✦ published");

    // Score badge
    node.filter((d) => d.blog.scores !== null).append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "22")
      .attr("fill", "rgba(255,255,255,0.3)")
      .attr("font-size", "9")
      .attr("font-family", "var(--font-jetbrains)")
      .text((d) => d.blog.scores ? `${Math.round((d.blog.scores.human + d.blog.scores.clarity + d.blog.scores.accuracy) / 3)}` : "");

    node.on("click", (_, d) => setSelected(d.blog));
    node.on("mouseenter", function (_, d) {
      d3.select(this).select("circle:nth-child(2)")
        .transition().duration(120)
        .attr("stroke-width", 2.5);
    });
    node.on("mouseleave", function () {
      d3.select(this).select("circle:nth-child(2)")
        .transition().duration(120)
        .attr("stroke-width", 1.5);
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
  }, [blogs]);

  return (
    <div className="relative w-full h-full">
      {/* Legend */}
      <div
        className="absolute top-4 left-4 z-10 p-3 rounded-xl flex flex-col gap-2"
        style={{ background: "rgba(13,13,18,0.9)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}
      >
        <div className="text-[10px] text-ink-muted uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-jetbrains)" }}>Legend</div>
        {[["seed", "🌱", "#6bcb77"], ["growing", "🌿", "#e8a045"], ["published", "✦", "#9d7cff"]].map(([s, icon, c]) => (
          <div key={s} className="flex items-center gap-2 text-[11px]">
            <div className="w-2 h-2 rounded-full" style={{ background: c }} />
            <span className="text-ink-secondary">{icon} {s}</span>
          </div>
        ))}
        <div className="text-[10px] text-ink-muted mt-1 pt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          Drag to explore · Scroll to zoom
        </div>
      </div>

      {/* Tag connections hint */}
      <div
        className="absolute bottom-4 left-4 z-10 px-3 py-2 rounded-xl text-[10px] text-ink-muted"
        style={{ background: "rgba(13,13,18,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        Lines = shared tags between blogs
      </div>

      <svg ref={svgRef} className="w-full h-full" />

      {selected && <PreviewPanel blog={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
