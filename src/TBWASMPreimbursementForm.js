import React, { useState } from 'react';

const TBWASMPreimbursementForm = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    id: expenses.length + 1,
    date: '',
    category: '',
    amount: 0,
    description: '',
  });
  const [receipt, setReceipt] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [error, setError] = useState(null);

  const categories = ['Food', 'Transportation', 'Accommodation', 'Miscellaneous'];

  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'application/pdf')) {
      setReceipt(file);
      const reader = new FileReader();
      reader.onload = (event) => setReceiptPreview(event.target.result);
      reader.readAsDataURL(file);
    } else {
      setError('Please upload a valid PNG, JPEG, or PDF file.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (receipt) {
      const formData = new FormData();
      formData.append('receipt', receipt);
      fetch('/api/upload', { method: 'POST', body: formData })
        .then((res) => res.json())
        .then((data) => {
          const extractedData = {
            date: data.date,
            category: data.category,
            amount: data.amount,
            description: data.description,
          };
          setNewExpense({ ...newExpense, ...extractedData });
          setExpenses([...expenses, { ...newExpense, ...extractedData }]);
        })
        .catch(() => setError('File upload failed. Please try again.'));
    }
  };

  const handleDelete = (id) => setExpenses(expenses.filter((expense) => expense.id !== id));

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100">
      <header className="flex justify-between items-center mb-6">
        <img src="/tbwa-logo.png" alt="TBWA Logo" className="h-12" />
        <h1 className="text-4xl font-bold text-yellow-600">TBWA\SMP Reimbursement Form</h1>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Upload Receipt:</label>
          <input
            type="file"
            onChange={handleReceiptChange}
            className="w-full px-3 py-2 text-gray-700 border rounded"
          />
          {receiptPreview && <img src={receiptPreview} alt="Receipt" className="mt-4 max-w-xs" />}
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Submit Receipt
        </button>
      </form>

      <section className="mt-8">
        <h2 className="text-3xl font-semibold mb-4">Expenses</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left bg-yellow-600 text-white">Date</th>
              <th className="px-4 py-2 text-left bg-yellow-600 text-white">Category</th>
              <th className="px-4 py-2 text-left bg-yellow-600 text-white">Amount</th>
              <th className="px-4 py-2 text-left bg-yellow-600 text-white">Description</th>
              <th className="px-4 py-2 text-left bg-yellow-600 text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td className="px-4 py-2 border">{expense.date}</td>
                <td className="px-4 py-2 border">{expense.category}</td>
                <td className="px-4 py-2 border">{expense.amount}</td>
                <td className="px-4 py-2 border">{expense.description}</td>
                <td className="px-4 py-2 border">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                    onClick={() => handleDelete(expense.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default TBWASMPreimbursementForm;
