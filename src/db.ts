import { supabase } from "~store";

// returns array of objects
export async function fetchMyFriendsFromDB(): Promise<Array<any>> {
    let query = supabase.from('view_my_friends').select('*');
    const { data, error } = await query;
    console.log('in extra, datax:', data);
    if(error) console.error("error querying db", error);
    return data;
}


//const { data } = await supabase
// .from('countries')
// .select()
// .returns<MyType>() // sets returned type