import { Metadata } from "next";
import { notFound } from "next/navigation";
import { postsService } from "@/lib/services/postsService";
import { profileService } from "@/lib/services/profileService";
import Navbar from "@/components/Navbar";
import ArticleClientView from "./ArticleClientView";

interface Props {
  params: Promise<{
    username: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await postsService.fetchBySlug(slug);

  if (!post) {
    return { title: "Manuscript Not Found — BlogPotro" };
  }

  return {
    title: `${post.title} — by ${post.author?.display_name || "Writer"} | BlogPotro`,
    description: post.excerpt || `Read "${post.title}" on BlogPotro.`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.published_at,
      authors: post.author?.display_name ? [post.author.display_name] : undefined,
      tags: post.tags,
      images: post.cover_url ? [{ url: post.cover_url }] : undefined,
    },
    twitter: {
      card: post.cover_url ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt,
      images: post.cover_url ? [post.cover_url] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { username, slug } = await params;
  const cleanUsername = username.replace(/^%40|^@/, "");
  const post = await postsService.fetchBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-paper-100 flex flex-col">
      <Navbar />
      <ArticleClientView post={post} usernameParam={cleanUsername} />
    </div>
  );
}
