import { createClient } from "@supabase/supabase-js";
import type { Database } from "types/supabase";

export const supabase = createClient<Database>(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.PUBLIC_SUPABASE_KEY
);

export enum MESSAGE_ACTIONS {
    TAB_UPDATE = "TAB_UPDATE",
    ATTACH = "ATTACH"
}

export interface TAB_UPDATE {
    url: string;
    title: string;
}

export interface TARGET {
    user_id: string;
}

export interface CHROME_API_MESSAGE {
    action: MESSAGE_ACTIONS;
    params: TAB_UPDATE | TARGET;
}
