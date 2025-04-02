import { Link } from 'react-router-dom';
import React from 'react';

export function Navbar() {
  return (
    <nav className="bg-[#1f2937] text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold text-white hover:text-blue-300 transition-colors"
        >
          GA-TIS Project
        </Link>
        <div className="space-x-6">
          <Link
            to="/"
            className="text-white hover:text-blue-300 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/model"
            className="text-white hover:text-blue-300 transition-colors"
          >
            Model
          </Link>
        </div>
      </div>
    </nav>
  );
}
