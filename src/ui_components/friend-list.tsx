import type { RealtimeChannel } from "@supabase/supabase-js";
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "~store";
import { FriendItem } from "./friend-item";
import { Friend, getFriends } from "~friends-state";

const FriendList = () => {
    console.log("friend list rendered");
    const friends = useRef<Array<Friend>>([]);

    const fetchFriends = async () => {};
    // add message listener for onFriendsLoaded

    useEffect(() => {
        friends.current = getFriends();
    }, []);

    const listItems = friends.current.map((friend, index) => (
        <FriendItem
            key={index}
            uuid={friend.user_data.user_id}
            nickname={friend.user_data.nickname}
            lastSeen={friend.user_data.last_seen}></FriendItem>
    ));

    return <div>{listItems}</div>;
};
export default FriendList;
