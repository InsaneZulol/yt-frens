// This file state should be shared and ontop.

import type { RealtimeChannel } from "@supabase/supabase-js";
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo";

import LoginModal from "~/ui_components/login-modal";
import { isLoggedIn, logout, useSession } from "~auth";
import { sendHeartbeat } from "~db";
import { supabase } from "~store";

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*", "http://www.youtube.com/*"],
  all_frames: true,
  run_at: "document_end"
};

let MY_ACTIVITY_CH: RealtimeChannel = null;
let MY_ACTIVITY_STATE: Activity = {
  event_timestamp: null,
  is_playing: null,
  video: null,
  video_name: null,
  video_duration: null,
  video_timestamp: null,
  muted: null
};

async function broadcastActivity(update: Activity) {
  console.log("act up:: ", {
    payload: {
      event_timestamp: update.event_timestamp,
      is_playing: update.is_playing,
      video: update.video,
      video_name: update.video_name,
      video_timestamp: update.video_timestamp,
      video_duration: update.video_duration,
      muted: update.muted
    }
  });
  MY_ACTIVITY_CH &&
    MY_ACTIVITY_CH.send({
      type: "broadcast",
      event: "activity",
      payload: {
        event_timestamp: update.event_timestamp,
        is_playing: update.is_playing,
        video: update.video,
        video_name: update.video_name,
        video_timestamp: update.video_timestamp,
        video_duration: update.video_duration,
        muted: update.muted
      }
    }).then(() => {
      console.log("sent activity update");
    });
}

async function launchActivityCh() {
  // sends a message to background script so this content script starts receiving tab updates
  // todo: instead of directly transmitting activity, maybe it should be changing state of
  //       'ACTIVITY' static object, and then whenever it mutates, it transmits that activity.
  function listenToBGWorker() {
    chrome.runtime.sendMessage({
      action: "listen_to_tab_updates"
    });
    chrome.runtime.onMessage.addListener((message) => {
      const tab_update: Activity = {
        event_timestamp: Date.now(),
        video: message.url,
        video_name: message.title,
        muted: message.mutedInfo?.muted
      };
      if (Object.values(tab_update).some((value) => value !== undefined)) {
        broadcastActivity(tab_update);
      }
    });
  }

  MY_ACTIVITY_CH = supabase.channel(
    `activity_ch:` + (await supabase.auth.getSession()).data.session.user.id
  );
  if (MY_ACTIVITY_CH) {
    MY_ACTIVITY_CH.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        console.log("wooow we created our activity channel wowowowo");
        listenToBGWorker();
        // now listen to video time updates from DOM
      }
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
  console.log(">> gdzie jest panel?");
  const sessionStatus = useSession();

  if (sessionStatus === "loading") {
    return <>Loading...</>;
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <>
        <LoginModal />
      </>
    );
  }

  return (
    <>
      Jesteś kurwa zalogowany!
      {sessionStatus}
      <button onClick={() => logout()}>Wyloguj</button>
    </>
  );
};

export default RenderUI;

interface Activity {
  event_timestamp: number;
  is_playing?: boolean;
  video?: string;
  video_name?: string;
  video_duration?: number;
  video_timestamp?: number;
  muted?: boolean;
}
