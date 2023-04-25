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
import gay from "data-base64:/assets/gay.png";

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
        // if (event.target === event.currentTarget)
        setToggled(!toggled);
    };

    if (sessionStatus === "logged_in") {
        return (
            <div className="pill-container">
                <div className={toggled ? "pill pill-toggled" : "pill"}>
                    <div className="left" onClick={toggle}>
                        <img src={gay} alt="" />
                    </div>
                    <div className="center">
                        <div className="name">Nickname</div>
                        <div className="status">Watching</div>
                    </div>
                    <div className="right">
                        <img className="avatar" src={av} alt="" />
                    </div>
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
                className={"pill"}
                // onClick={} open login modal
            >
                <button className="btn-open-login-modal">Sign in kurwa</button>
            </div>
        );
};

export default StatusPill;
