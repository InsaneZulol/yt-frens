import { login } from "~auth";

const LoginModal = () => {

    const handleLogin = (event) => {
        event.preventDefault();
        if
            (!event.target.email.value || !event.target.email.value) alert("Credentials undefined or something i huj");
        else
            login({
                email: event.target.email.value,
                password: event.target.password.value
            });
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                padding: 16,
                alignItems: "center",
                width: "20vw",
                height: "50vh",
                maxWidth: "60vh",
                backgroundColor: "green"
            }}>
            <h2>Login</h2>
            <form className="Auth-form" onSubmit={handleLogin} >
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
    );
}
export default LoginModal;