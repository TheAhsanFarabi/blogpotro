"use client";

import { useState, useEffect } from "react";
import { X, Globe, EyeOff, Sparkles, Check, ArrowRight, Share2, Copy, ExternalLink, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBlogStore } from "@/store/useBlogStore";
import { postsService } from "@/lib/services/postsService";
import confetti from "canvas-confetti";
import Link from "next/link";

interface Props {
  open: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export default function PublishModal({ open, onClose, onOpenAuth }: Props) {
  const { profile } = useAuth();
  const currentBlog = useBlogStore((s) => s.currentBlog());
  const updateCurrentBlog = useBlogStore((s) => s.updateBlog);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [visibility, setVisibility] = useState<"public" | "unlisted">("public");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // Sync draft data when modal opens
  useEffect(() => {
    if (open && currentBlog) {
      const cleanTitle = currentBlog.title || "Untitled Thought";
      setTitle(cleanTitle);

      const generatedSlug = cleanTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") || "thought-" + Date.now();
      setSlug(generatedSlug);

      const plainText = currentBlog.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      const generatedExcerpt = plainText.slice(0, 160) + (plainText.length > 160 ? "…" : "");
      setExcerpt(generatedExcerpt);

      setTags(currentBlog.tags || []);
      setPublishedUrl(null);
      setError("");
    }
  }, [open, currentBlog]);

  if (!open || !currentBlog) return null;

  const calculateReadingTime = (html: string) => {
    const text = html.replace(/<[^>]+>/g, " ").trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const handleAddTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput("");
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile) {
      onOpenAuth();
      return;
    }

    if (!title.trim()) {
      setError("Please provide a title for your publication.");
      return;
    }

    const cleanContent = currentBlog.content.replace(/<[^>]+>/g, " ").trim();
    if (!cleanContent) {
      setError("Your manuscript cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const readingTime = calculateReadingTime(currentBlog.content);
      const post = await postsService.createPost({
        author_id: profile.id,
        title: title.trim(),
        slug: slug.trim(),
        content: currentBlog.content,
        excerpt: excerpt.trim(),
        cover_url: coverUrl.trim() || undefined,
        visibility,
        stage: "published",
        reading_time: readingTime,
        scores: currentBlog.scores,
        tags,
        author: profile,
      });

      if (!post) {
        throw new Error("Failed to publish post. Please check your Supabase connection.");
      }

      // Update local draft metadata so user knows it is published
      updateCurrentBlog(currentBlog.id, {
        remoteSlug: post.slug,
        publishedAt: post.published_at,
        stage: "published",
      });

      const url = `/@${profile.username}/${post.slug}`;
      setPublishedUrl(url);


      // Trigger Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F59E0B", "#8B5CF6", "#10B981", "#18181B"],
      });
    } catch (err: any) {
      setError(err.message || "Failed to publish manuscript.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!publishedUrl) return;
    const fullUrl = `${window.location.origin}${publishedUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: "rgba(24, 24, 27, 0.65)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-paper-50 rounded-2xl p-6 sm:p-8 neo-border neo-shadow-xl animate-slide-up my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 border-b-2 border-ink pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pastel-violet-solid neo-border-sm flex items-center justify-center text-ink-primary">
              <Globe size={16} strokeWidth={2.4} />
            </div>
            <h2 style={{ fontFamily: "var(--font-cormorant)" }} className="text-2xl font-bold text-ink-primary">
              {publishedUrl ? "Published to the World" : "Publish Manuscript"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-paper-200 neo-border-sm text-ink-secondary hover:text-ink-primary neo-shadow-xs transition-colors"
          >
            <X size={16} strokeWidth={2.4} />
          </button>
        </div>

        {/* Success State */}
        {publishedUrl ? (
          <div className="text-center py-4 space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-pastel-mint-solid neo-border flex items-center justify-center text-ink-primary neo-shadow-sm">
              <Check size={32} strokeWidth={2.8} />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-ink-primary" style={{ fontFamily: "var(--font-cormorant)" }}>
                Your Essay is Live!
              </h3>
              <p className="text-xs text-ink-secondary mt-1 font-medium">
                Your manuscript has been minted to BlogPotro's public literary network and the Global Thought Constellation.
              </p>
            </div>

            {/* URL Box */}
            <div className="p-3 bg-paper-100 rounded-xl neo-border-sm flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-ink-primary truncate" style={{ fontFamily: "var(--font-jetbrains)" }}>
                {window.location.origin}{publishedUrl}
              </span>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-paper-50 neo-border-sm text-xs font-bold text-ink-primary neo-shadow-xs flex items-center gap-1 flex-shrink-0"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                {copied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} strokeWidth={2.4} />}
                <span>{copied ? "Copied" : "Copy Link"}</span>
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-ink-secondary bg-paper-200 neo-border-sm hover:bg-paper-300 transition-colors"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                Keep Editing Local Draft
              </button>
              <Link
                href={publishedUrl}
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-ink-primary bg-pastel-amber-solid neo-btn flex items-center justify-center gap-1.5"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                <span>View Public Article</span>
                <ExternalLink size={13} strokeWidth={2.4} />
              </Link>
            </div>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handlePublish} className="space-y-4">
            {!profile && (
              <div className="p-3.5 rounded-xl bg-pastel-amber-light neo-border-sm flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-ink-primary">Sign in with Google to publish under your author name.</span>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-3 py-1.5 rounded-lg bg-pastel-amber-solid neo-border-sm text-xs font-bold text-ink-primary neo-shadow-xs"
                >
                  Sign In
                </button>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-pastel-rose-light neo-border-sm text-xs font-bold text-rose">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-ink-primary mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                Publication Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-xl px-4 py-2.5 text-base font-bold text-ink-primary bg-paper-100 neo-border outline-none focus:bg-white transition-all"
                style={{ fontFamily: "var(--font-cormorant)", fontSize: "20px" }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-primary mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                Slug (URL Identifier)
              </label>
              <div className="flex items-center rounded-xl bg-paper-100 neo-border px-3 py-2 text-xs font-bold text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>
                <span>/@{profile?.username || "author"}/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  required
                  className="flex-1 bg-transparent outline-none text-ink-primary ml-0.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-primary mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                Excerpt / Social Summary
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                maxLength={200}
                placeholder="A compelling preview sentence for reader feeds and social shares..."
                className="w-full rounded-xl px-4 py-2.5 text-xs font-medium text-ink-primary bg-paper-100 neo-border outline-none focus:bg-white transition-all resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-primary mb-1.5 uppercase tracking-wider flex items-center gap-1.5" style={{ fontFamily: "var(--font-jetbrains)" }}>
                <ImageIcon size={12} /> Cover Image URL <span className="text-ink-muted font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl px-3.5 py-2 text-xs font-medium text-ink-primary bg-paper-100 neo-border outline-none focus:bg-white transition-all"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-primary mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                Visibility
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVisibility("public")}
                  className={`p-3 rounded-xl neo-border-sm flex items-center gap-2.5 text-xs font-bold text-left transition-all ${
                    visibility === "public" ? "bg-pastel-amber-solid neo-shadow-xs" : "bg-paper-100 hover:bg-paper-200"
                  }`}
                >
                  <Globe size={16} strokeWidth={2.4} />
                  <div>
                    <div>Public</div>
                    <div className="text-[10px] text-ink-muted font-normal">Appears in feeds & explore</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility("unlisted")}
                  className={`p-3 rounded-xl neo-border-sm flex items-center gap-2.5 text-xs font-bold text-left transition-all ${
                    visibility === "unlisted" ? "bg-pastel-violet-solid neo-shadow-xs" : "bg-paper-100 hover:bg-paper-200"
                  }`}
                >
                  <EyeOff size={16} strokeWidth={2.4} />
                  <div>
                    <div>Unlisted</div>
                    <div className="text-[10px] text-ink-muted font-normal">Accessible only via direct link</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-primary mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                Tags (for Thought Constellation)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); handleAddTag(); } }}
                  placeholder="e.g. philosophy, psychology..."
                  className="flex-1 rounded-xl px-3.5 py-2 text-xs font-medium text-ink-primary bg-paper-100 neo-border outline-none focus:bg-white transition-all"
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 rounded-xl bg-paper-200 neo-border-sm text-xs font-bold text-ink-primary hover:bg-paper-300 neo-shadow-xs"
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      onClick={() => setTags(tags.filter((x) => x !== t))}
                      className="px-2.5 py-0.5 rounded-full neo-border-sm bg-pastel-amber-solid text-[10px] font-bold text-ink-primary cursor-pointer hover:bg-pastel-rose-solid flex items-center gap-1"
                      style={{ fontFamily: "var(--font-jetbrains)" }}
                    >
                      #{t} <X size={10} strokeWidth={2.5} />
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t-2 border-dashed border-paper-300">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-ink-secondary bg-paper-200 neo-border-sm hover:bg-paper-300 transition-colors"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-ink-primary bg-pastel-violet-solid neo-btn flex items-center justify-center gap-2"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                <Sparkles size={14} strokeWidth={2.4} />
                <span>{loading ? "Publishing..." : "Publish Essay"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
