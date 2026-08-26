export type PostVisibility = "public" | "unlisted" | "private";
export type PostStage = "seed" | "growing" | "published";
export type NotificationType = "follow" | "like" | "comment";

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string | null;
  bio?: string | null;
  website?: string | null;
  streak_days?: number;
  words_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PostScores {
  human: number;
  clarity: number;
  accuracy: number;
}

export interface Post {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_url?: string | null;
  visibility: PostVisibility;
  stage: PostStage;
  reading_time: number;
  scores?: PostScores | null;
  tags: string[];
  likes_count: number;
  comments_count: number;
  bookmarks_count?: number;
  published_at: string;
  created_at: string;
  updated_at: string;
  author?: Profile;
  is_liked?: boolean;
  is_bookmarked?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author?: Profile;
}

export interface NotificationItem {
  id: string;
  recipient_id: string;
  actor_id: string;
  type: NotificationType;
  post_id?: string | null;
  comment_id?: string | null;
  is_read: boolean;
  created_at: string;
  actor?: Profile;
  post?: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface Follow {
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Like {
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface Bookmark {
  user_id: string;
  post_id: string;
  created_at: string;
  post?: Post;
}
