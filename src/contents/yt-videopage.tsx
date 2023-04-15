// import { supabase } from "~store";
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo";
import { useEffect, useState } from "react";
import { UPDATE_ACTIVITY_STATE } from "~activity";
import { MESSAGE_ACTIONS, type API_MESSAGING_EVENTS } from "~types/messages";

export const config: PlasmoCSConfig = {
    matches: ["https://www.youtube.com/*", "http://www.youtube.com/*"], // nie videopage, bo SPA. Ładujemy odrazu i mutation observer czeka na elem 'video'.
    all_frames: true,
    // css: ["./yt-style.css"], // jak to odkomentujesz, to przestanie działac dynamic cs injection
    run_at: "document_idle"
};

export const getInlineAnchor: PlasmoGetInlineAnchor = async () =>
    document.querySelector("video");

export const Video = () => {
    const [attachedTo, setAttachedTo] = useState<string>("self");
    console.log("video 🧏 component rendered");

    useEffect(() => {
        // add listener for messages
        // receive messages from this - same - content script through background script relay
        chrome.runtime.onMessage.addListener((message) => {
            if (message.action == MESSAGE_ACTIONS.ATTACH) {
                if (message.params) {
                    console.log("🔗 attaching to", message.params.user_id);
                    setAttachedTo(message.params.user_id);
                }
            }
        });

        // add listeners for video activity
        const video = document.querySelector("video");
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
    }, []);

    return <button>kuuurwa</button>;
};
export default Video;

// // Przykład użycia pokojów w demo supabase realtime demo https://github.com/supabase/realtime/blob/main/demo/pages/%5B...slug%5D.tsx

// var video_ = document.querySelector('video');

// // SUPABASE
// var channel = supabase.channel('default');
// const VIDEO_STATE_EVENT = 'vid-state'
// // send, broadcast 'vid-state' event
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

//   // listen to supabase broadcast events - general messages
//   channel
//     .on('broadcast', { event: VIDEO_STATE_EVENT }, function (message) {
//       video_.currentTime = message.payload.time;
//       return console.log(message.payload.time);
//     });

//   // listen to sync messages presesence events
//   // We can subscribe to all Presence changes using the 'presence' -> 'sync' event.
//   channel
//     .on('presence', { event: 'sync' }, () => {
//       const state = channel.presenceState();
//       console.log("on sync, current presence state is", state);
//     });

//   // listen to join presence events
//   channel
//     .on('presence', { event: 'join' }, ({ key, newPresences }) => {
//       console.log("user", name, "joined,", "this presence key", key, newPresences);
//     });

//   // listen to leave presence events
//   channel
//     .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
//       console.log("user", name, "left", key, leftPresences);
//     });

//   // subscribe to channel and track presence
//   channel.subscribe(async (status) => {
//     if (status === 'SUBSCRIBED') {
//       console.log('succesfuly joined room', room, 'as', name);
//       // track as in for presence to track us
//       const presenceTrackStatus = await channel.track({
//         user: name,
//         online_at: new Date().toISOString(),
//         is_dj: name == 'Michal' ? true : false,
//         video_at: video_.currentTime
//       });
//       console.log("status: ", presenceTrackStatus);
//       ret = true;
//     };
//   });
//   return ret;
// }
// // ENDOF Supabase

// function insert_debug_panel() {
//   // root object we attach the panel to
//   let elem_info_ = document.querySelector('#above-the-fold');
//   // https://developer.mozilla.org/pl/docs/Web/API/Element/insertAdjacentHTML
//   elem_info_.insertAdjacentHTML('afterbegin', /*html*/ `
//     <div class='debug_panel'>
//       <p>DEBUG PANEL KURWA TEN<p><br>
//       Your room id is <span class="dbg-room_id_nr"></span>
//       <br>
//       <h2>Join</h2>
//       <input type="text" id="roomId" name="room" minlength="1" maxlength="4" size="3">
//       as <input type="text" id="nameId" name="nameField" minlength="1" maxlength="10" size="4" value="Banan">
//       <button class="dbg-join_btn" type="button" onclick="">Join/Create</button> <br>
//       <button class="dbg-update_btn" type="button" onclick="">Update others</button> <br>
//     </div>
//     `);

//   let elem_name_field = document.getElementById('nameId') as HTMLInputElement | null;
//   let elem_room_field = document.getElementById('roomId') as HTMLInputElement | null;
//   let elem_update_btn_ = document.querySelector('.dbg-update_btn');
//   let elem_join_btn_ = document.querySelector('.dbg-join_btn');
//   let elem_room_id = document.querySelector('.dbg-room_id_nr');

//   elem_join_btn_.addEventListener('click', () => {
//     const name_value = elem_name_field?.value;
//     const room_value = elem_room_field?.value;
//     console.log('trying to join room', room_value, 'as', name_value);
//     if (join_room(name_value, room_value)) {
//       elem_room_id.innerHTML = room_value + ", as " + name_value;
//     };
//   });

//   elem_update_btn_.addEventListener('click', () => {
//     console.log('updating others');
//     send_update_message(video_.currentTime);
//   });
// }

// console.log('content script execute');
// setTimeout(insert_debug_panel, 1200); // ładowanie skryptu na document_idle nie wystarcza
//                                       // todo: change it to async await till this dom object exists or something
//                                       //  upd: plasmo getAnchor rozwiązuje ten problem. Todo: zamienić ten raw injection na plasmo cs ui.
