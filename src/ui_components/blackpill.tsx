import { useState } from "react";
import { useSession, logout } from "~auth";
import FriendList from "./friend-list";
import av from "data-base64:/assets/alan_av.jpg";

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
                        {toggled ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="88"
                                height="88"
                                fill="currentColor"
                                viewBox="0 0 256 256">
                                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                fill="currentColor"
                                viewBox="0 0 256 256">
                                <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
                            </svg>
                        )}
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
