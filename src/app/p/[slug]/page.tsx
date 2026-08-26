import { notFound } from "next/navigation";
import { postsService } from "@/lib/services/postsService";
import Navbar from "@/components/Navbar";
import ArticleClientView from "@/app/[username]/[slug]/ArticleClientView";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
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
  };
}

export default async function DirectArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await postsService.fetchBySlug(slug);

  if (!post) {
    notFound();
  }

  const authorUsername = post.author?.username || "author";

  return (
    <div className="min-h-screen bg-paper-100 flex flex-col">
      <Navbar />
      <ArticleClientView post={post} usernameParam={authorUsername} />
    </div>
  );
}
