import { useState, useEffect, useRef } from "react";
import { supabase } from "~store";
import type { ActivityI } from "~/activity";
import { MSG_EVENTS, type API_MSG_EVENTS, type VID_UPDATE } from "~types/messages";
import { LS_SET_ATTACHED_TO } from "~local-storage";
import av from "data-base64:/assets/alan_av.jpg";

export const Friend = (props) => {
    console.log("💥rendering ", props.nickname, " component💥");
    const [lastSeen, setLastSeen] = useState<Date>(new Date(props.lastSeen));
    const [status, setStatus] = useState<FriendStatus>("unknown");
    const [activity, setActivity] = useState<ActivityI>({});
    const act_ch = useRef(supabase.channel(`activity_ch:` + props.uuid));
    let rerender_timer = useRef<NodeJS.Timer>(null);
    const rerender_timer_dur = 16000;

    let startRerenderTimer = () => {
        clearInterval(rerender_timer.current);
        rerender_timer.current = setInterval(() => {
            setLastSeen(lastSeen); // rerender
            const calculated_status = calculateStatus();
            if (calculated_status === "offline" && status !== "offline") {
                setStatus("offline");
                console.log(props.nickname, "is", calculated_status);
            }
        }, rerender_timer_dur);
    };

    // calculate friend status based on last_seen time
    const calculateStatus = () => {
        const now = new Date();
        const time_diff_sec = (now.getTime() - lastSeen.getTime()) / 1000;

        if (time_diff_sec > 30) {
            return "offline";
        } else {
            return "online";
        }
    };

    const onActivity = (update: ActivityI) => {
        const new_activity = { ...activity, ...update };
        console.log("new kurwa merged 🐒 activity ", new_activity);
        // transmit this activity to video controller
        if (update.is_playing || update.video_timestamp) {
            console.log("vid_update");
            chrome.runtime.sendMessage({
                event: MSG_EVENTS.VID_UPDATE,
                params: {
                    is_playing: update.is_playing,
                    video_pos: update.video_timestamp
                } as VID_UPDATE
            } as API_MSG_EVENTS);
        }
        //
        setActivity(new_activity);
    };
    // subscribes to activity channel of this friend
    const subscribe = async () => {
        const fullActivityPls = async () => {
            act_ch.current.send({ type: "broadcast", event: "activity_req" });
        };
        // create event handler for activity events
        const addActivityHandler = async () => {
            act_ch.current.on("broadcast", { event: "activity" }, function (message) {
                onActivity(message.payload);
            });
        };
        act_ch.current.subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
                console.log(
                    "congratulations you moron, you are subscribing to",
                    props.nickname,
                    "activity!"
                );
                addActivityHandler().then(() => fullActivityPls());
            } else console.log("oops ", status);
        });
    };

    // adds handler for postgres_changes realtime channel
    const addPostgresHandler = async () => {
        props.realtimeChannel.on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "user_data",
                filter: `user_id=eq.${props.uuid}`
            },
            (payload) => {
                console.log("[table  update]");
                setLastSeen(new Date(payload.new.last_seen));
                // restart timer.
                startRerenderTimer();
            }
        );
    };

    // starts a timer to execute this effect on interval every N seconds.
    // updates friend status based on last_seen
    // if timer runs out, set user status to offline
    // should run on start and rerun every time last seen gets changed
    useEffect(() => {
        console.log("lastSeen changed, or first render.");
        setStatus(calculateStatus);
        startRerenderTimer();
        return () => clearInterval(rerender_timer.current);
    }, [lastSeen]);

    // create an event handler to listen to this friend's status changes in db
    // on new event setState
    // effect should only run on initial render
    useEffect(() => {
        console.log(`creating event handler for ${props.uuid}`);
        addPostgresHandler();
        setStatus(calculateStatus); // on startup
    }, []);

    // subscribe to this friend activity, if he is online and was previously offline.
    // effect should run initially and rerun on status change
    useEffect(() => {
        console.log(`${props.nickname} status changed to ${status}`);
        if (status === "online") {
            subscribe();
        }
    }, [status]);

    const attach = async (e) => {
        e.preventDefault();
        console.log("click!👆");
        window.location.href = activity.video_url;
        LS_SET_ATTACHED_TO(props.uuid);
    };
    return (
        <div
            className={
                "friend-item-container" +
                " " +
                status +
                " " +
                (activity.video_name && "watching")
            }>
            {/* todo dodaj state watching a nie */}
            {/* // activity.video_name || "Online" */}
            <div className="friend-item-left">
                <img src={av} alt="" />
            </div>
            <div className="friend-item-center">
                <div className="friend-item-center-flex-col">
                    <div className="friend-item-center-name">{props.nickname}</div>
                    <div className="friend-item-center-activity">
                        {(() => {
                            if (status === "online" && activity.video_name) {
                                return activity.video_name;
                            }
                            if (status === "online") {
                                return "Online";
                            }
                            if (status === "offline") {
                                let min_ago = Math.floor(
                                    (new Date().getTime() - lastSeen.getTime()) / 60000
                                );
                                let hours_ago = Math.floor(min_ago / 60);
                                let days_ago = Math.floor(hours_ago / 24);
                                let text = "Last seen ";
                                if (days_ago >= 2) {
                                    return text + days_ago + " days ago";
                                }
                                if (min_ago > 120) {
                                    return text + hours_ago + " hours ago";
                                }
                                if (min_ago == 1) {
                                    return text + "a minute ago";
                                }
                                if (min_ago < 1) {
                                    return text + "recently";
                                }
                                if (min_ago > 1) {
                                    return text + min_ago + " minutes ago";
                                }
                            }
                            return <div>err</div>;
                        })()}
                    </div>
                    {/* <div className="friend-item-center-progress">13:33 / 21:37</div> */}
                </div>
            </div>
            <div className="friend-item-right">
                {/* https://phosphoricons.com */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    viewBox="0 0 256 256">
                    <path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"></path>
                </svg>
            </div>
        </div>

        //     onClick={attach}
        //     style={{
        //         background: "black",
        //         padding: 3,
        //         color: "white",
        //         fontSize: 10,
        //         borderRadius: "10px",
        //         height: 120,
        //         width: 180,
        //         marginTop: 8
        //     }}
        //     className="friend_item">
        //     {props.nickname}
        //         Last seen {(new Date().getTime() - lastSeen.getTime()) / 1000} sec. ago.
        //     <div>VideoURL: {activity.video_url}</div>
        //     <div>Title: {activity.video_name}</div>
        //     <div>Playing: {activity.is_playing ? "Yes" : "No"}</div>
        //     <div>At: {activity.video_timestamp}</div>
        //     <div>{status}</div>
    );
};

type FriendStatus = "unknown" | "offline" | "afk" | "online" | "watching";
