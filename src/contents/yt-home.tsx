// - Pobrać liste friendsów z bazy danych i wyświetlić na homepage/, videopage/,
// - Zacząć trackować presence friendsów(i widzieć na jakim są channelu)
// - Zacząć od spróbowania integracji reacta w tym CS.
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { supabase } from "~store";

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/", "http://www.youtube.com/"],
  all_frames: true,
  run_at: "document_idle",
  css: ["./yt-style.css"],
}

async function getFriends() {
  // 1. read our id from local storage user
  // 2. compare our id with each row in of column 1 and column 2
  // 3. get row where our id is present, filter only for the other guy
  const my_id = (await supabase.auth.getUser()).data.user.id;

  
  let query = supabase.from('friendships').select('friends[]');
  // const { data: friends, error } = await query;
  const { data, error } = await query;
  console.log(JSON.stringify(data, null, 2));
}

// React CS UI
// https://docs.plasmo.com/framework/content-scripts-ui
// sidenote: gdyby element by siedział płycej, to by stał w miejscu w czasie scrollowania.
export const getInlineAnchor: PlasmoGetInlineAnchor = async () =>
  document.querySelector("#guide-inner-content #sections :not(:first-child) #items ");

const FriendList = () => {
  // await getFriends();

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
  </div>
}
export default FriendList