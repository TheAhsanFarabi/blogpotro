"use client";

import { useState, useEffect } from "react";
import { Comment, Profile } from "@/types/database";
import { commentService } from "@/lib/services/commentService";
import { useAuth } from "@/context/AuthContext";
import { MessageSquare, Send, Trash2, Shield, User, Sparkles } from "lucide-react";
import Link from "next/link";

interface Props {
  postId: string;
  postAuthorId: string;
  onOpenAuth: () => void;
}

export default function CommentsSection({ postId, postAuthorId, onOpenAuth }: Props) {
  const { profile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const data = await commentService.getComments(postId);
      setComments(data);
      setLoading(false);
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      onOpenAuth();
      return;
    }
    if (!content.trim()) return;

    setSubmitting(true);
    const newComment = await commentService.addComment(postId, profile.id, content, profile);
    if (newComment) {
      setComments((prev) => [...prev, newComment]);
    }
    setContent("");
    setSubmitting(false);
  };


  const handleDelete = async (commentId: string) => {
    if (confirm("Delete this comment?")) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      await commentService.deleteComment(commentId);
    }
  };


  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Just now";
    }
  };

  return (
    <section id="comments" className="mt-12 pt-8 border-t-2 border-ink">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-7 h-7 rounded-lg bg-pastel-amber-solid neo-border-sm flex items-center justify-center text-ink-primary">
          <MessageSquare size={15} strokeWidth={2.4} />
        </div>
        <h3 style={{ fontFamily: "var(--font-cormorant)" }} className="text-2xl font-bold text-ink-primary">
          Literary Discourse & Reflections ({comments.length})
        </h3>
      </div>

      {/* Input Box */}
      {profile ? (
        <form onSubmit={handleSubmit} className="mb-8 p-4 rounded-2xl bg-paper-50 neo-border neo-shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-6 h-6 rounded-full neo-border-sm object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-pastel-amber-solid neo-border-sm flex items-center justify-center text-[10px] font-bold text-ink-primary">
                {profile.display_name.charAt(0)}
              </div>
            )}
            <span className="text-xs font-bold text-ink-primary">{profile.display_name}</span>
            <span className="text-[10px] text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>@{profile.username}</span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share a constructive critique, resonant reflection, or question..."
            rows={3}
            required
            className="w-full p-3 rounded-xl bg-paper-100 neo-border text-xs font-medium text-ink-primary placeholder:text-ink-muted outline-none focus:bg-white transition-all resize-none leading-relaxed"
          />

          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="px-4 py-2 rounded-xl bg-pastel-amber-solid text-xs font-bold text-ink-primary neo-btn-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              <Send size={12} strokeWidth={2.4} />
              <span>{submitting ? "Posting..." : "Contribute Thought"}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-5 rounded-2xl bg-paper-50 neo-border neo-shadow-sm text-center">
          <p className="text-xs text-ink-secondary mb-3 font-medium">
            Join the conversation. Sign in with Google to share reflections with the author.
          </p>
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 rounded-xl bg-pastel-amber-solid text-xs font-bold text-ink-primary neo-btn-sm inline-flex items-center gap-1.5"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            <Sparkles size={13} strokeWidth={2.4} />
            <span>Sign in to Comment</span>
          </button>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-6 text-xs text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>
          Loading reflections…
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 p-6 bg-paper-50 rounded-2xl neo-border-sm text-ink-muted text-xs font-medium">
          No reflections yet. Be the first to leave an editorial note or thoughtful comment.
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => {
            const author = c.author;
            const isAuthor = author?.id === postAuthorId;
            const isMe = profile && author?.id === profile.id;

            return (
              <div key={c.id} className="p-4 rounded-xl bg-paper-50 neo-border-sm neo-shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Link
                    href={`/@${author?.username || "author"}`}
                    className="flex items-center gap-2 group"
                  >
                    {author?.avatar_url ? (
                      <img src={author.avatar_url} alt="" className="w-6 h-6 rounded-full neo-border-sm object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-pastel-amber-solid neo-border-sm flex items-center justify-center text-[10px] font-bold text-ink-primary">
                        {author?.display_name?.charAt(0) || "U"}
                      </div>
                    )}
                    <span className="text-xs font-bold text-ink-primary group-hover:underline">
                      {author?.display_name || "Writer"}
                    </span>
                    <span className="text-[10px] text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>
                      @{author?.username || "author"}
                    </span>
                    {isAuthor && (
                      <span className="px-1.5 py-0.2 rounded-full neo-border-sm bg-pastel-violet-solid text-[9px] font-bold text-ink-primary" style={{ fontFamily: "var(--font-jetbrains)" }}>
                        Author
                      </span>
                    )}
                  </Link>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>
                      {formatDate(c.created_at)}
                    </span>
                    {(isMe || (profile && profile.id === postAuthorId)) && (
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-ink-muted hover:text-rose p-1 transition-colors"
                        title="Delete comment"
                      >
                        <Trash2 size={12} strokeWidth={2.4} />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-ink-secondary leading-relaxed font-medium pl-8">
                  {c.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
