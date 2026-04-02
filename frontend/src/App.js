import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminCategories from './pages/AdminCategories';
import CreateService from './pages/CreateService';

// Pages
import AdminUsers from './pages/AdminUsers';
import AdminBookings from './pages/AdminBookings';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ServiceList from './pages/ServiceList';
import ServiceDetail from './pages/ServiceDetail';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            {/* Public */}
            <Route path="/admin/users" element={
              <PrivateRoute roles={['ADMIN']}><AdminUsers /></PrivateRoute>
            } />

            <Route path="/admin/bookings" element={
              <PrivateRoute roles={['ADMIN']}><AdminBookings /></PrivateRoute>
            } />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/services" element={<ServiceList />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/admin/categories" element={
              <PrivateRoute roles={['ADMIN']}><AdminCategories /></PrivateRoute>
            } />
            <Route path="/services/new" element={
              <PrivateRoute roles={['PROVIDER']}><CreateService /></PrivateRoute>
            } />

            {/* Client */}
            <Route path="/bookings/new" element={
              <PrivateRoute roles={['CLIENT']}><BookingForm /></PrivateRoute>
            } />
            <Route path="/bookings" element={
              <PrivateRoute><MyBookings /></PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute><Profile /></PrivateRoute>
            } />

            {/* Provider */}
            <Route path="/provider/dashboard" element={
              <PrivateRoute roles={['PROVIDER']}><ProviderDashboard /></PrivateRoute>
            } />

            {/* Admin */}
            <Route path="/admin/dashboard" element={
              <PrivateRoute roles={['ADMIN']}><AdminDashboard /></PrivateRoute>
            } />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;