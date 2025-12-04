import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard,
  User,
  Users,
  Briefcase,
  LogOut,
  Home,
  ChevronRight,
  Menu,
  TrendingUp,
  TrendingDown,
  Calendar,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Eye,
  CheckCircle,
  Clock as ClockIcon,
  XCircle,
  Star,
  Target,
  RefreshCw,
  GraduationCap,
} from "lucide-react";

// Import your page components (you'll need to create these)
import Profile from "./HrPages/Profile";
import JobPosts from "./HrPages/JobPosts";
import UsersPage from "./HrPages/Users";

const HiringTeamDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [allJobs, setAllJobs] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentCandidates, setRecentCandidates] = useState([]);
  
  // ===============================
  // TOKEN & NAVIGATION
  // ===============================
  const getToken = () => {
    return localStorage.getItem("HiringTeamToken");
  };

  const handleLogout = () => {
    localStorage.removeItem("HiringTeamToken");
    navigate("/hiring-team-login");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  // ===============================
  // DATA FETCHING
  // ===============================
  const fetchUserProfile = async () => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/hiring-team-login");
        return;
      }
      const res = await axios.get("/api/hiring/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (err) {
      console.error("Profile Load Failed", err);
    }
  };

  const fetchAllJobs = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get("/api/hiring/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        const jobs = res.data.data || [];
        setAllJobs(jobs);
        // Get only 5 most recent jobs for display
        setRecentJobs(jobs.slice(0, 5));
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setAllJobs([]);
      setRecentJobs([]);
    }
  };

  const fetchAllCandidates = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get("/api/hiring/interns", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        const interns = res.data.data || [];
        const candidates = interns.map(intern => ({
          _id: intern._id,
          name: intern.name,
          avatar: intern.profileImage,
          position: intern.domain,
          college: intern.college,
          status: "New",
          stage: "Resume Review",
          email: intern.email,
          appliedDate: intern.createdAt,
          rating: intern.hiringTeamFeedback?.length > 0 
            ? (intern.hiringTeamFeedback.reduce((sum, f) => sum + f.rating, 0) / intern.hiringTeamFeedback.length).toFixed(1)
            : "No rating"
        }));
        setAllCandidates(candidates);
        // Get only 5 most recent candidates for display
        setRecentCandidates(candidates.slice(0, 5));
      }
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
      setAllCandidates([]);
      setRecentCandidates([]);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUserProfile(),
        fetchAllJobs(),
        fetchAllCandidates(),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // USE EFFECTS
  // ===============================
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    loadData();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ===============================
  // UTILITY FUNCTIONS
  // ===============================
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
      case "new":
      case "active":
        return "bg-green-100 text-green-800";
      case "closed":
      case "rejected":
        return "bg-red-100 text-red-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      case "interview":
        return "bg-purple-100 text-purple-800";
      case "hired":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
      case "active":
        return <CheckCircle size={14} />;
      case "closed":
        return <XCircle size={14} />;
      case "new":
        return <ClockIcon size={14} />;
      default:
        return null;
    }
  };

  // ===============================
  // DASHBOARD STATS (Using ALL data for counts)
  // ===============================
  const mainStats = [
    { 
      label: "Total Jobs", 
      value: allJobs.length, // Use ALL jobs count
      icon: Briefcase, 
      color: "#09435F",
      bgColor: "bg-[#09435F]/10",
      onClick: () => setActivePage("jobposts")
    },
    { 
      label: "Total Candidates", 
      value: allCandidates.length, // Use ALL candidates count
      icon: Users, 
      color: "#2E84AE",
      bgColor: "bg-[#2E84AE]/10",
      onClick: () => setActivePage("users")
    },
    { 
      label: "Open Positions", 
      value: allJobs.filter(j => j.status === "Open").length, // Use ALL jobs for count
      icon: Award, 
      color: "#2E84AE",
      bgColor: "bg-[#CDE7F4]/20"
    },
    { 
      label: "Top Rated", 
      value: allCandidates.filter(c => c.rating && c.rating > 4).length, // Use ALL candidates for count
      icon: Star, 
      color: "#09435F",
      bgColor: "bg-[#09435F]/10"
    },
  ];

  // ===============================
  // PAGE RENDERING
  // ===============================
  const renderPage = () => {
    if (loading && activePage === "dashboard") {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-64 mt-2 animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    switch (activePage) {
      case "profile":
        return <Profile user={user} setUser={setUser} onUpdate={fetchUserProfile} />;
      case "jobposts":
        return <JobPosts />;
      case "users":
        return <UsersPage />;
      default:
        return renderDashboard();
    }
  };

  // ===============================
  // DASHBOARD COMPONENT
  // ===============================
  const renderDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Header with Time Range */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-[#09435F]">Dashboard Overview</h1>
            <p className="text-gray-600">
              Welcome back, {user?.name || "Hiring Manager"}. Here's your hiring performance
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={loadData}
              className="flex items-center space-x-2 px-4 py-2 bg-[#2E84AE] text-white rounded-lg hover:bg-[#09435F] transition-colors"
            >
              <RefreshCw size={18} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Main Stats - Showing ALL data counts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={stat.onClick}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`} style={{ color: stat.color }}>
                    <Icon size={24} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-[#09435F] mt-4">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Jobs & Candidates - Showing only 5 each */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Jobs - Showing 5 only */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#09435F] flex items-center">
                  <Briefcase className="mr-2" />
                  Recent Job Posts
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Showing {recentJobs.length} of {allJobs.length} total jobs
                </p>
              </div>
              <button 
                onClick={() => setActivePage("jobposts")}
                className="text-[#2E84AE] hover:text-[#09435F] text-sm font-medium flex items-center"
              >
                View All <ChevronRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {recentJobs.length > 0 ? (
                recentJobs.map((job) => (
                  <div key={job._id} className="flex items-center justify-between p-3 hover:bg-[#CDE7F4]/20 rounded-lg transition-colors">
                    <div>
                      <h4 className="font-medium text-[#09435F]">{job.title}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs mr-2">{job.department || "General"}</span>
                        <span>{job.location || "Remote"}</span>
                        <span className="mx-2">•</span>
                        <span>{job.type || "Full-time"}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-bold text-[#2E84AE]">{job.applicants || 0}</div>
                        <div className="text-xs text-gray-500">Applicants</div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)}
                        <span className="ml-1">{job.status || "Open"}</span>
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-gray-500">No job posts yet</p>
                  <button 
                    onClick={() => setActivePage("jobposts")}
                    className="mt-3 text-[#2E84AE] hover:text-[#09435F] text-sm font-medium"
                  >
                    Create your first job post
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Candidates - Showing 5 only */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#09435F] flex items-center">
                  <Users className="mr-2" />
                  Recent Interns
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Showing {recentCandidates.length} of {allCandidates.length} total interns
                </p>
              </div>
              <button 
                onClick={() => setActivePage("users")}
                className="text-[#2E84AE] hover:text-[#09435F] text-sm font-medium flex items-center"
              >
                View All <ChevronRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {recentCandidates.length > 0 ? (
                recentCandidates.map((candidate) => (
                  <div key={candidate._id} className="flex items-center p-3 hover:bg-[#CDE7F4]/20 rounded-lg transition-colors">
                    <img
                      src={candidate.avatar || `https://ui-avatars.com/api/?name=${candidate.name}&background=2E84AE&color=fff`}
                      alt={candidate.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-[#09435F]">{candidate.name}</h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <GraduationCap size={14} className="mr-1" />
                        <span>{candidate.college || "Unknown College"}</span>
                        <span className="mx-2">•</span>
                        <span>{candidate.position || "Intern"}</span>
                      </div>
                      {candidate.rating && candidate.rating !== "No rating" && (
                        <div className="flex items-center mt-1">
                          <Star size={12} className="text-yellow-400 fill-yellow-400 mr-1" />
                          <span className="text-xs text-gray-600">{candidate.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                        {getStatusIcon(candidate.status)}
                        <span className="ml-1">{candidate.status}</span>
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(candidate.appliedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <User className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-gray-500">No interns registered yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ===============================
  // SIDEBAR MENU
  // ===============================
  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "text-blue-500" },
    { key: "profile", label: "Profile", icon: User, color: "text-green-500" },
    { key: "jobposts", label: "Job Posts", icon: Briefcase, color: "text-purple-500" },
    { key: "users", label: "Candidates", icon: Users, color: "text-indigo-500" },
  ];

  const Sidebar = () => {
    const currentUser = user || {
      name: "John Hiring Manager",
      role: "Senior Recruiter",
      profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    };

    return (
      <div className="w-64 bg-gray-900 text-white flex flex-col h-full">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-800">
          <div className="flex items-center">
            <img src="/Graphura.jpg" alt="Graphura Logo" className="w-10 h-10 mr-2 rounded-full" />
            <div>
              <h1 className="font-bold text-lg">Graphura</h1>
              <p className="text-xs text-blue-100">Hiring Dashboard</p>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="p-4 border-b border-gray-800 text-center">
          <img
            src={currentUser.profileImage}
            className="w-16 h-16 mx-auto rounded-full border-2 border-blue-500 shadow-lg"
            alt="Profile"
          />
          <h2 className="font-bold mt-3 text-lg">{currentUser.name}</h2>
          <p className="text-gray-300 text-sm">{currentUser.role}</p>
          {currentUser.department && (
            <p className="text-gray-400 text-xs mt-1">{currentUser.department}</p>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`w-full flex items-center p-3 rounded-lg mb-1 transition-all ${
                  activePage === item.key 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => {
                  setActivePage(item.key);
                  if (isMobile) setMobileOpen(false);
                }}
              >
                <Icon className={`mr-3 ${item.color}`} size={20} />
                <span className="font-medium">{item.label}</span>
                {activePage === item.key && (
                  <ChevronRight className="ml-auto" size={16} />
                )}
              </button>
            );
          })}

          {/* Divider */}
          <div className="my-4 border-t border-gray-800"></div>

          {/* Action Buttons */}
          <div className="mt-4 border-t border-gray-800 pt-4 space-y-2">
            <button
              className="w-full flex items-center p-3 rounded-lg hover:bg-blue-800 transition-colors bg-blue-900"
              onClick={handleBackToHome}
            >
              <Home className="mr-3 text-blue-300" size={20} />
              <span className="text-blue-300">Back to Home</span>
            </button>

            <button
              className="w-full flex items-center p-3 rounded-lg hover:bg-red-900 transition-colors text-red-300 hover:text-red-200"
              onClick={handleLogout}
            >
              <LogOut className="mr-3" size={20} />
              <span>Logout</span>
            </button>
          </div>
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
        <header className="bg-white border-b shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button 
                onClick={() => setMobileOpen(true)} 
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg mr-2"
              >
                <Menu />
              </button>
              <h1 className="text-xl font-bold text-gray-800">
                {menuItems.find((m) => m.key === activePage)?.label || "Dashboard"}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* User Profile */}
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                  <img
                    src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default HiringTeamDashboard;