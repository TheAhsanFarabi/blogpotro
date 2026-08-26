import { notFound } from "next/navigation";
import { Metadata } from "next";
import { profileService } from "@/lib/services/profileService";
import { postsService } from "@/lib/services/postsService";
import Navbar from "@/components/Navbar";
import ProfileClientView from "./ProfileClientView";

interface Props {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const cleanUsername = username.replace(/^%40|^@/, "");
  const profile = await profileService.getProfileByUsername(cleanUsername);

  if (!profile) {
    return { title: "Writer Not Found — BlogPotro" };
  }

  return {
    title: `${profile.display_name} (@${profile.username}) — BlogPotro Writer Profile`,
    description: profile.bio || `Read thoughtful essays by ${profile.display_name} on BlogPotro.`,
    openGraph: {
      title: `${profile.display_name} (@${profile.username})`,
      description: profile.bio || `Read thoughtful essays on BlogPotro.`,
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : undefined,
    },
  };
}

export default async function ProfilePage({ params, searchParams }: Props) {
  const { username } = await params;
  const { tab } = await searchParams;
  const cleanUsername = username.replace(/^%40|^@/, "");
  const profile = await profileService.getProfileByUsername(cleanUsername);

  if (!profile) {
    notFound();
  }

  const posts = await postsService.fetchUserPosts(cleanUsername);

  return (
    <div className="min-h-screen bg-paper-100 flex flex-col">
      <Navbar />
      <ProfileClientView profile={profile} initialPosts={posts} initialTab={tab || "posts"} />
    </div>
  );
}
