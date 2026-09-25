import { useState, useEffect } from "react";

export default function EditTransactionModal({
    transaction,
    onSave,
    onClose,
}) {
    const [merchant, setMerchant] = useState("");
    const [amount, setAmount] = useState("");

    useEffect(() => {
        if (transaction) {
            setMerchant(transaction.merchant || "");
            setAmount(transaction.amount || "");
        }
    }, [transaction]);

    if (!transaction) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        onSave({
            ...transaction,
            merchant,
            amount: parseFloat(amount),
        });
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2>Edit Transaction</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        value={merchant}
                        onChange={(e) =>
                            setMerchant(e.target.value)
                        }
                        placeholder="Merchant"
                    />

                    <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) =>
                            setAmount(e.target.value)
                        }
                        placeholder="Amount"
                    />

                    <div style={{ marginTop: "15px" }}>
                        <button type="submit">
                            Save
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            style={{ marginLeft: "10px" }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const modalStyle = {
    background: "#1f2937",
    padding: "25px",
    borderRadius: "12px",
    width: "400px",
};