// This file state should be shared and ontop.

import type { PlasmoCSConfig } from "plasmo";
import { SECURE_STORAGE_API, supabase } from "~/store";
import type { Session } from "@supabase/supabase-js";


export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*", "http://www.youtube.com/*"],
  all_frames: true,
  run_at: "document_end"
};

function validateToken(token: string, expiry_date: number): boolean {

  let isExpired = (): boolean => {
    console.log(`time left: ${expiry_date - Math.ceil(Date.now() / 1000)}`);
    const timeLeft = expiry_date - Math.ceil(Date.now() / 1000);
    return timeLeft > 0;
  }

  return token != null && !isExpired();
}

// IIFE
(async function init() {
  // check if we have a session in storage and if it's not expired
  const session: Session = await SECURE_STORAGE_API.get("session");
  if (validateToken && session != null) {
    // TODO: Refresh Token missing lol
    console.log("session:", session);
    supabase.auth.setSession(session.access_token, session.refresh_token);

  }
})();

const CustomButton = () => {
  return <button>Shared UI Wow</button>
}

export default CustomButton

// await SECURE_STORAGE_API.set("key", "value")
// const data = await SECURE_STORAGE_API.get("key") // "value"