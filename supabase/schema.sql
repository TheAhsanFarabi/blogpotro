-- ==============================================================================
-- BlogPotro: Social Platform Expansion Database Schema
-- Architecture: PostgreSQL + Supabase Auth + Row Level Security (RLS)
-- Philosophy: "Private by default. Public by choice."
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text not null,
  avatar_url text,
  bio text default '',
  website text default '',
  streak_days int default 0,
  words_count int default 0,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null,
  
  constraint username_format check (username ~* '^[a-zA-Z0-9_]{3,30}$')
);

-- Index for fast username lookups
create index if not exists profiles_username_idx on public.profiles (username);

-- 2. POSTS TABLE
create table if not exists public.posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  slug text not null,
  content text not null,
  excerpt text default '',
  cover_url text,
  visibility text default 'public' check (visibility in ('public', 'unlisted', 'private')),
  stage text default 'published' check (stage in ('seed', 'growing', 'published')),
  reading_time int default 1,
  scores jsonb,
  tags text[] default array[]::text[],
  likes_count int default 0,
  comments_count int default 0,
  bookmarks_count int default 0,
  published_at timestamptz default timezone('utc'::text, now()) not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null,

  constraint unique_author_slug unique (author_id, slug)
);

create index if not exists posts_author_id_idx on public.posts (author_id);
create index if not exists posts_slug_idx on public.posts (slug);
create index if not exists posts_visibility_idx on public.posts (visibility);
create index if not exists posts_published_at_idx on public.posts (published_at desc);
create index if not exists posts_tags_idx on public.posts using gin (tags);

-- 3. FOLLOWS TABLE
create table if not exists public.follows (
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  
  primary key (follower_id, following_id),
  constraint no_self_follow check (follower_id != following_id)
);

create index if not exists follows_follower_id_idx on public.follows (follower_id);
create index if not exists follows_following_id_idx on public.follows (following_id);

