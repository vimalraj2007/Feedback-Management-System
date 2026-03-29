import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/'} className="flex items-center">
              <span className="text-2xl font-display font-bold text-primary-600 tracking-tight">Feedbak.</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link to="/login" className="text-gray-500 hover:text-gray-900 font-medium px-3 py-2 rounded-md transition-colors">Log in</Link>
                <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm">Get Started</Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 hidden sm:inline-block">Welcome, <span className="text-gray-900 font-medium">{user.name}</span></span>
                <button
                  onClick={logout}
                  className="flex items-center text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-colors"
                >
                  <LogOut className="w-5 h-5 sm:mr-2" />
                  <span className="hidden sm:inline-block">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
