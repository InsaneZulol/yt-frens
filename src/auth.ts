import { useEffect, useState } from "react";
import { supabase } from "~store";

export interface LoginCredentials {
    email: string;
    password: string;
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

export async function logout() {
    await supabase.auth.signOut();
}

type SessionStatus = 'loading' | 'logged_in' | 'unauthenticated';

export const useSession = () => {
    const [sessionStatus, setSessionStatus] = useState<SessionStatus>('loading');

    useEffect(() => {
        supabase.auth.getSession().then((session) => {
            handleSessionStatusChange(session);
        });


        supabase.auth.onAuthStateChange((_event, session) => {
            console.log('>>> auth state channnge!!')
            handleSessionStatusChange(session);
        })
    }, []);

    const handleSessionStatusChange = (session) => {
        console.log('>> handleSessionstatuschange', session);
       if (session?.data?.session?.user || session?.user) {
            setSessionStatus('logged_in');
       } else {
            setSessionStatus('unauthenticated');
       }
    }

    return sessionStatus;
}