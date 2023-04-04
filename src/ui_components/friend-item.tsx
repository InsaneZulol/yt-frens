import { useState, useEffect, useRef } from "react";
import { supabase } from "~store";
import type { ActivityI } from "~/activity";

export const useFriendActivity = () => {
    const [status, setStatus] = useState<FriendStatus>("unknown");
};

export const Friend = (props) => {
    console.log("💥rendering ", props.nickname, " component💥");
    const [lastSeen, setLastSeen] = useState<Date>(new Date(props.lastSeen));
    const [status, setStatus] = useState<FriendStatus>("unknown");
    const [activity, setActivity] = useState<ActivityI>({});
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
        const act_ch = supabase.channel(`activity_ch:` + props.uuid);
        act_ch.subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
                console.log(
                    "congratulations you moron, you are subscribing to ",
                    props.nickname,
                    "activity!"
                );
                // create event handler for activity events
                act_ch.on(
                    "broadcast",
                    { event: "activity" },
                    function (message) {
                        onActivity(message.payload);
                    }
                );
                //
            } else console.log("oops ", status);
        });
    };

    // adds handler for postgres_changes realtime channel
    const addHandler = async () => {
        props.realtimeChannel.on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "user_data",
                filter: `user_id=eq.${props.uuid}`
            },
            (payload) => {
                console.log(
                    "[table  update]",
                    props.nickname,
                    "is now",
                    calculateStatus()
                );
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
        console.log(
            "useEffect executed. Either [lastSeen changed], or first render."
        );

        setStatus(calculateStatus);
        startRerenderTimer();
        return () => clearInterval(rerender_timer.current);
    }, [lastSeen]);

    // create an event handler to listen to this friend's status changes in db
    // on new event setState
    // effect should only run on initial render
    useEffect(() => {
        console.log(`creating event handler for ${props.uuid}`);
        addHandler();
        setStatus(calculateStatus); // on startup
    }, []);

    // subscribe to this friend activity, if he is online and was previously offline.
    // effect should run initially and rerun on status change
    useEffect(() => {
        console.log("{{}} <- cipka");
        if (status === "online") {
            subscribe().then(() => {
                console.log("sub activity");
            });
        }
    }, [status]);

    return (
        <div
            style={{
                background: "black",
                padding: 3,
                color: "white",
                fontSize: 10,
                borderRadius: "20px",
                height: 50,
                width: 120,
                marginTop: 8
            }}
            className="friend_item">
            {props.nickname}; Last seen{" "}
            {new Date().getTime() - lastSeen.getTime() / 1000} sec. ago.
            <br></br>
            {calculateStatus()}
        </div>
    );
};

type FriendStatus = "unknown" | "offline" | "afk" | "online";
