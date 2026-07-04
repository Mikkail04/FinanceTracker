import { useEffect, useState } from "react";
import { getSummary, getTransactions, getSubscriptions } from "../api/api";
import CategoryChart from "../components/CategoryChart";
import MonthlyChart from "../components/MonthlyChart";
import TransactionsTable from "../components/TransactionsTable";
import AddTransaction from "../components/AddTransaction";
import { deleteTransaction } from "../api/api";
import { updateTransaction } from "../api/api";

export default function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);

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
        await deleteTransaction(id);
        loadData();
    };

    const handleEdit = async (tx) => {
        const newAmount = prompt("New amount:", tx.amount);
        const newMerchant = prompt("New vendor:", tx.merchant);

        await updateTransaction(tx._id, {
            amount: parseFloat(newAmount),
            merchant: newMerchant,
        });

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
        <div style={{ padding: "20px" }}>
            <h1>Finance Dashboard</h1>

            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    marginBottom: "20px",
                }}>
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
                type="text"
                placeholder="Search Vendor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    padding: "10px",
                    marginBottom: "15px",
                    width: "300px",
                }}
            />

            <h2>Transactions</h2>
            <TransactionsTable
                transactions={filteredTransactions}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
        </div>
    );
}