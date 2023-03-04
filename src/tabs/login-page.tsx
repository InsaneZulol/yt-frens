// Otwórz:
// chrome-extension://hjaihfdidlafclpldffcgdjpgfhfdjgf/tabs/login-page.html
import type { Session } from "@supabase/supabase-js";
import { supabase } from "~/store"

// JWT_EXPIRY można zmienic w
// https://app.supabase.com/project/hbhqngbhfuawgnuvwauf/settings/auth

async function signUpEmail(event) {
    event.preventDefault();
    if (!event.target.email.value || !event.target.email.value)
        alert("Credentials undefined or something i huj");

    const { data, error } = await supabase.auth.signUp({
        email: event.target.email.value,
        password: event.target.password.value,
    })
}

async function signInEmail(event) {
    event.preventDefault();
    if (!event.target.email.value || !event.target.email.value)
        alert("Credentials undefined or something i huj");

    const { data, error } = await supabase.auth.signInWithPassword({
        email: event.target.email.value,
        password: event.target.password.value
    });
    console.debug('login data:', data, 'error:', error);
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