import { useState, useEffect } from "react";
import { fetchMyFriendsFromDB } from "~db";
import { supabase } from "~store";
import { Friend } from "./friend-item";

const FriendList = () => {
    const [friends, setFriends] = useState([]);
    console.log('friend list rendered');

    const fetchFriends = async () => {
        const friends_arr = await fetchMyFriendsFromDB();
        setFriends(friends_arr);
    }
    

    useEffect(() => {
        fetchFriends();
    }, []);

    useEffect(() => {
        console.log("second useffect!!!!! xxx");

        // listen to friends
        const userdata_changes_ch = supabase.channel('changes');
                            // friends.map((friend, index) => {
                            //     console.log("friend object:", friend);
                            //     userdata_changes_ch.on(
                            //         'postgres_changes',
                            //         {
                            //             event: 'UPDATE',
                            //             schema: 'public',
                            //             table: 'user_data',
                            //             filter: `user_id=eq.${friend.user_id}`
                            //             // filter: `user_id=neq.23c0255d-34d2-4a22-aa8e-aacbb639cc15`
                            //         }, (payload) => {
                            //             // 1. decide if user is online.
                            //             // 2. if online -> subscribe(payload.new.);

                            //         }
                            //         // todo: this event should trigger setState/pass prop or something so our friend component
                            //         // potentially [reconnects to/disconnects from] the channel 
                            //     );
                            // });
        userdata_changes_ch.subscribe();
    }, [friends])

    const listItems = friends.map((friend, index) =>
    <Friend key={friend.user_id} uuid={friend.user_id} nickname={friend.nickname} lastSeen={friend.last_seen}></Friend>
    );

    return <div
        style={{
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
        <ul>
            {listItems}
        </ul>
    </div>
}
export default FriendList