import React from 'react';
import UserDashboard from './UserDashboard';
import Leaderboard from './Leaderboard';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>

      <UserDashboard />

      <Leaderboard isAdminMode={true} />

      {/* Add any additional functionalities for the admin dashboard */}
    </div>
  );
};

export default AdminDashboard;

