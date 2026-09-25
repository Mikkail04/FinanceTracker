import { useEffect, useState } from "react";
import { getSummary, getTransactions, getSubscriptions } from "../api/api";
import CategoryChart from "../components/CategoryChart";
import MonthlyChart from "../components/MonthlyChart";
import TransactionsTable from "../components/TransactionsTable";
import AddTransaction from "../components/AddTransaction";
import { deleteTransaction } from "../api/api";
import { updateTransaction } from "../api/api";
import "./Dashboard.css";
import EditTransactionModal from "../components/EditTransactionModal";

export default function Dashboard({onLogout}) {
    const [summary, setSummary] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [editingTransaction, setEditingTransaction] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const s = await getSummary();
        const t = await getTransactions();
        const sub = await getSubscriptions();

        setSummary(s.data);
        setTransactions(
            [...t.data].sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            )
        );
        setSubscriptions(sub.data);
    };

    const [search, setSearch] = useState("");

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteTransaction(id);
            await loadData();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleEdit = async (tx) => {
        setEditingTransaction(tx)
    };

    const handleSaveEdit = async (updatedTx) => {
        await updateTransaction(updatedTx._id, {
            merchant: updatedTx.merchant,
            amount: updatedTx.amount,
        });

        setEditingTransaction(null);
        loadData();
    };

    if (!summary) return <div>Loading...</div>;

    console.log(transactions);
    const filteredTransactions = transactions.filter((tx) =>
        (tx.merchant || "")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="dashboard">
            <h1>Finance Dashboard</h1>

            <button className="logout-btn" onClick={onLogout}>
                Logout
            </button>

            <div className="summary-card">
                <h2>Total Spent</h2>
                <h1>${summary.total_spent}</h1>
            </div>

            <AddTransaction onAdd={loadData} />

            <h2>Category Breakdown</h2>
            <CategoryChart data={summary.category_breakdown} />

            <h2>Monthly Spending</h2>
            <MonthlyChart data={summary.monthly_breakdown} />

            <h2>Subscriptions</h2>
            {subscriptions.map((s, i) => (
                <div key={i}>
                    {s.merchant} — ${s.avg_amount} ({s.frequency})
                </div>
            ))}

            <input
                className="search-box"
                type="text"
                placeholder="Search Vendor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <h2>Transactions</h2>
            <TransactionsTable
                transactions={filteredTransactions}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />

            <EditTransactionModal
                transaction={editingTransaction}
                onSave={handleSaveEdit}
                onClose={() => setEditingTransaction(null)}
            />
        </div>
    );
}