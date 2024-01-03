import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import Leaderboard from './components/Leaderboard';
import AdminDashboard from './components/AdminDashboard';
import PendingTransactions from './components/PendingTransactions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/user_dashboard' element={<UserDashboard />} />
        <Route path='/leaderboard' element={<Leaderboard />} />
        <Route path='/admin_dashboard' element={<AdminDashboard />} />
        <Route path='/' element={<Navigate to='/login' replace />} />
        {/* Add more routes as needed */}
      </Routes>
      {/* <Navigate from='/' to='/login' /> */}
    </Router>
  );
}

export default App;

