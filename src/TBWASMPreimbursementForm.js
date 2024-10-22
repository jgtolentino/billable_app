import React, { useState } from 'react';
import './App.css'; // Ensure this path is correct for your CSS file

const TBWASMPreimbursementForm = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    id: expenses.length + 1,
    date: '',
    category: 'Miscellaneous',
    amount: 0,
    description: '',
  });
  const [receipt, setReceipt] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [error, setError] = useState(null);
  const [extractedInfo, setExtractedInfo] = useState(null);

  const handleReceiptChange = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'application/pdf') {
        setReceipt(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          setReceiptPreview(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Invalid file type. Please upload a PNG, JPEG, or PDF file.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (receipt) {
      const formData = new FormData();
      formData.append('receipt', receipt);
      
      fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          const extractedData = {
            date: 'Extracted Date', // You should parse the date from data.text
            category: 'Extracted Category', // You can implement parsing logic
            amount: 100, // Update with actual extracted amount
            description: data.text,
          };

          setExtractedInfo(extractedData);
          setExpenses([...expenses, { ...newExpense, ...extractedData }]);
        })
        .catch((error) => {
          setError('Error uploading file. Please try again.');
        });
    } else {
      setError('Please upload a valid receipt.');
    }
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">TBWA\SMP Reimbursement Form</h1>
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
};

export default TBWASMPreimbursementForm;
