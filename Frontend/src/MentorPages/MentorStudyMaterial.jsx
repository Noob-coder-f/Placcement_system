import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MentorStudyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [previewMaterial, setPreviewMaterial] = useState(null);
  const [previewDialog, setPreviewDialog] = useState(false);

  const [newMaterial, setNewMaterial] = useState({
    title: '',
    subject: '',
    description: '',
    file: null
  });

  const subjectColors = {
    // Programming & Development
    'Web Development': 'bg-blue-100 text-blue-800 border-blue-200',
    'Mobile Development': 'bg-blue-200 text-blue-900 border-blue-300',
    'Backend Development': 'bg-blue-50 text-blue-700 border-blue-100',
    'Frontend Development': 'bg-sky-100 text-sky-800 border-sky-200',
    'Full Stack Development': 'bg-indigo-100 text-indigo-800 border-indigo-200',

    // AI & Data Science
    'AI/ML': 'bg-purple-100 text-purple-800 border-purple-200',
    'Data Science': 'bg-purple-200 text-purple-900 border-purple-300',
    'Deep Learning': 'bg-violet-100 text-violet-800 border-violet-200',
    'Natural Language Processing': 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
    'Computer Vision': 'bg-pink-100 text-pink-800 border-pink-200',

    // DevOps & Cloud
    'DevOps': 'bg-green-100 text-green-800 border-green-200',
    'Cloud Computing': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Containerization': 'bg-teal-100 text-teal-800 border-teal-200',
    'CI/CD': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'Infrastructure as Code': 'bg-lime-100 text-lime-800 border-lime-200',

    // Data & Databases
    'Database Management': 'bg-amber-100 text-amber-800 border-amber-200',
    'Big Data': 'bg-orange-100 text-orange-800 border-orange-200',
    'Data Analytics': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Data Engineering': 'bg-amber-50 text-amber-700 border-amber-100',

    // Cybersecurity
    'Cybersecurity': 'bg-red-100 text-red-800 border-red-200',
    'Network Security': 'bg-rose-100 text-rose-800 border-rose-200',
    'Ethical Hacking': 'bg-pink-50 text-pink-700 border-pink-100',

    // Other Technologies
    'Blockchain': 'bg-stone-100 text-stone-800 border-stone-200',
    'IoT': 'bg-neutral-100 text-neutral-800 border-neutral-200',
    'Game Development': 'bg-stone-200 text-stone-900 border-stone-300',
    'AR/VR': 'bg-stone-50 text-stone-700 border-stone-100',

    // Fundamentals
    'Programming Fundamentals': 'bg-teal-50 text-teal-700 border-teal-100',
    'Algorithms & Data Structures': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Software Engineering': 'bg-cyan-50 text-cyan-700 border-cyan-100',
    'System Design': 'bg-teal-100 text-teal-800 border-teal-200',

    // Business & Soft Skills
    'Project Management': 'bg-slate-100 text-slate-800 border-slate-200',
    'UI/UX Design': 'bg-gray-100 text-gray-800 border-gray-200',
    'Business Analytics': 'bg-slate-200 text-slate-900 border-slate-300'
  };

  // Fetch materials from backend
  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/mentor/study-materials');
      setMaterials(response.data.data);
      setFilteredMaterials(response.data.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
      showSnackbar('Error fetching study materials', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);




  const getPdfViewerUrl = (pdfUrl) => {
  if (!pdfUrl) return "";
  return `https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
};


  // Filter materials based on search term and subject
  useEffect(() => {
    let filtered = materials;

    if (searchTerm) {
      filtered = filtered.filter(material =>
        material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubject) {
      filtered = filtered.filter(material =>
        material.subject === selectedSubject
      );
    }

    setFilteredMaterials(filtered);
  }, [searchTerm, selectedSubject, materials]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => setSnackbar({ ...snackbar, open: false }), 6000);
  };

  const handleUpload = async () => {
    if (!newMaterial.title || !newMaterial.subject || !newMaterial.file) {
      showSnackbar('Please fill all fields and select a file', 'error');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('title', newMaterial.title);
      formData.append('subject', newMaterial.subject);
      formData.append('description', newMaterial.description);
      formData.append('file', newMaterial.file);

      const response = await axios.post('/api/mentor/study-materials/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setMaterials(prev => [response.data, ...prev]);
      setUploadDialog(false);
      setNewMaterial({ title: '', subject: '', description: '', file: null });
      setUploadProgress(0);
      showSnackbar('Material uploaded successfully!');
    } catch (error) {
      console.error('Error uploading material:', error);
      showSnackbar('Error uploading material', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/mentor/study-materials/${id}`);
      setMaterials(materials.filter(material => material._id !== id));
      showSnackbar('Material deleted successfully!');
    } catch (error) {
      console.error('Error deleting material:', error);
      showSnackbar('Error deleting material', 'error');
    }
  };

  const handlePreview = (material) => {
    setPreviewMaterial(material);
    setPreviewDialog(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type !== 'application/pdf') {
      showSnackbar('Please select a PDF file', 'error');
      return;
    }
    setNewMaterial(prev => ({ ...prev, file }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSubject('');
  };

  // Get unique subjects for filter dropdown
  const uniqueSubjects = [...new Set(materials.map(material => material.subject))].sort();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-purple-50/50 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-3xl mb-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Study Materials</h1>
            <p className="text-lg opacity-90">Manage and share educational resources with your students</p>
            <p className="text-sm opacity-80 mt-2">
              {materials.length} materials available • {filteredMaterials.length} filtered
            </p>
          </div>
          <button
            onClick={() => setUploadDialog(true)}
            className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload Material
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="md:col-span-4">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Subjects</option>
              {uniqueSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <button
              onClick={clearFilters}
              disabled={!searchTerm && !selectedSubject}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || selectedSubject) && (
          <div className="mt-4 flex gap-2 flex-wrap">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-blue-200 text-blue-700 bg-blue-100 text-sm">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="hover:text-blue-900">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {selectedSubject && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-purple-200 text-purple-700 bg-purple-100 text-sm">
                Subject: {selectedSubject}
                <button onClick={() => setSelectedSubject('')} className="hover:text-purple-900">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="bg-white/80 p-16 text-center rounded-2xl shadow-sm">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-2xl text-gray-500 mb-3">
            {materials.length === 0 ? 'No Study Materials Yet' : 'No Materials Found'}
          </h3>
          <p className="text-gray-400 mb-6">
            {materials.length === 0
              ? 'Start by uploading your first study material to share with students'
              : 'Try adjusting your search terms or filters to find what you\'re looking for'
            }
          </p>
          <button
            onClick={() => setUploadDialog(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 mx-auto hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload New Material
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <div
              key={material._id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
            >
              <div className="p-6 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${subjectColors[material.subject] || 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${subjectColors[material.subject] || 'bg-blue-100 text-blue-800 border-blue-200'
                    }`}>
                    {material.subject}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                  {material.title}
                </h3>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {material.description}
                </p>
                <p className="text-sm text-gray-500 mt-3">
                  Uploaded: {new Date(material.uploadDate || material.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="p-4 pt-0 flex gap-2">
                <button
                  onClick={() => handlePreview(material)}
                  className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </button>
                <button
                  onClick={() => handleDelete(material._id)}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      {uploadDialog && (
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="bg-blue-600 text-white p-6 rounded-t-2xl text-center">
              <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h2 className="text-2xl font-bold">Upload Study Material</h2>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, title: e.target.value }))}
                  disabled={uploading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />

                <select
                  value={newMaterial.subject}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, subject: e.target.value }))}
                  disabled={uploading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="">Select Subject</option>
                  {Object.keys(subjectColors).map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>

                <textarea
                  placeholder="Description"
                  value={newMaterial.description}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, description: e.target.value }))}
                  disabled={uploading}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50"
                />

                <label className={`block w-full px-4 py-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-blue-50'
                  } ${newMaterial.file ? 'border-green-400 bg-green-50' : 'border-gray-300'}`}>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {newMaterial.file ? newMaterial.file.name : 'Choose PDF File'}
                </label>

                {(uploadProgress > 0 || uploading) && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-center text-gray-600 text-sm mt-2">
                      {uploading ? `Uploading... ${uploadProgress}%` : 'Preparing upload...'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => setUploadDialog(false)}
                disabled={uploading}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!newMaterial.title || !newMaterial.subject || !newMaterial.file || uploading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? 'Uploading...' : 'Upload Material'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Dialog */}
      {/* PDF Preview Dialog */}
      {previewDialog && previewMaterial && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {previewMaterial.title}
              </h3>
              <button
                onClick={() => setPreviewDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* PDF viewer */}
            <div className="flex-1">
              {previewMaterial.pdfUrl ? (
                <iframe
                  src={getPdfViewerUrl(previewMaterial.pdfUrl)}
                  title={previewMaterial.title}
                  className="w-full h-full"
                />
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <p className="text-gray-600 mb-2">No PDF URL found.</p>
                  <p className="text-sm text-gray-500">
                    Please check that this material has a valid <code>pdfUrl</code>.
                  </p>
                </div>
              )}
            </div>

            {/* Footer actions (optional) */}
            <div className="p-4 border-t flex justify-end gap-2">
              {previewMaterial.pdfUrl && (
                <a
                  href={previewMaterial.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Open in new tab
                </a>
              )}
            </div>
          </div>
        </div>
      )}




      {/* Snackbar for notifications */}
      {snackbar.open && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-xl shadow-lg ${snackbar.severity === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}>
          {snackbar.message}
        </div>
      )}
    </div>
  );
};

export default MentorStudyMaterials;