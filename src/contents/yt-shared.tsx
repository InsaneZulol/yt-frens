// This file state should be shared and ontop.
import { supabase } from "~store";
import { isLoggedIn, logout, useSession } from "~auth";
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo";
import LoginModal from "~/ui_components/login-modal";
import { sendHeartbeat } from "~db";

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*", "http://www.youtube.com/*"],
  all_frames: true,
  run_at: "document_end"
};

async function initiateHeartbeat() {
  setInterval(sendHeartbeat, 15000);
}

async function launchStatusCh() {
  const my_activity_ch = supabase.channel(`activity_ch_` + (await supabase.auth.getSession()).data.session.user.id);
  my_activity_ch.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      console.log('wooow created activity channel wowowowo');
      // 
    };
  });
}

// IIFE
(async function init() {

  // let my_uid = (await supabase.auth.getSession()).data.session.user.id;
  // let the server know we are online:
  // 1. start updating our own online status every 15sec on the database table
  // 2. friend-list component will start listening for changes on the table for our friends
  initiateHeartbeat();
  if (isLoggedIn()) {
    launchStatusCh();
  }


  // const { data, error } = await supabase.auth.signUp({
  //   email: 'mariusz@wirtualnapolska.pl',
  //   password: 'kutas123',
  // });
})();

export const RenderUI = () => {
  console.log('>> gdzie jest panel?')
  const sessionStatus = useSession();

  if (sessionStatus === 'loading') {
    return <>Loading...</>
  }

  if (sessionStatus === 'unauthenticated') {
    return (
      <>
        <LoginModal />
      </>);
  }

  return (
    <>
      Jesteś kurwa zalogowany!
      {sessionStatus}
      <button onClick={() => logout()}>Wyloguj</button>
    </>)
}

export default RenderUI;
