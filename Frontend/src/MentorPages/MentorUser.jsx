import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Star,
  Eye,
  X,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  BookOpen,
  Github,
  FileText,
  Linkedin,
  GraduationCap,
  Code,
  Search
} from 'lucide-react';

const MentorUsers = () => {
  const [interns, setInterns] = useState([]);
  const [filteredInterns, setFilteredInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbackDialog, setFeedbackDialog] = useState({ open: false, intern: null });
  const [profileDialog, setProfileDialog] = useState({ open: false, intern: null });
  const [feedbacksDialog, setFeedbacksDialog] = useState({ open: false, intern: null });
  const [feedback, setFeedback] = useState({ rating: 0, comment: '', improvementSuggestions: '' });
  const [submitting, setSubmitting] = useState(false);

  // Fetch interns data
  const fetchInterns = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('mentorToken') || localStorage.getItem('token');
      const response = await axios.get('/api/mentors/interns', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const internsData = response.data.interns || response.data;
      setInterns(internsData);
      setFilteredInterns(internsData);
    } catch (err) {
      console.error('Error fetching interns:', err);
      setError('Failed to load interns data');
      // Fallback data with only essential information
      const fallbackData = [
        {
          _id: 1,
          name: 'Alice Johnson',
          email: 'alice@example.com',
          phone: '+1 234 567 8900',
          college: 'MIT',
          course: 'Computer Science',
          yearOfStudy: 3,
          domain: 'Frontend Development',
          skills: [
            { name: 'React' },
            { name: 'JavaScript' },
            { name: 'TypeScript' },
            { name: 'CSS' }
          ],
          resumeUrl: 'https://example.com/resume-alice.pdf',
          githubUrl: 'https://github.com/alicejohnson',
          linkedinUrl: 'https://linkedin.com/in/alicejohnson',
          profileImage: '',
          mentorFeedback: [
            { 
              _id: 1, 
              rating: 5, 
              comment: 'Excellent work on the React project!', 
              improvementSuggestions: 'Continue exploring advanced React patterns',
              date: '2024-02-15' 
            },
            { 
              _id: 2, 
              rating: 4, 
              comment: 'Good progress, needs more practice with state management', 
              improvementSuggestions: 'Practice with Redux and Context API',
              date: '2024-01-20' 
            }
          ],
          createdAt: '2024-01-15'
        },
        {
          _id: 2,
          name: 'Bob Smith',
          email: 'bob@example.com',
          phone: '+1 234 567 8901',
          college: 'Stanford University',
          course: 'Software Engineering',
          yearOfStudy: 4,
          domain: 'Backend Development',
          skills: [
            { name: 'Node.js' },
            { name: 'Python' },
            { name: 'MongoDB' },
            { name: 'Docker' }
          ],
          resumeUrl: 'https://example.com/resume-bob.pdf',
          githubUrl: 'https://github.com/bobsmith',
          linkedinUrl: 'https://linkedin.com/in/bobsmith',
          profileImage: '',
          mentorFeedback: [
            { 
              _id: 1, 
              rating: 4, 
              comment: 'Great understanding of Node.js concepts', 
              improvementSuggestions: 'Work on database optimization techniques',
              date: '2024-02-10' 
            }
          ],
          createdAt: '2024-02-01'
        }
      ];
      setInterns(fallbackData);
      setFilteredInterns(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // Filter interns based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredInterns(interns);
    } else {
      const filtered = interns.filter(intern =>
        intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intern.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intern.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intern.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intern.course.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInterns(filtered);
    }
  }, [searchTerm, interns]);

  // Submit feedback
  const handleSubmitFeedback = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('mentorToken') || localStorage.getItem('token');
      
      await axios.post('/api/mentors/feedback', {
        internId: feedbackDialog.intern._id,
        rating: feedback.rating,
        comment: feedback.comment,
        improvementSuggestions: feedback.improvementSuggestions
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      const updatedInterns = interns.map(intern => {
        if (intern._id === feedbackDialog.intern._id) {
          const newFeedback = {
            _id: Date.now(),
            rating: feedback.rating,
            comment: feedback.comment,
            improvementSuggestions: feedback.improvementSuggestions,
            date: new Date().toISOString().split('T')[0]
          };
          return {
            ...intern,
            mentorFeedback: [newFeedback, ...intern.mentorFeedback]
          };
        }
        return intern;
      });

      setInterns(updatedInterns);
      setFilteredInterns(updatedInterns);
      setFeedbackDialog({ open: false, intern: null });
      setFeedback({ rating: 0, comment: '', improvementSuggestions: '' });
      alert('Feedback submitted successfully!');
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  // Open feedback dialog
  const handleOpenFeedback = (intern) => {
    setFeedbackDialog({ open: true, intern });
    setFeedback({ rating: 0, comment: '', improvementSuggestions: '' });
  };

  // Open profile dialog
  const handleOpenProfile = (intern) => {
    setProfileDialog({ open: true, intern });
  };

  // Open feedbacks dialog
  const handleOpenFeedbacks = (intern) => {
    setFeedbacksDialog({ open: true, intern });
  };

  // Calculate average rating
  const calculateAverageRating = (feedbacks) => {
    if (!feedbacks || feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
    return (sum / feedbacks.length).toFixed(1);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600">Loading interns...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Interns</h1>
          <p className="text-gray-600 mt-2">Manage and track your interns</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search interns by name, email, college, domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Showing {filteredInterns.length} of {interns.length} interns
          {searchTerm && (
            <span className="text-blue-600"> for "{searchTerm}"</span>
          )}
        </p>
      </div>

      {/* Interns Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">College</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Domain</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rating</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Join Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInterns.length > 0 ? (
                filteredInterns.map((intern) => (
                  <tr key={intern._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={intern.profileImage || `https://ui-avatars.com/api/?name=${intern.name}&background=random`}
                          alt={intern.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <span className="font-medium text-gray-900">{intern.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{intern.email}</td>
                    <td className="px-6 py-4 text-gray-600">{intern.college}</td>
                    <td className="px-6 py-4 text-gray-600">{intern.domain}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">
                          {calculateAverageRating(intern.mentorFeedback)}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({intern.mentorFeedback?.length || 0})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(intern.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenFeedback(intern)}
                          className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Feedback
                        </button>
                        <button
                          onClick={() => handleOpenProfile(intern)}
                          className="inline-flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No interns found</h3>
                      <p className="text-gray-600">
                        {searchTerm ? `No results found for "${searchTerm}". Try a different search term.` : 'No interns available.'}
                      </p>
                      {searchTerm && (
                        <button
                          onClick={clearSearch}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback Dialog */}
      {feedbackDialog.open && feedbackDialog.intern && (
        <div className="fixed inset-0 backdrop-blur-sm backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Provide Feedback for {feedbackDialog.intern.name}
              </h2>
              <button
                onClick={() => setFeedbackDialog({ open: false, intern: null })}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= feedback.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                <textarea
                  value={feedback.comment}
                  onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide detailed feedback for the intern..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Improvement Suggestions</label>
                <textarea
                  value={feedback.improvementSuggestions}
                  onChange={(e) => setFeedback(prev => ({ ...prev, improvementSuggestions: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Suggest areas for improvement and growth..."
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setFeedbackDialog({ open: false, intern: null })}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                disabled={!feedback.rating || !feedback.comment || submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
              >
                {submitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{submitting ? 'Submitting...' : 'Submit Feedback'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Dialog */}
      {profileDialog.open && profileDialog.intern && (
        <div className="fixed inset-0 backdrop-blur-sm backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Intern Profile</h2>
              <button
                onClick={() => setProfileDialog({ open: false, intern: null })}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Header Section */}
              <div className="flex items-start space-x-6 mb-8">
                <img
                  src={profileDialog.intern.profileImage || `https://ui-avatars.com/api/?name=${profileDialog.intern.name}&background=random`}
                  alt={profileDialog.intern.name}
                  className="w-24 h-24 rounded-full border-4 border-blue-100"
                />
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {profileDialog.intern.name}
                  </h3>
                  <p className="text-lg text-gray-600 mb-4">{profileDialog.intern.domain}</p>
                  
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{profileDialog.intern.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{profileDialog.intern.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>{profileDialog.intern.college}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{profileDialog.intern.course} - Year {profileDialog.intern.yearOfStudy}</span>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center space-x-4 mt-4">
                    {profileDialog.intern.githubUrl && (
                      <a
                        href={profileDialog.intern.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <Github className="h-5 w-5" />
                        <span className="text-sm">GitHub</span>
                      </a>
                    )}
                    {profileDialog.intern.linkedinUrl && (
                      <a
                        href={profileDialog.intern.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <Linkedin className="h-5 w-5" />
                        <span className="text-sm">LinkedIn</span>
                      </a>
                    )}
                    {profileDialog.intern.resumeUrl && (
                      <a
                        href={profileDialog.intern.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <FileText className="h-5 w-5" />
                        <span className="text-sm">Resume</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profileDialog.intern.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {calculateAverageRating(profileDialog.intern.mentorFeedback)}
                  </div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <MessageSquare className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {profileDialog.intern.mentorFeedback?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Feedbacks</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {new Date(profileDialog.intern.createdAt).getFullYear()}
                  </div>
                  <div className="text-sm text-gray-600">Joined</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setProfileDialog({ open: false, intern: null });
                    handleOpenFeedback(profileDialog.intern);
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Give Feedback</span>
                </button>
                <button
                  onClick={() => {
                    setProfileDialog({ open: false, intern: null });
                    handleOpenFeedbacks(profileDialog.intern);
                  }}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Star className="h-5 w-5" />
                  <span>View Feedbacks</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedbacks Dialog */}
      {feedbacksDialog.open && feedbacksDialog.intern && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Feedbacks for {feedbacksDialog.intern.name}
              </h2>
              <button
                onClick={() => setFeedbacksDialog({ open: false, intern: null })}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {feedbacksDialog.intern.mentorFeedback && feedbacksDialog.intern.mentorFeedback.length > 0 ? (
                <div className="space-y-6">
                  {feedbacksDialog.intern.mentorFeedback.map((fb) => (
                    <div key={fb._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-5 w-5 ${
                                  star <= fb.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{fb.rating}/5</span>
                        </div>
                        <span className="text-sm text-gray-500">{fb.date}</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">Comments</h4>
                          <p className="text-gray-700">{fb.comment}</p>
                        </div>
                        
                        {fb.improvementSuggestions && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">Improvement Suggestions</h4>
                            <p className="text-gray-700">{fb.improvementSuggestions}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Feedbacks Yet</h3>
                  <p className="text-gray-600">You haven't provided any feedback for this intern.</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setFeedbacksDialog({ open: false, intern: null });
                  handleOpenFeedback(feedbacksDialog.intern);
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add New Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorUsers;