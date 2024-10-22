import React from 'react';
import TBWASMPreimbursementForm from './TBWASMPreimbursementForm';

function App() {
  return (
    <div className="App">
      <header style={{ textAlign: 'center', padding: '20px' }}>
        <img
          src="/public/tbwa-logo.png"  // Updated file name for the logo
          alt="TBWA Logo"
          style={{ width: '150px', marginBottom: '20px' }}
        />
        <h1>TBWA\SMP Reimbursement Form</h1>
      </header>
      <main>
        <TBWASMPreimbursementForm />
      </main>
    </div>
  );
}

export default App;
