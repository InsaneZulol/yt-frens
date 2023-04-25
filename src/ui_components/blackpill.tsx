import { useState } from "react";
import { useSession, logout } from "~auth";
import FriendList from "./friend-list";
import av from "data-base64:/assets/alan_av.jpg";
import gay from "data-base64:/assets/gay.png";

export const BlackPill = () => {
    const [toggled, setToggled] = useState<boolean>(false);
    const sessionStatus = useSession();
    let toggle = (event) => {
        event.preventDefault();
        setToggled(!toggled);
    };

    if (sessionStatus === "logged_in") {
        return (
            <div className="pill-container">
                <div className={toggled ? "pill pill-toggled" : "pill"}>
                    <div className="pill-left" onClick={toggle}>
                        <img src={gay} alt="" />
                    </div>
                    <div className="pill-center">
                        <div className="name">Nickname</div>
                        <div className="status">Watching</div>
                    </div>
                    <div className="pill-right">
                        <img className="avatar" src={av} alt="" />
                    </div>
                </div>
                <div className={toggled ? "friend-list" : "hidden"}>
                    <FriendList></FriendList>
                    {/* <button onClick={() => logout()}>Wyloguj</button> */}
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
