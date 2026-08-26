import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Post } from "@/types/database";

const LIKES_KEY = "blogpotro_user_likes";
const BOOKMARKS_KEY = "blogpotro_user_bookmarks";
const FOLLOWS_KEY = "blogpotro_user_follows";

const getSet = (key: string): Set<string> => {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) {
    return new Set();
  }
};

const saveSet = (key: string, set: Set<string>) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(set)));
  } catch (e) {}
};

export const socialService = {
  // LIKES
  async toggleLike(postId: string, userId: string): Promise<{ isLiked: boolean; newCount?: number }> {
    const localLikes = getSet(LIKES_KEY);
    const wasLiked = localLikes.has(postId);

    if (wasLiked) {
      localLikes.delete(postId);
    } else {
      localLikes.add(postId);
    }
    saveSet(LIKES_KEY, localLikes);

    if (isSupabaseConfigured() && userId) {
      try {
        if (wasLiked) {
          await (supabase.from("likes") as any).delete().match({ user_id: userId, post_id: postId });
        } else {
          await (supabase.from("likes") as any).insert({ user_id: userId, post_id: postId });
        }
      } catch (e) {}
    }

    return { isLiked: !wasLiked };
  },

  isLikedLocally(postId: string): boolean {
    return getSet(LIKES_KEY).has(postId);
  },

  // BOOKMARKS
  async toggleBookmark(postId: string, userId: string): Promise<boolean> {
    const localBookmarks = getSet(BOOKMARKS_KEY);
    const wasBookmarked = localBookmarks.has(postId);

    if (wasBookmarked) {
      localBookmarks.delete(postId);
    } else {
      localBookmarks.add(postId);
    }
    saveSet(BOOKMARKS_KEY, localBookmarks);

    if (isSupabaseConfigured() && userId) {
      try {
        if (wasBookmarked) {
          await (supabase.from("bookmarks") as any).delete().match({ user_id: userId, post_id: postId });
        } else {
          await (supabase.from("bookmarks") as any).insert({ user_id: userId, post_id: postId });
        }
      } catch (e) {}
    }

    return !wasBookmarked;
  },

  isBookmarkedLocally(postId: string): boolean {
    return getSet(BOOKMARKS_KEY).has(postId);
  },

  async getUserBookmarks(userId: string): Promise<Post[]> {
    if (!isSupabaseConfigured() || !userId) {
      return [];
    }

    try {
      const { data, error } = await (supabase.from("bookmarks") as any)
        .select(`
          post:posts(
            *,
            author:profiles(*)
          )
        `)
        .eq("user_id", userId);

      if (error || !data) {
        return [];
      }

      return data.map((b: any) => b.post).filter(Boolean) as Post[];
    } catch (e) {
      return [];
    }
  },

  // FOLLOWS
  async toggleFollow(targetUserId: string, currentUserId: string): Promise<boolean> {
    if (!targetUserId || !currentUserId || targetUserId === currentUserId) return false;

    const localFollows = getSet(FOLLOWS_KEY);
    const wasFollowing = localFollows.has(targetUserId);

    if (wasFollowing) {
      localFollows.delete(targetUserId);
    } else {
      localFollows.add(targetUserId);
    }
    saveSet(FOLLOWS_KEY, localFollows);

    if (isSupabaseConfigured()) {
      try {
        if (wasFollowing) {
          await (supabase.from("follows") as any).delete().match({ follower_id: currentUserId, following_id: targetUserId });
        } else {
          await (supabase.from("follows") as any).insert({ follower_id: currentUserId, following_id: targetUserId });
        }
      } catch (e) {}
    }

    return !wasFollowing;
  },

  isFollowingLocally(targetUserId: string): boolean {
    return getSet(FOLLOWS_KEY).has(targetUserId);
  },

  async getFollowersCount(userId: string): Promise<number> {
    if (!isSupabaseConfigured() || !userId) return 0;
    try {
      const { count } = await (supabase.from("follows") as any)
        .select("*", { count: "exact", head: true })
        .eq("following_id", userId);
      return count || 0;
    } catch (e) {
      return 0;
    }
  },

  async getFollowingCount(userId: string): Promise<number> {
    if (!isSupabaseConfigured() || !userId) return 0;
    try {
      const { count } = await (supabase.from("follows") as any)
        .select("*", { count: "exact", head: true })
        .eq("follower_id", userId);
      return count || 0;
    } catch (e) {
      return 0;
    }
  }
};


