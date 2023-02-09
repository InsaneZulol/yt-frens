// - w tym pliku globalne zmienne.
// - w innych plikach gdzie chcesz korzystać z supabase zawołaj `import { supabase } from "~/store"` (~ wskazuje na src/)

import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.PLASMO_PUBLIC_SUPABASE_URL,
  process.env.PLASMO_PUBLIC_SUPABASE_KEY
)