export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export default interface Database {
    public: {
        Tables: {
            user_data: {
                Row: {
                    friends: string[] | null;
                    id: number;
                    last_seen: string | null;
                    nickname: string | null;
                    user_id: string | null;
                };
                Insert: {
                    friends?: string[] | null;
                    id?: number;
                    last_seen?: string | null;
                    nickname?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    friends?: string[] | null;
                    id?: number;
                    last_seen?: string | null;
                    nickname?: string | null;
                    user_id?: string | null;
                };
            };
        };
        Views: {
            view_my_friends: {
                Row: {
                    nickname: string | null;
                    user_id: string | null;
                };
            };
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            continents:
                | "Africa"
                | "Antarctica"
                | "Asia"
                | "Europe"
                | "Oceania"
                | "North America"
                | "South America";
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}
export type UserData = Database["public"]["Tables"]["user_data"]["Row"];
