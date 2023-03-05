// Otwórz:
// chrome-extension://hjaihfdidlafclpldffcgdjpgfhfdjgf/tabs/login-page.html
import type { Session } from "@supabase/supabase-js";
import { supabase } from "~store";
import { sendToContentScript } from "@plasmohq/messaging";
// JWT_EXPIRY można zmienic w
// https://app.supabase.com/project/hbhqngbhfuawgnuvwauf/settings/auth

supabase.auth.onAuthStateChange((event, session) => {
    console.log(event, session)
});

async function signUpEmail(event) {
    event.preventDefault();
    if (!event.target.email.value || !event.target.email.value)
        alert("Credentials undefined or something i huj");
    // todo: register message to auth
    const { data, error } = await supabase.auth.signUp({
        email: event.target.email.value,
        password: event.target.password.value,
    });
}


// # On user logging in through dedicated extension tab.
// ## In order to inject session to local storage in context of youtube page instead of extension*
// - Query tabs for open yt
// - If no tabs, open one
// - Send user_login message to youtube content script
async function signInEmail(event) {
    event.preventDefault();
    if (!event.target.email.value || !event.target.email.value)
        alert("Credentials undefined or something i huj");

    const [tab] = await chrome.tabs.query({ lastFocusedWindow: true, url: 'https://www.youtube.com/*' });
    if (tab == null) {
        await chrome.tabs.create({ url: 'https://www.youtube.com/' });
    }
    // todo: remove the wait();
    setTimeout(async () => {
        console.log("Delayed for 900.");
        const [tab] = await chrome.tabs.query({ lastFocusedWindow: true, url: 'https://www.youtube.com/*' });
        const resp = await sendToContentScript({
            tabId: tab.id,
            name: "user_login",
            body: {
                email: event.target.email.value,
                password: event.target.password.value
            }
        });
        // console.log('sent message to cs, resp:', resp);
    }, 900);
}

function LoginPage() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                padding: 16,
                alignItems: "center",
                width: "100vw",
                height: "100vh",
            }}>
            <h2>Login</h2>
            <form className="Auth-form" onSubmit={signInEmail} >
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Sign In</h3>
                    <div className="form-group">
                        <label>Email address</label> <br></br>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label> <br></br>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Enter password"
                        />
                    </div>
                    <div>
                        <button type="submit" className="btn btn-primary">
                            Login
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default LoginPage