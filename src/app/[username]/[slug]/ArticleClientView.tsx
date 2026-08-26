"use client";

import { useState } from "react";
import Link from "next/link";
import { Post } from "@/types/database";
import { useAuth } from "@/context/AuthContext";
import { socialService } from "@/lib/services/socialService";
import { Heart, Bookmark, Share2, Sparkles, Clock, Calendar, ArrowLeft, UserPlus, UserCheck, Flame, Compass } from "lucide-react";
import ShareModal from "@/components/ShareModal";
import AuthModal from "@/components/AuthModal";
import CommentsSection from "@/components/CommentsSection";

interface Props {
  post: Post;
  usernameParam: string;
}

export default function ArticleClientView({ post, usernameParam }: Props) {
  const { profile } = useAuth();
  const [isLiked, setIsLiked] = useState(socialService.isLikedLocally(post.id));
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [isBookmarked, setIsBookmarked] = useState(socialService.isBookmarkedLocally(post.id));
  const [isFollowing, setIsFollowing] = useState(
    post.author ? socialService.isFollowingLocally(post.author.id) : false
  );
  const [showShare, setShowShare] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const author = post.author;
  const authorName = author?.display_name || "Anonymous Writer";
  const authorUsername = author?.username || usernameParam;
  const isOwnPost = profile && author?.id === profile.id;

  const handleToggleLike = async () => {
    if (!profile) {
      setShowAuth(true);
      return;
    }
    const next = !isLiked;
    setIsLiked(next);
    setLikesCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
    await socialService.toggleLike(post.id, profile.id);
  };

  const handleToggleBookmark = async () => {
    if (!profile) {
      setShowAuth(true);
      return;
    }
    const next = !isBookmarked;
    setIsBookmarked(next);
    await socialService.toggleBookmark(post.id, profile.id);
  };

  const handleToggleFollow = async () => {
    if (!profile) {
      setShowAuth(true);
      return;
    }
    if (!author || isOwnPost) return;

    const next = !isFollowing;
    setIsFollowing(next);
    await socialService.toggleFollow(author.id, profile.id);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    } catch {
      return "Published recently";
    }
  };

  return (
    <main className="flex-1 py-8 px-4 sm:px-6 max-w-4xl mx-auto w-full">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/home"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-paper-50 neo-border-sm hover:bg-paper-200 text-xs font-bold text-ink-primary neo-shadow-xs transition-all"
          style={{ fontFamily: "var(--font-jetbrains)" }}
        >
          <ArrowLeft size={13} strokeWidth={2.4} />
          <span>Back to Feed</span>
        </Link>
      </div>

      {/* Main Manuscript Article Container */}
      <article className="bg-paper-50 rounded-2xl neo-border neo-shadow-md p-6 sm:p-12 overflow-hidden">
        {/* Author Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b-2 border-ink">
          <div className="flex items-center gap-3">
            <Link href={`/@${authorUsername}`}>
              {author?.avatar_url ? (
                <img
                  src={author.avatar_url}
                  alt={authorName}
                  className="w-12 h-12 rounded-full neo-border-sm object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-pastel-amber-solid neo-border-sm flex items-center justify-center text-base font-bold text-ink-primary">
                  {authorName.charAt(0)}
                </div>
              )}
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/@${authorUsername}`}
                  className="text-base font-bold text-ink-primary hover:underline"
                >
                  {authorName}
                </Link>
                {author?.streak_days && author.streak_days > 0 ? (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-pastel-rose-solid neo-border-sm text-[10px] font-bold text-ink-primary" style={{ fontFamily: "var(--font-jetbrains)" }}>
                    <Flame size={10} className="text-rose" /> {author.streak_days}d
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-2 text-xs text-ink-muted font-bold" style={{ fontFamily: "var(--font-jetbrains)" }}>
                <Link href={`/@${authorUsername}`}>@{authorUsername}</Link>
                <span>•</span>
                <span>{formatDate(post.published_at)}</span>
              </div>
            </div>
          </div>

          {/* Follow Button */}
          {!isOwnPost && (
            <button
              onClick={handleToggleFollow}
              className={`px-4 py-2 rounded-xl text-xs font-bold neo-border-sm flex items-center gap-1.5 transition-all ${
                isFollowing
                  ? "bg-paper-200 text-ink-primary hover:bg-paper-300"
                  : "bg-pastel-amber-solid text-ink-primary neo-btn-sm"
              }`}
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              {isFollowing ? <UserCheck size={14} strokeWidth={2.4} /> : <UserPlus size={14} strokeWidth={2.4} />}
              <span>{isFollowing ? "Following" : "Follow Writer"}</span>
            </button>
          )}
        </div>

        {/* Title */}
        <h1
          className="text-3xl sm:text-5xl font-bold text-ink-primary leading-tight tracking-tight mb-4"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-base sm:text-lg text-ink-secondary italic leading-relaxed mb-6 font-serif" style={{ fontFamily: "var(--font-cormorant)" }}>
            "{post.excerpt}"
          </p>
        )}

        {/* Meta Pills & Reading Metrics */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-paper-100 rounded-xl neo-border-sm mb-8">
          <div className="flex flex-wrap items-center gap-1.5">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/explore?tag=${encodeURIComponent(tag)}`}
                className="px-2.5 py-0.5 rounded-full neo-border-sm bg-pastel-amber-solid text-xs font-bold text-ink-primary hover:bg-pastel-rose-solid transition-colors"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                #{tag}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-bold text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>
            <span className="flex items-center gap-1">
              <Clock size={12} strokeWidth={2.4} /> {post.reading_time} min read
            </span>
          </div>
        </div>

        {/* Cover Image */}
        {post.cover_url && (
          <div className="mb-8 rounded-2xl overflow-hidden neo-border">
            <img
              src={post.cover_url}
              alt={post.title}
              className="w-full max-h-[420px] object-cover"
            />
          </div>
        )}

        {/* Article Body Content */}
        <div
          className="prose max-w-none text-ink-primary font-serif leading-relaxed text-lg"
          style={{ fontFamily: "var(--font-cormorant)", fontSize: "20px", lineHeight: "1.8" }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Editorial Insights Summary Box (BlogScore for public readers) */}
        {post.scores && (
          <div className="mt-12 p-6 rounded-2xl bg-[#FEFCE8] neo-border neo-shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-amber" strokeWidth={2.4} />
              <h4 className="text-xs font-bold text-ink-primary uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                Editorial Insights & Craft Evaluation
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Authorial Voice", val: post.scores.human, color: "#10B981", bg: "bg-pastel-mint-solid" },
                { label: "Clarity & Rhythm", val: post.scores.clarity, color: "#F59E0B", bg: "bg-pastel-amber-solid" },
                { label: "Coherence & Logic", val: post.scores.accuracy, color: "#8B5CF6", bg: "bg-pastel-violet-solid" },
              ].map(({ label, val, color, bg }) => (
                <div key={label} className="p-3 bg-paper-50 rounded-xl neo-border-sm">
                  <div className="flex justify-between items-center text-xs font-bold mb-1" style={{ fontFamily: "var(--font-jetbrains)" }}>
                    <span className="text-ink-secondary">{label}</span>
                    <span className={`px-1.5 py-0.2 rounded neo-border-sm ${bg} text-ink-primary`}>{val}/100</span>
                  </div>
                  <div className="h-2 rounded-full neo-border-sm bg-paper-200 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${val}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Engagement Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-10 pt-6 border-t-2 border-ink">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleLike}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold neo-border-sm transition-all ${
                isLiked
                  ? "bg-pastel-rose-solid text-rose neo-shadow-xs"
                  : "bg-paper-100 text-ink-primary hover:bg-paper-200"
              }`}
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              <Heart size={14} strokeWidth={2.4} className={isLiked ? "fill-rose" : ""} />
              <span>{likesCount} {likesCount === 1 ? "Like" : "Likes"}</span>
            </button>

            <button
              onClick={handleToggleBookmark}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold neo-border-sm transition-all ${
                isBookmarked
                  ? "bg-pastel-mint-solid text-ink-primary neo-shadow-xs"
                  : "bg-paper-100 text-ink-primary hover:bg-paper-200"
              }`}
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              <Bookmark size={14} strokeWidth={2.4} className={isBookmarked ? "fill-current" : ""} />
              <span>{isBookmarked ? "Saved" : "Save"}</span>
            </button>

            <button
              onClick={() => setShowShare(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold neo-border-sm bg-paper-100 text-ink-primary hover:bg-paper-200 transition-all"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              <Share2 size={14} strokeWidth={2.4} />
              <span>Share</span>
            </button>
          </div>

          <Link
            href={`/@${authorUsername}`}
            className="text-xs font-bold text-ink-primary hover:underline"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            More essays by {authorName} →
          </Link>
        </div>

        {/* Author Bio Card Footer */}
        {author && (
          <div className="mt-10 p-6 rounded-2xl bg-paper-100 neo-border-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {author.avatar_url ? (
              <img src={author.avatar_url} alt={authorName} className="w-14 h-14 rounded-full neo-border-sm object-cover flex-shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-pastel-amber-solid neo-border-sm flex items-center justify-center text-xl font-bold text-ink-primary flex-shrink-0">
                {authorName.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-base font-bold text-ink-primary mb-1">
                Written by {authorName} (@{authorUsername})
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed font-medium">
                {author.bio || "Writer and essayist exploring thoughtful literature on BlogPotro."}
              </p>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <CommentsSection
          postId={post.id}
          postAuthorId={post.author_id}
          onOpenAuth={() => setShowAuth(true)}
        />
      </article>

      <ShareModal
        open={showShare}
        onClose={() => setShowShare(false)}
        title={post.title}
        url={typeof window !== "undefined" ? window.location.href : ""}
      />

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </main>
  );
}
