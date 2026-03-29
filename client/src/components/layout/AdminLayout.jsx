import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FullScreenLoader } from '../ui/Spinner';
import { LayoutDashboard, MessageSquare, HelpCircle, BarChart3, LogOut, Download } from 'lucide-react';

const AdminSidebar = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const links = [
    { to: '/admin', icon: <LayoutDashboard />, label: 'Overview' },
    { to: '/admin/feedback', icon: <MessageSquare />, label: 'All Feedback' },
    { to: '/admin/questions', icon: <HelpCircle />, label: 'Questions' },
    { to: '/admin/analytics', icon: <BarChart3 />, label: 'Analytics' }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden md:flex sticky top-0 h-screen">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <span className="text-2xl font-display font-bold text-primary-600 tracking-tight">Feedbak.</span>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.to || (link.to !== '/admin' && pathname.startsWith(link.to));
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors font-medium
                ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <div className={isActive ? 'text-primary-600' : 'text-gray-400'}>
                {React.cloneElement(link.icon, { className: 'w-5 h-5' })}
              </div>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-100 space-y-2">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 text-red-600 hover:bg-red-50 p-2.5 rounded-lg transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export const AdminLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-40">
          <span className="text-xl font-display font-bold text-primary-600 tracking-tight">Feedbak. Admin</span>
        </div>
        
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
