import { createClient } from "@supabase/supabase-js";

// Provide placeholder values so createClient never throws during Vercel's
// static page generation phase. Requests will simply return null/empty,
// which all route handlers already handle with fallbacks like `data || []`.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
// We use the service role key to bypass RLS since this is a private CMS.
// In a public facing app with user logins, you would use the anon key and RLS.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

export const supabase = createClient(supabaseUrl, supabaseKey);
