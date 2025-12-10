// components/Classes.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Calendar,
  Clock,
  Video,
  Users,
  BookOpen,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Sparkles,
  Star,
  CalendarDays,
  Filter,
  Calendar as CalendarIcon,
  GraduationCap,
  Code,
  Database,
  Smartphone,
  Cloud,
  Server,
  Layout,
  Globe
} from 'lucide-react';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [planInfo, setPlanInfo] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('upcoming');

  // Filters configuration
  const filters = [
    { id: 'all', label: 'All Classes', icon: BookOpen },
    { id: 'live', label: 'Live Now', icon: Video },
    { id: 'upcoming', label: 'Upcoming', icon: Calendar },
    { id: 'completed', label: 'Completed', icon: CheckCircle },
  ];


  // Subject icons mapping
  const subjectIcons = {
    'Frontend': { icon: Layout, color: 'bg-blue-500' },
    'Backend': { icon: Server, color: 'bg-green-500' },
    'Full Stack': { icon: Code, color: 'bg-purple-500' },
    'Database': { icon: Database, color: 'bg-orange-500' },
    'Mobile': { icon: Smartphone, color: 'bg-pink-500' },
    'DevOps': { icon: Cloud, color: 'bg-cyan-500' },
    'Architecture': { icon: Globe, color: 'bg-indigo-500' },
    'default': { icon: GraduationCap, color: 'bg-gray-500' }
  };

  // Fetch user's plan information
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const { data } = await axios.get('/api/payments/current-plan');
        if (data.success) {
          setPlanInfo(data);
          const paidPlan = data.planCategory && data.planCategory !== 'NONE';
          setHasAccess(paidPlan);
        } else {
          setHasAccess(false);
        }
      } catch (err) {
        console.error('Error fetching plan info:', err);
        setHasAccess(false);
      } finally {
        setLoadingPlan(false);
      }
    };
    fetchPlan();
  }, []);

  // Fetch classes data from backend
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        const { data } = await axios.get('/api/intern/classes');
        
        if (data.success) {
          setClasses(data.classes);
          setFilteredClasses(data.classes);
        } else {
          setError('Failed to load classes');
        }
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('Error loading classes. Please try again.');
      } finally {
        setLoadingClasses(false);
      }
    };

    if (hasAccess) {
      fetchClasses();
    }
  }, [hasAccess]);

  // Filter and search classes
  useEffect(() => {
    let result = classes;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(classItem =>
        classItem.title.toLowerCase().includes(query) ||
        classItem.description.toLowerCase().includes(query) ||
        classItem.subject.toLowerCase().includes(query) ||
        classItem.instructor?.name?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (selectedFilter !== 'all') {
      result = result.filter(classItem => {
        const status = getClassStatus(classItem.startTime, classItem.endTime);
        return status === selectedFilter;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.startTime) - new Date(a.startTime);
        case 'duration': {
          const durationA = new Date(a.endTime) - new Date(a.startTime);
          const durationB = new Date(b.endTime) - new Date(b.startTime);
          return durationB - durationA;
        }
        default: // upcoming
          return new Date(a.startTime) - new Date(b.startTime);
      }
    });

    setFilteredClasses(result);
  }, [searchQuery, selectedFilter, sortBy, classes]);

  const handleJoin = (classItem) => {
    const now = new Date();
    const startTime = new Date(classItem.startTime);
    const endTime = new Date(classItem.endTime);

    if (now < startTime) {
      alert('Class has not started yet!');
      return;
    }

    if (now > endTime) {
      alert('Class has already ended!');
      return;
    }

    if (classItem.meetingLink) {
      window.open(classItem.meetingLink, '_blank');
    } else {
      alert('Meeting link is not available for this class.');
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'long' }),
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const getClassDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end - start;
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (durationHours > 0) {
      return `${durationHours}h ${durationMinutes > 0 ? `${durationMinutes}m` : ''}`;
    }
    return `${durationMinutes}m`;
  };

  const getClassStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (now >= start && now <= end) return 'live';
    if (now < start) return 'upcoming';
    return 'completed';
  };

  const getStatusConfig = (startTime, endTime) => {
    const status = getClassStatus(startTime, endTime);
    switch (status) {
      case 'live':
        return {
          text: 'Live Now',
          color: 'bg-gradient-to-r from-green-500 to-emerald-600',
          icon: Video,
          badgeColor: 'bg-red-500'
        };
      case 'upcoming':
        return {
          text: 'Upcoming',
          color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
          icon: Calendar,
          badgeColor: 'bg-blue-500'
        };
      default:
        return {
          text: 'Completed',
          color: 'bg-gradient-to-r from-gray-500 to-gray-600',
          icon: CheckCircle,
          badgeColor: 'bg-gray-500'
        };
    }
  };

  const getSubjectIcon = (subject) => {
    return subjectIcons[subject] || subjectIcons.default;
  };

  const getInstructorInitials = (name) => {
    if (!name) return 'AI';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };


  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedFilter('all');
    setSortBy('upcoming');
  };

  // ⏳ While checking plan
  if (loadingPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium text-lg">Checking your subscription...</p>
          <p className="text-gray-400 text-sm mt-2">One moment please</p>
        </div>
      </div>
    );
  }

  // ❌ No active plan → show upgrade screen
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Premium Classes</h1>
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-600">PREMIUM FEATURE</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              Unlock Live Classes
            </h2>
            
            <p className="text-gray-600 text-center mb-8">
              Access expert-led live sessions, interactive workshops, and real-time Q&A by upgrading to a premium plan.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Live sessions with industry experts</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Interactive Q&A and doubt solving</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Recordings for later review</span>
              </div>
            </div>

            {planInfo && (
              <p className="text-center text-sm text-gray-500">
                Current plan: <span className="font-semibold text-gray-700">{planInfo.planCategory || 'Free Tier'}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ⏳ Loading classes
  if (loadingClasses) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-64 mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded-xl w-48 animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Live Classes
              </h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl">
              Join interactive live sessions with industry experts and enhance your skills in real-time
            </p>
            {planInfo?.planName && (
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">
                  Premium plan: <span className="font-semibold text-gray-700">{planInfo.planName}</span>
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search classes by title, topic, or instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => {
                const Icon = filter.icon;
                const isActive = selectedFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{filter.label}</span>
                    {isActive && (
                      <div className="ml-1 w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{classes.length}</div>
              <div className="text-sm text-gray-500">Total Classes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {classes.filter(c => getClassStatus(c.startTime, c.endTime) === 'live').length}
              </div>
              <div className="text-sm text-gray-500">Live Now</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {classes.filter(c => getClassStatus(c.startTime, c.endTime) === 'upcoming').length}
              </div>
              <div className="text-sm text-gray-500">Upcoming</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {classes.filter(c => getClassStatus(c.startTime, c.endTime) === 'completed').length}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        {error ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load Classes</h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        ) : filteredClasses.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedFilter === 'all' ? 'All Classes' : 
                 selectedFilter === 'live' ? 'Live Classes' :
                 selectedFilter === 'upcoming' ? 'Upcoming Classes' : 'Completed Classes'}
                <span className="ml-2 text-gray-500 font-normal">
                  ({filteredClasses.length} {filteredClasses.length === 1 ? 'class' : 'classes'})
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((classItem) => {
                const startDateTime = formatDateTime(classItem.startTime);
                const endDateTime = formatDateTime(classItem.endTime);
                const statusConfig = getStatusConfig(classItem.startTime, classItem.endTime);
                const subjectConfig = getSubjectIcon(classItem.subject);
                const SubjectIcon = subjectConfig.icon;
                const isLive = getClassStatus(classItem.startTime, classItem.endTime) === 'live';
                const isUpcoming = getClassStatus(classItem.startTime, classItem.endTime) === 'upcoming';

                return (
                  <div 
                    key={classItem._id} 
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group relative"
                  >
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusConfig.color} text-white text-xs font-semibold shadow-lg`}>
                        <statusConfig.icon className="w-3.5 h-3.5" />
                        <span>{statusConfig.text}</span>
                      </div>
                      {isLive && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                      )}
                    </div>

                    {/* Class Header */}
                    <div className={`relative p-6 ${isLive ? 'bg-gradient-to-br from-blue-50 to-indigo-50' : 'bg-gradient-to-br from-gray-50 to-blue-50'}`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${subjectConfig.color} shadow-lg`}>
                          <SubjectIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/5 text-gray-700">
                              {classItem.subject}
                            </span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500 capitalize">{classItem.classType}</span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {classItem.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {classItem.description || 'Join this interactive session to enhance your skills.'}
                          </p>
                        </div>
                      </div>

                      {/* Instructor Info */}
                      {classItem.instructor && (
                        <div className="flex items-center gap-3 mt-6 p-3 bg-white/50 rounded-xl border border-white/80 backdrop-blur-sm">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {getInstructorInitials(classItem.instructor.name)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{classItem.instructor.name}</div>
                            <div className="text-xs text-gray-500">{classItem.instructor.role || 'Expert Instructor'}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Class Details */}
                    <div className="p-6">
                      <div className="space-y-4 mb-6">
                        {/* Date Card */}
                        <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                            <CalendarDays className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{startDateTime.day}</div>
                            <div className="text-gray-600 text-sm">{startDateTime.date}</div>
                          </div>
                        </div>

                        {/* Time Card */}
                        <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                            <Clock className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{startDateTime.time} - {endDateTime.time}</div>
                            <div className="text-gray-600 text-sm">
                              {getClassDuration(classItem.startTime, classItem.endTime)} • {classItem.difficulty || 'Intermediate'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        {isLive || isUpcoming ? (
                          <button
                            onClick={() => handleJoin(classItem)}
                            className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 ${
                              isLive
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
                            }`}
                          >
                            {isLive ? (
                              <>
                                <Video className="w-5 h-5" />
                                <span>Join Live Class</span>
                                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                              </>
                            ) : (
                              <>
                                <Calendar className="w-5 h-5" />
                                <span>Join in {getClassDuration(new Date(), classItem.startTime)}</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="w-full py-3.5 bg-gray-100 text-gray-500 rounded-xl font-semibold text-center cursor-not-allowed border border-gray-200">
                            <CheckCircle className="w-5 h-5 inline-block mr-2" />
                            Class Completed
                          </div>
                        )}
                      
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="px-6 pb-6 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{classItem.enrolledCount || 0} enrolled</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="text-gray-600">{classItem.rating || 'New'}</span>
                          </div>
                        </div>
                        {classItem.prerequisites && classItem.prerequisites.length > 0 && (
                          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            {classItem.prerequisites.length} prerequisites
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Classes Found</h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
              {searchQuery 
                ? `No classes found matching "${searchQuery}"`
                : 'There are no live classes scheduled at the moment. Check back later for upcoming sessions.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Clear Search & Filters
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Classes;