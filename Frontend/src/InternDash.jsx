// pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import Profile from './components/Profile';
import Jobs from './components/Jobs';
import StudyMaterial from './components/StudyMaterial';
import VideoLectures from './components/VideoLectures';
import Classes from './components/Classes';
import Payments from './components/Payments';

const Dashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Add page transition effect
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [activePage]);

  const renderPage = () => {
    const pageContent = (() => {
      switch (activePage) {
        case 'dashboard':
          return <DashboardHome />;
        case 'profile':
          return <Profile />;
        case 'jobs':
          return <Jobs />;
        case 'study-material':
          return <StudyMaterial />;
        case 'video-lectures':
          return <VideoLectures />;
        case 'classes':
          return <Classes />;
        case 'payments':
          return <Payments />;
        default:
          return <DashboardHome />;
      }
    })();

    return (
      <div className={`transition-all duration-300 transform ${
        loading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}>
        {pageContent}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 overflow-hidden">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
        >
          <div className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
            mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
          }`}></div>
          <div className={`w-6 h-0.5 bg-gray-700 my-1.5 transition-all duration-300 ${
            mobileMenuOpen ? 'opacity-0' : 'opacity-100'
          }`}></div>
          <div className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
            mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
          }`}></div>
        </button>
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarCollapsed ? 'w-20' : 'w-64'}
      `}>
        <Sidebar 
          activePage={activePage} 
          setActivePage={setActivePage}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          onMobileItemClick={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className={`
        flex-1 transition-all duration-300
        ${sidebarCollapsed ? 'lg:ml-10' : 'lg:ml-10'}
        h-screen overflow-y-auto
      `}>
        {/* Animated Header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-200/60 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">I</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      {activePage === 'dashboard' && 'Dashboard Overview'}
                      {activePage === 'profile' && 'My Profile'}
                      {activePage === 'jobs' && 'Job Opportunities'}  
                      {activePage === 'study-material' && 'Study Materials'}
                      {activePage === 'video-lectures' && 'Video Lectures'}
                      {activePage === 'classes' && 'Live Classes'}
                      {activePage === 'payments' && 'Payments & Billing'}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                      {activePage === 'dashboard' && 'Welcome back! Here\'s your learning overview'}
                      {activePage === 'profile' && 'Manage your personal information and settings'}
                      {activePage === 'jobs' && 'Find your dream internship opportunities'}
                      {activePage === 'study-material' && 'Access comprehensive study resources'}
                      {activePage === 'video-lectures' && 'Watch and learn from expert instructors'}
                      {activePage === 'classes' && 'Join live interactive learning sessions'}
                      {activePage === 'payments' && 'Manage your subscription and payments'}
                    </p>
                  </div>
                </div>  
              </div>

              {/* User Profile & Notifications */}
            </div>
          </div>

          {/* Progress Bar for page loading */}
          {loading && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"></div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          {renderPage()}
        </main>

        {/* Footer */}
        <footer className="border-t border-black bg-white/50 backdrop-blur-sm mt-8">
          <div className="px-6 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-800">
                <span>© {new Date().getFullYear()} Graphura India Private Limited. All rights reserved.</span>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline">Built with ❤️ for aspiring interns</span>
              </div>
            </div>
          </div>
        </footer>
      </div>


      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;