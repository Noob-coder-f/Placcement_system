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
} from "lucide-react";

import Profile from "./MentorPages/MentorProfile";
import StudyMaterials from "./MentorPages/MentorStudyMaterial";
import VideoLectures from "./MentorPages/MentorVideoLectures";
import Classes from "./MentorPages/MentorClasses";
import axios from "axios";

const MentorDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  const [mentor, setMentor] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

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
      // Set fallback data immediately
      setMentor({
        name: "John Doe",
        email: "john@example.com",
        experience: 5,
        profileImage: "",
        domain: ["MERN", "AI"],
        students: 10,
        rating: 4.6,
      });
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
      // Set fallback data immediately
      setDashboardData({
        stats: { students: 10, materials: 8, videos: 12, classes: 6 },
        upcomingClasses: [
          { title: "React Hooks", time: "Today 2 PM", type: "online" },
          { title: "Node.js Advanced", time: "Tomorrow 10 AM", type: "offline" },
        ],
        recentActivities: [
          { action: "Uploaded Material", item: "React Notes", time: "2 hrs ago" },
        ],
      });
    }
  };

  // ===============================
  // LOAD ALL DATA
  // ===============================
  const loadData = async () => {
    setLoading(true);
    try {
      // Run both requests in parallel
      await Promise.all([fetchMentorProfile(), fetchDashboardData()]);
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

    // Load data on component mount
    loadData();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

    // Use fallback data if APIs fail
    const currentMentor = mentor || {
      name: "John Doe",
      email: "john@example.com",
      experience: 5,
      profileImage: "",
      domain: ["MERN", "AI"],
      students: 10,
      rating: 4.6,
    };

    switch (activePage) {
      case "profile":
        return <Profile mentor={currentMentor} setMentor={setMentor} />;

      case "materials":
        return <StudyMaterials />;

      case "videos":
        return <VideoLectures />;

      case "classes":
        return <Classes />;

      default:
        return <DashboardOverview dashboardData={dashboardData} mentor={currentMentor} />;
    }
  };

  // ===============================
  // SIDEBAR MENU
  // ===============================
  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "text-blue-500" },
    { key: "profile", label: "Profile", icon: User, color: "text-green-500" },
    { key: "materials", label: "Study Materials", icon: BookOpen, color: "text-red-500" },
    { key: "videos", label: "Video Lectures", icon: Video, color: "text-purple-500" },
    { key: "classes", label: "Classes", icon: Calendar, color: "text-cyan-500" },
  ];

  // ===============================
  // SIDEBAR COMPONENT
  // ===============================
  const Sidebar = () => {
    // Use fallback data for sidebar if mentor is null
    const currentMentor = mentor || {
      name: "John Doe",
      experience: 5,
      profileImage: "",
      domain: ["MERN", "AI"],
      rating: 4.6,
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

          <div className="flex items-center justify-center mt-1">
            <TrendingUp className="text-yellow-400 mr-1" size={14} />
            <span className="text-xs text-yellow-400 font-bold">
              {currentMentor.rating}/5
            </span>
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
            
            {/* User info in header */}
            {mentor && (
              <div className="flex items-center space-x-2">
                <img
                  src={mentor.profileImage || `https://ui-avatars.com/api/?name=${mentor.name}&background=random`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">{mentor.name}</span>
              </div>
            )}
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
// DASHBOARD OVERVIEW COMPONENT
// ======================================================
const DashboardOverview = ({ dashboardData, mentor }) => {
  // Ensure we have data even if APIs fail
  const data = dashboardData || {
    stats: { students: 10, materials: 8, videos: 12, classes: 6 },
    upcomingClasses: [
      { title: "React Hooks", time: "Today 2 PM", type: "online" },
      { title: "Node.js Advanced", time: "Tomorrow 10 AM", type: "offline" },
    ],
    recentActivities: [
      { action: "Uploaded Material", item: "React Notes", time: "2 hrs ago" },
    ],
  };

  const stats = [
    { label: "Interns", value: data.stats.students, icon: Users, color: "text-blue-500" },
    { label: "Materials", value: data.stats.materials, icon: BookOpen, color: "text-green-500" },
    { label: "Videos", value: data.stats.videos, icon: Video, color: "text-yellow-500" },
    { label: "Classes", value: data.stats.classes, icon: Calendar, color: "text-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-xl text-white">
        <h1 className="text-3xl font-bold">Welcome, {mentor.name} 👋</h1>
        <p className="opacity-75">Here's your performance overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div className="p-4 bg-white rounded-xl shadow" key={i}>
              <Icon className={s.color} size={22} />
              <h2 className="text-3xl font-bold">{s.value}</h2>
              <p className="text-gray-500">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Calendar className="text-blue-500 mr-2" /> Upcoming Classes
          </h2>

          {data.upcomingClasses.length > 0 ? (
            data.upcomingClasses.map((c, i) => (
              <div key={i} className="border-b py-3 last:border-b-0">
                <h3 className="font-semibold">{c.title}</h3>
                <p className="text-sm text-gray-500">{c.time}</p>
                <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                  c.type === 'online' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {c.type}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No upcoming classes</p>
          )}
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Recent Activities</h2>

          {data.recentActivities.length > 0 ? (
            data.recentActivities.map((a, i) => (
              <div key={i} className="mb-3 last:mb-0">
                <p>
                  {a.action} – <strong>{a.item}</strong>
                </p>
                <p className="text-sm text-gray-500">{a.time}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No recent activities</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;