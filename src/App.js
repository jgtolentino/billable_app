import React from 'react';
import TBWASMPreimbursementForm from './TBWASMPreimbursementForm';
import logo from './tbwa-logo.png';

function App() {
  return (
    <div className="App">
      <header>
        <img src={logo} alt="TBWA Logo" style={{ width: '100px', float: 'right' }} />
        <h1>TBWA\SMP Reimbursement Form</h1>
      </header>
      <TBWASMPreimbursementForm />
    </div>
  );
}

export default App;
