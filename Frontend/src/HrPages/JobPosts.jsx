import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  Eye,
  Edit2,
  Palette ,
  Megaphone ,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  User,
  Mail,
  Phone,
  Home,
  Globe,
  Hash,
  BookOpen,
  Award,
  FileText,
  Upload,
  Link,
  Code,
  Target,
  Building,
  GraduationCap,
  BriefcaseIcon,
  Star,
  Languages,
  FileCheck,
  FolderOpen,
  Percent,
  ChevronDown,
  Type,
  GripVertical,
  Save,
  Settings,
  Heart,
  Check,
  File,
  Image,
  FileUp,
  ExternalLink,
  MessageSquare,
  CreditCard,
  Users as UsersIcon,
  Bell,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Sparkles,
  Zap,
  Wand2,
  ChevronRight,
  Shield,
  Clock,
  Download,
  FileSpreadsheet,
  Layers,
  Smartphone,
  Mail as MailIcon,
  UserCheck,
  Bookmark,
  TrendingUp,
  Copy,
  MoreVertical,
  Download as DownloadIcon,
  Share2,
} from "lucide-react";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// ===============================
// ROLE-BASED TEMPLATES
// ===============================
const ROLE_TEMPLATES = {
  internship: {
    name: "Internship Template",
    icon: <GraduationCap size={20} />,
    description: "Best for internship positions",
    suggestedFields: [
      "full_name", "email", "mobile_number", "resume", "university_name", 
      "degree_name", "year_of_passing", "current_city", "skills"
    ],
    tips: [
      "Focus on education and academic projects",
      "Include semester/year of study",
      "Ask for college/university details"
    ]
  },
  developer: {
    name: "Developer Template",
    icon: <Code size={20} />,
    description: "Best for software developer roles",
    suggestedFields: [
      "full_name", "email", "mobile_number", "resume", "github_url", 
      "portfolio_url", "technical_skills", "total_experience", "current_company"
    ],
    tips: [
      "GitHub profile is highly recommended",
      "Include technical skills section",
      "Ask for portfolio/project links"
    ]
  },
  designer: {
    name: "Designer Template",
    icon: <Palette size={20} />,
    description: "Best for UI/UX designer roles",
    suggestedFields: [
      "full_name", "email", "mobile_number", "resume", "portfolio_url", 
      "behance_dribbble", "tools_technologies", "previous_projects"
    ],
    tips: [
      "Portfolio link is mandatory",
      "Include Behance/Dribbble profiles",
      "Ask for design tool proficiency"
    ]
  },
  marketing: {
    name: "Marketing Template",
    icon: <Megaphone size={20} />,
    description: "Best for marketing roles",
    suggestedFields: [
      "full_name", "email", "mobile_number", "resume", "portfolio_url", 
      "writing_samples", "soft_skills", "previous_compaigns"
    ],
    tips: [
      "Include writing samples section",
      "Ask for campaign results",
      "Focus on communication skills"
    ]
  },
  hr: {
    name: "HR/Recruiter Template",
    icon: <UsersIcon size={20} />,
    description: "Best for HR and recruitment roles",
    suggestedFields: [
      "full_name", "email", "mobile_number", "resume", "soft_skills", 
      "languages_known", "total_experience", "current_company"
    ],
    tips: [
      "Focus on communication skills",
      "Include language proficiency",
      "Ask for recruitment experience"
    ]
  }
};

