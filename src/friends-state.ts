import type { RealtimeChannel } from "@supabase/supabase-js";
import type { ActivityI } from "~activity";
import { fetchMyFriendsFromDB } from "~db";
import { supabase } from "~store";
import type { UserData } from "~types/supabase";

export interface Friend {
    user_data: UserData;
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
    // : sprawdz czy to fetch teraz dziala, zmieniles typ
    const fetchedFriends = await fetchMyFriendsFromDB();

    fetchedFriends.forEach((friend_data) => {
        const friend: Friend = {
            user_data: friend_data,
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
                    "state_ch:" + friend.user_data.user_id
                )
                .subscribe();
            // remember to add event handlers
        });
    }
}
