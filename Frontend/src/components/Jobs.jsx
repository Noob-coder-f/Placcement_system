// components/Jobs.js
import React, { useState } from 'react';
import axios from 'axios';

const Jobs = () => {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Frontend Developer Intern',
      company: 'Tech Corp',
      location: 'Remote',
      type: 'Full-time',
      duration: '6 months',
      stipend: '$2000/month',
      skills: ['React', 'JavaScript', 'CSS'],
      description: 'We are looking for a skilled frontend developer...',
      postedDate: '2024-01-15',
      applied: false
    },
    {
      id: 2,
      title: 'Backend Developer Intern',
      company: 'Startup XYZ',
      location: 'New York, NY',
      type: 'Part-time',
      duration: '3 months',
      stipend: '$1500/month',
      skills: ['Node.js', 'MongoDB', 'Express'],
      description: 'Join our backend team to build scalable APIs...',
      postedDate: '2024-01-10',
      applied: true
    }
  ]);

  const [ setAppliedJobs] = useState([2]);
  const [freeApplicationsLeft, setFreeApplicationsLeft] = useState(2);

  const handleApply = async (jobId) => {
    if (freeApplicationsLeft <= 0) {
      alert('No free applications left. Please upgrade your plan.');
      return;
    }

    try {
      await axios.post('/api/jobs/apply', { jobId });
      setAppliedJobs(prev => [...prev, jobId]);
      setFreeApplicationsLeft(prev => prev - 1);
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, applied: true } : job
      ));
      alert('Application submitted successfully!');
    } catch (error) {
      alert('Error applying to job', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Internships</h1>
          <p className="text-gray-600 mt-2">
            {freeApplicationsLeft} free applications remaining
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-lg text-blue-600 font-medium mt-1">{job.company}</p>
                  </div>
                  {job.applied && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Applied
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">📍</span>
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">⏱️</span>
                    {job.type}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">📅</span>
                    {job.duration}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">💰</span>
                    {job.stipend}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Posted on {job.postedDate}</span>
                  <button
                    onClick={() => handleApply(job.id)}
                    disabled={job.applied || freeApplicationsLeft <= 0}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      job.applied
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : freeApplicationsLeft <= 0
                        ? 'bg-red-100 text-red-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {job.applied ? 'Applied' : freeApplicationsLeft <= 0 ? 'No Credits' : 'Apply Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Jobs Message */}
        {jobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs available</h3>
            <p className="text-gray-600">Check back later for new internship opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;