"use client";

import { useState, useEffect } from "react";
import { useBlogStore } from "@/store/useBlogStore";
import { GitBranch, Clock, RotateCcw, Eye, X, Tag, Check, ArrowDownRight } from "lucide-react";

function DiffViewer({ content, vLabel, currentContent, onClose, onRestore }: {
  content: string;
  vLabel: string;
  currentContent: string;
  onClose: () => void;
  onRestore: () => void;
}) {
  const wordCount = content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const currentWords = currentContent.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const diff = wordCount - currentWords;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(24, 24, 27, 0.65)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-2xl bg-paper-50 rounded-2xl overflow-hidden neo-border neo-shadow-xl flex flex-col animate-slide-up"
        style={{ maxHeight: "85vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-ink bg-paper-200 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <GitBranch size={16} strokeWidth={2.4} />
              <h3 className="font-bold text-xl text-ink-primary" style={{ fontFamily: "var(--font-cormorant)" }}>
                Manuscript Snapshot — {vLabel}
              </h3>
            </div>
            <div className="flex items-center gap-2 mt-1.5" style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11 }}>
              <span className="px-2 py-0.5 rounded neo-border-sm bg-pastel-violet-solid font-bold text-ink-primary">
                {wordCount} words snapshot
              </span>
              <span className="text-ink-muted">vs</span>
              <span className="px-2 py-0.5 rounded neo-border-sm bg-pastel-amber-solid font-bold text-ink-primary">
                {currentWords} words now
              </span>
              <span className="font-bold px-1.5 py-0.5 rounded neo-border-sm bg-paper-50" style={{ color: diff > 0 ? "#047857" : diff < 0 ? "#BE123C" : "#52525B" }}>
                ({diff > 0 ? "+" : ""}{diff})
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-paper-50 neo-border-sm text-ink-secondary hover:text-ink-primary neo-shadow-xs transition-colors">
            <X size={16} strokeWidth={2.4} />
          </button>
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white paper-ruled">
          {content ? (
            <div
              className="tiptap-editor max-w-[620px] mx-auto p-6 bg-paper-50 rounded-xl neo-border-sm"
              dangerouslySetInnerHTML={{ __html: content }}
              style={{ pointerEvents: "none" }}
            />
          ) : (
            <p className="text-ink-muted text-sm italic text-center py-12" style={{ fontFamily: "var(--font-cormorant)" }}>
              This snapshot was recorded without content body.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t-2 border-ink bg-paper-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>
            <RotateCcw size={12} className="text-amber" />
            <span>Restoring will auto-backup your current draft</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-ink-secondary bg-paper-200 neo-border-sm hover:bg-paper-300 transition-all"
            >
              Close
            </button>
            {content && (
              <button
                onClick={() => { onRestore(); onClose(); }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-ink-primary bg-pastel-amber-solid neo-btn-sm flex items-center gap-1.5"
              >
                <RotateCcw size={12} strokeWidth={2.4} />
                Restore Snapshot
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VersionPanel() {
  const [mounted, setMounted] = useState(false);
  const blog = useBlogStore((s) => s.currentBlog());
  const saveVersion = useBlogStore((s) => s.saveVersion);
  const restoreVersion = useBlogStore((s) => s.restoreVersion);
  const currentId = useBlogStore((s) => s.currentId);
  
  const [commitMsg, setCommitMsg] = useState("");
  const [saved, setSaved] = useState(false);
  const [viewing, setViewing] = useState<number | null>(null);
  const [restoreConfirm, setRestoreConfirm] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    if (!currentId) return;
    const msg = commitMsg.trim() || "Snapshot log";
    saveVersion(currentId, msg);
    setCommitMsg("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRestore = (origIndex: number) => {
    if (!currentId) return;
    restoreVersion(currentId, origIndex);
    setRestoreConfirm(null);
    setViewing(null);
  };

  if (!mounted) {
    return <div className="p-4 text-center text-ink-muted text-xs" style={{ fontFamily: "var(--font-jetbrains)" }}>Loading version archive…</div>;
  }

  if (!blog) {
    return <div className="p-4 text-center text-ink-muted text-xs" style={{ fontFamily: "var(--font-jetbrains)" }}>Select a thought to view versions</div>;
  }

  const versionsReversed = [...blog.versions].reverse();
  const origIndicesReversed = blog.versions.map((_, i) => i).reverse();

  return (
    <div className="flex flex-col h-full bg-paper-100">
      {/* Commit Box */}
      <div className="p-4 border-b-2 border-ink bg-paper-50">
        <label className="block text-xs font-bold text-ink-primary mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
          Capture Snapshot
        </label>
        <textarea
          value={commitMsg}
          onChange={(e) => setCommitMsg(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSave(); } }}
          placeholder="e.g. Reworked introduction, added philosophical paradox..."
          rows={2}
          className="w-full rounded-xl px-3 py-2 text-xs font-medium text-ink-primary placeholder:text-ink-muted bg-paper-100 neo-border outline-none resize-none focus:bg-white transition-all"
        />
        <button
          onClick={handleSave}
          className={`w-full mt-2.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            saved 
              ? "bg-pastel-mint-solid text-ink-primary neo-border-sm neo-shadow-xs" 
              : "bg-pastel-amber-solid text-ink-primary neo-btn-sm"
          }`}
          style={{ fontFamily: "var(--font-jetbrains)" }}
        >
          {saved ? <Check size={13} strokeWidth={2.8} /> : <GitBranch size={13} strokeWidth={2.4} />}
          <span>{saved ? "Snapshot Captured!" : "Commit Version"}</span>
        </button>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-xs font-bold text-ink-muted mb-3 flex items-center justify-between" style={{ fontFamily: "var(--font-jetbrains)" }}>
          <span className="uppercase tracking-wider">Revision History</span>
          <span>{versionsReversed.length} logs</span>
        </div>

        <div className="relative pl-1">
          {/* Vertical timeline spine */}
          <div className="absolute left-3.5 top-3 bottom-3 w-[2px] bg-ink" />

          {versionsReversed.map((v, i) => {
            const origIndex = origIndicesReversed[i];
            const isCurrent = i === 0;

            return (
              <div key={`${v.v}-${i}`} className="relative flex gap-3 mb-3.5 group">
                {/* Timeline node */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 mt-1 neo-border-sm ${
                    isCurrent ? "bg-pastel-amber-solid neo-shadow-xs" : "bg-paper-50"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${isCurrent ? "bg-ink" : "bg-paper-400"}`} />
                </div>

                {/* Card */}
                <div
                  className={`flex-1 rounded-xl p-3.5 transition-all ${
                    isCurrent
                      ? "bg-[#FEFCE8] neo-border neo-shadow-xs"
                      : "bg-paper-50 neo-border-sm hover:neo-shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-bold px-1.5 py-0.2 rounded neo-border-sm ${isCurrent ? "bg-pastel-amber-solid" : "bg-pastel-violet-solid"}`} style={{ fontFamily: "var(--font-jetbrains)" }}>
                      {v.v}{isCurrent && <span className="ml-1 text-[9px] opacity-80 uppercase">· current</span>}
                    </span>
                    <span className="text-[10px] font-bold text-ink-muted flex items-center gap-1" style={{ fontFamily: "var(--font-jetbrains)" }}>
                      <Clock size={10} strokeWidth={2.2} />{v.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-ink-primary mb-2.5 font-medium leading-relaxed">{v.message}</p>

                  <div className="flex items-center justify-between pt-1 border-t border-paper-200">
                    <div className="flex items-center gap-1">
                      <Tag size={10} className="text-ink-muted" />
                      <span className="text-[10px] font-bold text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>
                        {v.wordCount}w
                      </span>
                    </div>

                    {!isCurrent && (
                      <div className="flex items-center gap-1.5">
                        {/* View Snapshot */}
                        <button
                          onClick={() => setViewing(origIndex)}
                          className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-pastel-violet-light hover:bg-pastel-violet-solid neo-border-sm text-ink-primary transition-all"
                          style={{ fontFamily: "var(--font-jetbrains)" }}
                        >
                          <Eye size={10} strokeWidth={2.4} /> View
                        </button>

                        {/* Restore Snapshot */}
                        {restoreConfirm === origIndex ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleRestore(origIndex)}
                              className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-pastel-amber-solid neo-border-sm text-ink-primary transition-all"
                            >
                              <Check size={10} strokeWidth={2.8} /> Confirm
                            </button>
                            <button onClick={() => setRestoreConfirm(null)} className="p-1 rounded-md text-ink-muted hover:text-ink-primary">
                              <X size={10} strokeWidth={2.5} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setRestoreConfirm(origIndex)}
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-paper-200 hover:bg-paper-300 neo-border-sm text-ink-primary transition-all"
                            style={{ fontFamily: "var(--font-jetbrains)" }}
                          >
                            <RotateCcw size={10} strokeWidth={2.4} /> Restore
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diff Viewer Modal */}
      {viewing !== null && blog.versions[viewing] && (
        <DiffViewer
          content={blog.versions[viewing].content}
          vLabel={blog.versions[viewing].v}
          currentContent={blog.content}
          onClose={() => setViewing(null)}
          onRestore={() => handleRestore(viewing)}
        />
      )}
    </div>
  );
}