import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MentorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    linkedinUrl: '',
    githubUrl: '',
    profileImage: '',
    domain: []
  });

  const [newDomain, setNewDomain] = useState('');

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('mentorToken');
  };

  // Show message helper
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  // Fetch mentor data
  const fetchMentorData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        showMessage('Please login to access your profile', 'error');
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/mentors/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const mentorData = response.data;
      setFormData({
        name: mentorData.name || '',
        email: mentorData.email || '',
        phone: mentorData.phone || '',
        experience: mentorData.experience || '',
        linkedinUrl: mentorData.linkedinUrl || '',
        githubUrl: mentorData.githubUrl || '',
        profileImage: mentorData.profileImage || '',
        domain: mentorData.domain || []
      });
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        showMessage('Session expired. Please login again.', 'error');
        localStorage.removeItem('mentorToken');
      } else {
        showMessage('Failed to load profile data', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Update mentor data
  const handleSave = async () => {
    try {
      setSaving(true);
      const token = getToken();
      
      if (!token) {
        showMessage('Authentication required', 'error');
        return;
      }

      // Prepare data for API (exclude email as it might not be editable)
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        experience: formData.experience,
        linkedinUrl: formData.linkedinUrl,
        githubUrl: formData.githubUrl,
        domain: formData.domain,
        profileImage: formData.profileImage
      };

      const response = await axios.put('/api/mentors/profile', updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setFormData(prev => ({
        ...prev,
        ...response.data
      }));
      setIsEditing(false);
      showMessage('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.status === 401) {
        showMessage('Session expired. Please login again.', 'error');
        localStorage.removeItem('mentorToken');
      } else {
        showMessage('Failed to update profile', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addDomain = () => {
    if (newDomain.trim() && !formData.domain.includes(newDomain.trim())) {
      setFormData(prev => ({
        ...prev,
        domain: [...prev.domain, newDomain.trim()]
      }));
      setNewDomain('');
    }
  };

  const removeDomain = (index) => {
    setFormData(prev => ({
      ...prev,
      domain: prev.domain.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showMessage('Image size should be less than 5MB', 'error');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      showMessage('Please upload an image file', 'error');
      return;
    }

    try {
      const uploadData = new FormData();
      uploadData.append('image', file);

      const token = getToken();
      const response = await axios.post('/api/upload/profile-image', uploadData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData(prev => ({
        ...prev,
        profileImage: response.data.imageUrl
      }));
      showMessage('Profile image updated!', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      if (error.response?.status === 401) {
        showMessage('Session expired. Please login again.', 'error');
        localStorage.removeItem('mentorToken');
      } else {
        showMessage('Failed to upload image', 'error');
      }
    }
  };

  const handleCancel = () => {
    fetchMentorData();
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addDomain();
    }
  };

  useEffect(() => {
    fetchMentorData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {message.text}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your professional information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={formData.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto border-4 border-white/30 shadow-lg object-cover"
                  />
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </label>
                  )}
                </div>
                
                <h2 className="text-xl font-bold mt-4">{formData.name}</h2>
                <p className="text-blue-100 mt-1">{formData.experience || 0} years of experience</p>
                
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {formData.domain.slice(0, 3).map((domain, index) => (
                    <span key={index} className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      {domain}
                    </span>
                  ))}
                  {formData.domain.length === 0 && (
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      No domains added
                    </span>
                  )}
                </div>

                <button
                  onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                  className="mt-6 w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isEditing ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700 break-all">{formData.email}</span>
                </div>
                
                {formData.phone && (
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-700">{formData.phone}</span>
                  </div>
                )}

                {formData.linkedinUrl && (
                  <a 
                    href={formData.linkedinUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span>LinkedIn Profile</span>
                  </a>
                )}

                {formData.githubUrl && (
                  <a 
                    href={formData.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-900 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>GitHub Profile</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => handleChange('experience', e.target.value)}
                    disabled={!isEditing}
                    min="0"
                    max="50"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                    placeholder="Years of experience"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => handleChange('githubUrl', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>

              {/* Domains Section */}
              <div className="mt-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">Areas of Expertise</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.domain.map((domain, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm flex items-center gap-2">
                      {domain}
                      {isEditing && (
                        <button
                          onClick={() => removeDomain(index)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          type="button"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                  {formData.domain.length === 0 && !isEditing && (
                    <span className="text-gray-500 text-sm">No domains added yet</span>
                  )}
                </div>
                
                {isEditing && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a domain (e.g., React, Node.js, Python)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                    <button
                      onClick={addDomain}
                      disabled={!newDomain.trim()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      type="button"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              {/* Save Buttons */}
              {isEditing && (
                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg hover:from-blue-700 hover:to-purple-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                    type="button"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
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

export default MentorProfile;