// This file state should be shared and ontop.

import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo";
import { launchActivityCh } from "~/activity";
import LoginModal from "~/ui_components/login-modal";
import { isLoggedIn, logout, useSession } from "~auth";
import { sendHeartbeat } from "~db";
import { supabase } from "~store";
import FriendList from "~ui_components/friend-list";

export const config: PlasmoCSConfig = {
    matches: ["https://www.youtube.com/*", "http://www.youtube.com/*"],
    all_frames: true,
    run_at: "document_end"
};
// IIFE
(async function init() {
    async function initiateHeartbeat() {
        sendHeartbeat();
        setInterval(sendHeartbeat, 15000);
    }

    if (isLoggedIn()) {
        initiateHeartbeat();
        launchActivityCh();
    }

    //   email: 'mariusz@wirtualnapolska.pl',
    //   password: 'kutas123',
    // });
})();

export const getInlineAnchor: PlasmoGetInlineAnchor = async () =>
    document.querySelector("#guide-inner-content #sections :not(:first-child) #items ");
export const RenderUI = () => {
    console.log(">> gdzie jest panel?");
    const sessionStatus = useSession();

    if (sessionStatus === "loading") {
        return <>Loading...</>;
    }

    if (sessionStatus === "unauthenticated") {
        return (
            <>
                <LoginModal />
            </>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
                <FriendList></FriendList>
            </div>
            <button onClick={() => logout()}>Wyloguj</button>
        </div>
    );
};

export default RenderUI;
