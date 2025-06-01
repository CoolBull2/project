import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Issues from './pages/Issues';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 ml-64">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;