import { createClient, Session } from "@supabase/supabase-js"
import { SecureStorage } from "@plasmohq/storage/secure"

export const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.PUBLIC_SUPABASE_KEY
);

export const SECURE_STORAGE_API = new SecureStorage();
SECURE_STORAGE_API.setPassword("123"); // todo

// user login session
export var AUTH_SESSION: Session = null;
export function SET_AUTH_SESSION(session: Session) {
  AUTH_SESSION = session;
}