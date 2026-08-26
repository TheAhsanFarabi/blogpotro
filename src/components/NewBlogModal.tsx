"use client";

import { useState, useEffect, useRef } from "react";
import { X, Plus, Sparkles, BookOpen } from "lucide-react";
import { useBlogStore } from "@/store/useBlogStore";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NewBlogModal({ open, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const titleRef = useRef<HTMLInputElement>(null);
  const createBlog = useBlogStore((s) => s.createBlog);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setTimeout(() => titleRef.current?.focus(), 80);
    } else {
      setTitle("");
      setTagInput("");
      setTags([]);
    }
  }, [open]);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (tagInput) { addTag(); return; }
      handleCreate();
    }
    if (e.key === "Escape") onClose();
  };

  const handleCreate = () => {
    const t = title.trim() || "Untitled thought";
    createBlog(t, tags);
    onClose();
    router.push("/editor");
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(24, 24, 27, 0.65)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md bg-paper-50 rounded-2xl p-6 sm:p-7 neo-border neo-shadow-xl animate-slide-up"
      >
        <div className="flex items-center justify-between mb-5 border-b-2 border-ink pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pastel-amber-solid neo-border-sm flex items-center justify-center text-ink-primary">
              <BookOpen size={16} strokeWidth={2.4} />
            </div>
            <h2
              style={{ fontFamily: "var(--font-cormorant)" }}
              className="text-2xl font-bold text-ink-primary"
            >
              Draft New Manuscript
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg bg-paper-200 neo-border-sm text-ink-secondary hover:text-ink-primary neo-shadow-xs transition-colors"
          >
            <X size={16} strokeWidth={2.4} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink-primary mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
              Manuscript Title
            </label>
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What philosophical paradox or idea are you exploring?"
              className="w-full rounded-xl px-4 py-3 text-base text-ink-primary placeholder:text-ink-muted bg-paper-100 neo-border outline-none focus:bg-white focus:neo-shadow-xs transition-all font-bold"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "19px",
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink-primary mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
              Tags & Connections (for Mind Map)
            </label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } if (e.key === "Escape") onClose(); }}
                placeholder="e.g. philosophy, psychology, life..."
                className="flex-1 rounded-xl px-3.5 py-2.5 text-xs font-medium text-ink-primary placeholder:text-ink-muted bg-paper-100 neo-border outline-none focus:bg-white transition-all"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              />
              <button
                onClick={addTag}
                className="px-3.5 py-2.5 rounded-xl bg-paper-200 neo-border-sm text-ink-primary hover:bg-paper-300 neo-shadow-xs transition-all font-bold"
              >
                <Plus size={16} strokeWidth={2.4} />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-pastel-amber-solid neo-border-sm text-ink-primary cursor-pointer hover:bg-pastel-rose-solid transition-colors"
                    style={{ fontFamily: "var(--font-jetbrains)" }}
                    onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                  >
                    #{tag} <X size={11} strokeWidth={2.5} />
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t-2 border-dashed border-paper-300">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-ink-secondary bg-paper-200 neo-border-sm hover:bg-paper-300 transition-colors"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-ink-primary bg-pastel-amber-solid neo-btn flex items-center justify-center gap-1.5"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            <Sparkles size={13} strokeWidth={2.4} />
            <span>Create Thought</span>
          </button>
        </div>
      </div>
    </div>
  );
}

