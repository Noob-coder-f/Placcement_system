// components/StudyMaterial.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudyMaterial = () => {
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [previewMaterial, setPreviewMaterial] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const itemsPerPage = 9;

  // Fetch materials from backend API
  // Fetch materials from backend API
  const fetchMaterials = async (page = 1) => {
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
    try {
      setPreviewLoading(true);
      
      // Create proper PDF viewer URL
      let pdfViewerUrl = material.pdfUrl;
      
      // If it's a direct Cloudinary PDF URL, we can use Google Docs viewer or embed directly
      if (material.pdfUrl.includes('cloudinary')) {
        // Option 1: Use Google Docs viewer (free, but may have limitations)
        pdfViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(material.pdfUrl)}&embedded=true`;
        
        // Option 2: Use the direct Cloudinary URL (if it supports embedding)
        // pdfViewerUrl = material.pdfUrl;
        
        // Option 3: Use our own API proxy for better security
        // pdfViewerUrl = `/api/intern/study-materials/${material._id}/preview`;
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
    sandbox: "allow-scripts allow-same-origin", // Prevents downloads
    allow: "autoplay", // Only allow autoplay, no downloads
    onContextMenu: (e) => e.preventDefault(),
    onKeyDown: (e) => {
      // Prevent keyboard shortcuts for save/print
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
    fetchMaterials(1);
  }, []);

  // Enhanced security measures for preview
  useEffect(() => {
    if (previewMaterial) {
      const preventDefault = (e) => {
        // Prevent right-click
        if (e.type === 'contextmenu') {
          e.preventDefault();
          return false;
        }
        
        // Prevent text selection
        if (e.type === 'selectstart') {
          e.preventDefault();
          return false;
        }
        
        // Prevent keyboard shortcuts (Ctrl+S, Ctrl+P, etc.)
        if ((e.ctrlKey || e.metaKey) && 
            (e.key === 's' || e.key === 'p' || e.key === 'o' || e.key === 'u')) {
          e.preventDefault();
          return false;
        }
      };

      // Add event listeners
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

  // Alternative PDF preview if iframe doesn't work
  const renderPDFPreview = () => {
    if (!previewMaterial) return null;

    return (
      <div className="w-full h-full">
        {/* Option 1: Direct iframe with Cloudinary URL */}
        <iframe
          src={previewMaterial.viewerUrl}
          className="w-full h-[75vh] border-0"
          title={`Preview: ${previewMaterial.title}`}
          {...iframeSecurityProps}
        />
        
        {/* Fallback message if iframe fails */}
        <div className="hidden" id="fallback-message">
          <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 mb-4">
              If the PDF is not loading, you can{' '}
              <a 
                href={previewMaterial.pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                open it in a new tab
              </a>
            </p>
            <button
              onClick={() => window.open(previewMaterial.pdfUrl, '_blank')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Open in New Tab
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Study Material</h1>
          <p className="text-gray-600 mt-2">Preview learning resources </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search by title, description, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <p className="text-red-800">{error}</p>
            </div>
            <button
              onClick={() => fetchMaterials(currentPage)}
              className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Materials Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => (
                <div key={material._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Subject Badge */}
                    <div className="flex justify-between items-start mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                        {material.subject}
                      </span>
                    </div>

                    {/* Title and Description */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{material.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {material.description || 'No description available'}
                    </p>

                    {/* Material Details */}
                    <div className="grid grid-cols-1 gap-2 text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <span className="mr-2">📚</span>
                        PDF Document
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">📅</span>
                        {new Date(material.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Preview Button */}
                    <button
                      onClick={() => handlePreview(material)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Preview Material
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* No Materials Message */}
            {filteredMaterials.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No study materials found</h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? `No materials found for "${searchTerm}"`
                    : 'No materials available yet.'
                  }
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Preview Modal */}
        {previewMaterial && (
          <div className="fixed inset-0 backdrop-blur bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[105vh] overflow-hidden">
              {/* Preview Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 truncate">{previewMaterial.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {previewMaterial.subject} • 
                  </p>
                </div>
                <button
                  onClick={closePreview}
                  className="text-gray-500 hover:text-gray-700 text-2xl bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center ml-4"
                >
                  ×
                </button>
              </div>

              {/* Preview Content */}
              <div className="p-1 bg-gray-100 h-full">
                {previewLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading preview...</span>
                  </div>
                ) : (
                  renderPDFPreview()
                )}
              </div>

              {/* Preview Footer */}
              <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-white">
                <p className="text-sm text-gray-600 truncate flex-1 mr-4">
                  {previewMaterial.description || 'No description available'}
                </p>
                <button
                  onClick={closePreview}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors whitespace-nowrap"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterial;