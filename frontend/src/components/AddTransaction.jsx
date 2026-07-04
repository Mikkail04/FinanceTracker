import { useState } from "react";
import axios from "axios";

export default function AddTransaction({ onAdd }) {
    const [vendor, setVendor] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://127.0.0.1:8000/transactions", {
                user_id: "1",
                merchant: vendor,
                amount: parseFloat(amount),
                date: new Date(date).toISOString(),
            });
            onAdd(); // refresh dashboard

            setVendor("");
            setAmount("");
            setDate("");

            console.log("Created:", res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <h2>Add Transaction</h2>

            <input
                placeholder="Vendor (e.g. Netflix)"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                style={inputStyle}
            />

            <input
                placeholder="Amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={inputStyle}
            />

            <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={inputStyle}
            />

            <button type="submit" style={buttonStyle}>
                Add Transaction
            </button>
        </form>
    );
}

const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "15px",
    border: "1px solid #ddd",
    marginBottom: "20px",
};

const inputStyle = {
    padding: "10px",
};

const buttonStyle = {
    padding: "10px",
    cursor: "pointer",
};