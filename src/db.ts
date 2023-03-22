import { supabase } from "~store";

// returns array of objects
export async function fetchMyFriendsFromDB(): Promise<Array<any>> {
    let query = supabase.from('view_my_friends').select('*');
    const { data, error } = await query;
    if(error) console.error("error querying db", error);
    return data;
}

// bug: 1. nie updatuje sie status w db po północy, bo wraparound 00 < 23 czy coś
//      2. nie updatuje się jeśli w komórce jest NULL.
// todo: poprawić ten .lt()
export async function sendHeartbeat(): Promise<Array<any>> {
    const current_time = new Date();
    const formatted_time = current_time.toISOString().substring(11, 19) // Extract HH:mm:ss from ISO string
    let query = supabase.from('user_data').update({ last_seen: formatted_time }).lt("last_seen", formatted_time); // updates only when current time is newer
    const { data, error } = await query;
    console.log('sendHeartbeat()', data);
    if(error) console.error("error querying db", error);
    return data;
}


//const { data } = await supabase
// .from('countries')
// .select()
// .returns<MyType>() // sets returned type