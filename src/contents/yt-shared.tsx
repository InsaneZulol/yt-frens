// This file state should be shared and ontop.
import { supabase } from "~store";
import { isLoggedIn, logout, useSession } from "~auth";
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo";
import LoginModal from "~/ui_components/login-modal";
import { sendHeartbeat } from "~db";
import type { RealtimeChannel } from "@supabase/supabase-js";

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*", "http://www.youtube.com/*"],
  all_frames: true,
  run_at: "document_end"
};
let MY_ACTIVITY_CH: RealtimeChannel = null;

interface Activity {
  event_timestamp: number;
  is_playing?: boolean;
  video?: string;
  video_name?: string;
  video_duration?: number;
  video_timestamp?: number;
  muted?: boolean;
}

async function broadcastActivity(update: Activity) {
  console.log('act up:: ', { payload: {
        event_timestamp: update.event_timestamp,
        is_playing: update.is_playing,
        video: update.video,
        video_name: update.video_name,
        video_timestamp: update.video_timestamp,
        video_duration: update.video_duration,
        muted: update.muted
      },
    });
  MY_ACTIVITY_CH &&
    MY_ACTIVITY_CH.send({
      type: 'broadcast',
      event: 'activity',
      payload: {
        event_timestamp: update.event_timestamp,
        is_playing: update.is_playing,
        video: update.video,
        video_name: update.video_name,
        video_timestamp: update.video_timestamp,
        video_duration: update.video_duration,
        muted: update.muted
      },
    }).then(() => {
      console.log('sent activity update');
    });
}

async function launchActivityCh() {
  // sends a message to background script so this content script starts receiving tab updates
  chrome.runtime.sendMessage({ action: "listen_to_tab_updates" });
  function listenToBGWorker() {
    chrome.runtime.onMessage.addListener((message) => {
      const activity_update: Activity = {
        event_timestamp: Date.now(),
        video: message.url,
        video_name: message.title,
        muted: message.mutedInfo?.muted,
      };
      if (Object.values(activity_update).some((value) => value !== undefined)) {
        broadcastActivity(activity_update);
      }
    });
  }

  MY_ACTIVITY_CH = supabase.channel(`activity_ch:` + (await supabase.auth.getSession()).data.session.user.id);
  if (MY_ACTIVITY_CH) {
    MY_ACTIVITY_CH.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        console.log('wooow we created our activity channel wowowowo');
        listenToBGWorker();
        // now listen to video time updates from DOM
      };
    });
  }
}

// IIFE
(async function init() {

  async function initiateHeartbeat() {
    sendHeartbeat();
    setInterval(sendHeartbeat, 15000);
  }

  if (isLoggedIn()) {
    initiateHeartbeat();
    launchActivityCh();
  }

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
