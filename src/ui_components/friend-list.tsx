import type { RealtimeChannel } from "@supabase/supabase-js";
import { useState, useEffect, useCallback } from "react";
import { fetchMyFriendsFromDB } from "~db";
import { supabase, MESSAGE_ACTIONS, type CHROME_API_MESSAGE, type TARGET } from "~store";
import { Friend } from "./friend-item";

const FriendList = () => {
    console.log("friend list rendered");
    const [friends, setFriends] = useState([]);
    const [postgresChangesCh, setPostgresChangesCh] = useState<RealtimeChannel>(null);

    const attach = async (user_id: string) => {
        chrome.runtime.sendMessage({
            action: MESSAGE_ACTIONS.ATTACH,
            params: { user_id } as TARGET
        } as CHROME_API_MESSAGE);
    };

    const fetchFriends = async () => {
        const friends_arr = await fetchMyFriendsFromDB();
        setFriends(friends_arr);
    };

    useEffect(() => {
        fetchFriends().then(() => {
            setPostgresChangesCh(supabase.channel("changes"));
        });
    }, []);

    useEffect(() => {
        console.log("second useffect!");
        if (postgresChangesCh) {
            postgresChangesCh.subscribe(async (status) => {
                if (status === "SUBSCRIBED") console.log("subbed postgres changes");
                else console.error("no i huj", status);
            });
        }
    }, [postgresChangesCh]);

    const listItems = friends.map((friend, index) => (
        <Friend
            onClick={() => attach(friend.user_id)}
            key={friend.user_id}
            uuid={friend.user_id}
            nickname={friend.nickname}
            lastSeen={friend.last_seen}
            realtimeChannel={postgresChangesCh}></Friend>
    ));

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "red",
                padding: 12,
                color: "white",
                fontSize: 20,
                borderRadius: "20px",
                height: 250,
                width: 180,
                marginTop: 8
            }}
            className="friend_list">
            Friends
            <div>{listItems}</div>
        </div>
    );
};
export default FriendList;
