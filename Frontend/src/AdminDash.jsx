import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Video,
  Briefcase,
  Shield,
  CreditCard,
  Settings,
  Menu,
  Home,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import admin pages
import AdminUsers from "./AdminPages/AdminUsers";
import AdminCourses from "./AdminPages/AdminCourses.jsx";
import AdminMaterials from "./AdminPages/AdminMaterials.jsx";
import AdminVideos from "./AdminPages/AdminVideos";
import AdminJobs from "./AdminPages/AdminJobs.jsx";
import AdminAccess from "./AdminPages/AdminAccess";
import AdminPayments from "./AdminPages/AdminPayments";
import AdminDashboardHome from "./AdminPages/dminHomeDashboard.jsx"

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // ============================
  // LOGOUT FUNCTION
  // ============================
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  // ============================
  // BACK TO HOME
  // ============================
  const handleBackToHome = () => {
    navigate("/");
  };

  // ============================
  // PAGE RENDERING
  // ============================
  const renderPage = () => {
    switch (activePage) {  
      case "users":
        return <AdminUsers />;
      case "courses":
        return <AdminCourses />;
      case "materials":
        return <AdminMaterials />;
      case "videos":
        return <AdminVideos />;
      case "jobs":
        return <AdminJobs />;
      case "payments":
        return <AdminPayments />;
      default:
        case "Dashboard":
        return <AdminDashboardHome />;
    }
  };

  // ============================
  // ADMIN SIDEBAR MENU
  // ============================
  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "text-blue-500" },
    { key: "users", label: "Users", icon: Users, color: "text-indigo-500" },
    { key: "courses", label: "Courses", icon: BookOpen, color: "text-green-500" },
    { key: "materials", label: "Study Materials", icon: BookOpen, color: "text-red-500" },
    { key: "videos", label: "Video Library", icon: Video, color: "text-purple-500" },
    { key: "jobs", label: "Jobs", icon: Briefcase, color: "text-yellow-500" },
    // { key: "access", label: "Access Control", icon: Shield, color: "text-blue-300" },
    { key: "payments", label: "Payments", icon: CreditCard, color: "text-orange-500" },
    { key: "settings", label: "System Settings", icon: Settings, color: "text-gray-300" },
  ];

  // ============================
  // SIDEBAR COMPONENT
  // ============================
  const Sidebar = () => {
    return (
      <div className="w-64 bg-gray-800 text-white flex flex-col h-full">

        {/* Sidebar Header */}
        <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600">
          <h1 className="font-bold text-lg">Admin Panel</h1>
          <p className="text-xs text-purple-100">Platform Management</p>
        </div>

        {/* Menu Buttons */}
        <nav className="flex-1 p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`w-full flex items-center p-3 rounded-lg mb-1 ${
                  activePage === item.key ? `bg-white bg-opacity-10 ${item.color}` : `hover:bg-white/5 text-white`
                }`}
                onClick={() => {
                  setActivePage(item.key);
                  if (isMobile) setMobileOpen(false);
                }}
              >
                <Icon className={`mr-3 ${item.color}`} size={20} />
                {item.label}
              </button>
            );
          })}

          {/* Footer Buttons */}
          <div className="mt-4 border-t border-gray-700 pt-4 space-y-2">
            
            <button
              onClick={handleBackToHome}
              className="w-full flex items-center p-3 rounded-lg hover:bg-white/5"
            >
              <Home className="mr-3 text-gray-300" size={20} />
              Back to Home
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center p-3 rounded-lg text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="mr-3" size={20} />
              Logout
            </button>
          </div>
        </nav>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="bg-white border-b">
          <div className="flex items-center justify-between px-4 py-3">
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileOpen(true)} 
              className="md:hidden p-2 hover:bg-gray-100 rounded"
            >
              <Menu />
            </button>

            {/* Page Title */}
            <h1 className="text-xl font-bold">
              {menuItems.find((m) => m.key === activePage)?.label || "Dashboard"}
            </h1>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {renderPage()}
        </main>

      </div>
    </div>
  );
};

export default AdminDashboard;
