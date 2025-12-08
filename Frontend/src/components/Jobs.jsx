// components/InternJobs.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Download,
  FileText,
  Upload,
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  Award,
  Star,
  X,
  AlertCircle,
  Lock,
  Users,
  BookOpen,
  Target,
  BriefcaseBusiness,
  Check
} from 'lucide-react';
import { toast } from 'react-toastify';

const InternJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [applyingJob, setApplyingJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationForm, setApplicationForm] = useState(null);
  const [applicationData, setApplicationData] = useState({});
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [freeApplicationsLeft, setFreeApplicationsLeft] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [planInfo, setPlanInfo] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: 'all',
    location: 'all',
    workMode: 'all',
    minStipend: '',
    maxStipend: '',
    experienceLevel: 'all'
  });

  // Fetch current plan info
  useEffect(() => {
    const fetchPlan = async () => {
      setLoadingPlan(true);
      try {
        const token = localStorage.getItem('interToken');
        const { data } = await axios.get('/api/payments/current-plan', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (data.success) {
          setPlanInfo(data);
          // Check if user has a paid plan or free credits
          const hasPlan = data.planCategory && data.planCategory !== 'NONE';
          const hasCredits = data.freeApplicationsLeft > 0;
          setHasAccess(hasPlan || hasCredits);
          
          // Set free applications
          if (data.freeApplicationsLeft !== undefined) {
            setFreeApplicationsLeft(data.freeApplicationsLeft);
          }
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

  // Fetch jobs from API
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('interToken');
      const response = await axios.get('/api/hiring/jobs', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          status: 'Open',
          isActive: true
        }
      });

      if (response.data.success) {
        const activeJobs = response.data.data.filter(job => 
          job.status === 'Open' && job.isActive
        );
        setJobs(activeJobs);
        setFilteredJobs(activeJobs);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast.error('Failed to load jobs');
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch application status
  const fetchApplicationStatus = async () => {
    try {
      const token = localStorage.getItem('interToken') || localStorage.getItem('token');
      const response = await axios.get('/api/jobs/applied', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const appliedJobIds = response.data.data.appliedJobs || [];
        setAppliedJobs(appliedJobIds);
        setTotalApplications(response.data.data.totalApplications || 0);
        
        // Update free applications if not set by plan API
        if (!planInfo && response.data.data.freeApplicationsLeft !== undefined) {
          setFreeApplicationsLeft(response.data.data.freeApplicationsLeft);
        }
      }
    } catch (error) {
      console.error('Failed to fetch application status:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplicationStatus();
  }, []);

  // Filter and search jobs
  useEffect(() => {
    let result = jobs;

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(job =>
        job.title?.toLowerCase().includes(searchLower) ||
        job.companyName?.toLowerCase().includes(searchLower) ||
        job.description?.toLowerCase().includes(searchLower) ||
        job.qualifications?.toLowerCase().includes(searchLower) ||
        (job.requiredSkills && job.requiredSkills.some(skill => 
          skill.toLowerCase().includes(searchLower)
        ))
      );
    }

    // Apply filters
    if (filters.jobType !== 'all') {
      result = result.filter(job => job.jobType === filters.jobType);
    }

    if (filters.location !== 'all') {
      if (filters.location === 'remote') {
        result = result.filter(job => job.workMode === 'Remote');
      } else if (filters.location === 'hybrid') {
        result = result.filter(job => job.workMode === 'Hybrid');
      } else {
        result = result.filter(job => job.location?.toLowerCase().includes(filters.location.toLowerCase()));
      }
    }

    if (filters.workMode !== 'all') {
      result = result.filter(job => job.workMode === filters.workMode);
    }

    if (filters.minStipend) {
      result = result.filter(job => {
        const minSalary = job.salary?.min || 0;
        return minSalary >= parseInt(filters.minStipend);
      });
    }

    if (filters.maxStipend) {
      result = result.filter(job => {
        const maxSalary = job.salary?.max || Infinity;
        return maxSalary <= parseInt(filters.maxStipend);
      });
    }

    if (filters.experienceLevel !== 'all') {
      result = result.filter(job => {
        const minExp = job.experienceRequired?.min || 0;
        if (filters.experienceLevel === 'fresher') return minExp === 0;
        if (filters.experienceLevel === '0-2') return minExp <= 2;
        if (filters.experienceLevel === '2-5') return minExp >= 2 && minExp <= 5;
        if (filters.experienceLevel === '5+') return minExp >= 5;
        return true;
      });
    }

    setFilteredJobs(result);
    setCurrentPage(1);
  }, [searchTerm, filters, jobs]);

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Check if apply button should be disabled
const canApply = (jobId) => {
  if (appliedJobs.includes(jobId)) return false;
  if (!hasAccess) return false;

  // ✅ Allow paid users even if credits = 0
  if (!planInfo?.planCategory || planInfo.planCategory === 'NONE') {
    if (freeApplicationsLeft <= 0) return false;
  }

  return true;
};

  // Handle view job details
  const handleViewJobDetails = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  // Handle apply button click
  const handleApplyClick = async (job) => {
    // Check if already applied
    if (appliedJobs.includes(job._id)) {
      toast.info("You have already applied for this job");
      return;
    }

    // Check plan access
    if (!hasAccess) {
      toast.error("Please upgrade your plan to apply for jobs");
      return;
    }

    // Check if job is still open
    if (job.status !== 'Open' || !job.isActive) {
      toast.error("This job is no longer accepting applications");
      return;
    }

    setApplyingJob(job);

    try {
      const token = localStorage.getItem("interToken");
      const { data } = await axios.get(
        `/api/intern/jobs/${job._id}/application-form`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        const form = data.data;
        setApplicationForm(form);

        // Initialize form values
        const initialData = {};
        
        // Add basic required fields
        initialData.full_name = "";
        initialData.email = "";
        initialData.mobile_number = "";
        initialData.resume = null;
        initialData.cover_letter = "";
        
        // Initialize custom fields
        form.customFields?.forEach((field) => {
          switch (field.fieldType) {
            case "checkbox":
              initialData[field.fieldKey] = field.defaultValue || [];
              break;
            case "file":
              initialData[field.fieldKey] = field.defaultValue || null;
              break;
            default:
              initialData[field.fieldKey] = field.defaultValue || "";
          }
        });

        setApplicationData(initialData);
        setShowApplicationForm(true);
        setShowJobDetails(false);
      }
    } catch (error) {
      console.error("Failed to fetch application form:", error);
      toast.error("Failed to load application form");
      setApplyingJob(null);
    }
  };

  // Handle form field change
  const handleFormChange = (fieldKey, value) => {
    setApplicationData(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  // Handle file upload
  const handleFileUpload = async (fieldKey, file, maxSizeMB = 5, allowedTypes = ['pdf', 'doc', 'docx']) => {
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size should be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      toast.error(`Please upload ${allowedTypes.join(', ').toUpperCase()} files only`);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fieldKey', fieldKey);
      
      const token = localStorage.getItem('interToken') || localStorage.getItem('token');
      const response = await axios.post('/api/upload/resume', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setApplicationData(prev => ({
          ...prev,
          [fieldKey]: response.data.fileUrl
        }));
        toast.success('File uploaded successfully');
      }
    } catch (error) {
      console.error('File upload failed:', error);
      toast.error('Failed to upload file');
    }
  };

  // Submit application form
  const handleSubmitApplication = async () => {
    if (!applyingJob) return;

    // Validate required fields
    const requiredFields = applicationForm?.customFields?.filter(field => field.required) || [];
    const missingFields = [];

    // Check basic required fields
    if (!applicationData.full_name?.trim()) missingFields.push('Full Name');
    if (!applicationData.email?.trim()) missingFields.push('Email');
    if (!applicationData.mobile_number?.trim()) missingFields.push('Mobile Number');
    if (!applicationData.resume) missingFields.push('Resume');

    // Check custom required fields
    requiredFields.forEach(field => {
      const value = applicationData[field.fieldKey];
      if (!value || (Array.isArray(value) && value.length === 0) || value.toString().trim() === '') {
        missingFields.push(field.label);
      }
    });

    if (missingFields.length > 0) {
      toast.error(`Please fill in required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicationData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate mobile number
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(applicationData.mobile_number)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      const token = localStorage.getItem('interToken') || localStorage.getItem('token');
      const response = await axios.post(
        `/api/jobs/${applyingJob._id}/apply`,
        {
          formData: applicationData,
          jobId: applyingJob._id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success('Application submitted successfully!');
        
        // Update local state
        setAppliedJobs(prev => [...prev, applyingJob._id]);
        setFreeApplicationsLeft(prev => prev - 1);
        setTotalApplications(prev => prev + 1);
        
        // Close form
        setShowApplicationForm(false);
        setApplyingJob(null);
        setApplicationData({});
        setApplicationForm(null);
        
        // Refresh jobs to update applied status
        fetchJobs();
        fetchApplicationStatus();
      }
    } catch (error) {
      console.error('Failed to submit application:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    }
  };

  // Render application form modal
  const renderApplicationForm = () => {
    if (!showApplicationForm || !applicationForm || !applyingJob) return null;

    return (
      <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[150vh] overflow-y-auto">
          {/* Form Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Apply for {applyingJob.title}</h2>
              <p className="text-gray-600">{applyingJob.companyName} • {applyingJob.location}</p>
              <div className="flex items-center mt-2 text-sm">
                <AlertCircle size={16} className="text-blue-600 mr-1" />
                <span className="text-blue-600">Job Credits left: {planInfo.jobCredits}</span>
                <span className="mx-2">•</span>
                <span className="text-red-500">* Required fields</span>
              </div>
            </div>
            <button
              onClick={() => {
                setShowApplicationForm(false);
                setApplyingJob(null);
                setApplicationData({});
                setApplicationForm(null);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-8">
            {/* Job Summary */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Job Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">Position:</span> {applyingJob.title}</div>
                <div><span className="font-medium">Company:</span> {applyingJob.companyName}</div>
                <div><span className="font-medium">Location:</span> {applyingJob.location}</div>
                <div><span className="font-medium">Type:</span> {applyingJob.jobType}</div>
                <div><span className="font-medium">Mode:</span> {applyingJob.workMode}</div>
                <div><span className="font-medium">Salary:</span> ₹{applyingJob.salary?.min || 'Not Given'} - ₹{applyingJob.salary?.max || 'Not Given'}</div>
              </div>
            </div>
            {/* Custom Fields Section */}
            {applicationForm.customFields && applicationForm.customFields.length > 0 && (
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
                <div className="space-y-6">
                  {applicationForm.customFields
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((field, index) => (
                    <div key={index} className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                        {field.placeholder && (
                          <span className="text-xs text-gray-500 ml-2">({field.placeholder})</span>
                        )}
                      </label>
                      
                      {renderFieldInput(field)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="text-blue-600 mr-2 mt-0.5" size={18} />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-2">Important Notes:</p>
                  <ul className="space-y-1">
                    <li className="flex items-start">
                      <Check size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                      Make sure all information is accurate before submitting
                    </li>
                    <li className="flex items-start">
                      <Check size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                      You cannot edit your application after submission
                    </li>
                    <li className="flex items-start">
                      <Check size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                      This will use 1 of your remaining applications
                    </li>
                    <li className="flex items-start">
                      <Check size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                      The employer will contact you via the email provided
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <div className="flex items-center">
                <Lock size={14} className="mr-1" />
                Your application data is secure and encrypted
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowApplicationForm(false);
                  setApplyingJob(null);
                  setApplicationData({});
                  setApplicationForm(null);
                }}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitApplication}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                disabled={applyingJob === null}
              >
                <CheckCircle size={18} className="mr-2" />
                Submit Application
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render field input based on type
  const renderFieldInput = (field) => {
    const value = applicationData[field.fieldKey] || field.defaultValue || '';
    const validation = field.validation || {};

    switch (field.fieldType) {
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
      case 'number':
        return (
          <input
            type={field.fieldType === 'number' ? 'number' : 'text'}
            value={value}
            onChange={(e) => handleFormChange(field.fieldKey, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min={validation.minValue}
            max={validation.maxValue}
            minLength={validation.minLength}
            maxLength={validation.maxLength}
            pattern={validation.regex}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFormChange(field.fieldKey, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            minLength={validation.minLength}
            maxLength={validation.maxLength}
            required={field.required}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFormChange(field.fieldKey, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={field.required}
          >
            <option value="">Select an option</option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option.value}>{option.label}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name={field.fieldKey}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleFormChange(field.fieldKey, e.target.value)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  required={field.required}
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );



      case 'file':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
            {value ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="text-green-600 mr-2" size={20} />
                  <div>
                    <span className="text-sm font-medium">File uploaded</span>
                    <p className="text-xs text-gray-500">Click replace to upload a new file</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleFormChange(field.fieldKey, '')}
                    className="text-red-600 text-sm hover:text-red-800"
                  >
                    Remove
                  </button>
                  <label className="cursor-pointer text-blue-600 text-sm hover:text-blue-800">
                    Replace
                    <input
                      type="file"
                      accept={validation.fileTypes?.map(t => `.${t}`).join(',') || ".pdf,.doc,.docx"}
                      className="hidden"
                      onChange={(e) => handleFileUpload(
                        field.fieldKey, 
                        e.target.files[0], 
                        validation.maxFileSizeMB || 5,
                        validation.fileTypes || ['pdf', 'doc', 'docx']
                      )}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                  Choose File
                  <input
                    type="file"
                    accept={validation.fileTypes?.map(t => `.${t}`).join(',') || ".pdf,.doc,.docx"}
                    className="hidden"
                    onChange={(e) => handleFileUpload(
                      field.fieldKey, 
                      e.target.files[0], 
                      validation.maxFileSizeMB || 5,
                      validation.fileTypes || ['pdf', 'doc', 'docx']
                    )}
                    required={field.required}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Max size: {validation.maxFileSizeMB || 5}MB • 
                  Allowed: {validation.fileTypes?.join(', ')?.toUpperCase() || "PDF, DOC, DOCX"}
                </p>
              </div>
            )}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFormChange(field.fieldKey, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={field.required}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFormChange(field.fieldKey, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            required={field.required}
          />
        );
    }
  };

  // Render job details modal
  const renderJobDetails = () => {
    if (!showJobDetails || !selectedJob) return null;

    return (
      <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                <p className="text-lg text-blue-600 font-medium mt-1">{selectedJob.companyName}</p>
              </div>
              <button
                onClick={() => {
                  setShowJobDetails(false);
                  setSelectedJob(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Job Quick Info */}
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <div className="flex items-center text-gray-600">
                <MapPin size={16} className="mr-2" />
                {selectedJob.location}
              </div>
              <div className="flex items-center text-gray-600">
                <Briefcase size={16} className="mr-2" />
                {selectedJob.jobType}
              </div>
              <div className="flex items-center text-gray-600">
                <Clock size={16} className="mr-2" />
                {selectedJob.workMode}
              </div>
              <div className="flex items-center text-gray-600">
                <DollarSign size={16} className="mr-2" />
                {selectedJob.salary?.min ? `₹${selectedJob.salary.min}` : 'Not Given'} - {selectedJob.salary?.max ? `₹${selectedJob.salary.max}` : 'Not Given'}
                {selectedJob.salary?.isNegotiable && ' (Not Fixed)'}
              </div>
              <div className="flex items-center text-gray-600">
                <Users size={16} className="mr-2" />
                {selectedJob.totalVacancies} vacancy{selectedJob.totalVacancies !== 1 ? 'ies' : ''}
              </div>
              {selectedJob.applicationDeadline && (
                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  Apply by: {new Date(selectedJob.applicationDeadline).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Job Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <BookOpen size={18} className="mr-2" />
                Job Description
              </h3>
              <div className="prose max-w-none text-gray-700">
                {selectedJob.description.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-3">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Qualifications */}
            {selectedJob.qualifications && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <GraduationCap size={18} className="mr-2" />
                  Qualifications
                </h3>
                <div className="prose max-w-none text-gray-700">
                  {selectedJob.qualifications.split('\n').map((line, idx) => (
                    <p key={idx} className="mb-1">{line}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Required Skills */}
            {selectedJob.requiredSkills && selectedJob.requiredSkills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Target size={18} className="mr-2" />
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Required */}
            {(selectedJob.experienceRequired?.min || selectedJob.experienceRequired?.max) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <BriefcaseBusiness size={18} className="mr-2" />
                  Experience Required
                </h3>
                <div className="text-gray-700">
                  {selectedJob.experienceRequired.min === 0 && !selectedJob.experienceRequired.max ? (
                    "Freshers can apply"
                  ) : (
                    <>
                      {selectedJob.experienceRequired.min} 
                      {selectedJob.experienceRequired.max ? 
                        ` - ${selectedJob.experienceRequired.max} years` : 
                        '+ years'
                      }
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Application Stats */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Application Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedJob.totalVacancies}</div>
                  <div className="text-sm text-gray-600">Total Vacancies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedJob.applicantsCount || 0}</div>
                  <div className="text-sm text-gray-600">Applicants</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedJob.totalVacancies > 0 && selectedJob.applicantsCount > 0 
                      ? Math.round((selectedJob.applicantsCount / selectedJob.totalVacancies) * 100)
                      : 0
                    }%
                  </div>
                  <div className="text-sm text-gray-600">Competition</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {selectedJob.status === 'Open' ? 'Open' : 'Closed'}
                  </div>
                  <div className="text-sm text-gray-600">Status</div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Posted on {new Date(selectedJob.createdAt).toLocaleDateString()}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowJobDetails(false);
                  setSelectedJob(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowJobDetails(false);
                  handleApplyClick(selectedJob);
                }}
                disabled={appliedJobs.includes(selectedJob._id) || !hasAccess || freeApplicationsLeft <= 0}
                className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                  appliedJobs.includes(selectedJob._id)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : !hasAccess
                    ? 'bg-red-100 text-red-400 cursor-not-allowed'
                    : freeApplicationsLeft <= 0
                    ? 'bg-yellow-100 text-yellow-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {appliedJobs.includes(selectedJob._id) ? (
                  <>
                    <CheckCircle size={16} className="mr-2" />
                    Already Applied
                  </>
                ) : !hasAccess ? (
                  <>
                    <Lock size={16} className="mr-2" />
                    Upgrade to Apply
                  </>
                ) : freeApplicationsLeft <= 0 ? (
                  <>
                    <AlertCircle size={16} className="mr-2" />
                    No Credits Left
                  </>
                ) : (
                  'Apply Now'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render job card
  const renderJobCard = (job) => {
    const isApplied = appliedJobs.includes(job._id);
    const canApplyJob = canApply(job._id);

    return (
      <div key={job._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
              <p className="text-lg text-blue-600 font-medium">{job.companyName}</p>
            </div>
            {isApplied && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle size={14} className="mr-1" />
                Applied
              </span>
            )}
          </div>

          {/* Job Details Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="flex items-center text-gray-600">
              <MapPin size={14} className="mr-2" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Briefcase size={14} className="mr-2" />
              {job.jobType}
            </div>
            <div className="flex items-center text-gray-600">
              <Clock size={14} className="mr-2" />
              {job.workMode}
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign size={14} className="mr-2" />
              ₹{job.salary?.min || 'Not Given'} - ₹{job.salary?.max || 'Not Given'}
            </div>
          </div>

          {/* Description Preview */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {job.description.substring(0, 120)}...
          </p>

          {/* Skills */}
          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {job.requiredSkills.slice(0, 3).map((skill, index) => (
                <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {skill}
                </span>
              ))}
              {job.requiredSkills.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600">
                  +{job.requiredSkills.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              onClick={() => handleViewJobDetails(job)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center hover:underline"
            >
              <Eye size={14} className="mr-1.5" />
              View Details
            </button>
            
            <div className="flex items-center space-x-2">
              {!hasAccess && (
                <span className="text-xs text-red-600 flex items-center">
                  <Lock size={12} className="mr-1" />
                  Upgrade to apply
                </span>
              )}
              <button
                onClick={() => handleApplyClick(job)}
                disabled={isApplied || !canApplyJob}
                className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center text-sm ${
                  isApplied
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : !canApplyJob
                    ? 'bg-red-50 text-red-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isApplied ? (
                  <>
                    <CheckCircle size={14} className="mr-1.5" />
                    Applied
                  </>
                ) : !canApplyJob ? (
                  <>
                    <Lock size={14} className="mr-1.5" />
                    Cannot Apply
                  </>
                ) : (
                  'Apply Now'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Available Internships & Jobs</h1>
          <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 space-y-3 md:space-y-0">
            <div className="text-gray-600">
              {loadingPlan ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Checking plan status...
                </div>
              ) : hasAccess ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle size={18} className="mr-2" />
                  <span>
                    Active Plan: {planInfo?.planCategory || 'Premium'} • 
                    <span className="font-medium ml-1">{planInfo.jobCredits} Job Credits are left</span>
                  </span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <AlertCircle size={18} className="mr-2" />
                  <span>
                    No active plan • 
                    <a href="/pricing" className="underline font-medium ml-1">Upgrade to apply</a>
                  </span>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600 bg-white px-3 py-1.5 rounded-lg border">
              Applied: <span className="font-semibold">{appliedJobs.length}</span> of <span className="font-semibold">{totalApplications}</span> total
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search jobs by title, company, skills, qualifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Filter size={16} className="mr-2" />
              <span>{filteredJobs.length} jobs found</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <select
                value={filters.jobType}
                onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="Internship">Internship</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
              <select
                value={filters.workMode}
                onChange={(e) => setFilters({ ...filters, workMode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Modes</option>
                <option value="Onsite">Onsite</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              <select
                value={filters.experienceLevel}
                onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Levels</option>
                <option value="fresher">Fresher</option>
                <option value="0-2">0-2 years</option>
                <option value="2-5">2-5 years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary (₹)</label>
              <input
                type="number"
                placeholder="Min"
                value={filters.minStipend}
                onChange={(e) => setFilters({ ...filters, minStipend: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary (₹)</label>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxStipend}
                onChange={(e) => setFilters({ ...filters, maxStipend: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({
                  jobType: 'all',
                  location: 'all',
                  workMode: 'all',
                  minStipend: '',
                  maxStipend: '',
                  experienceLevel: 'all'
                })}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Job Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-blue-600">{filteredJobs.length}</div>
            <div className="text-xs md:text-sm text-gray-600">Available Jobs</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-green-600">{appliedJobs.length}</div>
            <div className="text-xs md:text-sm text-gray-600">Applied Jobs</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-purple-600">{}</div>
            <div className="text-xs md:text-sm text-gray-600">Job Credits Left</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-orange-600">{totalApplications}</div>
            <div className="text-xs md:text-sm text-gray-600">Total Applications</div>
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredJobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
              {currentJobs.map(renderJobCard)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col md:flex-row items-center justify-between mt-8 space-y-4 md:space-y-0">
                <div className="text-sm text-gray-600">
                  Showing {Math.min(indexOfFirstJob + 1, filteredJobs.length)} to {Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} jobs
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        currentPage === idx + 1
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  jobType: 'all',
                  location: 'all',
                  workMode: 'all',
                  minStipend: '',
                  maxStipend: '',
                  experienceLevel: 'all'
                });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Plan Upgrade Banner (if no plan) */}
        {!loadingPlan && !hasAccess && (
          <div className="mt-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-lg p-4 md:p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg md:text-xl font-bold mb-2">🔒 Upgrade Your Plan to Apply</h3>
                <p className="opacity-90 text-sm md:text-base">Get access to all job postings and start applying today!</p>
              </div>
              <a
                href="/pricing"
                className="inline-block px-5 py-2.5 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-center text-sm md:text-base"
              >
                View Plans & Pricing
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Application Form Modal */}
      {renderApplicationForm()}

      {/* Job Details Modal */}
      {renderJobDetails()}
    </div>
  );
};

export default InternJobs;