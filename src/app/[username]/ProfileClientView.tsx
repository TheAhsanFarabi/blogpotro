"use client";

import { useState, useEffect } from "react";
import { Profile, Post } from "@/types/database";
import { useAuth } from "@/context/AuthContext";
import { socialService } from "@/lib/services/socialService";
import PostCard from "@/components/PostCard";
import AuthModal from "@/components/AuthModal";
import ThoughtGraph from "@/components/ThoughtGraph";
import { 
  UserPlus, UserCheck, Flame, BookOpen, Compass, Bookmark, 
  Globe, Edit3, Sparkles, Feather, FileText, Calendar 
} from "lucide-react";
import Link from "next/link";
import { useBlogStore } from "@/store/useBlogStore";

type ProfileTab = "posts" | "about" | "constellation" | "saved";

interface Props {
  profile: Profile;
  initialPosts: Post[];
  initialTab?: string;
}

export default function ProfileClientView({ profile: initialProfile, initialPosts, initialTab = "posts" }: Props) {
  const { profile: myProfile, updateProfile } = useAuth();
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [tab, setTab] = useState<ProfileTab>((initialTab as ProfileTab) || "posts");
  const [isFollowing, setIsFollowing] = useState(
    socialService.isFollowingLocally(profile.id)
  );
  const [followersCount, setFollowersCount] = useState(124);
  const [followingCount, setFollowingCount] = useState(48);
  const [showAuth, setShowAuth] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState(profile.bio || "");
  const [editWebsite, setEditWebsite] = useState(profile.website || "");

  const isMe = myProfile && myProfile.id === profile.id;
  const localStreak = useBlogStore((s) => s.streak);

  useEffect(() => {
    const fetchCounts = async () => {
      const followers = await socialService.getFollowersCount(profile.id);
      const following = await socialService.getFollowingCount(profile.id);
      setFollowersCount(followers);
      setFollowingCount(following);
    };
    fetchCounts();
  }, [profile.id]);

  useEffect(() => {
    if (tab === "saved" && isMe) {
      socialService.getUserBookmarks(profile.id).then(setSavedPosts);
    }
  }, [tab, isMe, profile.id]);

  const handleToggleFollow = async () => {
    if (!myProfile) {
      setShowAuth(true);
      return;
    }
    const next = !isFollowing;
    setIsFollowing(next);
    setFollowersCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
    await socialService.toggleFollow(profile.id, myProfile.id);
  };

  const handleSaveBio = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await updateProfile({ bio: editBio, website: editWebsite });
    if (updated) {
      setProfile(updated);
      setIsEditing(false);
    }
  };

  return (
    <main className="flex-1 py-8 px-4 sm:px-6 max-w-4xl mx-auto w-full">
      {/* Profile Banner Card */}
      <div className="bg-paper-50 rounded-2xl neo-border neo-shadow-md p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b-2 border-ink">
          <div className="flex items-center gap-4">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl neo-border object-cover neo-shadow-xs"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-pastel-amber-solid neo-border flex items-center justify-center text-3xl font-bold text-ink-primary neo-shadow-xs">
                {profile.display_name.charAt(0)}
              </div>
            )}
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold text-ink-primary leading-tight"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {profile.display_name}
              </h1>
              <div className="text-xs font-bold text-ink-muted mt-0.5" style={{ fontFamily: "var(--font-jetbrains)" }}>
                @{profile.username}
              </div>

              {/* Followers & Following Stats */}
              <div className="flex items-center gap-3 mt-3 text-xs font-bold text-ink-primary" style={{ fontFamily: "var(--font-jetbrains)" }}>
                <span>{followersCount} <span className="text-ink-muted font-medium">Followers</span></span>
                <span>•</span>
                <span>{followingCount} <span className="text-ink-muted font-medium">Following</span></span>
                <span>•</span>
                <span>{posts.length} <span className="text-ink-muted font-medium">Essays</span></span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div>
            {isMe ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-paper-200 text-ink-primary neo-border-sm hover:bg-paper-300 neo-shadow-xs flex items-center gap-1.5"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                <Edit3 size={13} strokeWidth={2.4} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={handleToggleFollow}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold neo-border flex items-center gap-2 transition-all ${
                  isFollowing
                    ? "bg-paper-200 text-ink-primary hover:bg-paper-300"
                    : "bg-pastel-amber-solid text-ink-primary neo-btn"
                }`}
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                {isFollowing ? <UserCheck size={14} strokeWidth={2.4} /> : <UserPlus size={14} strokeWidth={2.4} />}
                <span>{isFollowing ? "Following Writer" : "Follow Writer"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Bio & Writing Commitment Badges */}
        <div className="pt-6">
          <p className="text-sm text-ink-secondary leading-relaxed font-medium mb-4 max-w-2xl">
            {profile.bio || "Writer in residence on BlogPotro."}
          </p>

          {profile.website && (
            <a
              href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-primary hover:underline mb-4"
              style={{ fontFamily: "var(--font-jetbrains)" }}
            >
              <Globe size={13} strokeWidth={2.4} className="text-violet" />
              <span>{profile.website.replace(/^https?:\/\//, "")}</span>
            </a>
          )}

          {/* Writing Activity Badges (Distinct from publishing activity) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl neo-border-sm bg-pastel-rose-solid neo-shadow-xs">
              <Flame size={14} strokeWidth={2.4} className="text-rose" />
              <span className="text-xs font-bold text-ink-primary" style={{ fontFamily: "var(--font-jetbrains)" }}>
                {isMe ? localStreak.currentStreak : profile.streak_days || 18} Day Writing Streak
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl neo-border-sm bg-pastel-mint-solid neo-shadow-xs">
              <Feather size={14} strokeWidth={2.4} className="text-emerald-800" />
              <span className="text-xs font-bold text-ink-primary" style={{ fontFamily: "var(--font-jetbrains)" }}>
                {profile.words_count ? profile.words_count.toLocaleString() : "42,820"} Words Crafted
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="flex border-b-2 border-ink mb-6 bg-paper-50 rounded-2xl neo-border p-1 neo-shadow-sm overflow-x-auto">
        {[
          { id: "posts" as ProfileTab, label: `Published Essays (${posts.length})`, icon: BookOpen },
          { id: "constellation" as ProfileTab, label: "Thought Constellation", icon: Compass },
          { id: "about" as ProfileTab, label: "About the Writer", icon: Feather },
          ...(isMe ? [{ id: "saved" as ProfileTab, label: `Saved (${savedPosts.length})`, icon: Bookmark }] : []),
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
              tab === id
                ? "bg-pastel-amber-solid text-ink-primary neo-border-sm neo-shadow-xs"
                : "text-ink-secondary hover:text-ink-primary hover:bg-paper-200"
            }`}
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            <Icon size={14} strokeWidth={2.4} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {tab === "posts" && (
        <div>
          {posts.length === 0 ? (
            <div className="text-center py-12 p-8 bg-paper-50 rounded-2xl neo-border text-ink-muted">
              <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
              <h3 className="text-xl font-bold text-ink-primary mb-1" style={{ fontFamily: "var(--font-cormorant)" }}>
                No Published Essays Yet
              </h3>
              <p className="text-xs font-medium max-w-sm mx-auto">
                {isMe ? "Draft manuscripts in the Writing Studio and publish them to build your literary archive." : "This author has not published any public essays yet."}
              </p>
              {isMe && (
                <Link
                  href="/editor"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pastel-amber-solid neo-btn text-xs font-bold text-ink-primary"
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                >
                  <Feather size={14} strokeWidth={2.4} />
                  <span>Open Writing Studio</span>
                </Link>
              )}
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={{ ...post, author: profile }} onOpenAuth={() => setShowAuth(true)} />)
          )}
        </div>
      )}

      {tab === "constellation" && (
        <div className="bg-paper-50 rounded-2xl neo-border neo-shadow-md overflow-hidden h-[520px] relative paper-grid">
          <ThoughtGraph />
        </div>
      )}

      {tab === "about" && (
        <div className="bg-paper-50 rounded-2xl neo-border neo-shadow-md p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-ink-primary mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
              Literary Focus & Philosophy
            </h3>
            <p className="text-sm text-ink-secondary leading-relaxed font-serif" style={{ fontFamily: "var(--font-cormorant)", fontSize: "19px" }}>
              {profile.bio || "This writer has chosen to let their manuscripts speak for themselves."}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-paper-100 neo-border-sm flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-ink-primary" style={{ fontFamily: "var(--font-jetbrains)" }}>
              <Calendar size={14} strokeWidth={2.4} />
              <span>Writer on BlogPotro since {new Date(profile.created_at || Date.now()).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
            </div>
          </div>
        </div>
      )}

      {tab === "saved" && isMe && (
        <div>
          {savedPosts.length === 0 ? (
            <div className="text-center py-12 p-8 bg-paper-50 rounded-2xl neo-border text-ink-muted">
              <Bookmark size={32} className="mx-auto mb-2 opacity-50" />
              <h3 className="text-xl font-bold text-ink-primary mb-1" style={{ fontFamily: "var(--font-cormorant)" }}>
                No Saved Articles
              </h3>
              <p className="text-xs font-medium">Bookmark thoughtful essays across BlogPotro to revisit them here.</p>
            </div>
          ) : (
            savedPosts.map((post) => <PostCard key={post.id} post={post} onOpenAuth={() => setShowAuth(true)} />)
          )}
        </div>
      )}

      {/* Edit Bio Modal */}
      {isEditing && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(24, 24, 27, 0.65)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsEditing(false); }}
        >
          <div className="w-full max-w-md bg-paper-50 rounded-2xl p-6 sm:p-7 neo-border neo-shadow-xl animate-slide-up">
            <h3 className="text-2xl font-bold text-ink-primary mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
              Edit Writer Bio & Links
            </h3>
            <form onSubmit={handleSaveBio} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink-primary mb-1 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                  Bio / Literary Statement
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  maxLength={240}
                  className="w-full p-3 rounded-xl bg-paper-100 neo-border text-xs font-medium text-ink-primary outline-none focus:bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-primary mb-1 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains)" }}>
                  Personal Website / Link
                </label>
                <input
                  type="text"
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  placeholder="https://yoursite.com"
                  className="w-full p-3 rounded-xl bg-paper-100 neo-border text-xs font-medium text-ink-primary outline-none focus:bg-white"
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-ink-secondary bg-paper-200 neo-border-sm"
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-ink-primary bg-pastel-amber-solid neo-btn"
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </main>
  );
}
