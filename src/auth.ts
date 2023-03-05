import { useState } from "react";
import { supabase } from "~store";

export interface LoginCredentials {
    email: string;
    password: string;
}

export const useSession = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // handleLoginChange(sess)
}

export async function isLoggedIn(): Promise<boolean> {
    return (await (supabase.auth.getSession())).data.session !== null
}

export async function login(credentials: LoginCredentials) {
    console.log("test");
    const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
    });
    console.debug('login data:', data, 'error:', error);
}