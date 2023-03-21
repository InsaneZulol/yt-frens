import { supabase } from "~store";

// returns array of objects
export async function fetchMyFriendsFromDB(): Promise<Array<any>> {
    let query = supabase.from('view_my_friends').select('*');
    const { data, error } = await query;
    if(error) console.error("error querying db", error);
    return data;
}

export async function sendHeartbeat(): Promise<Array<any>> {
    const currentTime = new Date();
    const formattedTime = currentTime.toISOString().substring(11, 19) // Extract HH:mm:ss from ISO string
    let query = supabase.from('user_data').update({ last_seen: formattedTime }).lt("last_seen", formattedTime); // updates only when current time is newer
    const { data, error } = await query;
    console.log('sendHeartbeat()', data);
    if(error) console.error("error querying db", error);
    return data;
}


//const { data } = await supabase
// .from('countries')
// .select()
// .returns<MyType>() // sets returned type