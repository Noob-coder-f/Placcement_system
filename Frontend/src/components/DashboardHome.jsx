// components/DashboardHome.js
import React from 'react';

const DashboardHome = () => {
  const stats = [
    { title: 'Jobs Applied', value: '5', subtitle: '2 free applications left', icon: '💼', color: 'bg-blue-100 text-blue-600' },
    { title: 'Mentor Feedback', value: '3', subtitle: 'Reviews received', icon: '👨‍🏫', color: 'bg-purple-100 text-purple-600' },
    { title: 'Hiring Feedback', value: '2', subtitle: 'From applications', icon: '👥', color: 'bg-orange-100 text-orange-600' },
    { title: 'Study Progress', value: '75%', subtitle: 'Courses completed', icon: '📚', color: 'bg-green-100 text-green-600' }
  ];

  const recentJobs = [
    { title: 'Frontend Developer', company: 'Tech Corp', status: 'applied', date: '2 days ago' },
    { title: 'Backend Intern', company: 'Startup XYZ', status: 'reviewed', date: '1 week ago' },
    { title: 'Full Stack Developer', company: 'Digital Solutions', status: 'accepted', date: '3 weeks ago' }
  ];

  const recentFeedback = [
    { type: 'mentor', comment: 'Great progress on React concepts!', rating: 4, date: '2024-01-15' },
    { type: 'hiring', comment: 'Strong technical skills demonstrated', rating: 5, date: '2024-01-10' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, John!</h1>
          <p className="text-gray-600 mt-2">Here's your internship journey at a glance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <span className="text-xl">{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentJobs.map((job, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{job.company}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {job.status}
                          </span>
                          <span className="text-xs text-gray-500">{job.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Feedback */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Feedback</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentFeedback.map((feedback, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start space-x-3">
                      <span className={`text-lg ${feedback.type === 'mentor' ? 'text-purple-600' : 'text-orange-600'}`}>
                        {feedback.type === 'mentor' ? '👨‍🏫' : '👥'}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">{feedback.comment}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{feedback.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;