// ===============================
// PREDEFINED FIELDS LIBRARY
// ===============================
const PREDEFINED_FIELDS_LIBRARY = [
  // Basic Info
  { key: "full_name", label: "Full Name", fieldType: "text", required: true, icon: <User size={16} />, category: "basic", tip: "Full name of the applicant" },
  { key: "email", label: "Email Address", fieldType: "email", required: true, icon: <Mail size={16} />, category: "basic", tip: "Primary email for communication" },
  { key: "mobile_number", label: "Mobile Number", fieldType: "phone", required: true, icon: <Phone size={16} />, category: "basic", tip: "10-digit mobile number" },
  { key: "alternate_contact", label: "Alternate Contact", fieldType: "phone", required: false, icon: <Smartphone size={16} />, category: "basic", tip: "Secondary contact number" },
  
  // Education
  { key: "highest_qualification", label: "Highest Qualification", fieldType: "text", required: true, icon: <GraduationCap size={16} />, category: "education", tip: "e.g., Bachelor's Degree, Master's Degree" },
  { key: "university_name", label: "University/College", fieldType: "text", required: true, icon: <Building size={16} />, category: "education", tip: "Name of university or college" },
  { key: "degree_name", label: "Degree Name", fieldType: "text", required: true, icon: <BookOpen size={16} />, category: "education", tip: "e.g., Computer Science, MBA" },
  { key: "year_of_passing", label: "Year of Passing", fieldType: "number", required: true, icon: <Calendar size={16} />, category: "education", tip: "Graduation year" },
  { key: "percentage_cgpa", label: "Percentage/CGPA", fieldType: "number", required: true, icon: <Percent size={16} />, category: "education", tip: "Academic score" },
  
  // Professional
  { key: "total_experience", label: "Total Experience (Years)", fieldType: "number", required: true, icon: <BriefcaseIcon size={16} />, category: "professional", tip: "Years of professional experience" },
  { key: "current_company", label: "Current Company", fieldType: "text", required: true, icon: <Building size={16} />, category: "professional", tip: "Current employer name" },
  { key: "current_designation", label: "Current Designation", fieldType: "text", required: true, icon: <Briefcase size={16} />, category: "professional", tip: "Current job title" },
  { key: "current_ctc", label: "Current CTC (₹)", fieldType: "number", required: true, icon: <DollarSign size={16} />, category: "professional", tip: "Current annual salary" },
  { key: "expected_salary", label: "Expected Salary (₹)", fieldType: "number", required: true, icon: <CreditCard size={16} />, category: "professional", tip: "Expected annual salary" },
  { key: "notice_period", label: "Notice Period (Days)", fieldType: "number", required: true, icon: <Bell size={16} />, category: "professional", tip: "Days required to join" },
  
  // Skills
  { key: "technical_skills", label: "Technical Skills", fieldType: "textarea", required: true, icon: <Code size={16} />, category: "skills", tip: "Comma separated technical skills" },
  { key: "soft_skills", label: "Soft Skills", fieldType: "textarea", required: true, icon: <UsersIcon size={16} />, category: "skills", tip: "Communication, leadership, etc." },
  { key: "tools_technologies", label: "Tools & Technologies", fieldType: "textarea", required: true, icon: <Settings size={16} />, category: "skills", tip: "Software, tools, frameworks" },
  { key: "languages_known", label: "Languages Known", fieldType: "textarea", required: true, icon: <Languages size={16} />, category: "skills", tip: "Languages with proficiency level" },
  
  // Portfolio
  { key: "github_url", label: "GitHub Profile", fieldType: "url", required: false, icon: <Code size={16} />, category: "portfolio", tip: "GitHub profile URL" },
  { key: "portfolio_url", label: "Portfolio URL", fieldType: "url", required: false, icon: <Link size={16} />, category: "portfolio", tip: "Personal portfolio website" },
  { key: "linkedin_url", label: "LinkedIn Profile", fieldType: "url", required: false, icon: <Link size={16} />, category: "portfolio", tip: "LinkedIn profile URL" },
  { key: "behance_dribbble", label: "Behance/Dribbble", fieldType: "url", required: false, icon: <Image size={16} />, category: "portfolio", tip: "Design portfolio links" },
  
  // Documents
  { key: "resume", label: "Resume/CV", fieldType: "file", required: true, icon: <File size={16} />, category: "documents", tip: "PDF/DOC file, max 2MB" },
  { key: "cover_letter", label: "Cover Letter", fieldType: "file", required: false, icon: <FileText size={16} />, category: "documents", tip: "Optional cover letter" },
  { key: "portfolio_file", label: "Portfolio PDF", fieldType: "file", required: false, icon: <FileUp size={16} />, category: "documents", tip: "Portfolio as PDF" },
  
  // Additional
  { key: "current_city", label: "Current City", fieldType: "text", required: true, icon: <MapPin size={16} />, category: "additional", tip: "Current city of residence" },
  { key: "willing_to_relocate", label: "Willing to Relocate?", fieldType: "radio", required: true, options: [{label: "Yes", value: "yes"}, {label: "No", value: "no"}], icon: <Globe size={16} />, category: "additional", tip: "Relocation preference" },
  { key: "notice_period_select", label: "Notice Period", fieldType: "select", required: true, options: [{label: "Immediate", value: "0"}, {label: "15 Days", value: "15"}, {label: "30 Days", value: "30"}, {label: "60 Days", value: "60"}, {label: "90 Days", value: "90"}], icon: <Clock size={16} />, category: "additional", tip: "Notice period duration" },
];

// ===============================
// FIELD TYPE DESCRIPTIONS
// ===============================
const FIELD_TYPE_DESCRIPTIONS = {
  text: "Single line text input",
  email: "Email address with validation",
  phone: "Phone number with validation",
  number: "Numeric input only",
  url: "Website URL with validation",
  textarea: "Multi-line text input",
  select: "Dropdown with options",
  radio: "Multiple choice (select one)",
  checkbox: "Multiple choice (select many)",
  date: "Date picker",
  file: "File upload",
};

// ===============================
// VALIDATION TIPS
// ===============================
const VALIDATION_TIPS = {
  resume: "Resume should be PDF or DOCX format, max 2MB size",
  email: "Enter a valid email address (e.g., name@company.com)",
  phone: "Phone number should be 10 digits",
  url: "Enter a valid URL starting with http:// or https://",
  file: "Maximum file size: 5MB. Supported formats vary by field",
};

