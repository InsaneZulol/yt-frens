// - Pobrać liste friendsów z bazy danych i wyświetlić na homepage/, videopage/,
// - Zacząć trackować presence friendsów(i widzieć na jakim są channelu)
// - Zacząć od spróbowania integracji reacta w tym CS.
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useSession } from "~auth";
import FriendList from "~ui_components/friend-list";


export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/", "http://www.youtube.com/"],
  all_frames: true,
  run_at: "document_idle",
  css: ["./yt-style.css"],
};

(async function init() {
  // await fetchMyFriendsFromDB();
})();

// React CS UI
// https://docs.plasmo.com/framework/content-scripts-ui
export const getInlineAnchor: PlasmoGetInlineAnchor = async () =>
  document.querySelector("#guide-inner-content #sections :not(:first-child) #items ");
const RenderUI = () => {
  const sessionStatus = useSession();

  if (sessionStatus === 'unauthenticated') {
    return (
      <>
        loguj sie kurwa
      </>);
  }
  return (<FriendList></FriendList>)
}

export default RenderUI;