import { createClient } from "@supabase/supabase-js";
import type { Database } from "~types/supabase";

export const supabase = createClient<Database>(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.PUBLIC_SUPABASE_KEY
);
