import type { RealtimeChannel } from "@supabase/supabase-js";
import { MSG_EVENTS, type TAB_UPDATE } from "~types/messages";
import { supabase } from "~store";

export interface ActivityI {
    // user's tab info data
    video_url?: string;
    video_name?: string;
    // user's video controller data
    is_playing?: boolean;
    video_duration?: number;
    video_pos?: number;
    event_timestamp?: number;

    //  muted data - todo
    tab_muted?: boolean;
    video_muted?: boolean;
}

let ACTIVITY_STATE: ActivityI = {
    video_url: null,
    video_name: null,
    tab_muted: null,
    video_muted: null,
    is_playing: null,
    video_duration: null,
    video_pos: null,
    event_timestamp: null
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
            if (message.event && message.event === MSG_EVENTS.TAB_UPDATE) {
                // prettier-ignore
                UPDATE_ACTIVITY_STATE({
                    video_url: message?.params?.url ?? ACTIVITY_STATE.video_url,
                    video_name: message?.params?.title ?? ACTIVITY_STATE.video_name,
                    // po co te pola, kurwa zapomniałem
                    video_pos: message?.params?.video_pos ?? ACTIVITY_STATE.video_pos,
                    event_timestamp: message?.params?.event_timestamp ?? ACTIVITY_STATE.event_timestamp,
                    video_duration: message?.params?.video_duration ?? ACTIVITY_STATE.video_duration,
                    video_muted: message?.params?.video_muted ?? ACTIVITY_STATE.video_muted,
                    is_playing: message?.params?.is_playing ?? ACTIVITY_STATE.is_playing
                    // tab_muted: message.tab_muted ?? ACTIVITY_STATE.tab_muted
                } as ActivityI);
            }
        });
    }

    // add event handler for *our activity* requests coming from the web
    // to broadcast the requested activity
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
                    broadcastActivity();
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
