import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== "https://your-project.supabase.co" &&
    supabaseAnonKey !== "your-anon-key-here"
  );
};

let clientInstance: ReturnType<typeof createSupabaseClient> | null = null;

export const createClient = () => {
  if (clientInstance) return clientInstance;

  if (isSupabaseConfigured()) {
    clientInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } else {
    // Fallback stub client for initial setup or offline test mode
    clientInstance = createSupabaseClient(
      supabaseUrl || "https://placeholder-blogpotro.supabase.co",
      supabaseAnonKey || "placeholder-anon-key",
      {
        auth: {
          persistSession: true,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );
  }

  return clientInstance;
};

export const supabase = createClient();
