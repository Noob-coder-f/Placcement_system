import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  User,
  Users,
  BookOpen,
  Video,
  Calendar,
  Menu,
  GraduationCap,
  TrendingUp,
  Home,
  FileText,
  Eye,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Profile from "./MentorPages/MentorProfile";
import StudyMaterials from "./MentorPages/MentorStudyMaterial";
import VideoLectures from "./MentorPages/MentorVideoLectures";
import Classes from "./MentorPages/MentorClasses";
import MentorUsers from "./MentorPages/MentorUser";
import axios from "axios";

const MentorDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [mentor, setMentor] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentMaterials, setRecentMaterials] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  // ===============================
  // TOKEN
  // ===============================
  const getToken = () => {
    return localStorage.getItem("mentorToken") || localStorage.getItem("token");
  };

  // ===============================
  // FETCH MENTOR PROFILE
  // ===============================
  const fetchMentorProfile = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        throw new Error("No token found");
      }

      const res = await axios.get("/api/mentors/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMentor(res.data);
    } catch (err) {
      console.error("Profile Load Failed → Using fallback", err);
    }
  };

  // ===============================
  // FETCH DASHBOARD DATA
  // ===============================
  const fetchDashboardData = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        throw new Error("No token found");
      }

      const res = await axios.get("/api/mentors/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(res.data);
    } catch (err) {
      console.error("Dashboard API Failed → Using fallback", err);
    }
  };

  // ===============================
  // FETCH RECENT STUDY MATERIALS
  // ===============================
  const fetchRecentMaterials = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get("/api/mentor/study-materials", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Get recent 5 materials
      const recent = res.data.data?.slice(0, 5) || [];
      setRecentMaterials(recent);
    } catch (err) {
      console.error("Failed to fetch recent materials:", err);
      // Fallback data
    }
  };

  // ===============================
  // FETCH RECENT USERS
  // ===============================
  const fetchRecentUsers = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get("/api/mentors/interns", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Get recent 5 users
      const recent = res.data.interns?.slice(0, 5) || [];
      setRecentUsers(recent);
    } catch (err) {
      console.error("Failed to fetch recent users:", err);
      // Fallback data
    }
  };

  // ===============================
  // LOAD ALL DATA
  // ===============================
  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchMentorProfile(), 
        fetchDashboardData(),
        fetchRecentMaterials(),
        fetchRecentUsers()
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // RESIZE LISTENER + DATA LOAD
  // ===============================
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    loadData();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ===============================
  // BACK TO HOME FUNCTION
  // ===============================
  const handleBackToHome = () => {
    navigate("/");
  };

  // ===============================
  // FORMAT DATE
  // ===============================
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // ===============================
  // PAGE RENDERING
  // ===============================
  const renderPage = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin w-12 h-12 border-b-2 border-blue-600 rounded-full"></div>
          <p className="ml-4 text-gray-600">Loading...</p>
        </div>
      );
    }

    const currentMentor = mentor 

    switch (activePage) {
      case "profile":
        return <Profile mentor={currentMentor} setMentor={setMentor} onUpdate={fetchMentorProfile} />;

      case "materials":
        return <StudyMaterials />;

      case "videos":
        return <VideoLectures />;

      case "classes":
        return <Classes />;

      case "users":
        return <MentorUsers />;

      default:
        return (
          <DashboardOverview 
            dashboardData={dashboardData} 
            mentor={currentMentor}
            recentMaterials={recentMaterials}
            recentUsers={recentUsers}
            onMaterialClick={() => setActivePage("materials")}
            onUsersClick={() => setActivePage("users")}
            formatDate={formatDate}
          />
        );
    }
  };

  // ===============================
  // SIDEBAR MENU
  // ===============================
  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "text-blue-500" },
    { key: "profile", label: "Profile", icon: User, color: "text-green-500" },
    { key: "users", label: "Users", icon: Users, color: "text-indigo-500" },
    { key: "materials", label: "Study Materials", icon: BookOpen, color: "text-red-500" },
    { key: "videos", label: "Video Lectures", icon: Video, color: "text-purple-500" },
    { key: "classes", label: "Classes", icon: Calendar, color: "text-cyan-500" },
  ];

  // ===============================
  // SIDEBAR COMPONENT
  // ===============================
  const Sidebar = () => {
    const currentMentor = mentor || {
    };

    return (
      <div className="w-64 bg-gray-800 text-white flex flex-col h-full">
        <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center">
            <GraduationCap className="mr-2" />
            <div>
              <h1 className="font-bold text-lg">MentorPro</h1>
              <p className="text-xs text-blue-100">Education Platform</p>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="p-4 border-b border-gray-700 text-center">
          <img
            src={
              currentMentor.profileImage ||
              `https://ui-avatars.com/api/?name=${currentMentor.name}&background=random`
            }
            className="w-16 h-16 mx-auto rounded-full border-2 border-blue-500 shadow"
            alt="Profile"
          />
          <h2 className="font-bold mt-2">{currentMentor.name}</h2>
          <p className="text-gray-300 text-xs">{currentMentor.experience} yrs experience</p>

          <div className="flex justify-center mt-2 gap-1 flex-wrap">
            {currentMentor.domain?.slice(0, 2).map((d, i) => (
              <span key={i} className="bg-blue-600 text-xs px-2 py-1 rounded-full">
                {d}
              </span>
            ))}
          </div>

        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`w-full flex items-center p-3 rounded-lg mb-1 ${
                  activePage === item.key ? "bg-white bg-opacity-10" : "hover:bg-white/5"
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

          {/* Back to Home Button */}
          <button
            className="w-full flex items-center p-3 rounded-lg mb-1 hover:bg-white/5 mt-4 border-t border-gray-700 pt-4"
            onClick={handleBackToHome}
          >
            <Home className="mr-3 text-gray-400" size={20} />
            <span className="text-gray-300">Back to Home</span>
          </button>
        </nav>
      </div>
    );
  };

  // ===============================
  // MAIN RETURN UI
  // ===============================
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              onClick={() => setMobileOpen(true)} 
              className="md:hidden p-2 hover:bg-gray-100 rounded"
            >
              <Menu />
            </button>
            <h1 className="text-xl font-bold">
              {menuItems.find((m) => m.key === activePage)?.label || "Dashboard"}
            </h1>
            
            <div className="flex items-center space-x-4">
              {/* Back to Home Button in Header */}
              <button
                onClick={handleBackToHome}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Home size={16} />
                <span className="hidden sm:inline">Home</span>
              </button>

              {mentor && (
                <div className="flex items-center space-x-2">
                  <img
                    src={mentor.profileImage || `https://ui-avatars.com/api/?name=${mentor.name}&background=random`}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium hidden sm:inline">{mentor.name}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

// ======================================================
// DASHBOARD OVERVIEW COMPONENT (Updated with Recent Materials & Users)
// ======================================================
const DashboardOverview = ({ 
  dashboardData, 
  mentor, 
  recentMaterials, 
  recentUsers, 
  onMaterialClick, 
  onUsersClick,
  formatDate 
}) => {
  const data = dashboardData || {
    stats: { 
      students: 10, 
      materials: 8, 
      videos: 12, 
      classes: 6, 
      users: 25,
      interns: 15 
    },
  };

  const stats = [
    { label: "Interns", value: data.stats.interns || data.stats.students, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Materials", value: data.stats.materials, icon: BookOpen, color: "text-green-500", bg: "bg-green-50" },
    { label: "Videos", value: data.stats.videos, icon: Video, color: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "Classes", value: data.stats.classes, icon: Calendar, color: "text-red-500", bg: "bg-red-50" },
    { label: "Total Users", value: data.stats.users, icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-xl text-white">
        <h1 className="text-3xl font-bold">Welcome, {mentor.name} 👋</h1>
        <p className="opacity-75">Here's your performance overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div className={`p-4 ${s.bg} rounded-xl shadow hover:shadow-md transition-shadow`} key={i}>
              <Icon className={s.color} size={22} />
              <h2 className="text-3xl font-bold mt-2">{s.value}</h2>
              <p className="text-gray-500 text-sm">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Study Materials */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <BookOpen className="text-red-500 mr-2" /> Recent Study Materials
            </h2>
            <button 
              onClick={onMaterialClick}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>

          {recentMaterials && recentMaterials.length > 0 ? (
            <div className="space-y-3">
              {recentMaterials.map((material) => (
                <div key={material._id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{material.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{material.subject}</span>
                        <span className="text-xs text-gray-500">
                          {formatDate(material.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-500">No study materials uploaded yet</p>
              <button 
                onClick={onMaterialClick}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Upload your first material
              </button>
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <Users className="text-indigo-500 mr-2" /> Recent Users
            </h2>
            <button 
              onClick={onUsersClick}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>

          {recentUsers && recentUsers.length > 0 ? (
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user._id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center mt-1 space-x-3">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {user.college}
                        </span>
                        <span className="text-xs text-gray-500">
                          Year {user.yearOfStudy}
                        </span>
                      </div>
                      {user.domain && (
                        <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {user.domain}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;