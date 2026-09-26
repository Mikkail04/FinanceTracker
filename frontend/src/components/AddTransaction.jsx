import { useState } from "react";
import api from "../api/api"

export default function AddTransaction({ onAdd }) {
    const [vendor, setVendor] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [dateInput, setDateInput] = useState("");
    const [datePicker, setDatePicker] = useState("");
    const [dateError, setDateError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDateError("");

        try {
            let chosenDate;

if (dateInput) {
    const parts = dateInput.split("/");

    if (parts.length !== 3) {
        setDateError("Please enter the date as MM/DD/YYYY.");
        return;
    }

    const [month, day, year] = parts.map(Number);

    const testDate = new Date(year, month - 1, day);

    if (
        isNaN(testDate.getTime()) ||
        testDate.getFullYear() !== year ||
        testDate.getMonth() !== month - 1 ||
        testDate.getDate() !== day
    ) {
        setDateError("Please enter a valid date.");
        return;
    }

    chosenDate = testDate.toISOString();
} else if (datePicker) {
    chosenDate = new Date(datePicker).toISOString();
} else {
    setDateError("Please enter a date.");
    return;
}

            const res = await api.post("/transactions", {
                merchant: vendor,
                amount: parseFloat(amount),
                date: chosenDate,
                category: category || null,
            });
            onAdd(); // refresh dashboard

            setVendor("");
            setAmount("");
            setDateInput("");
            setDatePicker("");
            setCategory("");

            console.log("Created:", res.data);
            alert("Transaction added successfully!");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <h2>Add Transaction</h2>

            <label> Vendor </label>
            <input
                placeholder="Vendor (e.g. Netflix)"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                style={inputStyle}
            />

            <label> Amount </label>
            <input
                placeholder="Amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={inputStyle}
            />

            <label>Date</label>

<div
    style={{
        display: "flex",
        gap: "10px",
        width: "100%",
    }}
>
    <input
        type="text"
        placeholder="MM/DD/YYYY"
        value={dateInput}
        onChange={(e) => {
            setDateInput(e.target.value) 
            setDatePicker("")}
        }
        style={{
            ...inputStyle,
            flex: 1,
            width: "100%",
            boxSizing: "border-box",
        }}
    />

    <input
        type="date"
        value={datePicker}
        onChange={(e) => {
            setDatePicker(e.target.value);
            setDateInput(e.target.value);
        }}
        style={{
            ...inputStyle,
            flex: 1,
            width: "100%",
            boxSizing: "border-box",
        }}
    />
</div>

{dateError && (
    <p style={{ color: "#ef4444", margin: "0" }}>
        {dateError}
    </p>
)}

            <label> Category </label>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={inputStyle}
            >
                <option value="">Auto Detect</option>
                <option value="Food">Food</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Transportation">Transportation</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
            </select>

            <button type="submit" style={buttonStyle}>
                Add Transaction
            </button>
        </form >
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