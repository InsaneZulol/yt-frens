import { useState, useEffect } from "react";
import { supabase } from "~store";


export const useFriendStatus = () => {
    const [friendStatus, setFriendStatus] = useState<FriendStatus>('offline');



}

export const Friend = (item) => {
    // const [friendStatus, setFriendStatus] = useState<FriendStatus>('offline');
    // channel
    // .on('presence', { event: 'sync' }, () => {
    //   const state = channel.presenceState();
    //   console.log("on sync, current presence state is", state);
    // });

    // useEffect(

    //     // join friend_presence_channel so he can see us

    //     supabase.auth.onAuthStateChange((_event, session) => {
    //         console.log('>>> auth state channnge!!')
    //         handleSessionStatusChange(session);
    //     })
    // )
}

type FriendStatus = 'offline' | 'afk' | 'online';
