// - Pobrać liste friendsów z bazy danych i wyświetlić na homepage/, videopage/,
// - Zacząć trackować presence friendsów(i widzieć na jakim są channelu)
// - Zacząć od spróbowania integracji reacta w tym CS.
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useState, useEffect } from "react";
import { fetchMyFriendsFromDB } from "~db";

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/", "http://www.youtube.com/"],
  all_frames: true,
  run_at: "document_idle",
  css: ["./yt-style.css"],
};

(async function init() {
  await fetchMyFriendsFromDB();
})();

// React CS UI
// https://docs.plasmo.com/framework/content-scripts-ui
export const getInlineAnchor: PlasmoGetInlineAnchor = async () =>
  document.querySelector("#guide-inner-content #sections :not(:first-child) #items ");

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  console.log('friend list renderedx');

  const fetchFriends = async () => {
    const friends_arr = await fetchMyFriendsFromDB();
    setFriends(friends_arr);
  }

  useEffect(() => {
    fetchFriends();
  }, []);

  // todo: each friend listItem a separate compontent
  const listItems = friends.map((friend, index) =>
    <button
      key={friend.user_id} //
      style={{
        // backgroundColor: friend.isOnline ? 'green' : 'grey'
        // stan isOnline będzie pobierany z presence
      }}>
      {friend.nickname}
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