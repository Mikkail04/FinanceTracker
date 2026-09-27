import { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get("/admin/stats");
            setStats(res.data);
        } catch (err) {
            console.error("Failed to load admin stats", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading admin stats...</p>;
    }

    if (!stats) {
        return <p>Unable to load admin stats.</p>;
    }

    return (
        <div style={containerStyle}>
            <button
                onClick={() => {
                    window.location.href = "/";
                }}
                style={backButtonStyle}
            >
                ← Back to Dashboard
            </button>

            <h1>Admin Dashboard</h1>

            <div style={gridStyle}>
                <div style={cardStyle}>
                    <h3>Total Users</h3>
                    <p style={numberStyle}>{stats.total_users}</p>
                </div>

                <div style={cardStyle}>
                    <h3>Total Transactions</h3>
                    <p style={numberStyle}>{stats.total_transactions}</p>
                </div>

                <div style={cardStyle}>
                    <h3>Active Users (7 Days)</h3>
                    <p style={numberStyle}>{stats.active_users_7d}</p>
                </div>

                <div style={cardStyle}>
                    <h3>Subscriptions Detected</h3>
                    <p style={numberStyle}>{stats.subscriptions_detected}</p>
                </div>
            </div>
        </div>
    );
}

const containerStyle = {
    padding: "20px",
};

const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
};

const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

const numberStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    margin: "10px 0 0 0",
};

const backButtonStyle = {
    padding: "10px 16px",
    marginBottom: "20px",
    cursor: "pointer",
    border: "1px solid #ccc",
    borderRadius: "6px",
    background: "#f5f5f5",
    color: "#000",
    fontSize: "16px",
};