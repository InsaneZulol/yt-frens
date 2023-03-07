import { Database } from "types/supabase"
declare namespace NodeJS {
  interface ProcessEnv {
    PUBLIC_SUPABASE_URL?: string
    PUBLIC_SUPABASE_KEY?: string
  }
}