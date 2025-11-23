// components/StudyMaterial.js
import React, { useState } from 'react';

const StudyMaterial = () => {
  const [materials] = useState([
    {
      id: 1,
      title: 'React Fundamentals Guide',
      category: 'Frontend',
      type: 'PDF',
      pages: 45,
      size: '2.4 MB',
      description: 'Complete guide to React basics and advanced concepts',
      uploadedDate: '2024-01-10',
      isPaid: false
    },
    {
      id: 2,
      title: 'Node.js Advanced Patterns',
      category: 'Backend',
      type: 'PDF',
      pages: 62,
      size: '3.1 MB',
      description: 'Advanced Node.js patterns and best practices',
      uploadedDate: '2024-01-08',
      isPaid: true
    },
    {
      id: 3,
      title: 'System Design Primer',
      category: 'Architecture',
      type: 'PDF',
      pages: 89,
      size: '4.2 MB',
      description: 'Learn system design fundamentals',
      uploadedDate: '2024-01-05',
      isPaid: false
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Frontend', 'Backend', 'Architecture', 'Database', 'DevOps'];

  const filteredMaterials = selectedCategory === 'All' 
    ? materials 
    : materials.filter(material => material.category === selectedCategory);

  const handleDownload = (materialId) => {
    // Handle download logic
    alert(`Downloading material ${materialId}`);
  };

  const handlePurchase = (materialId) => {
    // Handle purchase logic
    alert(`Purchasing material ${materialId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Study Material</h1>
          <p className="text-gray-600 mt-2">Access learning resources and documentation</p>
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

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <div key={material.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    material.category === 'Frontend' ? 'bg-blue-100 text-blue-800' :
                    material.category === 'Backend' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {material.category}
                  </span>
                  {material.isPaid && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Paid
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{material.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{material.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                  <div className="flex items-center">
                    <span className="mr-1">📄</span>
                    {material.type}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">📖</span>
                    {material.pages} pages
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">💾</span>
                    {material.size}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">📅</span>
                    {material.uploadedDate}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {material.isPaid ? (
                    <button
                      onClick={() => handlePurchase(material.id)}
                      className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
                    >
                      Purchase
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDownload(material.id)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Download
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Materials Message */}
        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No study materials found</h3>
            <p className="text-gray-600">No materials available for the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterial;