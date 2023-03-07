// This file state should be shared and ontop.
import { supabase } from "~store";
import { isLoggedIn, login, logout, useSession } from "~auth";
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo";
import LoginModal from "~/ui_components/login-modal";

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*", "http://www.youtube.com/*"],
  all_frames: true,
  run_at: "document_end"
};

// IIFE
(async function init() {
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
        <LoginModal/>
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
