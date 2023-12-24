// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import Leaderboard from './components/Leaderboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/user_dashboard" component={UserDashboard} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/admin_dashboard" component={AdminDashboard} />
        {/* Add more routes as needed */}
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  );
}

export default App;

