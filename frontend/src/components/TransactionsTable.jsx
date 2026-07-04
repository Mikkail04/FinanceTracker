export default function TransactionsTable({ transactions, onEdit, onDelete }) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px",
      }}
    >
      <thead>
        <tr>
          <th style={cellStyle}>Vendor</th>
          <th style={cellStyle}>Amount</th>
          <th style={cellStyle}>Category</th>
          <th style={cellStyle}>Date</th>
          <th>Actions</th>
          <td>
          </td>
        </tr>
      </thead>

      <tbody>
        {transactions.map((tx) => (
          <tr key={tx._id}>
            <td style={cellStyle}>{tx.merchant}</td>
            <td style={cellStyle}>${tx.amount}</td>
            <td style={cellStyle}>{tx.category}</td>
            <td style={cellStyle}>
              {new Date(tx.date).toLocaleDateString()}
            </td>
            
            <button onClick={() => onEdit(tx)}>
              Edit
            </button>
            <button onClick={() => onDelete(tx._id)}>
              Delete
            </button>
            
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const cellStyle = {
  border: "1px solid #ddd",
  padding: "12px",
  textAlign: "left",
};