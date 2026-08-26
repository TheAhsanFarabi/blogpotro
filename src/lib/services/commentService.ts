import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Comment, Profile } from "@/types/database";

export const commentService = {
  async getComments(postId: string): Promise<Comment[]> {
    if (!isSupabaseConfigured() || !postId) {
      return [];
    }

    try {
      const { data, error } = await (supabase.from("comments") as any)
        .select(`
          *,
          author:profiles(*)
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error || !data) {
        return [];
      }
      return data as Comment[];
    } catch (e) {
      return [];
    }
  },

  async addComment(
    postId: string,
    authorId: string,
    content: string,
    authorProfile?: Profile
  ): Promise<Comment | null> {
    if (!content.trim() || !postId || !authorId) return null;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await (supabase.from("comments") as any)
          .insert({
            post_id: postId,
            author_id: authorId,
            content: content.trim(),
          })
          .select(`*, author:profiles(*)`)
          .single();

        if (!error && data) {
          return data as Comment;
        }
      } catch (e) {}
    }

    return null;
  },

  async deleteComment(commentId: string): Promise<boolean> {
    if (isSupabaseConfigured() && commentId) {
      try {
        await (supabase.from("comments") as any).delete().eq("id", commentId);
        return true;
      } catch (e) {}
    }

    return false;
  }
};


