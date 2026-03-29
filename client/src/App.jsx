import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute, AdminRoute } from './components/guards/AuthGuards';
import { UserLayout } from './components/layout/UserLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { FeedbackForm } from './pages/FeedbackForm';
import { Overview } from './pages/admin/Overview';
import { FeedbackTable } from './pages/admin/FeedbackTable';
import { Questions } from './pages/admin/Questions';
import { Analytics } from './pages/admin/Analytics';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Protected */}
            <Route element={<ProtectedRoute />}>
              <Route element={<UserLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/feedback/new" element={<FeedbackForm />} />
              </Route>
            </Route>

            {/* Admin Protected */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Overview />} />
                <Route path="/admin/feedback" element={<FeedbackTable />} />
                <Route path="/admin/questions" element={<Questions />} />
                <Route path="/admin/analytics" element={<Analytics />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
