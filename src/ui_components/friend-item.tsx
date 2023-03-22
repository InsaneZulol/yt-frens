import { useState, useEffect } from "react";
import { supabase } from "~store";

export const useFriendActivity = () => {
    const [friendStatus, setFriendStatus] = useState<FriendStatus>('unknown');
    const [friendActivity, setFriendActivity] = useState<string>('no_connection');

    // 1. Get friend online/offline status from db table
    // 2. if(friend is online) subscribe to their friendname_status_ch

}

export const Friend = (props) => {
    // const last_seen = props.last_seen;
    const userdata_changes_ch = supabase.channel('changes');


    const [friendStatus, setFriendStatus] = useState<FriendStatus>('unknown');
    // const [friendActivity, setFriendActivity] = useState<string>('no_connection');

    function calcFriendStatus(_last_seen) {
        const now = new Date();
        const last_seen_time = new Date(_last_seen);
        const time_diff_sec = (now.getTime() - last_seen_time.getTime()) / 1000

        if (time_diff_sec > 30) {
            return 'offline'
        } else {
            return 'online'
        }
    }
    console.log('== rendering ', props.nickname, ' component');

    // subscribes to activity channel of this friend
    const subscribe = async () => {
        const friend_activity_ch = supabase.channel(`activity_ch_` + props.uuid);
        friend_activity_ch.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                console.log('=== congratulations you moron, you are subscribing to ', props.nickname, 'activity!===');
            }
            else console.log("oops ", status);
        });
    }

    useEffect(() => {
        // listen to this friend's status changes in db
        userdata_changes_ch.on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'user_data',
                filter: `user_id=eq.${props.uuid}`
            }, (payload) => {
                console.log('o kurwa table change', payload);
            });

        subscribe().then(() => {
            console.log('sub');
        });
    }, []);

    return <div
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
        {props.nickname};
    </div>
}

type FriendStatus = 'unknown' | 'offline' | 'afk' | 'online';
