"use client";

import { useState, useEffect, useRef } from "react";
import { X, Plus } from "lucide-react";
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
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-2xl animate-slide-up"
        style={{ background: "#0d0d12", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2
            style={{ fontFamily: "var(--font-cormorant)" }}
            className="text-2xl font-semibold text-ink-primary"
          >
            New Thought
          </h2>
          <button onClick={onClose} className="text-ink-muted hover:text-ink-primary transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-ink-muted mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
              Title
            </label>
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind?"
              className="w-full rounded-xl px-4 py-3 text-base text-ink-primary placeholder:text-ink-muted outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily: "var(--font-cormorant)",
                fontSize: "18px",
              }}
            />
          </div>

          <div>
            <label className="block text-xs text-ink-muted mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
              Tags
            </label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } if (e.key === "Escape") onClose(); }}
                placeholder="philosophy, life..."
                className="flex-1 rounded-xl px-4 py-2.5 text-sm text-ink-primary placeholder:text-ink-muted outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
              <button
                onClick={addTag}
                className="px-3 py-2.5 rounded-xl text-ink-muted hover:text-amber transition-colors"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Plus size={16} />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs cursor-pointer hover:opacity-70"
                    style={{ background: "rgba(232,160,69,0.12)", color: "#e8a045", border: "1px solid rgba(232,160,69,0.2)" }}
                    onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                  >
                    {tag} <X size={10} />
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm text-ink-secondary hover:text-ink-primary transition-colors"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #e8a045, #c87d2a)", color: "#07070a" }}
          >
            Create Blog
          </button>
        </div>
      </div>
    </div>
  );
}
