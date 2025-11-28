// components/Sidebar.js
import React from 'react';

const Sidebar = ({ activePage, setActivePage, collapsed, setCollapsed, onMobileItemClick }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', badge: null },
    { id: 'profile', label: 'Profile', icon: '👤', badge: null },
    { id: 'jobs', label: 'Jobs', icon: '💼', badge: '3' },
    { id: 'study-material', label: 'Study Material', icon: '📚', badge: 'New' },
    { id: 'video-lectures', label: 'Video Lectures', icon: '🎥', badge: null },
    { id: 'classes', label: 'Classes', icon: '👨‍🏫', badge: 'Live' },
    { id: 'payments', label: 'Payments', icon: '💰', badge: null },
  ];

  const handleItemClick = (pageId) => {
    setActivePage(pageId);
    if (onMobileItemClick) onMobileItemClick();
  };

  return (
    <div className="h-full bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">IC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">InternConnect</h1>
                <p className="text-gray-400 text-xs">Learn • Grow • Succeed</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <span className="text-white font-bold text-lg">IC</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
          >
            <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={`w-full flex items-center rounded-xl p-3 transition-all duration-200 group ${
              activePage === item.id
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-lg'
            } ${collapsed ? 'justify-center' : 'justify-start'}`}
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && (
              <>
                <span className="ml-3 font-medium flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.badge === 'Live' 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : item.badge === 'New'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </button>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-700/50">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">John Doe</p>
                <p className="text-gray-400 text-xs">Premium Plan</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-xs">JD</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;