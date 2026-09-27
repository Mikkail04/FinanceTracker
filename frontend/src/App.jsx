import { useState } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
    const [loggedIn, setLoggedIn] = useState(
        !!localStorage.getItem("token")
    );

    const [showRegister, setShowRegister] = useState(false);

    const isAdminPage = window.location.pathname === "/admin";

    if (!loggedIn) {
        if (showRegister) {
            return (
                <Register
                    onRegister={() => setLoggedIn(true)}
                />
            );
        }

        return (
            <Login
                onLogin={() => setLoggedIn(true)}
                onShowRegister={() => setShowRegister(true)}
            />
        );
    }

    if (isAdminPage) {
        return <AdminDashboard />;
    }

    return (
        <Dashboard
            onLogout={() => {
                localStorage.removeItem("token");
                setLoggedIn(false);
            }}
        />
    );
}

export default App;