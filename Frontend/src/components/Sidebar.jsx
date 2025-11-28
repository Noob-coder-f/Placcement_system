// components/Sidebar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  BookOpen, 
  Video, 
  Users, 
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
  Bell,
  HelpCircle
} from 'lucide-react';

const Sidebar = ({ activePage, setActivePage, collapsed, setCollapsed, onMobileItemClick }) => {
  const [userData, setUserData] = useState({
    name: 'Loading...',
    profileImage: null,
    plan: 'Free Plan'
  });

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'profile', label: 'Profile', icon: User, badge: null },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, badge: '3' },
    { id: 'study-material', label: 'Study Material', icon: BookOpen, badge: 'New' },
    { id: 'video-lectures', label: 'Video Lectures', icon: Video, badge: null },
    { id: 'classes', label: 'Classes', icon: Users, badge: 'Live' },
    { id: 'payments', label: 'Payments', icon: CreditCard, badge: null }
  ];

  /* =======================
     🔐 AUTH CHECK
  ======================= */
  const checkAuth = () => {
    const token = localStorage.getItem('interToken');
    if (!token) {
      window.location.replace('/intern-login');
      return false;
    }
    return true;
  };

  /* =======================
     🚪 LOGOUT
  ======================= */
  const handleLogout = () => {
    localStorage.removeItem('interToken');
    sessionStorage.clear();
    window.location.replace('/intern-login');
  };

  /* =======================
     👤 FETCH PROFILE
  ======================= */
  const fetchUserProfile = async () => {
    try {
      if (!checkAuth()) return;

      const token = localStorage.getItem('interToken');

      const response = await axios.get('/api/intern/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response.data;

      setUserData({
        name: data.name || data.fullName || 'User',
        profileImage: data.profileImage || data.avatar || null,
        plan: data.planCategory || 'Free Plan'
      });
    } catch (error) {
      console.error('Profile fetch error:', error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    }
  };

  /* =======================
     🧠 INITIALS
  ======================= */
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  /* =======================
     🔄 EFFECT
  ======================= */
  useEffect(() => {
    checkAuth();
    fetchUserProfile();
  }, []);

  const handleItemClick = (pageId) => {
    setActivePage(pageId);
    if (onMobileItemClick) onMobileItemClick();
  };

  const getPlanColor = (plan) => {
    const colors = {
      'Premium': 'from-purple-500 to-pink-500',
      'Pro': 'from-blue-500 to-cyan-500',
      'Basic': 'from-green-500 to-emerald-500',
      'Free Plan': 'from-gray-500 to-gray-600'
    };
    return colors[plan] || colors['Free Plan'];
  };

  return (
    <div className="h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col shadow-2xl border-r border-slate-700/50 relative">

      {/* LOGO SECTION */}
      <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-900/80">
        <div className="flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img src="/Graphura.jpg" alt="Graphura" className="w-10 h-10 rounded-2xl shadow-lg border border-slate-600" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-800"></div>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Intern Portal
                </h1>
                <p className="text-xs text-slate-400 font-medium">Learn • Grow • Succeed</p>
              </div>
            </div>
          ) : (
            <div className="relative mx-auto">
              <img src="/Graphura.jpg" alt="Graphura" className="w-12 h-12 rounded-2xl shadow-lg border border-slate-600" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800"></div>
            </div>
          )}

          {/* COLLAPSE BUTTON */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activePage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-400 shadow-lg shadow-blue-500/10 border border-blue-500/20'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:shadow-lg'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-r-full shadow-lg shadow-blue-400/50"></div>
              )}
              
              <div className={`relative ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'} transition-colors`}>
                <IconComponent size={20} />
              </div>
              
              {!collapsed && (
                <>
                  <span className="ml-3 flex-1 text-left font-medium text-sm">{item.label}</span>
                  {item.badge && (
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
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

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 border border-slate-700">
                  {item.label}
                  {item.badge && ` • ${item.badge}`}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-4 border-t border-slate-700/50 bg-gradient-to-t from-slate-800 to-slate-900/80">
        {!collapsed ? (
          <div className="space-y-4">
            {/* USER INFO */}
            <div 
              className="flex items-center space-x-3 p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 cursor-pointer transition-all duration-300 group"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-slate-600">
                  {userData.profileImage ? (
                    <img src={userData.profileImage} alt="profile" className="rounded-full w-full h-full object-cover" />
                  ) : (
                    getInitials(userData.name)
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-slate-800 shadow-lg"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{userData.name}</p>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getPlanColor(userData.plan)} text-white mt-1 shadow-lg`}>
                  {userData.plan}
                </div>
              </div>
            </div>

            {/* LOGOUT BUTTON */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center p-3 rounded-xl text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 group border border-transparent hover:border-red-500/30"
            >
              <LogOut size={20} className="text-slate-400 group-hover:text-red-400" />
              <span className="ml-3 font-medium text-sm">Logout</span>
            </button>
          </div>
        ) : (
          // Collapsed user section
          <div className="space-y-3">
            <div className="relative flex justify-center">
              <div 
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-slate-600 cursor-pointer"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {userData.profileImage ? (
                  <img src={userData.profileImage} alt="profile" className="rounded-full w-full h-full object-cover" />
                ) : (
                  getInitials(userData.name)
                )}
              </div>
              
              {/* Tooltip for user */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-sm rounded-lg shadow-xl opacity-0 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 border border-slate-700">
                {userData.name}
                <div className={`text-xs mt-1 px-1 rounded bg-gradient-to-r ${getPlanColor(userData.plan)}`}>
                  {userData.plan}
                </div>
              </div>
            </div>

            {/* Logout button for collapsed state */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center p-3 rounded-xl text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 group relative"
            >
              <LogOut size={20} />
              {/* Tooltip for logout */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 border border-slate-700">
                Logout
              </div>
            </button>
          </div>
        )}
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-700 max-w-sm w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut size={24} className="text-red-400" />
              </div>
              <h3 className="text-white text-lg font-bold mb-2">Confirm Logout</h3>
              <p className="text-slate-400 text-sm">Are you sure you want to logout from your account?</p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutConfirm(false)} 
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout} 
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;