import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home'; // Adjust if necessary based on the folder structure
import Register from './components/Register/Register'; // Same for Register component
import Dashboard from './components/TaskDashboard/TaskDashboard'; // Same for Dashboard component

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home page with login form */}
        <Route path="/" element={<Home />} />

        {/* Register page */}
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Ensure this exists */}
      </Routes>
    </Router>
  );
};

export default App;