// ===============================
// MAIN COMPONENT
// ===============================
const JobPosts = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({ status: "all", type: "all" });
  
  // Job Creation State
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [showEditWizard, setShowEditWizard] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [wizardStep, setWizardStep] = useState(1);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    jobType: "Full-Time",
    location: "",
    workMode: "Onsite",
    requiredSkills: [],
    experienceRequired: { min: 0, max: null },
    qualifications: "",
    salary: { min: "", max: "", currency: "INR", isNegotiable: false },
    companyName: "",
    applicationDeadline: "",
    totalVacancies: 1,
    status: "Open",
    customFields: [],
  });
  
  // Form Builder State
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [showFieldLibrary, setShowFieldLibrary] = useState(false);
  const [fieldSearch, setFieldSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newCustomField, setNewCustomField] = useState({
    fieldKey: "",
    label: "",
    fieldType: "text",
    placeholder: "",
    required: false,
    options: [],
    validation: { maxFileSizeMB: 2, fileTypes: ["pdf", "docx"] },
    order: 0,
  });
  
  const jobTypeOptions = ["Full-Time", "Part-Time", "Internship", "Contract", "Freelance"];
  const workModeOptions = ["Onsite", "Remote", "Hybrid"];

  // Filter fields based on search and category
  const filteredFields = PREDEFINED_FIELDS_LIBRARY.filter(field => {
    const matchesSearch = fieldSearch === "" || 
      field.label.toLowerCase().includes(fieldSearch.toLowerCase()) ||
      field.category.toLowerCase().includes(fieldSearch.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
      field.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getToken = () => {
    return localStorage.getItem("HiringTeamToken") || localStorage.getItem("token");
  };

  const fetchJobs = async () => {   
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get("/api/hiring/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setJobs(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      toast.error("Failed to load jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ===============================
  // API CALL FUNCTIONS
  // ===============================
  
  // View Job Details
  const handleViewJob = async (jobId) => {
    try {
      const token = getToken();
      const response = await axios.get(`/api/hiring/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setSelectedJob(response.data.data);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error("Failed to fetch job details:", error);
      toast.error("Failed to load job details");
    }
  };

  // Edit Job - Load Data
  const handleEditJob = async (jobId) => {
    try {
      const token = getToken();
      const response = await axios.get(`/api/hiring/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setNewJob(response.data.data);
        setShowEditWizard(true);
        setWizardStep(1);
      }
    } catch (error) {
      console.error("Failed to fetch job for editing:", error);
      toast.error("Failed to load job for editing");
    }
  };

  // Update Job
const handleUpdateJob = async () => {
  try {
    if (!newJob?._id) {
      toast.error("Invalid job data");
      return;
    }

    const token = getToken();

    const response = await axios.put(
      `/api/hiring/jobs/${newJob._id}`,
      {
        ...newJob,
        customFields: newJob.customFields || [],
        salary: newJob.salary || {},
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data?.success) {
      toast.success("Job updated successfully ✅");
      setShowEditWizard(false);
      setSelectedJob(null);
      resetWizard();
      fetchJobs();
    }
  } catch (error) {
    console.error("Failed to update job:", error);
    toast.error(error.response?.data?.message || "Failed to update job");
  }
};

  // Update Job Status
  const handleUpdateStatus = async (status) => {
    if (!selectedJob) return;

    try {
      const token = getToken();
      const response = await axios.patch(`/api/hiring/jobs/${selectedJob._id}/status`, 
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success(`Job status updated to ${status}`);
        setShowStatusModal(false);
        setSelectedJob(null);
        fetchJobs();
      }
    } catch (error) {
      console.error("Failed to update job status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  }

  // Export Job Applicants
  const handleExportApplicants = async (jobId) => {
    try {
      const token = getToken();
      const response = await axios.get(`/api/hiring/jobs/${jobId}/export-applicants`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `applicants_${jobId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Applicants exported successfully!");
    } catch (error) {
      console.error("Failed to export applicants:", error);
      toast.error("Failed to export applicants");
    }
  };

  // ===============================
  // HANDLER FUNCTIONS
  // ===============================
  
  // STEP 1: JOB DETAILS HANDLERS
  const handleJobDetailsChange = (field, value) => {
    setNewJob(prev => ({ ...prev, [field]: value }));
  };

  const handleSalaryChange = (field, value) => {
    setNewJob(prev => ({
      ...prev,
      salary: { ...prev.salary, [field]: value }
    }));
  };

  const handleAddSkill = (skill) => {
    if (skill && !newJob.requiredSkills.includes(skill)) {
      setNewJob(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skill]
      }));
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setNewJob(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
    }));
  };

  // STEP 2: FORM BUILDER HANDLERS
  const handleApplyTemplate = (templateKey) => {
    const template = ROLE_TEMPLATES[templateKey];
    if (!template) return;
    
    setActiveTemplate(templateKey);
    
    // Add suggested fields
    const newFields = template.suggestedFields
      .map(fieldKey => PREDEFINED_FIELDS_LIBRARY.find(f => f.key === fieldKey))
      .filter(Boolean)
      .map((field, index) => ({
        fieldKey: field.key,
        label: field.label,
        fieldType: field.fieldType,
        placeholder: `Enter ${field.label.toLowerCase()}`,
        required: field.required,
        options: field.options || [],
        validation: field.fieldType === "file" 
          ? { maxFileSizeMB: 2, fileTypes: ["pdf", "docx"] } 
          : {},
        order: index,
      }));
    
    setNewJob(prev => ({
      ...prev,
      customFields: [...newFields]
    }));
    
    toast.success(`${template.name} applied! ${template.tips[0]}`);
  };

  const handleAddFieldFromLibrary = (field) => {
    const existingKeys = newJob.customFields.map(f => f.fieldKey);
    if (existingKeys.includes(field.key)) {
      toast.info("Field already added to form");
      return;
    }

    const newField = {
      fieldKey: field.key,
      label: field.label,
      fieldType: field.fieldType,
      placeholder: `Enter ${field.label.toLowerCase()}`,
      required: field.required,
      options: field.options || [],
      validation: field.fieldType === "file" 
        ? { maxFileSizeMB: 2, fileTypes: ["pdf", "docx"] } 
        : {},
      order: newJob.customFields.length,
    };

    setNewJob(prev => ({
      ...prev,
      customFields: [...prev.customFields, newField]
    }));

    toast.success(`${field.label} added to form`);
  };

  const handleAddCustomField = () => {
    if (!newCustomField.fieldKey || !newCustomField.label) {
      toast.error("Field key and label are required");
      return;
    }

    const fieldKeyRegex = /^[a-z][a-z0-9_]*$/;
    if (!fieldKeyRegex.test(newCustomField.fieldKey)) {
      toast.error("Field key must start with a letter and contain only lowercase letters, numbers, and underscores");
      return;
    }

    const existingKeys = newJob.customFields.map(f => f.fieldKey);
    if (existingKeys.includes(newCustomField.fieldKey)) {
      toast.error("Field with this key already exists");
      return;
    }

    const field = {
      ...newCustomField,
      order: newJob.customFields.length,
    };

    setNewJob(prev => ({
      ...prev,
      customFields: [...prev.customFields, field]
    }));

    setNewCustomField({
      fieldKey: "",
      label: "",
      fieldType: "text",
      placeholder: "",
      required: false,
      options: [],
      validation: { maxFileSizeMB: 2, fileTypes: ["pdf", "docx"] },
      order: 0,
    });

    toast.success("Custom field added!");
  };

  const handleRemoveField = (fieldKey) => {
    const systemFields = ["full_name", "email", "mobile_number", "resume"];
    if (systemFields.includes(fieldKey)) {
      toast.error("This is a system-recommended field and cannot be removed");
      return;
    }

    setNewJob(prev => ({
      ...prev,
      customFields: prev.customFields.filter(f => f.fieldKey !== fieldKey)
        .map((f, i) => ({ ...f, order: i }))
    }));

    toast.success("Field removed from form");
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const fields = Array.from(newJob.customFields);
    const [reorderedField] = fields.splice(result.source.index, 1);
    fields.splice(result.destination.index, 0, reorderedField);

    fields.forEach((field, index) => {
      field.order = index;
    });

    setNewJob(prev => ({
      ...prev,
      customFields: fields
    }));
  };

  const handleFieldChange = (fieldKey, updates) => {
    setNewJob(prev => ({
      ...prev,
      customFields: prev.customFields.map(field => 
        field.fieldKey === fieldKey ? { ...field, ...updates } : field
      )
    }));
  };

  // STEP 3: PREVIEW & SUBMIT
  const handleCreateJob = async () => {
    // Validate required system fields
    const requiredFields = ["full_name", "email", "mobile_number", "resume"];
    const existingFields = newJob.customFields.map(f => f.fieldKey);
    const missingFields = requiredFields.filter(f => !existingFields.includes(f));
    
    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    if (!newJob.title || !newJob.description || !newJob.location || !newJob.companyName) {
      toast.error("Please fill in all required job details");
      return;
    }

    try {
      const token = getToken();
      const response = await axios.post("/api/hiring/jobs", newJob, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success("Job created successfully!");
        setShowCreateWizard(false);
        resetWizard();
        fetchJobs();
      }
    } catch (error) {
      console.error("Failed to create job:", error);
      toast.error(error.response?.data?.message || "Failed to create job");
    }
  };

  const resetWizard = () => {
    setWizardStep(1);
    setNewJob({
      title: "",
      description: "",
      jobType: "Full-Time",
      location: "",
      workMode: "Onsite",
      requiredSkills: [],
      experienceRequired: { min: 0, max: null },
      qualifications: "",
      salary: { min: "", max: "", currency: "INR", isNegotiable: false },
      companyName: "",
      applicationDeadline: "",
      totalVacancies: 1,
      status: "Open",
      customFields: [],
    });
    setActiveTemplate(null);
    setFieldSearch("");
    setSelectedCategory("all");
    setNewCustomField({
      fieldKey: "",
      label: "",
      fieldType: "text",
      placeholder: "",
      required: false,
      options: [],
      validation: { maxFileSizeMB: 2, fileTypes: ["pdf", "docx"] },
      order: 0,
    });
  };

  // ===============================
  // MODAL COMPONENTS
  // ===============================
  
  // View Job Modal
  const renderViewModal = () => {
    if (!showViewModal || !selectedJob) return null;

    return (
      <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{selectedJob.title}</h2>
              <p className="text-gray-600">Job Details</p>
            </div>
            <button
              onClick={() => {
                setShowViewModal(false);
                setSelectedJob(null);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Job Type</label>
                <p className="text-gray-800">{selectedJob.jobType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <p className="text-gray-800">{selectedJob.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Work Mode</label>
                <p className="text-gray-800">{selectedJob.workMode}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Company</label>
                <p className="text-gray-800">{selectedJob.companyName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  selectedJob.status === "Open" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {selectedJob.status}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Applicants</label>
                <p className="text-gray-800">{selectedJob.applicantsCount || 0}</p>
              </div>
            </div>

            {/* Salary */}
            {selectedJob.salary && (selectedJob.salary.min || selectedJob.salary.max) && (
              <div>
                <label className="text-sm font-medium text-gray-500">Salary Range</label>
                <p className="text-gray-800">
                  {selectedJob.salary.min ? `₹${selectedJob.salary.min}` : 'Not specified'} - 
                  {selectedJob.salary.max ? `₹${selectedJob.salary.max}` : 'Not specified'}
                  {selectedJob.salary.isNegotiable && " (Negotiable)"}
                </p>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-gray-500">Job Description</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-800 whitespace-pre-line">{selectedJob.description}</p>
              </div>
            </div>

            {/* Skills */}
            {selectedJob.requiredSkills && selectedJob.requiredSkills.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Required Skills</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedJob.requiredSkills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Fields */}
            {selectedJob.customFields && selectedJob.customFields.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Application Form Fields</label>
                <div className="mt-2 space-y-2">
                  {selectedJob.customFields
                    .sort((a, b) => a.order - b.order)
                    .map((field, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-800">{field.label}</span>
                          <span className="ml-2 text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded">
                            {field.fieldType}
                          </span>
                          {field.required && (
                            <span className="ml-2 text-xs text-red-600">Required</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {field.options?.length > 0 ? `${field.options.length} options` : ''}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowViewModal(false);
                handleEditJob(selectedJob._id);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit2 size={16} className="inline mr-2" />
              Edit Job
            </button>
            <button
              onClick={() => {
                setShowViewModal(false);
                setSelectedJob(null);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  

  // Status Update Modal
  const renderStatusModal = () => {
    if (!showStatusModal || !selectedJob) return null;

    return (
      <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                {selectedJob.status === "Open" ? (
                  <XCircle className="text-blue-600" size={24} />
                ) : (
                  <CheckCircle className="text-blue-600" size={24} />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {selectedJob.status === "Open" ? "Close Job Post" : "Open Job Post"}
                </h3>
                <p className="text-gray-600">Update job status</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Job: <strong>"{selectedJob.title}"</strong>
              </p>
              <p className="text-sm text-gray-600">
                Current status:{" "}
                <span className={`font-medium ${
                  selectedJob.status === "Open" ? "text-green-600" : "text-red-600"
                }`}>
                  {selectedJob.status}
                </span>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Applicants: {selectedJob.applicantsCount || 0}
              </p>
            </div>

            <div className="space-y-3">
              {selectedJob.status === "Open" ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">
                    Closing this job will:
                  </p>
                  <ul className="text-sm text-red-600 mt-1 ml-4 list-disc">
                    <li>Stop accepting new applications</li>
                    <li>Hide the job from public view</li>
                    <li>Preserve existing applicant data</li>
                  </ul>
                </div>
              ) : (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700">
                    Opening this job will:
                  </p>
                  <ul className="text-sm text-green-600 mt-1 ml-4 list-disc">
                    <li>Start accepting new applications</li>
                    <li>Make the job publicly visible</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedJob(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(
                  selectedJob.status === "Open" ? "Closed" : "Open"
                )}
                className={`px-4 py-2 rounded-lg text-white ${
                  selectedJob.status === "Open" 
                    ? "bg-red-600 hover:bg-red-700" 
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {selectedJob.status === "Open" ? "Close Job" : "Open Job"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ===============================
  // WIZARD STEP COMPONENTS (Same as before)
  // ===============================
  const renderStep1JobDetails = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <HelpCircle className="text-blue-600 mr-2" size={20} />
          <p className="text-blue-700 text-sm">
            Enter basic job information. This will be visible to candidates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              value={newJob.title}
              onChange={(e) => handleJobDetailsChange("title", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Frontend Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Type *
            </label>
            <select
              value={newJob.jobType}
              onChange={(e) => handleJobDetailsChange("jobType", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {jobTypeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              value={newJob.location}
              onChange={(e) => handleJobDetailsChange("location", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Bangalore, Karnataka"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Mode *
            </label>
            <select
              value={newJob.workMode}
              onChange={(e) => handleJobDetailsChange("workMode", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {workModeOptions.map(mode => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              value={newJob.companyName}
              onChange={(e) => handleJobDetailsChange("companyName", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Vacancies
            </label>
            <input
              type="number"
              value={newJob.totalVacancies}
              onChange={(e) => handleJobDetailsChange("totalVacancies", parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Application Deadline
            </label>
            <input
              type="date"
              value={newJob.applicationDeadline}
              onChange={(e) => handleJobDetailsChange("applicationDeadline", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary Range (₹)
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={newJob.salary.min}
                onChange={(e) => handleSalaryChange("min", e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Min"
              />
              <input
                type="number"
                value={newJob.salary.max}
                onChange={(e) => handleSalaryChange("max", e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Job Description *
        </label>
        <textarea
          value={newJob.description}
          onChange={(e) => handleJobDetailsChange("description", e.target.value)}
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe the job responsibilities, requirements, and benefits..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Required Skills
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {newJob.requiredSkills.map((skill, index) => (
            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddSkill(e.target.value);
                e.target.value = '';
              }
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add a skill and press Enter"
          />
          <button
            type="button"
            onClick={() => {
              const input = document.querySelector('input[placeholder="Add a skill and press Enter"]');
              if (input.value) {
                handleAddSkill(input.value);
                input.value = '';
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep2FormBuilder = () => (
    <div className="space-y-6">
      {/* Template Suggestions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Sparkles className="text-blue-600 mr-2" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">Smart Suggestions</h3>
          <span className="ml-auto text-sm text-gray-500">Choose a template to get started</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(ROLE_TEMPLATES).map(([key, template]) => (
            <button
              key={key}
              onClick={() => handleApplyTemplate(key)}
              className={`p-3 rounded-lg border text-center transition-all ${
                activeTemplate === key 
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-white'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="mb-2">{template.icon}</div>
                <div className="text-sm font-medium text-gray-800">{template.name}</div>
                <div className="text-xs text-gray-500 mt-1">{template.description}</div>
              </div>
            </button>
          ))}
        </div>

        {activeTemplate && (
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <div className="flex items-center">
              <Wand2 size={16} className="text-blue-600 mr-2" />
              <p className="text-sm text-blue-700">
                <strong>Tip:</strong> {ROLE_TEMPLATES[activeTemplate].tips[0]}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Field Library */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
          <div className="flex items-center">
            <FolderOpen size={18} className="text-gray-600 mr-2" />
            <h3 className="font-medium text-gray-800">Field Library</h3>
            <span className="ml-2 text-sm text-gray-500">
              {PREDEFINED_FIELDS_LIBRARY.length} fields available • {filteredFields.length} filtered
            </span>
          </div>
          <button
            onClick={() => setShowFieldLibrary(!showFieldLibrary)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {showFieldLibrary ? "Hide Library" : "Show Library"}
          </button>
        </div>

        {showFieldLibrary && (
          <div className="p-4 bg-gray-50 border-b">
            {/* Search and Filter */}
            <div className="mb-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search fields by name or category..."
                  value={fieldSearch}
                  onChange={(e) => setFieldSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {['all', 'basic', 'education', 'professional', 'skills', 'portfolio', 'documents', 'additional'].map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                      selectedCategory === category 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    {category !== 'all' && (
                      <span className="ml-1 text-xs opacity-75">
                        ({PREDEFINED_FIELDS_LIBRARY.filter(f => f.category === category).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Fields Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-60 overflow-y-auto p-2">
              {filteredFields.length > 0 ? (
                filteredFields.map((field, index) => {
                  const isAdded = newJob.customFields.some(f => f.fieldKey === field.key);
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border text-left transition-all min-w-[140px] ${
                        isAdded
                          ? 'border-green-200 bg-green-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-white cursor-pointer'
                      }`}
                      onClick={() => !isAdded && handleAddFieldFromLibrary(field)}
                    >
                      <div className="flex items-center mb-1">
                        <div className="text-gray-600 mr-2">{field.icon}</div>
                        <div className="text-sm font-medium text-gray-800 truncate">{field.label}</div>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        {field.category}
                      </div>
                      <div className="text-xs text-gray-400 mb-2">
                        {FIELD_TYPE_DESCRIPTIONS[field.fieldType]}
                      </div>
                      {isAdded ? (
                        <div className="text-xs text-green-600 font-medium">✓ Added</div>
                      ) : (
                        <div className="text-xs text-blue-600 font-medium">Click to add</div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-6 text-center py-8 text-gray-500">
                  <FolderOpen size={32} className="mx-auto mb-2" />
                  <p>No fields found matching your search</p>
                  <p className="text-sm mt-1">Try a different search term or category</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create Custom Field */}
        <div className="p-4 border-b">
          <h4 className="font-medium text-gray-700 mb-3">Create Custom Field</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Label *
              </label>
              <input
                type="text"
                value={newCustomField.label}
                onChange={(e) => setNewCustomField(prev => ({ ...prev, label: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Custom Field Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Type *
              </label>
              <select
                value={newCustomField.fieldType}
                onChange={(e) => setNewCustomField(prev => ({ 
                  ...prev, 
                  fieldType: e.target.value,
                  options: ["select", "radio", "checkbox"].includes(e.target.value) ? prev.options : []
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                {Object.entries(FIELD_TYPE_DESCRIPTIONS).map(([value, description]) => (
                  <option key={value} value={value}>
                    {value.charAt(0).toUpperCase() + value.slice(1)} - {description}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Key *
              </label>
              <input
                type="text"
                value={newCustomField.fieldKey}
                onChange={(e) => setNewCustomField(prev => ({ 
                  ...prev, 
                  fieldKey: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., custom_field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placeholder (Optional)
              </label>
              <input
                type="text"
                value={newCustomField.placeholder}
                onChange={(e) => setNewCustomField(prev => ({ ...prev, placeholder: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Enter information here"
              />
            </div>
          </div>

          {["select", "radio", "checkbox"].includes(newCustomField.fieldType) && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options (One per line)
              </label>
              <textarea
                value={newCustomField.options.map(opt => opt.label).join('\n')}
                onChange={(e) => {
                  const options = e.target.value.split('\n')
                    .filter(line => line.trim())
                    .map(line => ({
                      label: line.trim(),
                      value: line.trim().toLowerCase().replace(/\s+/g, '_')
                    }));
                  setNewCustomField(prev => ({ ...prev, options }));
                }}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Option 1\nOption 2\nOption 3"
              />
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="required"
                checked={newCustomField.required}
                onChange={(e) => setNewCustomField(prev => ({ ...prev, required: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="required" className="text-sm text-gray-700">
                This field is required
              </label>
            </div>
            <button
              onClick={handleAddCustomField}
              disabled={!newCustomField.label || !newCustomField.fieldKey}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Custom Field
            </button>
          </div>
        </div>

        {/* Current Form Fields */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-gray-800">Current Form Fields</h4>
              <p className="text-sm text-gray-600">
                {newJob.customFields.length} field(s) • Drag to reorder
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Required: {newJob.customFields.filter(f => f.required).length} / Optional: {newJob.customFields.filter(f => !f.required).length}
            </div>
          </div>

          {newJob.customFields.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Layers size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">No fields added yet</p>
              <p className="text-sm text-gray-500 mt-1">Add fields from library or create custom ones</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="form-fields">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {newJob.customFields
                      .sort((a, b) => a.order - b.order)
                      .map((field, index) => (
                        <Draggable
                          key={field.fieldKey}
                          draggableId={field.fieldKey}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`bg-white p-4 rounded-lg border ${
                                snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''
                              } ${field.required ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-gray-300'}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center flex-1">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="mr-3 text-gray-400 cursor-move hover:text-gray-600"
                                  >
                                    <GripVertical size={18} />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center mb-1">
                                      <div className="font-medium text-gray-800">
                                        {field.label}
                                        {field.required && (
                                          <span className="ml-2 text-xs text-red-600">Required</span>
                                        )}
                                      </div>
                                      <span className="ml-2 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                        {field.fieldType}
                                      </span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {field.placeholder && (
                                        <span>Placeholder: "{field.placeholder}"</span>
                                      )}
                                      {field.options?.length > 0 && (
                                        <span className="ml-2">• {field.options.length} options</span>
                                      )}
                                    </div>
                                    {VALIDATION_TIPS[field.fieldKey] && (
                                      <div className="text-xs text-blue-600 mt-1">
                                        <HelpCircle size={12} className="inline mr-1" />
                                        {VALIDATION_TIPS[field.fieldKey]}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleFieldChange(field.fieldKey, { 
                                      required: !field.required 
                                    })}
                                    className={`px-3 py-1 text-xs rounded ${
                                      field.required 
                                        ? 'bg-red-100 text-red-700' 
                                        : 'bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    {field.required ? 'Required' : 'Optional'}
                                  </button>
                                  <button
                                    onClick={() => handleRemoveField(field.fieldKey)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3Preview = () => (
    <div className="space-y-6">
      {/* Job Preview */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="font-medium text-gray-800">Job Preview</h3>
          <p className="text-sm text-gray-600">This is how candidates will see your job</p>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{newJob.title || "[Job Title]"}</h2>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center">
                <Briefcase size={14} className="mr-1" />
                {newJob.jobType}
              </span>
              <span className="flex items-center">
                <MapPin size={14} className="mr-1" />
                {newJob.location || "[Location]"}
              </span>
              <span className="flex items-center">
                <Building size={14} className="mr-1" />
                {newJob.companyName || "[Company]"}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Job Description</h4>
            <p className="text-gray-600 whitespace-pre-line">
              {newJob.description || "[Job description will appear here]"}
            </p>
          </div>

          {newJob.requiredSkills.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {newJob.requiredSkills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Preview */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="font-medium text-gray-800">Application Form Preview</h3>
          <p className="text-sm text-gray-600">This is the form candidates will fill out</p>
        </div>
        <div className="p-4">
          {newJob.customFields.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileSpreadsheet size={48} className="mx-auto mb-3" />
              <p>No form fields configured yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {newJob.customFields
                .sort((a, b) => a.order - b.order)
                .map((field, index) => (
                  <div key={index} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    
                    {field.fieldType === "text" && (
                      <input
                        type="text"
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        disabled
                      />
                    )}
                    
                    {field.fieldType === "email" && (
                      <input
                        type="email"
                        placeholder={field.placeholder || "email@example.com"}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        disabled
                      />
                    )}

                    {field.fieldType === "phone" && (
                      <input
                        type="tel"
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        disabled
                      />
                    )}

                    {field.fieldType === "number" && (
                      <input
                        type="number"
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        disabled
                      />
                    )}

                    {field.fieldType === "url" && (
                      <input
                        type="url"
                        placeholder={field.placeholder || `https://example.com`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        disabled
                      />
                    )}

                    {field.fieldType === "date" && (
                      <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        disabled
                      />
                    )}
                    
                    {field.fieldType === "textarea" && (
                      <textarea
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        disabled
                      />
                    )}
                    
                    {field.fieldType === "select" && (
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg" disabled>
                        <option value="">{field.placeholder || `Select ${field.label.toLowerCase()}`}</option>
                        {field.options?.map((opt, idx) => (
                          <option key={idx} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    )}
                    
                    {field.fieldType === "file" && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">{field.placeholder || `Upload ${field.label.toLowerCase()}`}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Max size: {field.validation?.maxFileSizeMB || 2}MB • 
                          Formats: {field.validation?.fileTypes?.join(", ") || "PDF, DOCX"}
                        </p>
                      </div>
                    )}
                    
                    {field.fieldType === "radio" && (
                      <div className="space-y-2">
                        {field.options?.map((opt, idx) => (
                          <div key={idx} className="flex items-center">
                            <input type="radio" className="mr-2" disabled />
                            <label className="text-sm text-gray-700">{opt.label}</label>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {field.fieldType === "checkbox" && (
                      <div className="space-y-2">
                        {field.options?.map((opt, idx) => (
                          <div key={idx} className="flex items-center">
                            <input type="checkbox" className="mr-2" disabled />
                            <label className="text-sm text-gray-700">{opt.label}</label>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {VALIDATION_TIPS[field.fieldKey] && (
                      <div className="text-xs text-blue-600 flex items-center">
                        <HelpCircle size={12} className="mr-1" />
                        {VALIDATION_TIPS[field.fieldKey]}
                      </div>
                    )}
                  </div>
                ))}
              
              <div className="pt-4 border-t">
                <button
                  type="button"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled
                >
                  Submit Application
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  This is a preview. Candidates will see this button as active.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{newJob.customFields.length}</div>
          <div className="text-sm text-gray-600">Total Fields</div>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {newJob.customFields.filter(f => f.required).length}
          </div>
          <div className="text-sm text-gray-600">Required Fields</div>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {newJob.customFields.filter(f => f.fieldType === "file").length}
          </div>
          <div className="text-sm text-gray-600">File Uploads</div>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {newJob.customFields.filter(f => ["select", "radio", "checkbox"].includes(f.fieldType)).length}
          </div>
          <div className="text-sm text-gray-600">Choice Fields</div>
        </div>
      </div>
    </div>
  );

  const renderWizard = (isEdit = false) => {
    const wizardType = isEdit ? showEditWizard : showCreateWizard;
    if (!wizardType) return null;

    const steps = [
      { number: 1, title: "Job Details", icon: <Briefcase size={18} /> },
      { number: 2, title: "Build Form", icon: <FileSpreadsheet size={18} /> },
      { number: 3, title: "Preview & Publish", icon: <Eye size={18} /> },
    ];

    return (
      <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
          {/* Wizard Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {isEdit ? "Edit Job Post" : "Create New Job Post"}
                </h2>
                <p className="text-gray-600">Step {wizardStep} of 3</p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure? All unsaved changes will be lost.")) {
                    if (isEdit) {
                      setShowEditWizard(false);
                    } else {
                      setShowCreateWizard(false);
                    }
                    resetWizard();
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${wizardStep >= step.number 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                      }
                      ${wizardStep === step.number ? 'ring-4 ring-blue-100' : ''}
                    `}>
                      {wizardStep > step.number ? <Check size={20} /> : step.icon}
                    </div>
                    <span className={`mt-2 text-sm ${
                      wizardStep >= step.number ? 'font-medium text-blue-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 ${
                      wizardStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Wizard Content */}
          <div className="p-6">
            {wizardStep === 1 && renderStep1JobDetails()}
            {wizardStep === 2 && renderStep2FormBuilder()}
            {wizardStep === 3 && renderStep3Preview()}
          </div>

          {/* Wizard Footer */}
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-between">
            <div>
              {wizardStep > 1 && (
                <button
                  onClick={() => setWizardStep(wizardStep - 1)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <ArrowLeft size={16} className="inline mr-2" />
                  Previous
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              {wizardStep < 3 && (
                <button
                  onClick={() => {
                    // Validate current step
                    if (wizardStep === 1) {
                      if (!newJob.title || !newJob.location || !newJob.companyName) {
                        toast.error("Please fill in all required job details");
                        return;
                      }
                    }
                    setWizardStep(wizardStep + 1);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next
                  <ArrowRight size={16} className="inline ml-2" />
                </button>
              )}
              
              {wizardStep === 3 && (
                <>
                  <button
                    onClick={() => setWizardStep(2)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <Edit2 size={16} className="inline mr-2" />
                    Edit Form
                  </button>
                  <button
                    onClick={isEdit ? handleUpdateJob : handleCreateJob}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Check size={16} className="inline mr-2" />
                    {isEdit ? "Update Job" : "Publish Job"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ===============================
  // MAIN RENDER
  // ===============================
  const filteredJobs = jobs.filter((job) => {
    if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !job.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    if (selectedFilters.status !== "all" && job.status !== selectedFilters.status) {
      return false;
    }

    if (selectedFilters.type !== "all" && job.jobType !== selectedFilters.type) {
      return false;
    }

    return true;
  });

  const stats = [
    { label: "Total Jobs", value: jobs.length, color: "#09435F" },
    { label: "Active Jobs", value: jobs.filter(j => j.status === "Open").length, color: "#2E84AE" },
    { label: "Total Applicants", value: jobs.reduce((sum, job) => sum + (job.applicantsCount || 0), 0), color: "#CDE7F4" },
    { label: "Avg Applicants/Job", value: Math.round(jobs.reduce((sum, job) => sum + (job.applicantsCount || 0), 0) / jobs.length || 0), color: "#09435F" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Job Posts</h1>
          <p className="text-gray-600">Manage and track all job postings</p>
        </div>
        <button 
          onClick={() => setShowCreateWizard(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus size={18} />
          <span>Create New Job</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-4"
            style={{ borderLeft: `4px solid ${stat.color}` }}
          >
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search jobs by title, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={selectedFilters.status}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              value={selectedFilters.type}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, type: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {jobTypeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Type & Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Applicants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Form Fields
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin w-6 h-6 border-b-2 border-blue-600 rounded-full"></div>
                      <p className="ml-3 text-gray-600">Loading jobs...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-800">{job.title}</div>
                        <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">
                          {job.description.substring(0, 80)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Briefcase size={14} className="mr-1 text-gray-500" />
                          {job.jobType}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin size={14} className="mr-1" />
                          {job.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        job.status === "Open" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {job.status === "Open" ? (
                          <CheckCircle size={14} className="mr-1" />
                        ) : (
                          <XCircle size={14} className="mr-1" />
                        )}
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Users size={16} className="mr-2 text-blue-600" />
                        <div>
                          <div className="font-medium">{job.applicantsCount || 0}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {job.customFields?.length > 0 ? (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {job.customFields.length} fields
                          </span>
                        ) : (
                          <span className="text-gray-400">No form</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewJob(job._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEditJob(job._id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        {job.applicantsCount > 0 && (
                          <button
                            onClick={() => handleExportApplicants(job._id)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Export Applicants"
                          >
                            <DownloadIcon size={18} />
                          </button>
                        )}
                        <div className="relative">
                          <button
                            onClick={() => {
                              setSelectedJob(job);
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="More Options"
                          >
                            <MoreVertical size={18} />
                          </button>
                          {selectedJob?._id === job._id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                              <button
                                onClick={() => {
                                  setSelectedJob(job);
                                  setShowStatusModal(true);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                              >
                                {job.status === "Open" ? "Close Job" : "Open Job"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Briefcase size={48} className="text-gray-400 mb-2" />
                      <p>No jobs found</p>
                      <button 
                        onClick={() => setShowCreateWizard(true)}
                        className="mt-2 text-blue-600 hover:underline"
                      >
                        Create your first job post
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Job Wizard */}
      {renderWizard(false)}
      
      {/* Edit Job Wizard */}
      {renderWizard(true)}
      
      {/* View Modal */}
      {renderViewModal()}
      
      {/* Status Modal */}
      {renderStatusModal()}
    </div>
  );
};

export default JobPosts;