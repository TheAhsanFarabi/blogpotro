"use client";

import { useState } from "react";
import Link from "next/link";
import { Post } from "@/types/database";
import { Heart, MessageSquare, Bookmark, Share2, Sparkles, Clock, Calendar } from "lucide-react";
import { socialService } from "@/lib/services/socialService";
import { useAuth } from "@/context/AuthContext";
import ShareModal from "./ShareModal";

interface Props {
  post: Post;
  onOpenAuth?: () => void;
}

export default function PostCard({ post, onOpenAuth }: Props) {
  const { profile } = useAuth();
  const [isLiked, setIsLiked] = useState(socialService.isLikedLocally(post.id));
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [isBookmarked, setIsBookmarked] = useState(socialService.isBookmarkedLocally(post.id));
  const [showShare, setShowShare] = useState(false);

  const authorUsername = post.author?.username || "author";
  const authorName = post.author?.display_name || "Anonymous Writer";
  const authorAvatar = post.author?.avatar_url;
  const postUrl = `/@${authorUsername}/${post.slug}`;

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!profile) {
      onOpenAuth?.();
      return;
    }

    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    await socialService.toggleLike(post.id, profile.id);
  };

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!profile) {
      onOpenAuth?.();
      return;
    }

    const nextBookmarked = !isBookmarked;
    setIsBookmarked(nextBookmarked);
    await socialService.toggleBookmark(post.id, profile.id);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowShare(true);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "Recently";
    }
  };

  return (
    <>
      <article className="rounded-2xl bg-paper-50 neo-border neo-shadow-sm hover:neo-shadow transition-all overflow-hidden flex flex-col p-5 sm:p-6 mb-5">
        {/* Author Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <Link
            href={`/@${authorUsername}`}
            className="flex items-center gap-2.5 group min-w-0"
          >
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-8 h-8 rounded-full neo-border-sm object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-pastel-amber-solid neo-border-sm flex items-center justify-center text-xs font-bold text-ink-primary flex-shrink-0">
                {authorName.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-xs font-bold text-ink-primary group-hover:underline truncate">
                {authorName}
              </div>
              <div className="text-[10px] text-ink-muted truncate" style={{ fontFamily: "var(--font-jetbrains)" }}>
                @{authorUsername}
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2 text-[10px] font-bold text-ink-muted flex-shrink-0" style={{ fontFamily: "var(--font-jetbrains)" }}>
            <span className="flex items-center gap-1">
              <Clock size={11} strokeWidth={2.4} /> {post.reading_time}m read
            </span>
            <span>•</span>
            <span>{formatDate(post.published_at)}</span>
          </div>
        </div>

        {/* Title & Excerpt */}
        <Link href={postUrl} className="group block mb-3">
          <h2
            className="text-xl sm:text-2xl font-bold text-ink-primary group-hover:text-amber-800 transition-colors leading-tight mb-2"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {post.title}
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-medium line-clamp-3">
            {post.excerpt}
          </p>
        </Link>

        {/* Cover Image (Optional) */}
        {post.cover_url && (
          <Link href={postUrl} className="block mb-4 overflow-hidden rounded-xl neo-border-sm max-h-56">
            <img
              src={post.cover_url}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </Link>
        )}

        {/* Tags & Action Bar */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t-2 border-dashed border-paper-200 mt-auto">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 min-w-0">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/explore?tag=${encodeURIComponent(tag)}`}
                className="px-2 py-0.5 rounded-full neo-border-sm bg-pastel-amber-solid text-[10px] font-bold text-ink-primary hover:bg-pastel-rose-solid transition-colors"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                #{tag}
              </Link>
            ))}
          </div>

          {/* Social Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Like */}
            <button
              onClick={handleToggleLike}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold neo-border-sm transition-all ${
                isLiked
                  ? "bg-pastel-rose-solid text-rose"
                  : "bg-paper-100 text-ink-secondary hover:bg-paper-200"
              }`}
              style={{ fontFamily: "var(--font-jetbrains)" }}
              title="Like essay"
            >
              <Heart size={13} strokeWidth={2.4} className={isLiked ? "fill-rose" : ""} />
              <span>{likesCount}</span>
            </button>

            {/* Comments */}
            <Link
              href={`${postUrl}#comments`}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold neo-border-sm bg-paper-100 text-ink-secondary hover:bg-paper-200 transition-all"
              style={{ fontFamily: "var(--font-jetbrains)" }}
              title="View comments"
            >
              <MessageSquare size={13} strokeWidth={2.4} />
              <span>{post.comments_count || 0}</span>
            </Link>

            {/* Bookmark */}
            <button
              onClick={handleToggleBookmark}
              className={`p-1.5 rounded-lg neo-border-sm transition-all ${
                isBookmarked
                  ? "bg-pastel-mint-solid text-ink-primary"
                  : "bg-paper-100 text-ink-secondary hover:bg-paper-200"
              }`}
              title={isBookmarked ? "Remove bookmark" : "Bookmark essay"}
            >
              <Bookmark size={13} strokeWidth={2.4} className={isBookmarked ? "fill-current" : ""} />
            </button>

            {/* Share */}
            <button
              onClick={handleShareClick}
              className="p-1.5 rounded-lg neo-border-sm bg-paper-100 text-ink-secondary hover:text-ink-primary hover:bg-paper-200 transition-all"
              title="Share article"
            >
              <Share2 size={13} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </article>

      <ShareModal
        open={showShare}
        onClose={() => setShowShare(false)}
        title={post.title}
        url={typeof window !== "undefined" ? `${window.location.origin}${postUrl}` : postUrl}
      />
    </>
  );
}
