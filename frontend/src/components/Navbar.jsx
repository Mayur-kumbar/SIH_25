import React from 'react'
import { Home, Upload, Eye, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Navbar = ({ setUploadOpen }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center shadow">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              Smart Student Hub
            </span>
          </div>
          {/* Navigation Buttons */}
          <div className="flex items-center space-x-2">
            <button
              className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition"
              onClick={() => navigate('/studentDashboard')}
            >
              <Home size={20} className="mr-1" />
              <span className="text-sm font-medium">Dashboard</span>
            </button>
            <button
              className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition"
              onClick={() => setUploadOpen(true)}
            >
              <Upload size={20} className="mr-1" />
              <span className="text-sm font-medium">Upload Achievement</span>
            </button>
            <button
              className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition"
              onClick={() => navigate('/profile')}
            >
              <Eye size={20} className="mr-1" />
              <span className="text-sm font-medium">My Profile</span>
            </button>
            
              <button
                className="ml-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/signin");
                }}
              >
                Logout
              </button>
            
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar