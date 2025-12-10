import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  User,
  Mail,
  Phone,
  Calendar,
  RefreshCw,
  GraduationCap,
  MapPin,
  Eye,
  MessageSquare,
  FileText,
  ExternalLink,
  Github,
  Linkedin,
  Award,
  Star,
  Briefcase,
  Users,
  TrendingUp,
  BookOpen,
  Globe,
  Code,
  Sparkles,
  ThumbsUp,
  ChevronRight,
  X,
  Download,
  Share2,
  Bookmark,
  Clock
} from "lucide-react";
import { toast } from "react-toastify";

const InternsPage = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    domain: "all",
    yearOfStudy: "all",
    planCategory: "all",
  });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [feedback, setFeedback] = useState({
    rating: 5,
    comment: "",
    improvementSuggestions: ""
  });

  const getToken = () => {
    return localStorage.getItem("HiringTeamToken") || localStorage.getItem("token");
  };

  const fetchInterns = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get("/api/hiring/interns", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setInterns(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch interns:", error);
      toast.error("Failed to load interns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  const openProfileModal = (intern) => {
    setSelectedIntern(intern);
    setShowProfileModal(true);
  };

  const handleSubmitFeedback = async (internId) => {
    try {
      const token = getToken();
      await axios.post(
        `/api/hiring/interns/${internId}/feedback`,
        feedback,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Feedback submitted successfully");
      setShowFeedbackModal(false);
      setFeedback({ rating: 5, comment: "", improvementSuggestions: "" });
      fetchInterns();
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast.error("Failed to submit feedback");
    }
  };

  const openFeedbackModal = (intern) => {
    setSelectedIntern(intern);
    setShowFeedbackModal(true);
  };

  const getPlanColor = (plan) => {
    switch (plan?.toUpperCase()) {
      case "PLATINUM":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      case "GOLD":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white";
      case "SILVER":
        return "bg-gradient-to-r from-gray-400 to-blue-400 text-white";
      default:
        return "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700";
    }
  };

  const getPlanIcon = (plan) => {
    switch (plan?.toUpperCase()) {
      case "PLATINUM":
        return <Sparkles size={14} />;
      case "GOLD":
        return <Award size={14} />;
      case "SILVER":
        return <Award size={14} />;
      default:
        return null;
    }
  };

  const getDomainIcon = (domain) => {
    switch (domain?.toLowerCase()) {
      case "web development":
        return <Globe size={16} className="text-blue-500" />;
      case "mobile development":
        return <Code size={16} className="text-green-500" />;
      case "data science":
        return <TrendingUp size={16} className="text-purple-500" />;
      case "machine learning":
        return <Sparkles size={16} className="text-pink-500" />;
      case "ui/ux design":
        return <Users size={16} className="text-yellow-500" />;
      default:
        return <Briefcase size={16} className="text-gray-500" />;
    }
  };

  const filteredInterns = interns.filter((intern) => {
    if (searchTerm && 
        !intern.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !intern.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !intern.college.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !intern.domain.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    if (selectedFilters.domain !== "all" && intern.domain !== selectedFilters.domain) {
      return false;
    }

    if (selectedFilters.yearOfStudy !== "all" && intern.yearOfStudy !== parseInt(selectedFilters.yearOfStudy)) {
      return false;
    }

    if (selectedFilters.planCategory !== "all" && intern.planCategory !== selectedFilters.planCategory) {
      return false;
    }

    return true;
  });

  const stats = [
    { 
      label: "Total Interns", 
      value: interns.length, 
      color: "#09435F",
      icon: <Users className="text-[#09435F]" size={24} />
    },
    { 
      label: "Active Plans", 
      value: interns.filter(i => i.planCategory !== "NONE").length, 
      color: "#2E84AE",
      icon: <Award className="text-[#2E84AE]" size={24} />
    },
    { 
      label: "Avg Rating", 
      value: (interns.reduce((sum, i) => {
        const feedbacks = i.hiringTeamFeedback || [];
        const avg = feedbacks.length > 0 
          ? feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length 
          : 0;
        return sum + avg;
      }, 0) / interns.filter(i => i.hiringTeamFeedback?.length > 0).length || 0).toFixed(1), 
      color: "#CDE7F4", 
      suffix: "/5",
      icon: <Star className="text-[#CDE7F4]" size={24} />
    },
    { 
      label: "Available Credits", 
      value: interns.reduce((sum, i) => sum + (i.jobCredits || 0), 0), 
      color: "#09435F",
      icon: <BookOpen className="text-[#09435F]" size={24} />
    },
  ];

  const SkillBadge = ({ skill }) => (
    <span className="px-3 py-1.5 bg-gradient-to-r from-[#CDE7F4] to-[#E3F2FD] text-[#09435F] text-xs font-medium rounded-full border border-[#2E84AE]/20">
      {skill.name}
    </span>
  );

  const LoadingCard = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
            <div className="flex space-x-1">
              {[1,2,3].map((i) => (
                <div key={i} className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#09435F] to-[#2E84AE] bg-clip-text text-transparent">
            Talent Pool
          </h1>
          <p className="text-gray-600 mt-2">Discover and manage talented interns</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={fetchInterns}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-[#2E84AE] to-[#09435F] text-white rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[#09435F]">
                  {stat.value}{stat.suffix || ""}
                </p>
                <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-inner">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, college, skills, or domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2E84AE] focus:border-transparent shadow-sm transition-all duration-300"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedFilters.domain}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, domain: e.target.value })}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2E84AE] focus:border-transparent shadow-sm"
            >
              <option value="all">🌐 All Domains</option>
              <option value="Web Development">🌐 Web Development</option>
              <option value="Mobile Development">📱 Mobile Development</option>
              <option value="Data Science">📊 Data Science</option>
              <option value="Machine Learning">🤖 Machine Learning</option>
              <option value="UI/UX Design">🎨 UI/UX Design</option>
            </select>

            <select
              value={selectedFilters.yearOfStudy}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, yearOfStudy: e.target.value })}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2E84AE] focus:border-transparent shadow-sm"
            >
              <option value="all">🎓 All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>

            <select
              value={selectedFilters.planCategory}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, planCategory: e.target.value })}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2E84AE] focus:border-transparent shadow-sm"
            >
              <option value="all">💎 All Plans</option>
              <option value="NONE">Basic</option>
              <option value="SILVER">Silver</option>
              <option value="GOLD">Gold</option>
              <option value="PLATINUM">Platinum</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => <LoadingCard key={index} />)
        ) : filteredInterns.length > 0 ? (
          filteredInterns.map((intern) => (
            <div 
              key={intern._id} 
              className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden"
            >
              {/* Gradient Header */}
              <div className="h-2 bg-gradient-to-r from-[#09435F] via-[#2E84AE] to-[#CDE7F4]"></div>
              
              <div className="p-6">
                {/* Intern Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={intern.profileImage || `https://ui-avatars.com/api/?name=${intern.name}&background=2E84AE&color=fff&bold=true`}
                        alt={intern.name}
                        className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-full shadow-lg">
                        {getDomainIcon(intern.domain)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-[#09435F] group-hover:text-[#2E84AE] transition-colors">
                        {intern.name}
                      </h3>
                      <p className="text-gray-600 text-sm flex items-center mt-1">
                        <GraduationCap size={14} className="mr-2" />
                        {intern.college}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getPlanColor(intern.planCategory)}`}>
                          {getPlanIcon(intern.planCategory)}
                          <span className="ml-1.5">{intern.planCategory || "Basic"}</span>
                        </span>
                        <span className="ml-3 text-xs text-gray-500">
                          {intern.jobCredits || 0} credits
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`mr-1 ${
                          i < Math.floor(
                            intern.hiringTeamFeedback?.length > 0
                              ? intern.hiringTeamFeedback.reduce((sum, f) => sum + f.rating, 0) / 
                                intern.hiringTeamFeedback.length
                              : 0
                          )
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      {intern.hiringTeamFeedback?.length > 0
                        ? (intern.hiringTeamFeedback.reduce((sum, f) => sum + f.rating, 0) / 
                           intern.hiringTeamFeedback.length).toFixed(1)
                        : "No ratings"}
                    </span>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-700">
                    <Mail size={14} className="mr-3 text-[#2E84AE]" />
                    <span className="text-sm truncate">{intern.email}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <GraduationCap size={14} className="mr-3 text-[#2E84AE]" />
                    <span className="text-sm">{intern.course} • Year {intern.yearOfStudy}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Briefcase size={14} className="mr-3 text-[#2E84AE]" />
                    <span className="text-sm">{intern.domain}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Top Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {intern.skills?.slice(0, 4).map((skill, index) => (
                      <SkillBadge key={index} skill={skill} />
                    ))}
                    {intern.skills?.length > 4 && (
                      <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        +{intern.skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Social & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    {intern.githubUrl && (
                      <a
                        href={intern.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-900 text-white hover:bg-black rounded-xl transition-colors shadow-sm"
                        title="GitHub"
                      >
                        <Github size={18} />
                      </a>
                    )}
                    {intern.linkedinUrl && (
                      <a
                        href={intern.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
                        title="LinkedIn"
                      >
                        <Linkedin size={18} />
                      </a>
                    )}
                    {intern.resumeUrl && (
                      <a
                        href={intern.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-green-600 text-white hover:bg-green-700 rounded-xl transition-colors shadow-sm"
                        title="Resume"
                      >
                        <FileText size={18} />
                      </a>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openFeedbackModal(intern)}
                      className="p-2.5 bg-gradient-to-r from-[#2E84AE] to-[#09435F] text-white rounded-xl hover:shadow-lg transition-all duration-300"
                      title="Give Feedback"
                    >
                      <ThumbsUp size={18} />
                    </button>
                    <button
                      onClick={() => openProfileModal(intern)}
                      className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-200 text-[#2E84AE] rounded-xl hover:bg-gray-50 hover:shadow-lg transition-all duration-300"
                    >
                      <Eye size={16} />
                      <span className="text-sm font-medium">View</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="inline-flex p-4 bg-gradient-to-r from-[#CDE7F4] to-[#E3F2FD] rounded-2xl mb-6">
              <User size={48} className="text-[#2E84AE]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No interns found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedFilters({ domain: "all", yearOfStudy: "all", planCategory: "all" });
              }}
              className="px-6 py-3 bg-gradient-to-r from-[#2E84AE] to-[#09435F] text-white rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* View Profile Modal */}
      {showProfileModal && selectedIntern && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative h-15 bg-gradient-to-r from-[#09435F] via-[#2E84AE] to-[#CDE7F4]">
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="px-8 pb-8 mt-12">
              {/* Profile Header */}
              <div className="flex items-end justify-between mb-8">
                <div className="flex items-end space-x-6">
                  <img
                    src={selectedIntern.profileImage || `https://ui-avatars.com/api/?name=${selectedIntern.name}&background=2E84AE&color=fff&bold=true&size=128`}
                    alt={selectedIntern.name}
                    className="w-32 h-32 rounded-2xl border-4 border-white shadow-2xl"
                  />
                  <div>
                    <h2 className="text-3xl font-bold text-[#09435F] mb-2">{selectedIntern.name}</h2>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full font-bold ${getPlanColor(selectedIntern.planCategory)}`}>
                        {getPlanIcon(selectedIntern.planCategory)}
                        <span className="ml-2">{selectedIntern.planCategory || "Basic"}</span>
                      </span>
                      <span className="text-gray-600">
                        <GraduationCap size={16} className="inline mr-2" />
                        {selectedIntern.college}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                  {/* About */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-[#09435F] mb-4 flex items-center">
                      <User size={20} className="mr-2" />
                      About
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Course</p>
                        <p className="font-medium text-[#09435F]">{selectedIntern.course}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Year of Study</p>
                        <p className="font-medium text-[#09435F]">Year {selectedIntern.yearOfStudy}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Domain</p>
                        <p className="font-medium text-[#09435F]">{selectedIntern.domain}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Credits Available</p>
                        <p className="font-medium text-[#09435F]">{selectedIntern.jobCredits || 0}</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-[#09435F] mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedIntern.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-[#CDE7F4] to-[#E3F2FD] text-[#09435F] rounded-xl font-medium"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Contact Info */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-[#09435F] mb-4">Contact</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Mail size={18} className="text-[#2E84AE] mr-3" />
                        <span className="text-gray-700">{selectedIntern.email}</span>
                      </div>
                      {selectedIntern.phone && (
                        <div className="flex items-center">
                          <Phone size={18} className="text-[#2E84AE] mr-3" />
                          <span className="text-gray-700">{selectedIntern.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-[#09435F] mb-4">Profiles</h3>
                    <div className="space-y-3">
                      {selectedIntern.githubUrl && (
                        <a
                          href={selectedIntern.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors"
                        >
                          <div className="flex items-center">
                            <Github size={18} className="mr-3" />
                            <span>GitHub</span>
                          </div>
                          <ExternalLink size={16} />
                        </a>
                      )}
                      {selectedIntern.linkedinUrl && (
                        <a
                          href={selectedIntern.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          <div className="flex items-center">
                            <Linkedin size={18} className="mr-3" />
                            <span>LinkedIn</span>
                          </div>
                          <ExternalLink size={16} />
                        </a>
                      )}
                      {selectedIntern.resumeUrl && (
                        <a
                          href={selectedIntern.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                        >
                          <div className="flex items-center">
                            <FileText size={18} className="mr-3" />
                            <span>View Resume</span>
                          </div>
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-4 mt-8 pt-8 border-t border-gray-200">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    openFeedbackModal(selectedIntern);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-[#2E84AE] to-[#09435F] text-white rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Give Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedIntern && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[#09435F]">
                    Feedback for {selectedIntern.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">Share your constructive feedback</p>
                </div>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Overall Rating
                  </label>
                  <div className="flex space-x-2 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedback({ ...feedback, rating: star })}
                        className="text-3xl transition-transform hover:scale-110"
                      >
                        <Star
                          size={32}
                          className={star <= feedback.rating 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "text-gray-300"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Feedback Comments
                  </label>
                  <textarea
                    value={feedback.comment}
                    onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2E84AE] focus:border-transparent shadow-sm"
                    placeholder="What are this intern's strengths and areas for improvement?"
                  />
                </div>

                {/* Suggestions */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Improvement Suggestions
                  </label>
                  <textarea
                    value={feedback.improvementSuggestions}
                    onChange={(e) => setFeedback({ ...feedback, improvementSuggestions: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2E84AE] focus:border-transparent shadow-sm"
                    placeholder="Specific suggestions for growth and development..."
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmitFeedback(selectedIntern._id)}
                  className="px-6 py-3 bg-gradient-to-r from-[#2E84AE] to-[#09435F] text-white rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternsPage;