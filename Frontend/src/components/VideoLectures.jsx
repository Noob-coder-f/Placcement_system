// components/VideoLectures.js
import React, { useState } from 'react';

const VideoLectures = () => {
  const [videos] = useState([
    {
      id: 1,
      title: 'React Hooks Deep Dive',
      instructor: 'Sarah Johnson',
      duration: '45:32',
      category: 'Frontend',
      thumbnail: '/api/placeholder/320/180',
      description: 'Learn about useState, useEffect, and custom hooks',
      isPaid: false,
      price: 0
    },
    {
      id: 2,
      title: 'Advanced Node.js Patterns',
      instructor: 'Mike Chen',
      duration: '1:22:15',
      category: 'Backend',
      thumbnail: '/api/placeholder/320/180',
      description: 'Master advanced Node.js patterns and best practices',
      isPaid: true,
      price: 29.99
    },
    {
      id: 3,
      title: 'System Design Fundamentals',
      instructor: 'Alex Rodriguez',
      duration: '1:15:43',
      category: 'Architecture',
      thumbnail: '/api/placeholder/320/180',
      description: 'Learn the basics of system design',
      isPaid: false,
      price: 0
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Frontend', 'Backend', 'Architecture', 'Database', 'Mobile'];

  const filteredVideos = selectedCategory === 'All' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  const handleWatch = (videoId) => {
    // Handle video playback
    alert(`Playing video ${videoId}`);
  };

  const handlePurchase = (videoId) => {
    // Handle video purchase
    alert(`Purchasing video ${videoId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Video Lectures</h1>
          <p className="text-gray-600 mt-2">Learn from expert instructors through video content</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>
                {video.isPaid && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-sm font-medium">
                    Paid
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    video.category === 'Frontend' ? 'bg-blue-100 text-blue-800' :
                    video.category === 'Backend' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {video.category}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{video.instructor}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{video.description}</p>

                <div className="flex justify-between items-center">
                  {video.isPaid ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-gray-900">${video.price}</span>
                      <button
                        onClick={() => handlePurchase(video.id)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
                      >
                        Purchase
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleWatch(video.id)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Watch Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Videos Message */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No video lectures found</h3>
            <p className="text-gray-600">No videos available for the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoLectures;