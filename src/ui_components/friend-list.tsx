import type { RealtimeChannel } from "@supabase/supabase-js";
import { useState, useEffect, useCallback } from "react";
import { fetchMyFriendsFromDB } from "~db";
import { supabase } from "~store";
import { Friend } from "./friend-item";

const FriendList = () => {
    console.log("friend list rendered");
    const [friends, setFriends] = useState([]);
    const [postgresChangesCh, setPostgresChangesCh] = useState<RealtimeChannel>(null);

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
        console.debug("re/subscribed to friend status ch(postgres)");
        if (postgresChangesCh) {
            postgresChangesCh.subscribe(async (status) => {
                if (status === "SUBSCRIBED") console.log("subbed postgres changes");
                else console.error("no i huj", status);
            });
        }
    }, [postgresChangesCh]);

    const listItems = friends.map((friend, index) => (
        <Friend
            key={friend.user_id}
            uuid={friend.user_id}
            nickname={friend.nickname}
            lastSeen={friend.last_seen}
            realtimeChannel={postgresChangesCh}></Friend>
    ));

    return <div>{listItems}</div>;
};
export default FriendList;
