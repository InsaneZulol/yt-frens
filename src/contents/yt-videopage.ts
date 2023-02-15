import type { PlasmoCSConfig } from "plasmo"
import { supabase } from "~/store"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/watch?v=*", "http://www.youtube.com/watch?v=*"],
  all_frames: true,
  css: ["./yt-videopage.css"],
  run_at: "document_idle" // wydaje mi się, że nie musimy to robić w idle. Poprostu injectować dopiero jak obiekt się pojawi, on event.
}

// SUPABASE

var channel = supabase.channel('default');

// send, broadcast 'supa' event
async function send_message() {
  console.log("sending message");
  const resp = await channel.send({
    type: 'broadcast',
    event: 'supa',
    payload: { org: 'supabase' },
  })
  console.log(resp);
};

async function join_room(name: string, room: string) : Promise<boolean> {

  let ret  = false;
  channel = supabase.channel(room, {
    config: {
      broadcast: { ack: true },
    },
  });

  // listen to supabase broadcast events - general messages
  channel
    .on('broadcast', { event: 'supa' }, (payload) => console.log(payload));

  // listen to sync messages presesence events
  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      console.log("presence state: ", state);
    });

  // listen to join presence events
  channel
    .on('presence', { event: 'join' }, ({ key, newPresences }) => {
      console.log("user joined ", key, newPresences);
    });

  // listen to leave presence events
  channel
    .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      console.log("user ", name , "left", key, leftPresences);
    });

  // subscribe to channel and track presence
  channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      console.log("joined ", " as ", name);
      const presenceTrackStatus = await channel.track({
        user: name,
        online_at: new Date().toISOString(),
      });
      console.log("status: ", presenceTrackStatus);
      ret = true;
    };
  });
  return ret;
}
// ENDOF Supabase


function insert_debug_panel() {
  let elem_info_ = document.querySelector('#above-the-fold');
  // https://developer.mozilla.org/pl/docs/Web/API/Element/insertAdjacentHTML
  elem_info_.insertAdjacentHTML('afterbegin', `
      <div class='debug_panel'>
        <p>DEBUG PANEL KURWA TEN<p><br>
        Your room id is <span class="dbg-room_id_nr"></span>
        <br>
        <h2>Join</h2>
        <input type="text" id="roomId" name="room" minlength="1" maxlength="4" size="3">
        as <input type="text" id="nameId" name="nameField" minlength="1" maxlength="10" size="4" value="Banan">
        <button class="dbg-join_btn" type="button" onclick="">Join/Create</button> <br>
      </div>
      `);
  let elem_name_field = document.getElementById('nameId') as HTMLInputElement | null;
  let elem_room_field = document.getElementById('roomId') as HTMLInputElement | null;
  let elem_join_btn_ = document.querySelector('.dbg-join_btn');
  let elem_room_id = document.querySelector('.dbg-room_id_nr');
  elem_join_btn_.addEventListener('click', () => {
    const name_value = elem_name_field?.value;
    const room_value = elem_room_field?.value;
    console.log('trying to join room ', room_value, ' as ', name_value);
    if (join_room(name_value, room_value)) {
      elem_room_id.innerHTML = room_value + ", as " + name_value;
    }
  });
}

console.log('content script execute');
setTimeout(insert_debug_panel, 1200); // ładowanie skryptu na document_idle nie wystarcza
                                      // todo: change it to async await till this dom object exists or something