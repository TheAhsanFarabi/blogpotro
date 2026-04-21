"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import BlogSidebar from "@/components/BlogSidebar";
import RichEditor from "@/components/RichEditor";
import VersionPanel from "@/components/VersionPanel";
import AIPanel from "@/components/AIPanel";
import StageSelector from "@/components/StageSelector";
import LofiPlayer from "@/components/LofiPlayer";
import { useBlogStore } from "@/store/useBlogStore";
import { GitBranch, Sparkles, Trash2, Menu, X } from "lucide-react";

type RightTab = "versions" | "ai";

export default function EditorPage() {
  const [mounted, setMounted] = useState(false);
  const [rightTab, setRightTab] = useState<RightTab>("versions");
  const [focusMode, setFocusMode] = useState(false);
  
  // Mobile drawer states
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileRightPanel, setShowMobileRightPanel] = useState(false);
  
  const blog = useBlogStore((s) => s.currentBlog());
  const updateBlog = useBlogStore((s) => s.updateBlog);
  const deleteBlog = useBlogStore((s) => s.deleteBlog);
  const currentId = useBlogStore((s) => s.currentId);
  const recordWriting = useBlogStore((s) => s.recordWriting);

  useEffect(() => setMounted(true), []);

  const prevWordCount = useRef(0);
  useEffect(() => {
    if (!blog || !mounted) return;
    const words = blog.content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
    if (words > prevWordCount.current) {
      const delta = words - prevWordCount.current;
      if (delta >= 5) recordWriting(delta); 
    }
    prevWordCount.current = words;
  }, [blog?.content, mounted, recordWriting]);

  // Close mobile sidebar when a blog is selected
  useEffect(() => {
    setShowMobileSidebar(false);
  }, [currentId]);

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: "100vh", background: "#07070a", position: "relative" }}>
      {!focusMode && <Navbar />}

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* =========================================
            LEFT SIDEBAR (Blogs List)
            ========================================= */}
        {showMobileSidebar && (
          <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setShowMobileSidebar(false)} />
        )}
        <div 
          className={`
            ${showMobileSidebar ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0 transition-transform duration-300 ease-in-out
            absolute md:relative z-50 md:z-auto h-full flex-shrink-0
          `}
        >
          {/* Close button for mobile sidebar */}
          <button 
            className="md:hidden absolute top-3 right-3 p-1.5 bg-ink-elevated rounded-lg text-ink-muted z-[60]"
            onClick={() => setShowMobileSidebar(false)}
          >
            <X size={16} />
          </button>
          {!focusMode && <BlogSidebar />}
        </div>

        {/* =========================================
            CENTER (Editor)
            ========================================= */}
        <div className="flex flex-col flex-1 overflow-hidden min-w-0" style={{ borderRight: focusMode ? "none" : "1px solid rgba(255,255,255,0.07)" }}>
          {/* Top bar */}
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 flex-shrink-0 border-b min-h-[57px] overflow-x-auto" style={{ background: "#0a0a0f", borderColor: "rgba(255,255,255,0.06)" }}>
            
            {/* Mobile Sidebar Toggle */}
            <button className="md:hidden p-1.5 text-ink-muted hover:text-ink-primary flex-shrink-0" onClick={() => setShowMobileSidebar(true)}>
              <Menu size={18} />
            </button>

            {mounted ? (
              blog ? (
                <>
                  <input
                    value={blog.title}
                    onChange={(e) => currentId && updateBlog(currentId, { title: e.target.value })}
                    placeholder="Untitled thought…"
                    className="flex-1 bg-transparent text-ink-primary outline-none placeholder:text-ink-muted min-w-[120px]"
                    style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(18px, 4vw, 22px)", fontWeight: 600 }}
                  />
                  <div className="hidden sm:block"><StageSelector /></div>
                  <button
                    onClick={() => { if (currentId && confirm("Delete this blog?")) deleteBlog(currentId); }}
                    className="p-1.5 rounded-lg text-ink-muted hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              ) : (
                <span className="text-ink-muted text-sm italic flex-1" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Select or create a blog
                </span>
              )
            ) : (
              <span className="text-ink-muted text-sm italic opacity-50 flex-1" style={{ fontFamily: "var(--font-cormorant)" }}>
                Loading...
              </span>
            )}

            {/* Mobile Right Panel Toggle */}
            <button 
              className="lg:hidden p-1.5 text-violet flex-shrink-0 ml-auto" 
              onClick={() => setShowMobileRightPanel(true)}
            >
              <Sparkles size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <RichEditor />
          </div>
        </div>

        {/* =========================================
            RIGHT PANEL (AI & Versions)
            ========================================= */}
        {showMobileRightPanel && (
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setShowMobileRightPanel(false)} />
        )}
        
        {!focusMode && (
          <div 
            className={`
              ${showMobileRightPanel ? "translate-x-0" : "translate-x-full"} 
              lg:translate-x-0 transition-transform duration-300 ease-in-out
              absolute right-0 lg:relative z-50 lg:z-auto h-full flex flex-col flex-shrink-0
              w-72 max-w-[85vw]
            `}
            style={{ background: "#0a0a0f" }}
          >
            {/* Close button for mobile right panel */}
            <button 
              className="lg:hidden absolute top-2 right-2 p-1.5 text-ink-muted z-[60]"
              onClick={() => setShowMobileRightPanel(false)}
            >
              <X size={16} />
            </button>

            <div className="flex border-b flex-shrink-0 pr-8 lg:pr-0" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              {([
                { id: "versions" as RightTab, label: "Versions", icon: GitBranch, activeColor: "#e8a045" },
                { id: "ai" as RightTab, label: "AI Score", icon: Sparkles, activeColor: "#9d7cff" },
              ]).map(({ id, label, icon: Icon, activeColor }) => (
                <button
                  key={id}
                  onClick={() => setRightTab(id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all border-b-2"
                  style={{
                    color: rightTab === id ? activeColor : "#5e5a55",
                    borderBottomColor: rightTab === id ? activeColor : "transparent",
                    background: "transparent",
                  }}
                >
                  <Icon size={12} />
                  {label}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-hidden">
              {rightTab === "versions" ? <VersionPanel /> : <AIPanel />}
            </div>
          </div>
        )}
      </div>

      <LofiPlayer />
    </div>
  );
}