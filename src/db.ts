import { supabase } from "~store";

// 1. get row where our id is present. This should be done on SQL side,
//    I've enabled RLS so we should be getting only the row with our uid. 
// 2. read array[], store
export async function getFriendsUuidsFromDb(): Promise<Array<string>> {
    let query = supabase.from('friendships').select('friends');
    const { data, error } = await query;
    return data[0].friends;
}

// get data based on uuids passed in array param
export async function getFriendsExtraDataFromDb(user_ids: Array<string>): Promise<Array<any>> {
    let query = supabase.from('extra_user_data').select('nickname, user_id').in('user_id', user_ids);
    const { data, error } = await query;
    console.log('in extra, data:', data)
    return data;
}