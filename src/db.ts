import { supabase } from "~store";
export var heartbeat_timer_begin = null;

// returns array of objects
export async function fetchMyFriendsFromDB(): Promise<Array<any>> {
    let query = supabase.from('view_my_friends').select('*');
    const { data, error } = await query;
    if(error) console.error("error querying db", error);
    return data;
}

export async function sendHeartbeat(): Promise<Array<any>> {
    const current_time = new Date(Date.now()).toISOString();
    let query = supabase.from('user_data').update({ last_seen: current_time }).lt('last_seen', current_time) // updates only when current time is newer
    const { data, error } = await query;
    console.log('sendHeartbeat()', data);
    if(error) console.log("error querying db", error);
    return data;
}


//const { data } = await supabase
// .from('countries')
// .select()
// .returns<MyType>() // sets returned type