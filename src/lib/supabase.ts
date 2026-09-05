import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// We use the service role key to bypass RLS since this is a private CMS.
// In a public facing app with user logins, you would use the anon key and RLS.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Lazy-initialize the Supabase client to avoid crashes during Next.js build
// when environment variables may not be fully available at module evaluation time.
let _supabase: SupabaseClient | null = null;

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_supabase) {
      _supabase = createClient(supabaseUrl, supabaseKey);
    }
    return (_supabase as any)[prop];
  },
});
