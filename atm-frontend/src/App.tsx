import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import PinEntry from './pages/PinEntry';
import Operations from './pages/Operations';
import Balance from './pages/Balance';
import Withdraw from './pages/Withdraw';
import TransactionReport from './pages/TransactionReport';
import Error from './pages/Error';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pin" element={<PinEntry />} />
          <Route path="/operations" element={<Operations />} />
          <Route path="/balance" element={<Balance />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/transaction-report" element={<TransactionReport />} />
          <Route path="/error" element={<Error />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
