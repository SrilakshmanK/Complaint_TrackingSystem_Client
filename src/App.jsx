import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminComplaints from './pages/admin/Complaints';
import AdminUsers from './pages/admin/Users';
import AdminMasterData from './pages/admin/MasterData';
import AdminReport from './pages/admin/Report';

// Staff
import StaffDashboard from './pages/staff/StaffDashboard';

// Student
import MyComplaints from './pages/student/MyComplaints';
import NewComplaint from './pages/student/NewComplaint';

const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <main>{children}</main>
  </div>
);

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          user
            ? (() => {
                const role = user?.role || '';
                if (role === 'Super Admin') return <Navigate to="/admin/dashboard" replace />;
                if (role === 'Student' || role === 'User') return <Navigate to="/student/complaints" replace />;
                return <Navigate to="/staff/complaints" replace />;
              })()
            : <Landing />
        }
      />
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={['Super Admin']} />}>
        <Route path="/admin/dashboard" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/admin/complaints" element={<Layout><AdminComplaints /></Layout>} />
        <Route path="/admin/users" element={<Layout><AdminUsers /></Layout>} />
        <Route path="/admin/master-data" element={<Layout><AdminMasterData /></Layout>} />
        <Route path="/admin/report" element={<Layout><AdminReport /></Layout>} />
      </Route>

      {/* Staff routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/staff/complaints" element={<Layout><StaffDashboard /></Layout>} />
      </Route>

      {/* Student routes — 'User' is the same as 'Student' in this system */}
      <Route element={<ProtectedRoute allowedRoles={['Student', 'User']} />}>
        <Route path="/student/complaints" element={<Layout><MyComplaints /></Layout>} />
        <Route path="/student/new-complaint" element={<Layout><NewComplaint /></Layout>} />
      </Route>

      {/* Default redirect */}
      <Route
        path="*"
        element={
          user
            ? (() => {
                const role = user?.role || '';
                if (role === 'Super Admin') return <Navigate to="/admin/dashboard" replace />;
                if (role === 'Student' || role === 'User') return <Navigate to="/student/complaints" replace />;
                return <Navigate to="/staff/complaints" replace />;
              })()
            : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
};

export default App;
