// import { supabase } from "~store";
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo";
import { useEffect, useRef, useState } from "react";
import { UPDATE_ACTIVITY_STATE } from "~activity";
import { LS_GET_ATTACHED_TO, LS_SET_ATTACHED_TO } from "~attached-to";
import { MSG_EVENTS, type API_MSG_EVENTS } from "~types/messages";

export const config: PlasmoCSConfig = {
    matches: ["https://www.youtube.com/*", "http://www.youtube.com/*"], // nie videopage, bo SPA. Ładujemy odrazu i mutation observer czeka na elem 'video'.
    all_frames: true,
    // css: ["./yt-style.css"], // jak to odkomentujesz, to przestanie działac dynamic cs injection
    run_at: "document_idle"
};

export const getInlineAnchor: PlasmoGetInlineAnchor = async () =>
    document.querySelector("video");

export const Video = () => {
    const attachedTo = useRef<string>("");
    console.log("video 🧏 component rendered");

    useEffect(() => {
        const video = document.querySelector("video");
        LS_GET_ATTACHED_TO().then((value: string) => (attachedTo.current = value));
        // RX
        // add listener for messages
        // receive messages from this - same - content script through background script relay
        chrome.runtime.onMessage.addListener((message) => {
            if (message.event === MSG_EVENTS.VID_UPDATE) {
                if (message.params.video_pos) {
                    console.log(
                        "vid controller received video pos",
                        message.params.video_pos,
                        "attached to",
                        attachedTo.current
                    );
                    if (attachedTo.current !== "") {
                        video.currentTime = message.params.video_pos;
                    }
                }
                if (message.params.is_playing !== null) {
                    console.log("is_playing", message.params.is_playing);
                    if (attachedTo.current !== "") {
                        console.log("handle is_playing", message.params.is_playing);
                        message.params.is_playing ? video.play() : video.pause();
                    }
                }
            }
        });
        // END OF RX

        // TX
        // add listeners for video activity
        video.addEventListener("pause", (event) => {
            console.debug("PAUSE ⏸️");
            UPDATE_ACTIVITY_STATE({
                is_playing: false,
                video_timestamp: video.currentTime
            });
        });
        video.addEventListener("play", (event) => {
            console.debug("PLAY ▶️");
            UPDATE_ACTIVITY_STATE({
                is_playing: true,
                video_timestamp: video.currentTime
            });
        });
        // todo: youtube by default pauses when you start
        // seeking. This causes unnecesary paused/played
        // events. Figure it out.
        video.addEventListener("seeked", (event) => {
            console.debug("video seeked ⌚");
            UPDATE_ACTIVITY_STATE({ video_timestamp: video.currentTime });
        });
        // video.addEventListener("volumechange", (event) => {
        //     if(video.muted)
        //     UPDATE_ACTIVITY_STATE({ video_muted: true });
        //     console.log("vol change");
        // });
        // END OF TX
    }, []);

    return <button onClick={() => LS_SET_ATTACHED_TO("")}>detach kurwa</button>;
};
export default Video;

// // SUPABASE
// async function send_update_message(time_: number) {
//   // const begin = performance.now();
//   const resp = await channel.send({
//     type: 'broadcast',
//     event: VIDEO_STATE_EVENT,
//     payload: { time: time_ },
//   });
//   // const end = performance.now()
//   // console.log(`sent video time update message, RTT is ${end - begin} milliseconds`);
//   console.log(resp);
// };

// async function join_room(name: string, room: string): Promise<boolean> {

//   let ret = false;
//   channel = supabase.channel(room, {
//     config: {
//       broadcast: { ack: true },
//     },
//   });
