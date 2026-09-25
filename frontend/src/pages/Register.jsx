import { useState } from "react";
import API from "../api/api";

export default function Register({ onRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await API.post("/register", {
                email,
                password,
            });

            localStorage.setItem(
                "token",
                res.data.token
            )

            onRegister();
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Registration failed"
            );
        }
    };

    return (
        <div>
            <h1>Finance Tracker</h1>
            <h2>Create Account</h2>

            <form onSubmit={handleRegister}>
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
                    Create Account
                </button>
            </form>

            {error && <p>{error}</p>}
        </div>
    );
}