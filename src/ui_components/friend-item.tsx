import { useState, useEffect, useRef } from "react";
import { supabase } from "~store";
import type { ActivityI } from "~/activity";
import { time } from "console";
import { MESSAGE_ACTIONS, type TARGET, type API_MESSAGING_EVENTS } from "~types/messages";

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

    const attach = async (user_id: string) => {
        console.log("click!👆");
        chrome.runtime.sendMessage({
            action: MESSAGE_ACTIONS.ATTACH,
            params: { user_id } as TARGET
        } as API_MESSAGING_EVENTS);
    };
    return (
        <a href={activity.video_url}>
            <div
                onClick={() => attach(props.uuid)}
                style={{
                    background: "black",
                    padding: 3,
                    color: "white",
                    fontSize: 10,
                    borderRadius: "10px",
                    height: 120,
                    width: 180,
                    marginTop: 8
                }}
                className="friend_item">
                {props.nickname}
                <div>
                    Last seen {(new Date().getTime() - lastSeen.getTime()) / 1000} sec.
                    ago.
                </div>
                <div>VideoURL: {activity.video_url}</div>
                <div>Title: {activity.video_name}</div>
                <div>Playing: {activity.is_playing ? "Yes" : "No"}</div>
                <div>At: {activity.video_timestamp}</div>
                <div>{status}</div>
            </div>
        </a>
    );
};

type FriendStatus = "unknown" | "offline" | "afk" | "online";
