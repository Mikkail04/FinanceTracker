import { useState } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register"

function App() {
    const [loggedIn, setLoggedIn] = useState(
        !!localStorage.getItem("token")
    );
    const [showRegister, setShowRegister] = useState(false);

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

    return <Dashboard onLogout={() => {
        localStorage.removeItem("token");
        setLoggedIn(false);
    }} />;
}

export default App
