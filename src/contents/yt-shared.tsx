// This file state should be shared and ontop.
import { supabase } from "~/store";
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

async function retrieveSessionFromStorage() {
  const { data, error } = await supabase.auth.getSession();
  if(!error && data.session != null) {
    console.debug("Session retrieved", data);
  }
  else {
    console.debug("Failed to retrieve session. Are you not logged in?", data, error);
  }
}


const CustomButton = () => {
  return <button>Shared UI Wow</button>
}

export default CustomButton