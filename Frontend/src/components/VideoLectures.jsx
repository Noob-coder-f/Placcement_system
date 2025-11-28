// components/VideoLectures.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VideoLectures = () => {
  const [videos, setVideos] = useState([]);
  const [planInfo, setPlanInfo] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  // Fetch videos data from backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoadingVideos(true);
        const { data } = await axios.get('/api/intern/video-lectures');
        
        if (data.success) {
          setVideos(data.videos);
        } else {
          setError('Failed to load video lectures');
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Error loading video lectures. Please try again.');
      } finally {
        setLoadingVideos(false);
      }
    };

    if (hasAccess) {
      fetchVideos();
    }
  }, [hasAccess]);

  const handleWatch = (video) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVideo(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Checking your subscription...</p>
        </div>
      </div>
    );
  }

  // ❌ No active plan → show upgrade screen
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-3xl text-white">🎥</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade Required
          </h1>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Unlock premium video lectures, expert-led content, and comprehensive learning materials by upgrading your plan.
          </p>

          <button
            onClick={() => navigate('/payments')}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg mb-6"
          >
            View Plans & Pricing
          </button>

          {planInfo && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-600">
                Current plan: <span className="font-semibold text-gray-800">{planInfo.planCategory || 'Free Tier'}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ⏳ Loading videos
  if (loadingVideos) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Video Library
            </h1>
            <p className="text-gray-600 text-xl">Loading premium video content...</p>
          </div>
          
          {/* Loading Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2 mb-6">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ❌ Error loading videos
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-4xl text-red-600">⚠️</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Unable to Load Videos</h3>
            <p className="text-gray-600 text-xl mb-8 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Video Library
            </h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              Access premium video lectures from industry experts and accelerate your learning journey
            </p>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div 
                key={video._id} 
                className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
              >
                {/* Thumbnail with Gradient Overlay */}
                <div className="relative overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 bg-black/80 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                    {video.duration}
                  </div>
                  
                  {/* Subject Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${getSubjectColor(video.subject)} text-white shadow-lg`}>
                      {video.subject}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {video.description || 'No description available.'}
                  </p>

                  {/* Additional Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center space-x-1">
                      <span>📅</span>
                      <span>{formatDate(video.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>👨‍🏫</span>
                      <span>Mentor</span>
                    </div>
                  </div>

                  {/* Watch Button */}
                  <button
                    onClick={() => handleWatch(video)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 group/btn"
                  >
                    <span>Watch Now</span>
                    <span className="group-hover/btn:scale-110 transition-transform">▶️</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Videos Message */}
          {videos.length === 0 && (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <span className="text-5xl text-blue-600">📚</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No Videos Available</h3>
              <p className="text-gray-600 text-xl max-w-md mx-auto mb-8">
                We're preparing amazing video content for you. Check back soon for new lectures!
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Refresh Page
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {showModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedVideo.title}</h2>
                <p className="text-gray-600 mt-1">{selectedVideo.subject} • {selectedVideo.duration}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Video Player */}
            <div className="p-6">
              <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
                <video
                  controls
                  className="w-full h-full"
                  poster={selectedVideo.thumbnail}
                >
                  <source src={selectedVideo.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedVideo.description || 'No description available.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="font-semibold text-gray-700">Subject:</span>
                    <span className="ml-2 text-gray-600">{selectedVideo.subject}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="font-semibold text-gray-700">Duration:</span>
                    <span className="ml-2 text-gray-600">{selectedVideo.duration}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeModal}
                className="bg-gray-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoLectures;