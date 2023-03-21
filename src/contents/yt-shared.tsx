// This file state should be shared and ontop.
import { supabase } from "~store";
import { logout, useSession } from "~auth";
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

// IIFE
(async function init() {

  // let my_uid = (await supabase.auth.getSession()).data.session.user.id;
  // let the server know we are online:
  // 1. start updating our own online status every 5sec on the database table
  // 2. friend-list component will start listening for changes on the table for our friends
  initiateHeartbeat();


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
