import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "~store";

export interface ActivityI {
    // event_timestamp: number;
    is_playing?: boolean;
    video?: string;
    video_name?: string;
    video_duration?: number;
    video_timestamp?: number;
    tab_muted?: boolean;
}

let ACTIVITY_STATE: ActivityI = {
    is_playing: null,
    video: null,
    video_name: null,
    video_duration: null,
    video_timestamp: null,
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
    chrome.runtime.onMessage.addListener((message) => {
        UPDATE_ACTIVITY_STATE({
            video: message.url ?? ACTIVITY_STATE.video,
            video_name: message.title ?? ACTIVITY_STATE.video_name,
            tab_muted: message.tab_muted ?? ACTIVITY_STATE.tab_muted
        });
    });

    async function listenForRequests() {
        console.log("nice, a request!");
        ACTIVITY_CH.on("broadcast", { event: "activity_req" }, broadcastActivity);
    }

    SET_ACTIVITY_CH().then(() => {
        if (ACTIVITY_CH) {
            ACTIVITY_CH.subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    console.log("wooow we created act channelwo");
                    // now listen to video time updates from DOM
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