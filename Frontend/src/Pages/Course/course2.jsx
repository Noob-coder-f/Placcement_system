import React from 'react';
import { useNavigate } from 'react-router-dom';

const CVBuilding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 text-blue-500 hover:text-blue-700 font-semibold"
        >
          ← Back to Courses
        </button>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            CV Building Course
          </h1>
          <p className="text-gray-600 mb-6">
            Learn to strengthen your CV and create compelling cover letters.
          </p>
          
          {/* Add your course content here */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Course Content</h2>
            <p>Your course materials will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilding;
