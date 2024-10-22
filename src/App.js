import React from 'react';
import TBWASMPreimbursementForm from './TBWASMPreimbursementForm';
import './App.css'; // Ensure you have your styles in App.css

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="/tbwa-logo.png" alt="TBWA Logo" className="tbwa-logo" />
        <h1>TBWA\SMP Reimbursement Form</h1>
      </header>
      <TBWASMPreimbursementForm />
    </div>
  );
}

export default App;
