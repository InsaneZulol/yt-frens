// This file state should be shared and ontop.
import { supabase } from "~store";
import { isLoggedIn, login } from "~auth";
import type { PlasmoCSConfig } from "plasmo";
import type { Session } from "@supabase/supabase-js";
import LoginModal from "~/ui_components/login-modal";

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*", "http://www.youtube.com/*"],
  all_frames: true,
  run_at: "document_end"
};

// IIFE
(async function init() {
  // await login();

  // retrieveSessionFromStorage();

  //   const { data, error } = await supabase.auth.signInWithPassword({
  //     email: 'banan@biuro24.pl',
  //     password: 'kutas123'
  // });
  // console.debug('login data:', data, 'error:', error);



  // plasmo messaging api narazie zjebane, lepiej odbierac wiadomosci vanilla
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
      if (request.name === "user_login") {
        login({
          email: request.body.email,
          password: request.body.password
        });
        sendResponse({ farewell: "goodbye" });
      }
    }
  );


  supabase.auth.onAuthStateChange((event, session) => {
    console.log(event, session);
    // zawsze mozna wyslac message z login page do tutaj i zrobić save
  })

}
)();

async function retrieveSessionFromStorage() {
  const { data, error } = await supabase.auth.getSession();
  if (!error && data.session != null) {
    console.debug("Session retrieved", data);
  }
  else {
    console.debug("Failed to retrieve session. Are you not logged in?", data, error);
  }
}

// const CustomButton = () => {
//   return <button>Shared UI Wow</button>
// }

// export default CustomButton

export const RenderUI = () => {
  
  let test_: boolean = async () => {
    await Promise.resolve(isLoggedIn());
  };
  console.log("test: ", test_);
  if (async (): boolean => await isLoggedIn()) {
    return (<LoginModal></LoginModal>);
  }
  // else return (<div></div>)
  // else render friends buttons and stuff
}

export default RenderUI;