-- 4. LIKES TABLE
create table if not exists public.likes (
  user_id uuid references public.profiles(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  
  primary key (user_id, post_id)
);

create index if not exists likes_post_id_idx on public.likes (post_id);
create index if not exists likes_user_id_idx on public.likes (user_id);

-- 5. COMMENTS TABLE
create table if not exists public.comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists comments_post_id_idx on public.comments (post_id);
create index if not exists comments_author_id_idx on public.comments (author_id);

-- 6. BOOKMARKS TABLE
create table if not exists public.bookmarks (
  user_id uuid references public.profiles(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  
  primary key (user_id, post_id)
);

create index if not exists bookmarks_user_id_idx on public.bookmarks (user_id);

-- 7. NOTIFICATIONS TABLE
create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  recipient_id uuid references public.profiles(id) on delete cascade not null,
  actor_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('follow', 'like', 'comment')),
  post_id uuid references public.posts(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  is_read boolean default false not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists notifications_recipient_id_idx on public.notifications (recipient_id);
create index if not exists notifications_is_read_idx on public.notifications (recipient_id, is_read);

-- ==============================================================================
-- AUTOMATED COUNTERS & NOTIFICATION TRIGGERS
-- ==============================================================================

-- Update likes_count on posts
create or replace function public.handle_like_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.posts set likes_count = likes_count + 1 where id = NEW.post_id;
    insert into public.notifications (recipient_id, actor_id, type, post_id)
    select author_id, NEW.user_id, 'like', NEW.post_id
    from public.posts where id = NEW.post_id and author_id != NEW.user_id;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    update public.posts set likes_count = greatest(0, likes_count - 1) where id = OLD.post_id;
    delete from public.notifications 
    where recipient_id = (select author_id from public.posts where id = OLD.post_id)
      and actor_id = OLD.user_id 
      and type = 'like' 
      and post_id = OLD.post_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create or replace trigger on_like_change
after insert or delete on public.likes
for each row execute function public.handle_like_count();

-- Update comments_count on posts
create or replace function public.handle_comment_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.posts set comments_count = comments_count + 1 where id = NEW.post_id;
    insert into public.notifications (recipient_id, actor_id, type, post_id, comment_id)
    select author_id, NEW.author_id, 'comment', NEW.post_id, NEW.id
    from public.posts where id = NEW.post_id and author_id != NEW.author_id;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    update public.posts set comments_count = greatest(0, comments_count - 1) where id = OLD.post_id;
    delete from public.notifications where comment_id = OLD.id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create or replace trigger on_comment_change
after insert or delete on public.comments
for each row execute function public.handle_comment_count();

-- Follow notification trigger
create or replace function public.handle_follow_notification()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    insert into public.notifications (recipient_id, actor_id, type)
    values (NEW.following_id, NEW.follower_id, 'follow');
    return NEW;
  elsif (TG_OP = 'DELETE') then
    delete from public.notifications 
    where recipient_id = OLD.following_id and actor_id = OLD.follower_id and type = 'follow';
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create or replace trigger on_follow_change
after insert or delete on public.follows
for each row execute function public.handle_follow_notification();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.follows enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;
alter table public.bookmarks enable row level security;
alter table public.notifications enable row level security;

-- PROFILES RLS
create policy "Public profiles are viewable by everyone."
  on public.profiles for select using (true);

create policy "Users can insert their own profile."
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile."
  on public.profiles for update using (auth.uid() = id);

-- POSTS RLS
create policy "Public and unlisted posts are viewable by everyone."
  on public.posts for select
  using (visibility in ('public', 'unlisted') or auth.uid() = author_id);

create policy "Users can insert their own posts."
  on public.posts for insert
  with check (auth.uid() = author_id);

create policy "Users can update their own posts."
  on public.posts for update
  using (auth.uid() = author_id);

create policy "Users can delete their own posts."
  on public.posts for delete
  using (auth.uid() = author_id);

-- FOLLOWS RLS
create policy "Follows are viewable by everyone."
  on public.follows for select using (true);

create policy "Users can follow other users."
  on public.follows for insert
  with check (auth.uid() = follower_id and auth.uid() != following_id);

create policy "Users can unfollow other users."
  on public.follows for delete
  using (auth.uid() = follower_id);

-- LIKES RLS
create policy "Likes are viewable by everyone."
  on public.likes for select using (true);

create policy "Users can like posts."
  on public.likes for insert
  with check (auth.uid() = user_id);

create policy "Users can unlike posts."
  on public.likes for delete
  using (auth.uid() = user_id);

-- COMMENTS RLS
create policy "Comments on public/unlisted posts are viewable by everyone."
  on public.comments for select
  using (
    exists (
      select 1 from public.posts
      where posts.id = comments.post_id
      and (posts.visibility in ('public', 'unlisted') or posts.author_id = auth.uid())
    )
  );

create policy "Authenticated users can create comments."
  on public.comments for insert
  with check (auth.uid() = author_id);

create policy "Users can delete their own comments or comments on their posts."
  on public.comments for delete
  using (
    auth.uid() = author_id or 
    exists (select 1 from public.posts where posts.id = comments.post_id and posts.author_id = auth.uid())
  );

-- BOOKMARKS RLS
create policy "Users can view their own bookmarks."
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can bookmark posts."
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can remove bookmarks."
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- NOTIFICATIONS RLS
create policy "Users can view their own notifications."
  on public.notifications for select
  using (auth.uid() = recipient_id);

create policy "Users can update their own notifications (mark as read)."
  on public.notifications for update
  using (auth.uid() = recipient_id);

-- ==============================================================================
-- AUTO-PROVISION PROFILE TRIGGER ON AUTH.USERS (Google OAuth & Email Signups)
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
declare
  raw_username text;
  clean_username text;
begin
  raw_username := coalesce(
    new.raw_user_meta_data->>'user_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );
  clean_username := lower(regexp_replace(raw_username, '[^a-zA-Z0-9_]', '', 'g'));
  if length(clean_username) < 3 then
    clean_username := 'writer_' || substr(new.id::text, 1, 6);
  end if;

  insert into public.profiles (id, username, display_name, avatar_url, bio, streak_days, words_count)
  values (
    new.id,
    clean_username,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Writer'),
    new.raw_user_meta_data->>'avatar_url',
    '',
    1,
    0
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

