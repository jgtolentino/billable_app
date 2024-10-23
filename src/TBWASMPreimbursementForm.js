return (
  <div className="max-w-4xl mx-auto p-4">
    <h1 className="text-3xl font-bold mb-4">TBWA\SMP Reimbursement Form</h1> {/* Only one header here */}
    <form onSubmit={handleSubmit} className="mb-4">
      <label htmlFor="receipt">Upload Receipt:</label>
      <input type="file" onChange={handleReceiptChange} />
      {receiptPreview && (
        <div>
          <h3>Receipt Preview</h3>
          <img src={receiptPreview} alt="Receipt Preview" className="receipt-preview" />
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit">Upload Receipt</button>
    </form>

    {extractedInfo && (
      <div>
        <h2>Extracted Information:</h2>
        <p>Date: {extractedInfo.date}</p>
        <p>Category: {extractedInfo.category}</p>
        <p>Amount: {extractedInfo.amount}</p>
        <p>Description: {extractedInfo.description}</p>
      </div>
    )}

    <h2>Expenses</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => (
          <tr key={expense.id}>
            <td>{expense.date}</td>
            <td>{expense.category}</td>
            <td>{expense.amount}</td>
            <td>{expense.description}</td>
            <td>
              <button onClick={() => handleDelete(expense.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
