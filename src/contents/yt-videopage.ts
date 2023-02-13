import type { PlasmoCSConfig } from "plasmo"
import { supabase } from "~/store"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/watch?v=*", "http://www.youtube.com/watch?v=*"],
  all_frames: true,
  css: ["./yt-videopage.css"],
  run_at: "document_idle" // wydaje mi się, że nie musimy to robić w idle. Poprostu injectować dopiero jak obiekt się pojawi, on event.
}

// SUPABASE
const channel = supabase.channel('receipt', {
  config: {
    broadcast: { ack: true },
  },
})

// listen
channel
  .on('broadcast', { event: 'supa' }, (payload) => console.log(payload))
  .subscribe();

async function send_message() {
  console.log("sending message");
  const resp = await channel.send({
      type: 'broadcast',
      event: 'supa',
      payload: { org: 'supabase' },
  })
  console.log(resp);
};
// ENDOF Supabase



function insert_debug_panel() {
  let elem_info_ = document.querySelector('#above-the-fold');
  // https://developer.mozilla.org/pl/docs/Web/API/Element/insertAdjacentHTML
  elem_info_.insertAdjacentHTML('afterbegin', `
      <div class='debug_panel'>
      <p>DEBUG PANEL KURWA TEN<p><br>
      <h3>Your room id is </h3> <p class="dbg_room_id_nr"></p>
      <br>
      <h2>Join</h2>
      <input type="text" id="roomId" name="room" minlength="1" maxlength="4" size="4">
      <button class="dbg-join_btn" type="button" onclick=""()">Join</button> <br>
      <h2>Create</h2>
      <button class="dbg-create_btn" type="button" onclick="create_room()">Create</button>
      </div>
      `);
  // test: simple supabase send message. Todo: join_room()  functionality instead 
  let elem_btn_ = document.querySelector('.dbg-join_btn');
  elem_btn_.addEventListener('click', send_message);
}

console.log('content script injected');
setTimeout(insert_debug_panel, 1200); // ładowanie skryptu na document_idle nie wystarcza
                                      // todo: change it to async await till this dom object exists or something