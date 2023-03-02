import { createClient, Session } from "@supabase/supabase-js"
import { SecureStorage } from "@plasmohq/storage/secure"

export const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.PUBLIC_SUPABASE_KEY
);

const SECURE_STORAGE_API = new SecureStorage();
SECURE_STORAGE_API.setPassword("123"); // todo

export async function GET_AUTH_SESSION_STORAGE(): Promise<Session>  {
  return await SECURE_STORAGE_API.get("AUTH_SESSION");
}

export function SET_AUTH_SESSION_STORAGE(session: Session) {
  console.debug('DBG API SET_AUTH_SESSION_STORAGE', session);
  return SECURE_STORAGE_API.set("AUTH_SESSION", session);
}