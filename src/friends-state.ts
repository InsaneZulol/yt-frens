import type { RealtimeChannel } from "@supabase/supabase-js";
import type { ActivityI } from "~activity";
import { fetchMyFriendsFromDB } from "~db";
import { supabase } from "~store";
import type view_my_friends from "~types/supabase";

interface Friend {
    user_data: view_my_friends;
    state_ch: RealtimeChannel;
    state: ActivityI;
}

let friends: Array<Friend> = [];

export const getFriends = (): Array<Friend> => {
    return friends;
};

// export let setFriends = async (arr: string[]) => {
//     friends = arr;
// };

// just call it once at the start to get initial friends data
export async function loadFriendsData() {
    const fetchedFriends = await fetchMyFriendsFromDB();

    fetchedFriends.forEach((friendData) => {
        const friend: Friend = {
            user_data: friendData,
            state_ch: null,
            state: {}
        };
        friends.push(friend);
    });
}

export async function subscribeToFriendsState() {
    if (friends.length > 0) {
        friends.forEach((friend) => {
            friend.state_ch = supabase
                .channel(
                    // wtf fix that type
                    "state_ch:" +
                        friend.user_data.public.Views.view_my_friends.Row.user_id
                )
                .subscribe();
            // remember to add event handlers
        });
    }
}
