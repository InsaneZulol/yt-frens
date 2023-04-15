import type { RealtimeChannel } from "@supabase/supabase-js";
import { MESSAGE_ACTIONS } from "~types/messages";
import { supabase } from "~store";

export interface ActivityI {
    // event_timestamp: number;
    is_playing?: boolean;
    video_url?: string;
    video_name?: string;
    video_duration?: number;
    video_timestamp?: number;
    tab_muted?: boolean;
    video_muted?: boolean;
}

let ACTIVITY_STATE: ActivityI = {
    is_playing: null,
    video_url: null,
    video_name: null,
    video_duration: null,
    video_timestamp: null,
    video_muted: null,
    tab_muted: null
};

export function UPDATE_ACTIVITY_STATE(new_activity: ActivityI): void {
    ACTIVITY_STATE = {
        ...ACTIVITY_STATE,
        ...new_activity
    };
    onActivityStateUpdate();
}

async function broadcastActivity() {
    ACTIVITY_CH &&
        ACTIVITY_CH.send({
            type: "broadcast",
            event: "activity",
            payload: ACTIVITY_STATE
        }).then(() => {
            console.log("sent activity update");
        });
}

async function onActivityStateUpdate() {
    broadcastActivity();
}

export async function launchActivityCh() {
    // listen to tab updates messages from the service worker
    function listenToTabUpdates() {
        chrome.runtime.onMessage.addListener((message) => {
            if (message.action == MESSAGE_ACTIONS.ATTACH)
                UPDATE_ACTIVITY_STATE({
                    video_url: message?.tab_update?.url ?? ACTIVITY_STATE.video_url,
                    video_name: message?.tab_update?.title ?? ACTIVITY_STATE.video_name
                    // tab_muted: message.tab_muted ?? ACTIVITY_STATE.tab_muted
                });
        });
    }

    // listen to our activity requests coming from the web
    function listenForRequests() {
        console.log("nice, a request!");
        ACTIVITY_CH.on("broadcast", { event: "activity_req" }, broadcastActivity);
    }

    SET_ACTIVITY_CH().then(() => {
        if (ACTIVITY_CH) {
            ACTIVITY_CH.subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    console.log("wooow we created act channel");
                    listenToTabUpdates();
                    listenForRequests();
                }
            });
        }
    });
}

export let ACTIVITY_CH: RealtimeChannel = null;
export let SET_ACTIVITY_CH = async (): Promise<void> => {
    ACTIVITY_CH = supabase.channel(
        `activity_ch:` + (await supabase.auth.getSession()).data.session.user.id
    );
};
