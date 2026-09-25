import { useState } from "react";
import API from "../api/api";

export default function Login({ onLogin, onShowRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await API.post("/login", {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);

            onLogin();
        } catch (error) {
            setError("Invalid email or password");
        }
    };

    return (
        <div>
            <h1>Finance Tracker</h1>
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">
                    Login
                </button>

                <button type="button" onClick={onShowRegister}>
                    Register
                </button>
            </form>

            {error && <p>{error}</p>}
        </div>
    );
}