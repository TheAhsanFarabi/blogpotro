import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types/database";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/home";

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      // Check if profile exists
      const { data: profileData } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", data.user.id)
        .single();

      const profile = profileData as { username?: string } | null;

      if (!profile || !profile.username) {
        return NextResponse.redirect(`${origin}/onboarding`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/home`);
}

