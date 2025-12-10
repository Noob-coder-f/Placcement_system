// components/DashboardHome.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Briefcase,
  GraduationCap,
  Users,
  UserCheck,
  Calendar,
  MapPin,
  DollarSign,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Star,
  MessageSquare,
  Target,
  Award,
  Lightbulb,
  Clock,
  Building,
  FileText,
  CheckCircle,
  XCircle,
  ChevronRight,
  Sparkles,
  BookOpen,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
  const [stats, setStats] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [planInfo, setPlanInfo] = useState(null);
  const navigate = useNavigate();

  // Check plan access on component mount
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const { data } = await axios.get('/api/payments/current-plan');
        if (data.success) {
          setPlanInfo(data);
          const paidPlan = data.planCategory && data.planCategory !== 'NONE';
          setHasAccess(paidPlan);
          
          // Only fetch dashboard data if user has access
          if (paidPlan) {
            fetchDashboardData();
          } else {
            setLoading(false);
          }
        } else {
          setHasAccess(false);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching plan info:', err);
        setHasAccess(false);
        setLoading(false);
      } finally {
        setLoadingPlan(false);
      }
    };
    fetchPlan();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Parallel API calls for better performance
      const [statsResponse, jobsResponse, feedbackResponse] = await Promise.all([
        axios.get('/api/intern/dashboard-stats'),
        axios.get('/api/intern/recent-job-posts'),
        axios.get('/api/intern/recent-feedback')
      ]);

      // Process and set data
      setStats(processStatsData(statsResponse.data));
      setRecentJobs(processJobsData(jobsResponse.data));
      setRecentFeedback(processFeedbackData(feedbackResponse.data));

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      
      // Clear data on error - no mock data
      setStats([]);
      setRecentJobs([]);
      setRecentFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  // Process API response for stats
  const processStatsData = (data) => {
    const statsArray = [
      { 
        title: 'Jobs Applied', 
        value: data.jobsApplied || '0', 
        subtitle: `${data.freeApplicationsLeft || 0} free applications left`, 
        icon: Briefcase, 
        color: 'bg-blue-100 text-blue-600',
        borderColor: 'border-blue-200',
        tooltip: 'Total number of internship applications submitted',
        trend: data.jobsAppliedTrend
      },
      { 
        title: 'Mentor Feedback', 
        value: data.mentorFeedbackCount || '0', 
        subtitle: 'Reviews received', 
        icon: UserCheck, 
        color: 'bg-purple-100 text-purple-600',
        borderColor: 'border-purple-200',
        tooltip: 'Feedback received from assigned mentors',
        trend: data.mentorFeedbackTrend
      },
      { 
        title: 'Hiring Feedback', 
        value: data.hiringFeedbackCount || '0', 
        subtitle: 'From applications', 
        icon: Users, 
        color: 'bg-orange-100 text-orange-600',
        borderColor: 'border-orange-200',
        tooltip: 'Feedback from companies on your applications',
        trend: data.hiringFeedbackTrend
      },
    ];

    // Add additional stats if available
    if (data.interviewsScheduled || data.interviewsScheduled === 0) {
      statsArray.push({
        title: 'Interviews',
        value: data.interviewsScheduled,
        subtitle: 'Scheduled',
        icon: Target,
        color: 'bg-red-100 text-red-600',
        borderColor: 'border-red-200',
        tooltip: 'Upcoming interviews',
        trend: data.interviewsTrend
      });
    }

    return statsArray;
  };

  // Process API response for recent jobs
  const processJobsData = (jobs) => {
    return jobs.map(job => ({
      title: job.title,
      company: job.company,
      status: job.status,
      date: formatDate(job.appliedDate || job.createdAt),
      id: job.id || job._id,
      location: job.location,
      type: job.type || 'Internship',
      salary: job.salaryRange,
      applicationStatus: job.applicationStatus,
      nextStep: job.nextStep,
      deadline: job.deadline ? formatDate(job.deadline) : null,
      skills: job.requiredSkills || [],
      description: job.description,
      remote: job.remote || false,
      duration: job.duration
    }));
  };

  // Process API response for feedback
  const processFeedbackData = (feedback) => {
    const allFeedback = [];
    
    // Process mentor feedback
    if (feedback.mentorFeedback && Array.isArray(feedback.mentorFeedback)) {
      feedback.mentorFeedback.forEach(item => {
        allFeedback.push({
          type: 'mentor',
          comment: item.comment,
          rating: item.rating,
          date: formatDate(item.date || item.createdAt),
          id: item._id || item.id,
          improvementSuggestions: item.improvementSuggestions,
          provider: item.provider || 'Mentor',
          providerRole: 'Technical Mentor',
          category: 'technical',
          strengths: item.strengths || [],
          areasForImprovement: item.areasForImprovement || [],
          actionableItems: item.actionableItems || [],
          followUpRequired: item.followUpRequired,
          sentiment: item.sentiment
        });
      });
    }
    
    // Process hiring team feedback
    if (feedback.hiringTeamFeedback && Array.isArray(feedback.hiringTeamFeedback)) {
      feedback.hiringTeamFeedback.forEach(item => {
        allFeedback.push({
          type: 'hiring',
          comment: item.comment,
          rating: item.rating,
          date: formatDate(item.date || item.createdAt),
          id: item._id || item.id,
          improvementSuggestions: item.improvementSuggestions,
          provider: item.provider || 'Hiring Team',
          providerRole: 'Recruiter/Hiring Manager',
          category: 'recruitment',
          strengths: item.strengths || [],
          areasForImprovement: item.areasForImprovement || [],
          actionableItems: item.actionableItems || [],
          followUpRequired: item.followUpRequired,
          sentiment: item.sentiment,
          company: item.company
        });
      });
    }
    
    // If feedback is an array (legacy format)
    if (Array.isArray(feedback)) {
      feedback.forEach(item => {
        allFeedback.push({
          type: item.type || 'general',
          comment: item.comment,
          rating: item.rating,
          date: formatDate(item.date || item.createdAt),
          id: item._id || item.id,
          improvementSuggestions: item.improvementSuggestions,
          provider: item.provider || 'System',
          providerRole: item.providerRole || 'Feedback Provider',
          category: item.category || 'general',
          strengths: item.strengths || [],
          areasForImprovement: item.areasForImprovement || [],
          actionableItems: item.actionableItems || [],
          followUpRequired: item.followUpRequired,
          sentiment: item.sentiment
        });
      });
    }
    
    // Sort by date (most recent first)
    return allFeedback.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  };

  // Format date to relative time
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Recently';
      
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        if (diffHours === 0) {
          const diffMinutes = Math.floor(diffTime / (1000 * 60));
          return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
        }
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      }
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
      }
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: diffDays > 365 ? 'numeric' : undefined
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Recently';
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    if (hasAccess) {
      fetchDashboardData();
    }
  };

  // Navigate to jobs page
  const handleViewAllJobs = () => {
    navigate('/jobs');
  };

  // Navigate to feedback page
  const handleViewAllFeedback = () => {
    navigate('/feedback');
  };

  // Render stars for rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
        <span className="ml-2 text-xs text-gray-500">({rating}/5)</span>
      </div>
    );
  };

  // Get status color and icon
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'applied':
        return { color: 'bg-blue-100 text-blue-800', icon: FileText };
      case 'reviewed':
        return { color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'shortlisted':
        return { color: 'bg-purple-100 text-purple-800', icon: Award };
      case 'interview':
        return { color: 'bg-indigo-100 text-indigo-800', icon: Users };
      case 'accepted':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800', icon: XCircle };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: FileText };
    }
  };

  // Get sentiment color
  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'neutral':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Combined loading state
  if (loading || loadingPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading your dashboard...</p>
          <p className="text-gray-400 text-sm mt-2">Getting everything ready for you</p>
        </div>
      </div>
    );
  }

  // No active plan
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-600">PREMIUM DASHBOARD</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Upgrade Required
          </h1>
          
          <p className="text-gray-600 mb-8 text-lg">
            Access your personalized internship dashboard by upgrading to a premium plan.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">Track application progress</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">Receive expert feedback</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">Monitor study progress</span>
            </div>
          </div>

          {planInfo && (
            <p className="text-sm text-gray-500">
              Current plan: <span className="font-semibold text-gray-700">{planInfo.planCategory || 'Free Tier'}</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                <TrendingUpIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Dashboard Overview
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Track your internship journey progress</p>
            {planInfo?.planName && (
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">
                  Active plan: <span className="font-semibold text-gray-700">{planInfo.planName}</span>
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-md disabled:opacity-50"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-3" size={20} />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.color} ${stat.borderColor} border`}>
                    <Icon size={24} />
                  </div>
                  {stat.trend && (
                    <div className={`text-xs px-2.5 py-1.5 rounded-full ${stat.trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      <TrendingUp className={`w-3 h-3 inline mr-1 ${stat.trend > 0 ? '' : 'rotate-180'}`} />
                      {stat.trend > 0 ? '+' : ''}{stat.trend}%
                    </div>
                  )}
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm font-medium text-gray-600 mt-1">{stat.title}</p>
                <p className="text-xs text-gray-500 mt-2">{stat.subtitle}</p>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Recent Applications */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-5 md:p-6 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-xl">
                  <Briefcase size={22} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
                  <p className="text-sm text-gray-500">Your latest job applications</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">{recentJobs.length}</span>
                {recentJobs.length > 0 && (
                  <button
                    onClick={handleViewAllJobs}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                  >
                    View all
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-4 md:p-6">
              {recentJobs.length > 0 ? (
                <div className="space-y-4">
                  {recentJobs.slice(0, 4).map((job, index) => {
                    const StatusIcon = getStatusConfig(job.status).icon;
                    const statusColor = getStatusConfig(job.status).color;
                    
                    return (
                      <div 
                        key={job.id || index} 
                        className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 hover:border-blue-300 group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                                {job.title}
                              </h3>
                              {job.remote && (
                                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-medium">
                                  Remote
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1.5">
                                <Building size={14} />
                                <span className="font-medium">{job.company}</span>
                              </div>
                              {job.location && (
                                <div className="flex items-center gap-1.5">
                                  <MapPin size={14} />
                                  <span>{job.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusColor} shadow-sm`}>
                            <StatusIcon size={14} />
                            <span className="text-xs font-semibold capitalize">{job.status}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                          {job.type && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Briefcase size={14} className="text-gray-400" />
                              <span>{job.type}</span>
                            </div>
                          )}
                          {job.salary && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <DollarSign size={14} className="text-gray-400" />
                              <span>{job.salary}</span>
                            </div>
                          )}
                          {job.duration && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar size={14} className="text-gray-400" />
                              <span>{job.duration}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock size={14} className="text-gray-400" />
                            <span>{job.date}</span>
                          </div>
                        </div>
                        
                        {job.skills && job.skills.length > 0 && (
                          <div className="mt-4">
                            <div className="flex flex-wrap gap-1.5">
                              {job.skills.slice(0, 3).map((skill, idx) => (
                                <span key={idx} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg font-medium">
                                  {skill}
                                </span>
                              ))}
                              {job.skills.length > 3 && (
                                <span className="text-xs px-2.5 py-1 text-gray-500 bg-gray-50 rounded-lg">
                                  +{job.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {job.nextStep && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">Next step:</span>
                              <span className="text-sm font-medium text-blue-600">{job.nextStep}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <Briefcase size={32} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Start applying to internships to track your progress and get feedback
                  </p>
                  <button
                    onClick={() => navigate('/jobs')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Briefcase size={18} />
                    Browse Jobs
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Feedback */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-5 md:p-6 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 rounded-xl">
                  <MessageSquare size={22} className="text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Recent Feedback</h2>
                  <p className="text-sm text-gray-500">From mentors and hiring teams</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">{recentFeedback.length}</span>
                {recentFeedback.length > 0 && (
                  <button
                    onClick={handleViewAllFeedback}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center gap-1"
                  >
                    View all
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-4 md:p-6">
              {recentFeedback.length > 0 ? (
                <div className="space-y-4">
                  {recentFeedback.slice(0, 4).map((feedback, index) => (
                    <div 
                      key={feedback.id || index} 
                      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${feedback.type === 'mentor' ? 'bg-purple-50 border border-purple-200' : 'bg-orange-50 border border-orange-200'}`}>
                          {feedback.type === 'mentor' ? (
                            <UserCheck size={20} className="text-purple-600" />
                          ) : (
                            <Users size={20} className="text-orange-600" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900">
                                  {feedback.provider}
                                </h4>
                                {feedback.sentiment && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(feedback.sentiment)}`}>
                                    {feedback.sentiment}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">{feedback.providerRole}</p>
                              {feedback.company && (
                                <p className="text-xs text-gray-500 mt-0.5">From: {feedback.company}</p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {renderStars(feedback.rating)}
                              <span className="text-xs text-gray-500">{feedback.date}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-3 bg-gray-50 p-3 rounded-lg">
                            "{feedback.comment}"
                          </p>
                          
                          {feedback.improvementSuggestions && (
                            <div className="mb-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Lightbulb size={14} className="text-yellow-500" />
                                <span className="text-sm font-medium text-gray-700">Suggestions for Improvement:</span>
                              </div>
                              <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                {feedback.improvementSuggestions}
                              </p>
                            </div>
                          )}
                          
                          {feedback.followUpRequired && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <AlertCircle size={14} className="text-red-500" />
                                <span className="text-sm font-medium text-red-600">Follow-up required</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="mx-auto w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare size={32} className="text-purple-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No feedback yet</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Feedback will appear here after your applications are reviewed by mentors and hiring teams
                  </p>
                  <button
                    onClick={() => navigate('/jobs')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Briefcase size={18} />
                    Apply for Feedback
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;