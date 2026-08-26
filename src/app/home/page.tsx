"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import AuthModal from "@/components/AuthModal";
import { Post, Profile } from "@/types/database";
import { postsService } from "@/lib/services/postsService";
import { profileService } from "@/lib/services/profileService";
import { useAuth } from "@/context/AuthContext";
import { useBlogStore } from "@/store/useBlogStore";
import { 
  Sparkles, Users, TrendingUp, Feather, Plus, 
  Tag, Flame, Compass, ArrowRight, UserPlus, UserCheck 
} from "lucide-react";
import Link from "next/link";
import { socialService } from "@/lib/services/socialService";

type FeedTab = "for-you" | "following";

const POPULAR_TAGS = [
  "philosophy", "writing", "slow-tech", "psychology", 
  "mindfulness", "typography", "creativity", "history"
];

export default function HomePage() {
  const { profile } = useAuth();
  const [tab, setTab] = useState<FeedTab>("for-you");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendedWriters, setRecommendedWriters] = useState<Profile[]>([]);
  const [showAuth, setShowAuth] = useState(false);
  const localBlogs = useBlogStore((s) => s.blogs);
  const localStreak = useBlogStore((s) => s.streak);

  useEffect(() => {
    const loadFeed = async () => {
      setLoading(true);
      if (tab === "following" && profile) {
        const data = await postsService.fetchFollowing(profile.id);
        setPosts(data);
      } else {
        const data = await postsService.fetchForYou();
        setPosts(data);
      }
      setLoading(false);
    };

    loadFeed();
  }, [tab, profile]);

  useEffect(() => {
    profileService.getRecommendedWriters(profile?.id).then(setRecommendedWriters);
  }, [profile?.id]);

  return (
    <div className="min-h-screen bg-paper-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Feed Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Writer Welcome Banner (If Logged In) */}
            {profile && (
              <div className="p-5 rounded-2xl bg-paper-50 neo-border neo-shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full neo-border-sm object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-pastel-amber-solid neo-border-sm flex items-center justify-center text-sm font-bold text-ink-primary flex-shrink-0">
                      {profile.display_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-bold text-ink-primary" style={{ fontFamily: "var(--font-cormorant)" }}>
                      Welcome to the Desk, {profile.display_name}
                    </h2>
                    <p className="text-xs text-ink-secondary font-medium">
                      Your private studio is active with <span className="font-bold text-ink-primary">@{profile.username}</span>.
                    </p>
                  </div>
                </div>
                <Link
                  href="/editor"
                  className="px-3.5 py-2 rounded-xl bg-pastel-amber-solid neo-btn text-xs font-bold text-ink-primary flex items-center gap-1.5 flex-shrink-0"
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                >
                  <Feather size={13} strokeWidth={2.4} />
                  <span>Draft Manuscript</span>
                </Link>
              </div>
            )}

            {/* Feed Tabs Bar */}
            <div className="flex items-center justify-between gap-4 bg-paper-50 rounded-2xl neo-border p-1.5 neo-shadow-sm">

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setTab("for-you")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    tab === "for-you"
                      ? "bg-pastel-amber-solid text-ink-primary neo-border-sm neo-shadow-xs"
                      : "text-ink-secondary hover:text-ink-primary hover:bg-paper-200"
                  }`}
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                >
                  <Sparkles size={14} strokeWidth={2.4} />
                  <span>For You</span>
                </button>

                <button
                  onClick={() => {
                    if (!profile) {
                      setShowAuth(true);
                    } else {
                      setTab("following");
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    tab === "following"
                      ? "bg-pastel-amber-solid text-ink-primary neo-border-sm neo-shadow-xs"
                      : "text-ink-secondary hover:text-ink-primary hover:bg-paper-200"
                  }`}
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                >
                  <Users size={14} strokeWidth={2.4} />
                  <span>Following</span>
                </button>
              </div>

              <Link
                href="/explore"
                className="text-xs font-bold text-ink-muted hover:text-ink-primary px-3 py-1.5 rounded-lg hover:bg-paper-200 transition-colors hidden sm:flex items-center gap-1"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                <span>Explore Topics</span>
                <ArrowRight size={12} strokeWidth={2.4} />
              </Link>
            </div>

            {/* Posts List */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="p-6 rounded-2xl bg-paper-50 neo-border neo-shadow-sm animate-pulse h-48" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 p-8 bg-paper-50 rounded-2xl neo-border text-ink-muted">
                <Users size={36} className="mx-auto mb-3 opacity-40 text-ink-primary" />
                <h3 className="text-2xl font-bold text-ink-primary mb-1" style={{ fontFamily: "var(--font-cormorant)" }}>
                  {tab === "following" ? "No Essays from Writers You Follow" : "No Public Manuscripts Yet"}
                </h3>
                <p className="text-xs font-medium max-w-sm mx-auto mb-4">
                  {tab === "following"
                    ? "Discover thoughtful writers in the explore directory or switch to the For You tab."
                    : "Be the first to publish a philosophical thought from your writing studio."}
                </p>
                <Link
                  href="/editor"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pastel-amber-solid neo-btn text-xs font-bold text-ink-primary"
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                >
                  <Feather size={14} strokeWidth={2.4} />
                  <span>Open Studio & Draft</span>
                </Link>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} onOpenAuth={() => setShowAuth(true)} />
              ))
            )}
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Studio Jump Card */}
            <div className="p-5 rounded-2xl bg-[#FEFCE8] neo-border neo-shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Feather size={18} className="text-amber" strokeWidth={2.4} />
                <h3 className="text-xs font-bold text-ink-primary uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                  Writing Sanctuary
                </h3>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed font-medium mb-4">
                You have <span className="font-bold text-ink-primary">{localBlogs.length} local manuscripts</span> in your private studio.
              </p>
              <Link
                href="/editor"
                className="w-full py-2.5 rounded-xl bg-pastel-amber-solid text-ink-primary neo-btn text-xs font-bold flex items-center justify-center gap-2"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                <Plus size={14} strokeWidth={2.4} />
                <span>Open Studio Canvas</span>
              </Link>
            </div>

            {/* Trending Topics / Tags */}
            <div className="p-5 rounded-2xl bg-paper-50 neo-border neo-shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={15} className="text-violet" strokeWidth={2.4} />
                <h3 className="text-xs font-bold text-ink-primary uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                  Curated Topics
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_TAGS.map((tag) => (
                  <Link
                    key={tag}
                    href={`/explore?tag=${encodeURIComponent(tag)}`}
                    className="px-2.5 py-1 rounded-full neo-border-sm bg-paper-100 text-xs font-bold text-ink-primary hover:bg-pastel-amber-solid transition-colors"
                    style={{ fontFamily: "var(--font-jetbrains)" }}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Recommended Writers */}
            {recommendedWriters.length > 0 && (
              <div className="p-5 rounded-2xl bg-paper-50 neo-border neo-shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users size={15} className="text-emerald-700" strokeWidth={2.4} />
                    <h3 className="text-xs font-bold text-ink-primary uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                      Writers to Discover
                    </h3>
                  </div>
                  <Link
                    href="/explore?tab=writers"
                    className="text-[10px] font-bold text-ink-muted hover:underline"
                    style={{ fontFamily: "var(--font-jetbrains)" }}
                  >
                    View all
                  </Link>
                </div>

                <div className="space-y-3">
                  {recommendedWriters.slice(0, 4).map((writer) => {
                    return (
                      <div key={writer.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-paper-100 neo-border-sm">
                        <Link href={`/@${writer.username}`} className="flex items-center gap-2.5 min-w-0 group">
                          {writer.avatar_url ? (
                            <img src={writer.avatar_url} alt="" className="w-8 h-8 rounded-full neo-border-sm object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-pastel-amber-solid neo-border-sm flex items-center justify-center text-xs font-bold text-ink-primary flex-shrink-0">
                              {writer.display_name.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-ink-primary group-hover:underline truncate">
                              {writer.display_name}
                            </div>
                            <div className="text-[10px] text-ink-muted truncate" style={{ fontFamily: "var(--font-jetbrains)" }}>
                              @{writer.username}
                            </div>
                          </div>
                        </Link>

                        <Link
                          href={`/@${writer.username}`}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-paper-50 neo-border-sm hover:bg-pastel-amber-solid transition-colors flex-shrink-0"
                          style={{ fontFamily: "var(--font-jetbrains)" }}
                        >
                          Profile
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}


            {/* Constellation Preview Card */}
            <div className="p-5 rounded-2xl bg-paper-50 neo-border neo-shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Compass size={16} className="text-violet" strokeWidth={2.4} />
                <h3 className="text-xs font-bold text-ink-primary uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                  Thought Constellation
                </h3>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed font-medium mb-3">
                Explore the global 3D graph connecting essays across all writers by philosophical tags.
              </p>
              <Link
                href="/feed"
                className="w-full py-2 rounded-xl bg-paper-200 neo-border-sm hover:bg-paper-300 text-xs font-bold text-ink-primary flex items-center justify-center gap-1.5 transition-colors"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                <span>Open Constellation</span>
                <ArrowRight size={12} strokeWidth={2.4} />
              </Link>
            </div>

          </div>
        </div>
      </main>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}
