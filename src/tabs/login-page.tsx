// Otwórz:
// chrome-extension://hjaihfdidlafclpldffcgdjpgfhfdjgf/tabs/login-page.html
import { supabase } from "~/store"


async function sign_up_email(event) {
    event.preventDefault();
    if (!event.target.email.value || !event.target.email.value)
        alert("Credentials undefined or something i huj");

    const { data, error } = await supabase.auth.signUp({
        email: event.target.email.value,
        password: event.target.password.value,
    })
    console.log('sign up data:', data, 'error', error);
}

async function sign_in_email(event) {
    event.preventDefault();
    if (!event.target.email.value || !event.target.email.value)
        alert("Credentials undefined or something i huj");

    const { data, error } = await supabase.auth.signInWithPassword({
        email: event.target.email.value,
        password: event.target.password.value,
    });
    console.log('login data:', data, 'error', error);
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
            <form className="Auth-form" onSubmit={sign_in_email} >
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