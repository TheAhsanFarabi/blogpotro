import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Profile } from "@/types/database";

export const profileService = {
  async getProfileByUsername(username: string): Promise<Profile | null> {
    const cleanUsername = username.replace(/^@/, "").toLowerCase();
    
    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      const { data, error } = await (supabase.from("profiles") as any)
        .select("*")
        .ilike("username", cleanUsername)
        .single();

      if (error || !data) {
        return null;
      }
      return data as Profile;
    } catch (e) {
      return null;
    }
  },

  async getProfileById(userId: string): Promise<Profile | null> {
    if (!isSupabaseConfigured() || !userId) {
      return null;
    }

    try {
      const { data, error } = await (supabase.from("profiles") as any)
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !data) {
        return null;
      }
      return data as Profile;
    } catch (e) {
      return null;
    }
  },

  async createProfile(profileData: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string | null;
    bio?: string;
    website?: string;
  }): Promise<Profile> {
    const profile: Profile = {
      id: profileData.id,
      username: profileData.username.toLowerCase().trim(),
      display_name: profileData.display_name.trim(),
      avatar_url: profileData.avatar_url || null,
      bio: profileData.bio || "",
      website: profileData.website || "",
      streak_days: 1,
      words_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await (supabase.from("profiles") as any)
          .upsert(profile)
          .select()
          .single();

        if (!error && data) return data as Profile;
      } catch (e) {}
    }

    return profile;
  },

  async updateProfile(userId: string, data: Partial<Profile>): Promise<Profile | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data: updated, error } = await (supabase.from("profiles") as any)
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq("id", userId)
          .select()
          .single();

        if (!error && updated) return updated as Profile;
      } catch (e) {}
    }

    return null;
  },

  async getRecommendedWriters(excludeUserId?: string): Promise<Profile[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      const query = (supabase.from("profiles") as any)
        .select("*")
        .order("streak_days", { ascending: false })
        .limit(6);

      if (excludeUserId) {
        query.neq("id", excludeUserId);
      }

      const { data, error } = await query;
      if (error || !data) {
        return [];
      }
      return data as Profile[];
    } catch (e) {
      return [];
    }
  },

  async searchProfiles(query: string): Promise<Profile[]> {
    const q = query.toLowerCase().trim();
    if (!q || !isSupabaseConfigured()) return [];

    try {
      const { data, error } = await (supabase.from("profiles") as any)
        .select("*")
        .or(`username.ilike.%${q}%,display_name.ilike.%${q}%,bio.ilike.%${q}%`)
        .limit(10);

      if (error || !data) {
        return [];
      }
      return data as Profile[];
    } catch (e) {
      return [];
    }
  }
};


