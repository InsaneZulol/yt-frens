// This file state should be shared and ontop.

import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo";
import { launchActivityCh } from "~/activity";
import LoginModal from "~/ui_components/login-modal";
import { isLoggedIn, logout, useSession } from "~auth";
import { sendHeartbeat } from "~db";
import { supabase } from "~store";

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
        <>
            Jesteś kurwa zalogowany!
            {sessionStatus}
            <button onClick={() => logout()}>Wyloguj</button>
        </>
    );
};

export default RenderUI;
