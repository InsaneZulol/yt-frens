import { createClient, Session } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.PUBLIC_SUPABASE_KEY
);