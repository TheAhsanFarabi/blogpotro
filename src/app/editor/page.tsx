"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import BlogSidebar from "@/components/BlogSidebar";
import RichEditor from "@/components/RichEditor";
import VersionPanel from "@/components/VersionPanel";
import AIPanel from "@/components/AIPanel";
import StageSelector from "@/components/StageSelector";
import LofiPlayer from "@/components/LofiPlayer";
import PublishModal from "@/components/PublishModal";
import AuthModal from "@/components/AuthModal";
import { useBlogStore } from "@/store/useBlogStore";
import { GitBranch, Sparkles, Trash2, Menu, X, Globe, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type RightTab = "versions" | "ai";

export default function EditorPage() {
  const [mounted, setMounted] = useState(false);
  const [rightTab, setRightTab] = useState<RightTab>("versions");
  const [focusMode, setFocusMode] = useState(false);
  
  // Modals
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Mobile drawer states
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileRightPanel, setShowMobileRightPanel] = useState(false);
  
  const { profile } = useAuth();
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
    <div className="flex flex-col overflow-hidden bg-paper-100" style={{ height: "100vh", position: "relative" }}>
      {!focusMode && <Navbar />}

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* =========================================
            LEFT SIDEBAR (Blogs List)
            ========================================= */}
        {showMobileSidebar && (
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs" onClick={() => setShowMobileSidebar(false)} />
        )}
        <div 
          className={`
            ${showMobileSidebar ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0 transition-transform duration-250 ease-out
            absolute md:relative z-50 md:z-auto h-full flex-shrink-0
          `}
        >
          {/* Close button for mobile sidebar */}
          <button 
            className="md:hidden absolute top-3 right-3 p-1.5 bg-paper-50 neo-border-sm rounded-lg text-ink-primary z-[60] neo-shadow-xs"
            onClick={() => setShowMobileSidebar(false)}
          >
            <X size={16} />
          </button>
          {!focusMode && <BlogSidebar />}
        </div>

        {/* =========================================
            CENTER (Editor Canvas)
            ========================================= */}
        <div className="flex flex-col flex-1 overflow-hidden min-w-0 bg-paper-100">
          {/* Top Header Bar */}
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2.5 flex-shrink-0 bg-paper-50 border-b-2 border-ink min-h-[56px] overflow-x-auto">
            
            {/* Mobile Sidebar Toggle */}
            <button 
              className="md:hidden p-2 rounded-lg bg-paper-200 neo-border-sm text-ink-primary flex-shrink-0 neo-shadow-xs active:translate-x-0.5 active:translate-y-0.5 active:shadow-none" 
              onClick={() => setShowMobileSidebar(true)}
            >
              <Menu size={16} strokeWidth={2.4} />
            </button>

            {mounted ? (
              blog ? (
                <>
                  <input
                    value={blog.title}
                    onChange={(e) => currentId && updateBlog(currentId, { title: e.target.value })}
                    placeholder="Untitled thought…"
                    className="flex-1 bg-transparent text-ink-primary outline-none placeholder:text-ink-muted min-w-[140px] font-bold"
                    style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(20px, 4.5vw, 26px)" }}
                  />
                  <div className="hidden sm:block"><StageSelector /></div>

                  {/* Publish / Live Post Button */}
                  {blog.remoteSlug && profile ? (
                    <Link
                      href={`/@${profile.username}/${blog.remoteSlug}`}
                      target="_blank"
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-pastel-mint-solid text-ink-primary neo-border-sm flex items-center gap-1.5 neo-shadow-xs flex-shrink-0"
                      style={{ fontFamily: "var(--font-jetbrains)" }}
                    >
                      <Globe size={13} strokeWidth={2.4} />
                      <span className="hidden md:inline">Live Post</span>
                      <ExternalLink size={11} strokeWidth={2.4} />
                    </Link>
                  ) : (
                    <button
                      onClick={() => setShowPublishModal(true)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-pastel-violet-solid text-ink-primary neo-btn-sm flex items-center gap-1.5 flex-shrink-0"
                      style={{ fontFamily: "var(--font-jetbrains)" }}
                    >
                      <Globe size={13} strokeWidth={2.4} />
                      <span>Publish</span>
                    </button>
                  )}

                  <button
                    onClick={() => { if (currentId && confirm("Are you sure you want to delete this thought?")) deleteBlog(currentId); }}
                    className="p-2 rounded-lg bg-paper-200 neo-border-sm text-ink-secondary hover:text-rose hover:bg-pastel-rose-light transition-all flex-shrink-0 neo-shadow-xs active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    title="Delete Thought"
                  >
                    <Trash2 size={15} strokeWidth={2.2} />
                  </button>
                </>
              ) : (
                <span className="text-ink-muted text-base italic flex-1 font-serif" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Select or create a thought to begin writing
                </span>
              )
            ) : (
              <span className="text-ink-muted text-sm italic opacity-60 flex-1" style={{ fontFamily: "var(--font-cormorant)" }}>
                Loading thought…
              </span>
            )}

            {/* Mobile Right Panel Toggle */}
            <button 
              className="lg:hidden p-2 rounded-lg bg-pastel-violet-solid neo-border-sm text-ink-primary flex-shrink-0 ml-auto neo-shadow-xs" 
              onClick={() => setShowMobileRightPanel(true)}
            >
              <Sparkles size={16} strokeWidth={2.2} />
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
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs" onClick={() => setShowMobileRightPanel(false)} />
        )}
        
        {!focusMode && (
          <div 
            className={`
              ${showMobileRightPanel ? "translate-x-0" : "translate-x-full"} 
              lg:translate-x-0 transition-transform duration-250 ease-out
              absolute right-0 lg:relative z-50 lg:z-auto h-full flex flex-col flex-shrink-0
              w-80 max-w-[88vw] bg-paper-100 border-l-2 border-ink
            `}
          >
            {/* Close button for mobile right panel */}
            <button 
              className="lg:hidden absolute top-2.5 right-2.5 p-1.5 bg-paper-50 neo-border-sm rounded-lg text-ink-primary z-[60] neo-shadow-xs"
              onClick={() => setShowMobileRightPanel(false)}
            >
              <X size={15} />
            </button>

            {/* Tabs Header */}
            <div className="flex border-b-2 border-ink flex-shrink-0 bg-paper-200 pr-8 lg:pr-0">
              {([
                { id: "versions" as RightTab, label: "Snapshots", icon: GitBranch, activeBg: "bg-pastel-amber-solid", activeColor: "text-ink-primary" },
                { id: "ai" as RightTab, label: "AI Analysis", icon: Sparkles, activeBg: "bg-pastel-violet-solid", activeColor: "text-ink-primary" },
              ]).map(({ id, label, icon: Icon, activeBg }) => (
                <button
                  key={id}
                  onClick={() => setRightTab(id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all ${
                    rightTab === id
                      ? `${activeBg} text-ink-primary border-b-2 border-ink neo-shadow-xs z-10`
                      : "text-ink-secondary hover:text-ink-primary hover:bg-paper-300"
                  }`}
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                >
                  <Icon size={13} strokeWidth={2.4} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-hidden bg-paper-100">
              {rightTab === "versions" ? <VersionPanel /> : <AIPanel />}
            </div>
          </div>
        )}
      </div>

      {/* Publish & Auth Modals */}
      <PublishModal
        open={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onOpenAuth={() => {
          setShowPublishModal(false);
          setShowAuthModal(true);
        }}
      />
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <LofiPlayer />
    </div>
  );
}