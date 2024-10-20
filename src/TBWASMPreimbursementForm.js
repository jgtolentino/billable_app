import React, { useState } from 'react';

interface Expense {
  id: number;
  date: string;
  category: string;
  amount: number;
  description: string;
}

const categories = ['Food', 'Transportation', 'Accommodation', 'Miscellaneous'];

const TBWASMPreimbursementForm = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState<Expense>({
    id: expenses.length + 1,
    date: '',
    category: '',
    amount: 0,
    description: '',
  });
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'application/pdf') {
        setReceipt(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target) {
            setReceiptPreview(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      } else {
        setError('Invalid file type. Please upload a PNG, JPEG, or PDF file.');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (receipt) {
      const formData = new FormData();
      formData.append('receipt', receipt);
      // Send the form data to the server for processing
      fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // Extract the necessary data from the response
          const extractedData = {
            date: data.date,
            category: data.category,
            amount: data.amount,
            description: data.description,
          };
          setNewExpense({ ...newExpense, ...extractedData });
          setExpenses([...expenses, { ...newExpense, ...extractedData }]);
        })
        .catch((error) => {
          setError('Error uploading file. Please try again.');
        });
    }
  };

  const handleDelete = (id: number) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">TBWA\SMP Reimbursement Form</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="receipt">
              Receipt
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="receipt"
              type="file"
              onChange={handleReceiptChange}
            />
          </div>
        </div>
        {receiptPreview && (
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <img src={receiptPreview} alt="Receipt Preview" />
            </div>
          </div>
        )}
        {error && (
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        )}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Upload Receipt
        </button>
      </form>
      <h2 className="text-2xl font-bold mb-4">Expenses</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td className="px-4 py-2">{expense.date}</td>
              <td className="px-4 py-2">{expense.category}</td>
              <td className="px-4 py-2">{expense.amount}</td>
              <td className="px-4 py-2">{expense.description}</td>
              <td className="px-4 py-2">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleDelete(expense.id)}
                >
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