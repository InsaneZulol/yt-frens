import type {
    PlasmoCSConfig,
    PlasmoGetInlineAnchor,
    PlasmoGetOverlayAnchor,
    PlasmoGetStyle
} from "plasmo";
import { useState } from "react";
import { useSession, logout, login } from "~auth";
import FriendList from "~ui_components/friend-list";
import styleText from "data-text:./yt-style.css";
import av from "data-base64:/assets/alan_av.jpg";

export const config: PlasmoCSConfig = {
    matches: ["https://www.youtube.com/*", "http://www.youtube.com/*"],
    all_frames: true,
    run_at: "document_end"
};

export const getStyle: PlasmoGetStyle = () => {
    const style = document.createElement("style");
    style.textContent = styleText;
    return style;
};

export const getInlineAnchor: PlasmoGetInlineAnchor = async () =>
    document.querySelector("#container #center");

export const StatusPill = () => {
    const [toggled, setToggled] = useState<boolean>(false);
    const sessionStatus = useSession();
    let toggle = (event) => {
        event.preventDefault();
        if (event.target === event.currentTarget) setToggled(!toggled);
    };

    if (sessionStatus === "logged_in") {
        return (
            <div
                className={toggled ? "status-pill status-pill-toggled" : "status-pill"}
                onClick={toggle}>
                <div className="status-pill-content">
                    <div className="status-pill-content-friends">
                        {/* <img src={av} alt="" /> */}
                    </div>
                    <div className="status-pill-content-status"></div>
                    <div className="status-pill-content-avatar"></div>
                </div>
                <div className={toggled ? "friend-list" : "hidden"}>
                    <FriendList></FriendList>
                    <button onClick={() => logout()}>Wyloguj</button>
                </div>
            </div>
        );
    } else
        return (
            <div
                className={"status-pill"}
                // onClick={} open login modal
            >
                <button className="btn-open-login-modal">Sign in kurwa</button>
            </div>
        );
};

export default StatusPill;
