import React, { useState } from 'react';

const TBWASMPreimbursementForm = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    id: expenses.length + 1,
    date: '',
    category: 'Miscellaneous',
    amount: 0,
    description: 'Uploaded receipt',
  });
  const [receipt, setReceipt] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);

  const handleReceiptChange = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setReceipt(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          setReceiptPreview(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Invalid file type. Please upload a PDF or image.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (receipt) {
      const formData = new FormData();
      formData.append('receipt', receipt);
      // Mock extract data (replace with actual server response)
      const mockExtractedData = {
        date: '2024-10-22',
        category: 'Miscellaneous',
        amount: 100,
        description: 'Uploaded receipt',
      };
      setExtractedData(mockExtractedData);
      setNewExpense({ ...newExpense, ...mockExtractedData });
      setExpenses([...expenses, { ...newExpense, ...mockExtractedData }]);
    } else {
      setError('Please upload a valid receipt.');
    }
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label>Upload Receipt:</label>
          <input type="file" onChange={handleReceiptChange} />
        </div>
        {receiptPreview && (
          <div>
            <h3>Receipt Preview</h3>
            <img src={receiptPreview} alt="Receipt Preview" style={{ width: '100px' }} />
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Upload Receipt
        </button>
      </form>
      
      {extractedData && (
        <div>
          <h3>Extracted Information:</h3>
          <p>Date: {extractedData.date}</p>
          <p>Category: {extractedData.category}</p>
          <p>Amount: {extractedData.amount}</p>
          <p>Description: {extractedData.description}</p>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Expenses</h2>
      <table className="w-full">
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
                <button onClick={() => handleDelete(expense.id)} className="bg-red-500 text-white px-4 py-2">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TBWASMPreimbursementForm;
