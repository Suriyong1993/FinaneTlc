import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Lazy init — only creates the client when first used
// This avoids build-time errors when env vars aren't set yet
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
      );
    }
    _client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return _client;
}

// Proxy defers all property access until runtime
const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop: keyof SupabaseClient) {
    return getClient()[prop];
  },
});

export { supabase, getClient };
