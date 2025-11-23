// components/Sidebar.js
import React from 'react';

const Sidebar = ({ activePage, setActivePage }) => {
  const navigation = [
    { name: 'Dashboard', key: 'dashboard', icon: '📊' },
    { name: 'Profile', key: 'profile', icon: '👤' },
    { name: 'Jobs', key: 'jobs', icon: '💼' },
    { name: 'Study Material', key: 'study-material', icon: '📚' },
    { name: 'Video Lectures', key: 'video-lectures', icon: '🎥' },
    { name: 'Classes', key: 'classes', icon: '🏫' },
    { name: 'Payments', key: 'payments', icon: '💳' },
  ];

  const isActive = (key) => activePage === key;

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 bg-blue-600 text-white">
        <h1 className="text-xl font-bold">InternHub</h1>
      </div>

      {/* Navigation */}
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.key}
              onClick={() => setActivePage(item.key)}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.key)
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </div>
      </nav>

      {/* User Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center">
          <img
            className="h-8 w-8 rounded-full object-cover"
            src="/default-avatar.png"
            alt="Profile"
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">John Doe</p>
            <p className="text-xs text-gray-500">FREE Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;