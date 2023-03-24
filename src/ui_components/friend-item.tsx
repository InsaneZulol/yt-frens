import { useState, useEffect } from "react";
import { supabase } from "~store";

export const useFriendActivity = () => {
    const [friendStatus, setFriendStatus] = useState<FriendStatus>('unknown');
    const [friendActivity, setFriendActivity] = useState<string>('no_connection');

    // 1. Get friend online/offline status from db table
    // 2. if(friend is online) subscribe to their friendname_status_ch

}

export const Friend = (props) => {
    const [friendStatus, setFriendStatus] = useState<FriendStatus>('unknown');
    // const [friendActivity, setFriendActivity] = useState<string>('no_connection');
    const friend_activity_ch = supabase.channel(`activity_ch_` + props.uuid);

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
        friend_activity_ch.subscribe(async (status) => {
            if (status === 'SUBSCRIBED')
                console.log('=== congratulations you moron, you are subscribing to ', props.nickname, 'activity!===');
            else
                console.log("oops ", status);
        });
    }

    useEffect(() => {
        // listen to this friend's status changes in db
        console.log(`creating event handler for ${props.uuid}`);
        console.log(props.realtimeChannel);
        props.realtimeChannel.on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'user_data',
                filter: `user_id=eq.${props.uuid}`
            }, (payload) => {
                console.log('o kurwa table change', payload);
                console.log('xx this friend is', calcFriendStatus(payload.new.last_seen));

            });
        if (friendStatus == 'online') {
            subscribe().then(() => {
                console.log('sub activity');
            });
        }
        // todo: this event should trigger setState/pass prop or something so our friend component
        // potentially [reconnects to/disconnects from] the channel 
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
