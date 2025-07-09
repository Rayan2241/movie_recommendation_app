"use client"

import React from 'react'
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-700 text-white flex-shrink-0 shadow-lg flex flex-col items-center">
  {/* Header */}
  <div className="h-16 flex items-center justify-center border-b border-indigo-800 w-full">
    <h1 className="text-3xl font-semibold text-center">MOVIE RECOMMENDATION APP</h1>
  </div>

</div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="text-3xl font-semibold text-gray-900">
            Welcome, {user?.name},Have a nice day!
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md shadow-md"
          >
            Logout
          </button>
        </header>

        {/* Profile Overview */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">User Details</h3>
          <div className="text-lg space-y-2">
            <p><span className="font-semibold">Full Name:</span> {user?.name}</p>
            <p><span className="font-semibold">Email Address:</span> {user?.email}</p>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
