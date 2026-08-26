"use client";

import { useState, useEffect, useTransition, Suspense } from "react";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import AuthModal from "@/components/AuthModal";
import { Post, Profile } from "@/types/database";
import { postsService } from "@/lib/services/postsService";
import { profileService } from "@/lib/services/profileService";
import { Search, TrendingUp, Users, Tag, Clock, Sparkles, X, UserPlus, UserCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { socialService } from "@/lib/services/socialService";
import { useAuth } from "@/context/AuthContext";

type ExploreSection = "trending" | "writers" | "topics" | "latest";

const TOPICS = [
  { name: "philosophy", count: 18, desc: "Metaphysics, epistemology, ethics, and slow thought." },
  { name: "writing", count: 24, desc: "The craft of prose, revision psychology, and editing." },
  { name: "slow-tech", count: 12, desc: "Calm interfaces, digital sovereignty, and offline tools." },
  { name: "psychology", count: 15, desc: "Attention ecology, cognitive architecture, and memory." },
  { name: "typography", count: 9, desc: "Codex history, serifs, print culture, and aesthetic layouts." },
  { name: "creativity", count: 16, desc: "Incubation, divergent intuition, and unhurried craft." },
];

function ExploreContent() {
  const searchParams = useSearchParams();
  const tagParam = searchParams.get("tag");
  const tabParam = searchParams.get("tab") as ExploreSection | null;

  const { profile } = useAuth();
  const [section, setSection] = useState<ExploreSection>(tabParam || "trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(tagParam);
  const [posts, setPosts] = useState<Post[]>([]);
  const [writers, setWriters] = useState<Profile[]>([]);
  const [searchResults, setSearchResults] = useState<{ posts: Post[]; writers: Profile[] }>({ posts: [], writers: [] });
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (tagParam) {
      setSelectedTag(tagParam);
      setSection("topics");
    }
  }, [tagParam]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (selectedTag) {
        const data = await postsService.fetchByTag(selectedTag);
        setPosts(data);
      } else if (section === "trending") {
        const data = await postsService.fetchTrending();
        setPosts(data);
      } else if (section === "latest") {
        const data = await postsService.fetchForYou();
        setPosts(data);
      } else if (section === "writers") {
        const data = await profileService.getRecommendedWriters();
        setWriters(data);
      }
      setLoading(false);
    };

    loadData();
  }, [section, selectedTag]);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults({ posts: [], writers: [] });
      return;
    }

    startTransition(async () => {
      const [matchedPosts, matchedWriters] = await Promise.all([
        postsService.searchPosts(q),
        profileService.searchProfiles(q),
      ]);
      setSearchResults({ posts: matchedPosts, writers: matchedWriters });
    });
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <main className="flex-1 py-8 px-4 sm:px-6 max-w-5xl mx-auto w-full">
      {/* Header & Search */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink-primary tracking-tight mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
          Explore the Literary Constellation
        </h1>
        <p className="text-xs sm:text-sm text-ink-secondary mb-6 font-medium">
          Discover thought-provoking essays, philosophical topics, and fellow writers across BlogPotro.
        </p>

        {/* Search Input Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" strokeWidth={2.4} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search essays, author pen names, or #topics..."
            className="w-full rounded-2xl pl-11 pr-10 py-3.5 text-xs sm:text-sm font-bold text-ink-primary bg-paper-50 neo-border neo-shadow-sm outline-none focus:bg-white focus:neo-shadow transition-all"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg bg-paper-200 text-ink-secondary hover:text-ink-primary"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Search Results Display */}
      {isSearching ? (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-ink-primary border-b-2 border-ink pb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
            Search Results for "{searchQuery}"
          </h2>

          {/* Matched Writers */}
          {searchResults.writers.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-3" style={{ fontFamily: "var(--font-jetbrains)" }}>
                Writers ({searchResults.writers.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {searchResults.writers.map((w) => (
                  <Link
                    key={w.id}
                    href={`/@${w.username}`}
                    className="p-4 rounded-xl bg-paper-50 neo-border-sm neo-shadow-xs hover:neo-shadow transition-all flex items-center gap-3"
                  >
                    {w.avatar_url ? (
                      <img src={w.avatar_url} alt="" className="w-10 h-10 rounded-full neo-border-sm object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-pastel-amber-solid neo-border-sm flex items-center justify-center text-sm font-bold text-ink-primary">
                        {w.display_name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-ink-primary truncate">{w.display_name}</div>
                      <div className="text-[10px] text-ink-muted truncate" style={{ fontFamily: "var(--font-jetbrains)" }}>@{w.username}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Matched Essays */}
          <div>
            <h3 className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-3" style={{ fontFamily: "var(--font-jetbrains)" }}>
              Essays ({searchResults.posts.length})
            </h3>
            {searchResults.posts.length === 0 ? (
              <div className="p-8 text-center bg-paper-50 rounded-2xl neo-border text-ink-muted text-xs font-medium">
                No essays matching your query. Try searching for broader philosophical keywords.
              </div>
            ) : (
              searchResults.posts.map((post) => (
                <PostCard key={post.id} post={post} onOpenAuth={() => setShowAuth(true)} />
              ))
            )}
          </div>
        </div>
      ) : (
        /* Normal Category Browse */
        <div>
          {/* Category Navigation Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {[
              { id: "trending" as ExploreSection, label: "Trending Essays", icon: TrendingUp },
              { id: "topics" as ExploreSection, label: "Topics & Tags", icon: Tag },
              { id: "writers" as ExploreSection, label: "Discover Writers", icon: Users },
              { id: "latest" as ExploreSection, label: "Latest Publications", icon: Clock },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setSection(id);
                  setSelectedTag(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  section === id && !selectedTag
                    ? "bg-pastel-amber-solid text-ink-primary neo-border-sm neo-shadow-xs"
                    : "bg-paper-50 text-ink-secondary neo-border-sm hover:bg-paper-200"
                }`}
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                <Icon size={14} strokeWidth={2.4} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Tag Filter Banner */}
          {selectedTag && (
            <div className="flex items-center justify-between p-3.5 bg-pastel-amber-light rounded-2xl neo-border-sm mb-6">
              <span className="text-xs font-bold text-ink-primary" style={{ fontFamily: "var(--font-jetbrains)" }}>
                Showing essays tagged with #{selectedTag}
              </span>
              <button
                onClick={() => setSelectedTag(null)}
                className="px-2.5 py-1 rounded-lg bg-paper-50 neo-border-sm text-xs font-bold text-ink-primary"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Section Views */}
          {section === "topics" && !selectedTag && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {TOPICS.map((topic) => (
                <button
                  key={topic.name}
                  onClick={() => setSelectedTag(topic.name)}
                  className="p-5 rounded-2xl bg-paper-50 neo-border neo-shadow-sm hover:neo-shadow hover:bg-[#FEFCE8] text-left transition-all flex flex-col"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold text-ink-primary" style={{ fontFamily: "var(--font-jetbrains)" }}>
                      #{topic.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full neo-border-sm bg-pastel-amber-solid text-ink-primary" style={{ fontFamily: "var(--font-jetbrains)" }}>
                      {topic.count} essays
                    </span>
                  </div>
                  <p className="text-xs text-ink-secondary leading-relaxed font-medium">
                    {topic.desc}
                  </p>
                </button>
              ))}
            </div>
          )}

          {section === "writers" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {writers.map((writer) => {
                const isFollowing = socialService.isFollowingLocally(writer.id);

                return (
                  <div key={writer.id} className="p-5 rounded-2xl bg-paper-50 neo-border neo-shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <Link href={`/@${writer.username}`} className="flex items-center gap-3 min-w-0 group">
                          {writer.avatar_url ? (
                            <img src={writer.avatar_url} alt="" className="w-12 h-12 rounded-full neo-border-sm object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-pastel-amber-solid neo-border-sm flex items-center justify-center text-lg font-bold text-ink-primary flex-shrink-0">
                              {writer.display_name.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-ink-primary group-hover:underline truncate">
                              {writer.display_name}
                            </div>
                            <div className="text-xs text-ink-muted truncate" style={{ fontFamily: "var(--font-jetbrains)" }}>
                              @{writer.username}
                            </div>
                          </div>
                        </Link>

                        <Link
                          href={`/@${writer.username}`}
                          className="px-3 py-1.5 rounded-xl bg-pastel-amber-solid neo-border-sm text-xs font-bold text-ink-primary hover:bg-pastel-rose-solid transition-colors flex-shrink-0"
                          style={{ fontFamily: "var(--font-jetbrains)" }}
                        >
                          View Profile
                        </Link>
                      </div>

                      <p className="text-xs text-ink-secondary leading-relaxed font-medium line-clamp-2 mb-3">
                        {writer.bio || "Writer in residence on BlogPotro."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-paper-200 text-[10px] font-bold text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>
                      <span>{writer.streak_days || 0}d Writing Streak</span>
                      <span>•</span>
                      <span>{(writer.words_count || 0).toLocaleString()} words written</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}


          {(section === "trending" || section === "latest" || selectedTag) && (
            <div>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="p-6 rounded-2xl bg-paper-50 neo-border neo-shadow-sm animate-pulse h-48" />
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12 p-6 bg-paper-50 rounded-2xl neo-border text-ink-muted text-xs font-medium">
                  No essays found in this category yet.
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} onOpenAuth={() => setShowAuth(true)} />
                ))
              )}
            </div>
          )}
        </div>
      )}

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </main>
  );
}

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-paper-100 flex flex-col">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center text-xs text-ink-muted" style={{ fontFamily: "var(--font-jetbrains)" }}>
          Loading explore…
        </div>
      }>
        <ExploreContent />
      </Suspense>
    </div>
  );
}

