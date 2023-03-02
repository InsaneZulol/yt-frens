// This file state should be shared and ontop.
import {
  SET_AUTH_SESSION_STORAGE, GET_AUTH_SESSION_STORAGE, supabase
} from "~/store";
import type { PlasmoCSConfig } from "plasmo";
import type { Session } from "@supabase/supabase-js";


export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*", "http://www.youtube.com/*"],
  all_frames: true,
  run_at: "document_end"
};

// IIFE
(async function init() {
  retrieveSessionFromStorage();
}
)();

function validateToken(token: string, expiry_date: number): boolean {
  let isExpired = (): boolean => {
    const timeLeft = expiry_date - Math.ceil(Date.now() / 1000);
    console.log(`time left: ${timeLeft}`);
    return timeLeft <= 0;
  }

  return (token != null && !isExpired());
}

async function retrieveSessionFromStorage() {
  // check if we have a session in storage and if it's not expired
  const session_store: Session = await GET_AUTH_SESSION_STORAGE();
  console.log("INIT\n retrieving local session from storage: ", session_store);

  if (session_store != null) {
    const is_token_valid: boolean = validateToken(session_store.access_token, session_store.expires_at);

    if (is_token_valid) {
      console.log("Access token still valid. Setting session.");
      const { data, error } = await supabase.auth.setSession({
        access_token: session_store.access_token,
        refresh_token: session_store.refresh_token
      });
      if (error) {
        console.log("error setting session", error);
      }
      else {
        console.log("great success!", data);
        SET_AUTH_SESSION_STORAGE(data.session);
      }
    }
  }
}


const CustomButton = () => {
  return <button>Shared UI Wow</button>
}

export default CustomButton