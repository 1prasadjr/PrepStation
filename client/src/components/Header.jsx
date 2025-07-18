import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Home, Brain, FileText, Settings, Upload } from 'lucide-react';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/predictor', label: 'Predictor', icon: Brain },
    { path: '/assistant', label: 'AI Assistant', icon: FileText },
    { path: '/profile', label: 'Profile', icon: Settings }
  ];

  return (
    <header className="sticky top-0 z-40 bg-black bg-opacity-90 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-2xl font-bold text-white hover:text-purple-400 transition-colors">
              PrepStation
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                      location.pathname === path
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </Link>
                ))}
                {/* Admin Upload Link */}
                {user?.isAdmin && (
                  <Link
                    to="/admin/upload"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                      location.pathname === '/admin/upload'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                        : 'text-purple-400 hover:text-white hover:bg-purple-700'
                    }`}
                  >
                    <Upload size={18} />
                    <span>Upload Paper</span>
                  </Link>
                )}
                <div className="flex items-center space-x-4 ml-4">
                  <div className="flex items-center space-x-2">
                    <User size={20} className="text-purple-400" />
                    <span className="text-white">{user?.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-white hover:text-purple-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/50"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className="w-full h-0.5 bg-white mb-1"></span>
              <span className="w-full h-0.5 bg-white mb-1"></span>
              <span className="w-full h-0.5 bg-white"></span>
            </div>
          </button>
        </div>
      </div>
      
      {/* Glowing bottom border */}
      <div className="h-0.5 bg-gradient-to-r from-purple-500 to-red-500 shadow-lg shadow-purple-500/50"></div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black bg-opacity-95 z-50 flex flex-col items-center py-4">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 w-full text-center ${
                location.pathname === path
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
          {user?.isAdmin && (
            <Link
              to="/admin/upload"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 w-full text-center ${
                location.pathname === '/admin/upload'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                  : 'text-purple-400 hover:text-white hover:bg-purple-700'
              }`}
            >
              <Upload size={18} />
              <span>Upload Paper</span>
            </Link>
          )}
          <div className="flex items-center space-x-4 w-full mt-4">
            <div className="flex items-center space-x-2 w-full text-center">
              <User size={20} className="text-purple-400" />
              <span className="text-white">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;