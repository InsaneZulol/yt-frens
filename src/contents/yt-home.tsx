// - Pobrać liste friendsów z bazy danych i wyświetlić na homepage/, videopage/,
// - Zacząć trackować presence friendsów(i widzieć na jakim są channelu)
// - Zacząć od spróbowania integracji reacta w tym CS.
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { supabase } from "~store";
import { useState, useEffect } from "react";

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/", "http://www.youtube.com/"],
  all_frames: true,
  run_at: "document_idle",
  css: ["./yt-style.css"],
}

// 1. get row where our id is present. This should be done on SQL side,
//    I've enabled RLS so we should be getting only the row with our uid. 
// 2. read array[], store
async function getFriends(): Promise<Array<string>> {
  let query = supabase.from('friendships').select('friends');
  const { data, error } = await query;
  return data[0].friends;
}

(async function init() {
  await getFriends();
})();

// React CS UI
// https://docs.plasmo.com/framework/content-scripts-ui
export const getInlineAnchor: PlasmoGetInlineAnchor = async () =>
  document.querySelector("#guide-inner-content #sections :not(:first-child) #items ");

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  console.log('friend list rendered');

  const fetchFriends = async () => {
    const arr = await getFriends();
    setFriends(arr);
  }

  useEffect(() => {
    fetchFriends();
    // cleanup nie mam pomysłu
  }, []);

  // todo: each friend listItem a separate compontent
  const listItems = friends.map((friend, index) =>
    <button
      key={index} //
      style={{
        // backgroundColor: friend.isOnline ? 'green' : 'grey'
        // stan isOnline będzie pobierany z presence
      }}>
      {friend}
    </button>
  );

  return <div
    style={{
      background: "red",
      padding: 12,
      color: "white",
      fontSize: 20,
      borderRadius: "20px",
      height: 250,
      width: 180,
      marginTop: 8
    }}
    className="friend_list">
    Friends
    <ul>
      {listItems}
    </ul>
  </div>
}
export default FriendList