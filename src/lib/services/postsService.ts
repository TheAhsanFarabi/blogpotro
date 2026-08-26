import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Post, Profile } from "@/types/database";

export const postsService = {
  async fetchForYou(): Promise<Post[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }
    try {
      const { data, error } = await (supabase.from("posts") as any)
        .select(`
          *,
          author:profiles(*)
        `)
        .eq("visibility", "public")
        .order("published_at", { ascending: false })
        .limit(20);

      if (error || !data) return [];
      return data as Post[];
    } catch (e) {
      return [];
    }
  },

  async fetchFollowing(userId: string): Promise<Post[]> {
    if (!isSupabaseConfigured() || !userId) {
      return [];
    }
    try {
      const { data: follows, error: followError } = await (supabase.from("follows") as any)
        .select("following_id")
        .eq("follower_id", userId);

      if (followError || !follows || follows.length === 0) {
        return [];
      }

      const followingIds = follows.map((f: any) => f.following_id);

      const { data, error } = await (supabase.from("posts") as any)
        .select(`
          *,
          author:profiles(*)
        `)
        .in("author_id", followingIds)
        .eq("visibility", "public")
        .order("published_at", { ascending: false })
        .limit(20);

      if (error || !data) return [];
      return data as Post[];
    } catch (e) {
      return [];
    }
  },

  async fetchTrending(): Promise<Post[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }
    try {
      const { data, error } = await (supabase.from("posts") as any)
        .select(`
          *,
          author:profiles(*)
        `)
        .eq("visibility", "public")
        .order("likes_count", { ascending: false })
        .limit(10);

      if (error || !data) return [];
      return data as Post[];
    } catch (e) {
      return [];
    }
  },

  async fetchByTag(tag: string): Promise<Post[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }
    try {
      const { data, error } = await (supabase.from("posts") as any)
        .select(`
          *,
          author:profiles(*)
        `)
        .contains("tags", [tag.toLowerCase()])
        .eq("visibility", "public")
        .order("published_at", { ascending: false });

      if (error || !data) return [];
      return data as Post[];
    } catch (e) {
      return [];
    }
  },

  async fetchBySlug(slug: string): Promise<Post | null> {
    if (!isSupabaseConfigured()) {
      return null;
    }
    try {
      const { data, error } = await (supabase.from("posts") as any)
        .select(`
          *,
          author:profiles(*)
        `)
        .eq("slug", slug)
        .single();

      if (error || !data) return null;
      return data as Post;
    } catch (e) {
      return null;
    }
  },

  async fetchUserPosts(username: string): Promise<Post[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }
    try {
      const { data: profile } = await (supabase.from("profiles") as any)
        .select("id")
        .eq("username", username)
        .single();

      if (!profile) return [];

      const { data, error } = await (supabase.from("posts") as any)
        .select(`
          *,
          author:profiles(*)
        `)
        .eq("author_id", profile.id)
        .eq("visibility", "public")
        .order("published_at", { ascending: false });

      if (error || !data) return [];
      return data as Post[];
    } catch (e) {
      return [];
    }
  },

  async createPost(postData: {
    author_id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    cover_url?: string;
    visibility: "public" | "unlisted" | "private";
    stage: "seed" | "growing" | "published";
    reading_time: number;
    scores?: any;
    tags: string[];
    author?: Profile;
  }): Promise<Post | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await (supabase.from("posts") as any)
          .insert({
            author_id: postData.author_id,
            title: postData.title,
            slug: postData.slug,
            content: postData.content,
            excerpt: postData.excerpt,
            cover_url: postData.cover_url || null,
            visibility: postData.visibility,
            stage: postData.stage,
            reading_time: postData.reading_time,
            scores: postData.scores || null,
            tags: postData.tags,
          })
          .select(`*, author:profiles(*)`)
          .single();

        if (!error && data) {
          return data as Post;
        }
      } catch (e) {}
    }
    return null;
  },

  async searchPosts(query: string): Promise<Post[]> {
    const q = query.toLowerCase().trim();
    if (!q || !isSupabaseConfigured()) return [];

    try {
      const { data, error } = await (supabase.from("posts") as any)
        .select(`
          *,
          author:profiles(*)
        `)
        .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
        .eq("visibility", "public")
        .order("published_at", { ascending: false })
        .limit(20);

      if (error || !data) return [];
      return data as Post[];
    } catch (e) {
      return [];
    }
  },
};


