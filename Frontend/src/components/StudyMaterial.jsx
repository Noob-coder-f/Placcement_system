// components/StudyMaterial.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiSearch,
  FiFileText,
  FiCalendar,
  FiBook,
  FiDownload,
  FiX,
  FiLock,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi';
import { GraduationCap, Sparkles, CheckCircle } from 'lucide-react';
import { MdOutlinePictureAsPdf } from 'react-icons/md';

const StudyMaterial = () => {
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [previewMaterial, setPreviewMaterial] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [planInfo, setPlanInfo] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(true);
  
  const itemsPerPage = 9;

  // Fetch user's current plan
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

  // Fetch materials from backend API
  const fetchMaterials = async (page = 1) => {
    if (!hasAccess) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`/api/intern/study-materials`, {
        params: {
          page,
          limit: itemsPerPage
        }
      });
      
      setFilteredMaterials(response.data.materials);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setError(null);
    } catch (err) {
      setError('Failed to fetch study materials');
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search materials by title, description, or subject
  const searchMaterials = async (searchQuery) => {
    if (!hasAccess) return;
    
    if (!searchQuery.trim()) {
      fetchMaterials(currentPage);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`/api/intern/study-materials/search`, {
        params: {
          query: searchQuery,
          page: 1,
          limit: itemsPerPage
        }
      });
      
      setFilteredMaterials(response.data.materials);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (err) {
      setError('Search failed');
      console.error('Error searching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle preview material
  const handlePreview = async (material) => {
    if (!hasAccess) return;
    
    try {
      setPreviewLoading(true);
      
      // Create proper PDF viewer URL
      let pdfViewerUrl = material.pdfUrl;
      
      if (material.pdfUrl.includes('cloudinary')) {
        // Use Google Docs viewer for Cloudinary PDFs
        pdfViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(material.pdfUrl)}&embedded=true`;
      }
      
      setPreviewMaterial({
        id: material._id,
        title: material.title,
        description: material.description,
        subject: material.subject,
        pdfUrl: material.pdfUrl,
        viewerUrl: pdfViewerUrl,
        uploadedBy: material.uploadedBy,
        createdAt: material.createdAt
      });
    } catch (err) {
      alert('Failed to load preview');
      console.error('Preview error:', err);
    } finally {
      setPreviewLoading(false);
    }
  };

  // Close preview
  const closePreview = () => {
    setPreviewMaterial(null);
  };

  // Enhanced security for iframe
  const iframeSecurityProps = {
    sandbox: "allow-scripts allow-same-origin",
    allow: "autoplay",
    onContextMenu: (e) => e.preventDefault(),
    onKeyDown: (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p')) {
        e.preventDefault();
      }
    }
  };

  // Handle search with debouncing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchMaterials(searchTerm);
      } else {
        fetchMaterials(currentPage);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      if (searchTerm) {
        searchMaterials(searchTerm, newPage);
      } else {
        fetchMaterials(newPage);
      }
    }
  };

  // Initial fetch
  useEffect(() => {
    if (hasAccess) {
      fetchMaterials(1);
    }
  }, [hasAccess]);

  // Enhanced security measures for preview
  useEffect(() => {
    if (previewMaterial) {
      const preventDefault = (e) => {
        if (e.type === 'contextmenu') {
          e.preventDefault();
          return false;
        }
        
        if (e.type === 'selectstart') {
          e.preventDefault();
          return false;
        }
        
        if ((e.ctrlKey || e.metaKey) && 
            (e.key === 's' || e.key === 'p' || e.key === 'o' || e.key === 'u')) {
          e.preventDefault();
          return false;
        }
      };

      document.addEventListener('contextmenu', preventDefault);
      document.addEventListener('selectstart', preventDefault);
      document.addEventListener('keydown', preventDefault);

      return () => {
        document.removeEventListener('contextmenu', preventDefault);
        document.removeEventListener('selectstart', preventDefault);
        document.removeEventListener('keydown', preventDefault);
      };
    }
  }, [previewMaterial]);

  // Render PDF preview
  const renderPDFPreview = () => {
    if (!previewMaterial) return null;

    return (
      <div className="w-full h-full">
        <iframe
          src={previewMaterial.viewerUrl}
          className="w-full h-[75vh] border-0 rounded-lg shadow-inner"
          title={`Preview: ${previewMaterial.title}`}
          {...iframeSecurityProps}
        />
        
        <div className="hidden" id="fallback-message">
          <div className="text-center p-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 mb-4">
              If the PDF is not loading, you can{' '}
              <a 
                href={previewMaterial.pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                open it in a new tab
              </a>
            </p>
            <button
              onClick={() => window.open(previewMaterial.pdfUrl, '_blank')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
            >
              Open in New Tab
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Get subject color
  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': 'from-purple-500 to-pink-500',
      'Science': 'from-green-500 to-teal-500',
      'History': 'from-amber-500 to-orange-500',
      'Literature': 'from-blue-500 to-indigo-500',
      'Technology': 'from-cyan-500 to-blue-500',
      'Business': 'from-emerald-500 to-green-500',
      'Arts': 'from-rose-500 to-pink-500',
      'Languages': 'from-violet-500 to-purple-500'
    };
    return colors[subject] || 'from-gray-500 to-gray-700';
  };

  // Access Denied Component
  const AccessDenied = () => (
     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Premium Study Material</h1>
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-600">PREMIUM FEATURE</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              Unlock Exclusive Learning Resources
            </h2>
            
            <p className="text-gray-600 text-center mb-8">
              Access a curated library of premium study materials designed to enhance your learning experience and help you excel in your career.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Comprehensive study guides and notes</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Interactive quizzes and practice tests</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Detailed explanations and examples</span>
              </div>
            </div>

            {planInfo && (
              <p className="text-center text-sm text-gray-500">
                Current plan: <span className="font-semibold text-gray-700">{planInfo.planCategory || 'Free Tier'}</span>
              </p>
            )}
          </div>
        </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Study Material Library
              </h1>
              <p className="text-gray-600 mt-2 flex items-center">
                <FiBook className="mr-2" />
                Preview and explore premium learning resources
              </p>
            </div>
            
            {hasAccess && planInfo && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center">
                  <FiCheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <p className="font-semibold text-green-800">{planInfo.planName}</p>
                    <p className="text-sm text-green-600">Full Access Granted</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          {hasAccess && (
            <div className="mb-8">
              <div className="relative max-w-2xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by title, description, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all text-lg"
                  disabled={!hasAccess}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <FiX className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Loading State for Plan */}
        {loadingPlan && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Checking your access permissions...</p>
          </div>
        )}

        {/* Access Denied State */}
        {!loadingPlan && !hasAccess && !loading && <AccessDenied />}

        {/* Loading State for Materials */}
        {hasAccess && loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-100"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
                <MdOutlinePictureAsPdf className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-600 text-lg mt-4">Loading study materials...</p>
          </div>
        )}

        {/* Error State */}
        {hasAccess && error && (
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center">
              <FiAlertCircle className="w-6 h-6 text-rose-600 mr-3" />
              <div className="flex-1">
                <p className="text-rose-800 font-medium">{error}</p>
                <button
                  onClick={() => fetchMaterials(currentPage)}
                  className="mt-2 text-rose-600 hover:text-rose-800 text-sm font-medium inline-flex items-center"
                >
                  <FiRefreshCw className="w-3 h-3 mr-1" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Materials Grid */}
        {hasAccess && !loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredMaterials.map((material) => (
                <div 
                  key={material._id} 
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden transform hover:-translate-y-1"
                >
                  <div className={`h-2 bg-gradient-to-r ${getSubjectColor(material.subject)}`}></div>
                  <div className="p-6">
                    {/* Subject Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getSubjectColor(material.subject)} text-white`}>
                        {material.subject}
                      </span>
                      <MdOutlinePictureAsPdf className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>

                    {/* Title and Description */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {material.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 min-h-[60px]">
                      {material.description || 'No description available'}
                    </p>

                    {/* Material Details */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <FiCalendar className="w-4 h-4 mr-1" />
                          {new Date(material.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <FiFileText className="w-4 h-4 mr-1" />
                          PDF
                        </span>
                      </div>
                    </div>

                    {/* Preview Button */}
                    <button
                      onClick={() => handlePreview(material)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center group/btn"
                    >
                      <span>Preview Material</span>
                      <FiDownload className="ml-2 w-4 h-4 opacity-0 group-hover/btn:opacity-100 transform group-hover/btn:translate-y-0.5 transition-all" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* No Materials Message */}
            {filteredMaterials.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-6">
                  <FiBook className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No study materials found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {searchTerm 
                    ? `No materials found for "${searchTerm}". Try a different search term.`
                    : 'Study materials will appear here once available.'
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-6 text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                  >
                    <FiX className="w-4 h-4 mr-1" />
                    Clear Search
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && filteredMaterials.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredMaterials.length)} materials
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all ${
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Preview Modal */}
        {previewMaterial && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Preview Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white sticky top-0 z-10">
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-gray-900 truncate">{previewMaterial.title}</h3>
                  <div className="flex items-center flex-wrap gap-2 mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${getSubjectColor(previewMaterial.subject)} text-white`}>
                      {previewMaterial.subject}
                    </span>
                    <span className="text-gray-500 text-sm flex items-center">
                      <FiCalendar className="w-3 h-3 mr-1" />
                      {new Date(previewMaterial.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closePreview}
                  className="ml-6 flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors"
                  aria-label="Close preview"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Preview Content */}
              <div className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 h-full">
                {previewLoading ? (
                  <div className="flex flex-col items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600 mb-4"></div>
                    <span className="text-gray-600 text-lg">Loading preview...</span>
                  </div>
                ) : (
                  renderPDFPreview()
                )}
              </div>

              {/* Preview Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-t border-gray-200 bg-white">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-600 truncate">
                    {previewMaterial.description || 'No description available'}
                  </p>
                </div>
                <div className="flex items-center space-x-4 flex-shrink-0">
                  <button
                    onClick={() => window.open(previewMaterial.pdfUrl, '_blank')}
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <FiDownload className="w-4 h-4 mr-2" />
                    Download
                  </button>
                  <button
                    onClick={closePreview}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterial;