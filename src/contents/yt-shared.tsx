// This file state should be shared and ontop.

import type {
    PlasmoCSConfig,
    PlasmoGetInlineAnchor,
    PlasmoGetOverlayAnchor
} from "plasmo";
import { launchActivityCh } from "~/activity";
import { isLoggedIn, logout, useSession } from "~auth";
import { sendHeartbeat } from "~db";
import FriendList from "~ui_components/friend-list";
import LoginModal from "~ui_components/login-modal";

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
        // validateAttachedTo(); TODO
    }

    //   email: 'mariusz@wirtualnapolska.pl',
    //   password: 'kutas123',
    // });
})();

// Don't neeed to attach it to any anchor. We just anchor it by default at the top.
// export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () =>
//     document.querySelector("#container #end");
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
};

export default RenderUI;
