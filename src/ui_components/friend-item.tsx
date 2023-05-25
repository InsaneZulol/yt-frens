import { useState, useEffect, useRef } from "react";
import { supabase } from "~store";
import type { ActivityI } from "~/activity";
import { MSG_EVENTS, type API_MSG_EVENTS, type VID_UPDATE } from "~types/messages";
import { LS_SET_ATTACHED_TO } from "~local-storage";
import av from "data-base64:/assets/alan_av.jpg";

const VideoStatus = ({ is_playing, video_pos, video_duration, event_timestamp }) => {
    const [predictedVideoPos, setPredictedVideoPos] = useState<number>(predictVideoPos());

    // whenever props change, restart timer
    useEffect(() => {
        setPredictedVideoPos(video_pos); // synchronized pred with real value
        let interval: NodeJS.Timeout = null;
        if (is_playing) {
            interval = setInterval(() => {
                setPredictedVideoPos(predictVideoPos);
            }, 1000);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [is_playing, video_pos]);

    function predictVideoPos(): number {
        // predicted time =>
        //      ile czasu minęło od event_timestamp + czas wideło
        const time_elapsed_in_sec = (Date.now() - event_timestamp) / 1000;
        return video_pos + time_elapsed_in_sec;
    }

    function displayTime(): string {
        const formatTime = (seconds: number): string => {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const remainingSeconds = Math.floor(seconds % 60);

            // prettier-ignore
            if (hours < 1) {
                return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
            } else {
                return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
            }
        };
        let text = formatTime(predictedVideoPos) + " / " + formatTime(video_duration);
        return text;
    }

    return (
        <div className="friend-item-center-video-status">
            <div className="friend-item-center-playback-status">
                {is_playing ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        fill="currentColor"
                        viewBox="0 0 256 256">
                        <path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"></path>
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        fill="currentColor"
                        viewBox="0 0 256 256">
                        <path d="M216,48V208a16,16,0,0,1-16,16H160a16,16,0,0,1-16-16V48a16,16,0,0,1,16-16h40A16,16,0,0,1,216,48ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Z"></path>
                    </svg>
                )}
            </div>
            <div className="friend-item-center-time">{displayTime()}</div>
        </div>
    );
};

export const FriendItem = (props) => {
    console.log("💥rendering ", props.nickname, " component💥");
    const [lastSeen, setLastSeen] = useState<Date>(new Date(props.lastSeen)); // timestamp in ms epoch of last heartbeat
    const [sinceLastSeen, setSinceLastSeen] = useState<number>(
        new Date().getTime() - lastSeen.getTime()
    ); // timestamp in ms of (now - last_heartbeat)
    const [status, setStatus] = useState<FriendStatus>("unknown");
    const [activity, setActivity] = useState<ActivityI>({});
    const act_ch = useRef(supabase.channel(`activity_ch:` + props.uuid));
    let rerender_timer = useRef<NodeJS.Timer>(null);
    const rerender_timer_dur = 20000;

    let startRerenderTimer = () => {
        clearInterval(rerender_timer.current);
        rerender_timer.current = setInterval(() => {
            console.debug("should re-render!");
            setSinceLastSeen(new Date().getTime() - lastSeen.getTime()); // rerender
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

    const displayLastSeen = (): string => {
        let min_ago = Math.floor(sinceLastSeen / 60000);
        let hours_ago = Math.floor(min_ago / 60);
        let days_ago = Math.floor(hours_ago / 24);
        let text = "Last seen ";
        if (days_ago >= 2) {
            return text + days_ago + " days ago";
        } else if (min_ago > 120) {
            return text + hours_ago + " hours ago";
        } else if (min_ago == 1) {
            return text + "a minute ago";
        } else if (min_ago < 1) {
            return text + "just now";
        } else if (min_ago > 1) {
            return text + min_ago + " minutes ago";
        }
        return "gowno debilu";
    };

    const onActivity = (update: ActivityI) => {
        const new_activity = { ...activity, ...update };
        console.log("new kurwa merged 🐒 activity ", new_activity);
        // transmit this activity to video controller
        if (update.is_playing || update.video_pos) {
            console.log("vid_update");
            chrome.runtime.sendMessage({
                event: MSG_EVENTS.VID_UPDATE,
                params: {
                    is_playing: update.is_playing,
                    video_pos: update.video_pos
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
                            } else if (status === "online") {
                                return "Online";
                            } else {
                                return displayLastSeen();
                            }
                        })()}
                    </div>
                    {status == "online" && activity.video_name && (
                        <VideoStatus
                            video_pos={activity.video_pos}
                            video_duration={activity.video_duration}
                            is_playing={activity.is_playing}
                            event_timestamp={activity.event_timestamp}
                        />
                    )}
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
    );
};

type FriendStatus = "unknown" | "offline" | "afk" | "online" | "watching";
