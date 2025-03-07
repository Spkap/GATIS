import { Link, useNavigate } from 'react-router-dom';
import React from 'react';

export function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <nav className="bg-[#1f2937] text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white hover:text-blue-300 transition-colors">
          GA-TIS Project
        </Link>
        <div className="space-x-6">
          <Link
            to="/"
            className="text-white hover:text-blue-300 transition-colors"
          >
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/model"
                className="text-white hover:text-blue-300 transition-colors"
              >
                Model
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-blue-300 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:text-blue-300 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-white hover:text-blue-300 transition-colors"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}