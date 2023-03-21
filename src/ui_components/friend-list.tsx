import { useState, useEffect } from "react";
import { fetchMyFriendsFromDB } from "~db";

const FriendList = () => {
    const [friends, setFriends] = useState([]);
    console.log('friend list rendered');

    const fetchFriends = async () => {
        const friends_arr = await fetchMyFriendsFromDB();
        setFriends(friends_arr);
    }

    useEffect(() => {
        fetchFriends();
        // now open channels and set connection with those friends to get their status live
    }, []);

    // todo: each friend listItem a separate compontent
    const listItems = friends.map((friend, index) =>
        <button
            key={friend.user_id} //
            style={{
                // backgroundColor: friend.isOnline ? 'green' : 'grey'
                // stan isOnline będzie pobierany z presence
            }}>
            {friend.nickname}
        </button>
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