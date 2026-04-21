"use client";

import { useState, useEffect } from "react";
import { useBlogStore } from "@/store/useBlogStore";
import { GitBranch, Clock, RotateCcw, Eye, X, Tag, Check } from "lucide-react";

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
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(10px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ background: "#0d0d12", border: "1px solid rgba(255,255,255,0.1)", maxHeight: "85vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div>
            <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: 20, color: "#f4f1eb" }}>
              Snapshot — {vLabel}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs" style={{ fontFamily: "var(--font-jetbrains)", color: "#9d7cff" }}>
                {wordCount} words in snapshot
              </span>
              <span className="text-xs text-ink-muted">vs</span>
              <span className="text-xs" style={{ fontFamily: "var(--font-jetbrains)", color: "#e8a045" }}>
                {currentWords} words now
              </span>
              <span className="text-xs" style={{ color: diff > 0 ? "#6bcb77" : diff < 0 ? "#f87171" : "#5e5a55", fontFamily: "var(--font-jetbrains)" }}>
                ({diff > 0 ? "+" : ""}{diff})
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-ink-muted hover:text-ink-primary p-1 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {content ? (
            <div
              className="tiptap-editor"
              dangerouslySetInnerHTML={{ __html: content }}
              style={{ pointerEvents: "none" }}
            />
          ) : (
            <p className="text-ink-muted text-sm italic text-center py-8">
              This snapshot was created before content saving was enabled.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center gap-3 flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <RotateCcw size={11} style={{ color: "#e8a045" }} />
            Restoring will auto-backup your current content first
          </div>
          <div className="ml-auto flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm transition-all"
              style={{ background: "rgba(255,255,255,0.04)", color: "#a09a8e", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Close
            </button>
            {content && (
              <button
                onClick={() => { onRestore(); onClose(); }}
                className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all hover:brightness-110"
                style={{ background: "rgba(232,160,69,0.15)", color: "#e8a045", border: "1px solid rgba(232,160,69,0.3)" }}
              >
                <RotateCcw size={13} />
                Restore this version
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

  // Prevent hydration errors by not rendering UI dependent on localStorage until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    if (!currentId) return;
    const msg = commitMsg.trim() || "Saved changes";
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
    return <div className="p-4 text-center text-ink-muted text-sm">Loading versions...</div>;
  }

  if (!blog) {
    return <div className="p-4 text-center text-ink-muted text-sm">Select a blog to see versions</div>;
  }

  const versionsReversed = [...blog.versions].reverse();
  const origIndicesReversed = blog.versions.map((_, i) => i).reverse();

  return (
    <div className="flex flex-col h-full">
      {/* Commit box */}
      <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <label className="block text-xs text-ink-muted mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
          Save Snapshot
        </label>
        <textarea
          value={commitMsg}
          onChange={(e) => setCommitMsg(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSave(); } }}
          placeholder="What changed in this version?"
          rows={2}
          className="w-full rounded-xl px-3 py-2.5 text-xs text-ink-secondary placeholder:text-ink-muted outline-none resize-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        />
        <button
          onClick={handleSave}
          className="w-full mt-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all"
          style={{
            background: saved ? "rgba(107,203,119,0.15)" : "rgba(232,160,69,0.15)",
            color: saved ? "#6bcb77" : "#e8a045",
            border: saved ? "1px solid rgba(107,203,119,0.25)" : "1px solid rgba(232,160,69,0.25)",
          }}
        >
          {saved ? <Check size={12} /> : <GitBranch size={12} />}
          {saved ? "Saved!" : "Commit Version"}
        </button>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-xs text-ink-muted mb-3 flex items-center justify-between" style={{ fontFamily: "var(--font-jetbrains)" }}>
          <span className="uppercase tracking-wider">Timeline</span>
          <span>{versionsReversed.length} snapshots</span>
        </div>

        <div className="relative">
          <div className="absolute left-3 top-3 bottom-3 w-px" style={{ background: "rgba(255,255,255,0.07)" }} />

          {versionsReversed.map((v, i) => {
            const origIndex = origIndicesReversed[i];
            const isCurrent = i === 0;

            return (
              <div key={`${v.v}-${i}`} className="relative flex gap-3 mb-3 group">
                {/* Timeline node */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 mt-1"
                  style={{
                    background: isCurrent ? "rgba(232,160,69,0.2)" : "#0a0a0f",
                    border: isCurrent ? "1.5px solid #e8a045" : "1.5px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: isCurrent ? "#e8a045" : "rgba(255,255,255,0.2)" }} />
                </div>

                {/* Card */}
                <div
                  className="flex-1 rounded-xl p-3"
                  style={{
                    background: isCurrent ? "rgba(232,160,69,0.05)" : "rgba(255,255,255,0.02)",
                    border: isCurrent ? "1px solid rgba(232,160,69,0.15)" : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ fontFamily: "var(--font-jetbrains)", color: isCurrent ? "#e8a045" : "#9d7cff" }}>
                      {v.v}{isCurrent && <span className="ml-1 text-[10px] opacity-60">current</span>}
                    </span>
                    <span className="text-[10px] text-ink-muted flex items-center gap-1">
                      <Clock size={9} />{v.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-ink-secondary mb-2 leading-relaxed">{v.message}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Tag size={9} className="text-ink-muted" />
                      <span className="text-[10px] text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>
                        {v.wordCount}w
                      </span>
                    </div>

                    {!isCurrent && (
                      <div className="flex items-center gap-1">
                        {/* View */}
                        <button
                          onClick={() => setViewing(origIndex)}
                          className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-all hover:brightness-125"
                          style={{ background: "rgba(157,124,255,0.1)", color: "#9d7cff", border: "1px solid rgba(157,124,255,0.2)" }}
                        >
                          <Eye size={9} /> View
                        </button>

                        {/* Restore */}
                        {restoreConfirm === origIndex ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleRestore(origIndex)}
                              className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-all"
                              style={{ background: "rgba(232,160,69,0.2)", color: "#e8a045", border: "1px solid rgba(232,160,69,0.35)" }}
                            >
                              <Check size={9} /> Confirm
                            </button>
                            <button onClick={() => setRestoreConfirm(null)} className="px-1.5 py-1 rounded-md text-ink-muted hover:text-ink-secondary">
                              <X size={9} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setRestoreConfirm(origIndex)}
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-all hover:brightness-125"
                            style={{ background: "rgba(255,255,255,0.04)", color: "#6b6880", border: "1px solid rgba(255,255,255,0.08)" }}
                          >
                            <RotateCcw size={9} /> Restore
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

      {/* Diff viewer modal */}
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