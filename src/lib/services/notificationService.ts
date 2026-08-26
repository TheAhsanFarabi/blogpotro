import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { NotificationItem } from "@/types/database";

export const notificationService = {
  async getNotifications(userId: string): Promise<NotificationItem[]> {
    if (!isSupabaseConfigured() || !userId) {
      return [];
    }

    try {
      const { data, error } = await (supabase.from("notifications") as any)
        .select(`
          *,
          actor:profiles!actor_id(*),
          post:posts!post_id(id, title, slug)
        `)
        .eq("recipient_id", userId)
        .order("created_at", { ascending: false });

      if (error || !data) {
        return [];
      }
      return data as NotificationItem[];
    } catch (e) {
      return [];
    }
  },

  async markAsRead(notificationId: string): Promise<void> {
    if (isSupabaseConfigured() && notificationId) {
      try {
        await (supabase.from("notifications") as any)
          .update({ is_read: true })
          .eq("id", notificationId);
      } catch (e) {}
    }
  },

  async markAllAsRead(userId: string): Promise<void> {
    if (isSupabaseConfigured() && userId) {
      try {
        await (supabase.from("notifications") as any)
          .update({ is_read: true })
          .eq("recipient_id", userId);
      } catch (e) {}
    }
  }
};


