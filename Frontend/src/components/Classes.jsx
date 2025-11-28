// components/Classes.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [planInfo, setPlanInfo] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

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
      return `${durationHours} hour${durationHours > 1 ? 's' : ''}${durationMinutes > 0 ? ` ${durationMinutes} min` : ''}`;
    }
    return `${durationMinutes} minutes`;
  };

  // Fixed: Single declaration of status functions
  const isOngoing = (startTime, endTime) => {
    const now = new Date();
    return now >= new Date(startTime) && now <= new Date(endTime);
  };

  const isUpcoming = (startTime) => {
    const now = new Date();
    return now < new Date(startTime);
  };

  const isCompleted = (endTime) => {
    const now = new Date();
    return now > new Date(endTime);
  };

  const getStatusText = (startTime, endTime) => {
    if (isOngoing(startTime, endTime)) return 'Live Now';
    if (isUpcoming(startTime)) return 'Upcoming';
    if (isCompleted(endTime)) return 'Closed';
    return '';
  };

  const getStatusColor = (startTime, endTime) => {
    if (isOngoing(startTime, endTime)) return 'bg-gradient-to-r from-green-500 to-emerald-600';
    if (isUpcoming(startTime)) return 'bg-gradient-to-r from-blue-500 to-indigo-600';
    return 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Frontend': 'from-blue-500 to-cyan-500',
      'Backend': 'from-green-500 to-emerald-500',
      'Architecture': 'from-purple-500 to-pink-500',
      'Database': 'from-orange-500 to-red-500',
      'Mobile': 'from-indigo-500 to-purple-500',
      'Other': 'from-gray-500 to-gray-600'
    };
    return colors[subject] || colors['Other'];
  };

  // ⏳ While checking plan
  if (loadingPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Checking your subscription...</p>
        </div>
      </div>
    );
  }

  // ❌ No active plan → show upgrade screen instead of classes
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-2xl text-white">🎓</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Upgrade Required
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Access premium live classes and expert-led sessions by upgrading your plan.
          </p>

          <button
            onClick={() => navigate('/payments')}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg mb-4"
          >
            View Plans & Pricing
          </button>

          {planInfo && (
            <p className="text-sm text-gray-500">
              Current plan: <span className="font-semibold text-gray-700">{planInfo.planCategory || 'Free Tier'}</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  // ⏳ Loading classes
  if (loadingClasses) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Live Classes
            </h1>
            <p className="text-gray-600 text-lg">Loading available classes...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

  // ❌ Error loading classes
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-3xl text-red-600">⚠️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load Classes</h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Live Classes
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join interactive live sessions with industry experts and enhance your skills in real-time
          </p>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.map((classItem) => {
            const startDateTime = formatDateTime(classItem.startTime);
            const endDateTime = formatDateTime(classItem.endTime);
            const ongoing = isOngoing(classItem.startTime, classItem.endTime);
            const upcoming = isUpcoming(classItem.startTime);
            const completed = isCompleted(classItem.endTime);

            return (
              <div 
                key={classItem._id} 
                className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
              >
                {/* Header with Gradient */}
                <div className={`bg-gradient-to-r ${getSubjectColor(classItem.subject)} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-black bg-opacity-20 text-white text-sm font-semibold backdrop-blur-sm">
                        {classItem.subject}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(classItem.startTime, classItem.endTime)} text-white shadow-lg`}>
                        {getStatusText(classItem.startTime, classItem.endTime)}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-white">
                      {classItem.title}
                    </h3>
                    
                    <p className="text-black text-sm line-clamp-2">
                      {classItem.description || 'Join this interactive session to enhance your skills.'}
                    </p>

                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  {/* Date and Time Information */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-lg">📅</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{startDateTime.day}</div>
                        <div className="text-gray-600 text-xs">{startDateTime.date}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-xl border border-green-100">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-lg">⏰</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{startDateTime.time} - {endDateTime.time}</div>
                        <div className="text-gray-600 text-xs">{getClassDuration(classItem.startTime, classItem.endTime)}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-xl border border-purple-100">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 text-lg">💻</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm capitalize">{classItem.classType}</div>
                        <div className="text-gray-600 text-xs">Online Session</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 border-t border-gray-200">
                    {(ongoing || upcoming) && classItem.meetingLink ? (
                      <button
                        onClick={() => handleJoin(classItem)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 group"
                      >
                        <span>{ongoing ? 'Join Live Class' : 'Join Class'}</span>
                        <span className="group-hover:scale-110 transition-transform">🎯</span>
                      </button>
                    ) : !classItem.meetingLink ? (
                      <div className="w-full bg-gray-100 text-gray-500 py-4 rounded-xl font-semibold text-center cursor-not-allowed border border-gray-200">
                        No Meeting Link
                      </div>
                    ) : completed ? (
                      <div className="w-full bg-gray-100 text-gray-500 py-4 rounded-xl font-semibold text-center cursor-not-allowed border border-gray-200">
                        Class Closed
                      </div>
                    ) : (
                      <div className="w-full bg-gray-100 text-gray-500 py-4 rounded-xl font-semibold text-center cursor-not-allowed border border-gray-200">
                        Unable to Join
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Classes Message */}
        {classes.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-3xl text-blue-600">📚</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Classes Scheduled</h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
              There are no live classes scheduled at the moment. Check back later for upcoming sessions.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Refresh Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Classes;