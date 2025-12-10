import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Video, 
  Calendar,
  Clock,
  BookOpen,
  Loader,
  Users,
  MapPin,
  Globe,
  GraduationCap
} from 'lucide-react';
import axios from 'axios';

const MentorClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [classDialog, setClassDialog] = useState({ open: false, class: null });
  const [newClass, setNewClass] = useState({
    title: '',
    subject: '',
    classType: 'online',
    startTime: '',
    endTime: '',
    meetingLink: '',
    description: ''
  });

  // ===============================
  // TOKEN
  // ===============================
  const getToken = () => {
    return localStorage.getItem("mentorToken") || localStorage.getItem("token");
  };

  // ===============================
  // FETCH CLASSES
  // ===============================
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error("No token found");
      }

      const res = await axios.get("/api/mentors/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data.classes || []);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // CREATE CLASS
  // ===============================
  const createClass = async (classData) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No token found");
      }

      const res = await axios.post("/api/mentors/classes", classData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error("Failed to create class:", err);
      throw err;
    }
  };

  // ===============================
  // UPDATE CLASS
  // ===============================
  const updateClass = async (classId, classData) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No token found");
      }

      const res = await axios.put(`/api/mentors/classes/${classId}`, classData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error("Failed to update class:", err);
      throw err;
    }
  };

  // ===============================
  // DELETE CLASS
  // ===============================
  const deleteClass = async (classId) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No token found");
      }

      await axios.delete(`/api/mentors/classes/${classId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Failed to delete class:", err);
      throw err;
    }
  };

  // ===============================
  // HANDLE SAVE CLASS
  // ===============================
  const handleSaveClass = async () => {
    try {
      setSubmitting(true);

      if (classDialog.class) {
        const updatedClass = await updateClass(classDialog.class._id, newClass);
        setClasses((prev) =>
          prev.map((cls) =>
            cls._id === updatedClass._id ? updatedClass : cls
          )
        );
      } else {
        const createdClass = await createClass(newClass);
        setClasses((prev) => [...prev, createdClass]);
      }

      setClassDialog({ open: false, class: null });
      resetForm();
    } catch (error) {
      console.error("Error saving class:", error);
      alert("Failed to save class. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ===============================
  // HANDLE EDIT
  // ===============================
  const handleEdit = (classItem) => {
    setNewClass({
      title: classItem.title || '',
      subject: classItem.subject || '',
      classType: classItem.classType || 'online',
      startTime: classItem.startTime ? classItem.startTime.slice(0, 16) : '',
      endTime: classItem.endTime ? classItem.endTime.slice(0, 16) : '',
      meetingLink: classItem.meetingLink || '',
      description: classItem.description || ''
    });
    setClassDialog({ open: true, class: classItem });
  };

  // ===============================
  // HANDLE DELETE
  // ===============================
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await deleteClass(id);
        setClasses((prev) => prev.filter((cls) => cls._id !== id));
      } catch (error) {
        console.error("Error deleting class:", error);
        alert("Failed to delete class. Please try again.");
      }
    }
  };

  // ===============================
  // RESET FORM
  // ===============================
  const resetForm = () => {
    setNewClass({
      title: '',
      subject: '',
      classType: 'online',
      startTime: '',
      endTime: '',
      meetingLink: '',
      description: ''
    });
  };

  // ===============================
  // FORMAT DATE TIME
  // ===============================
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // ===============================
  // GET TIME UNTIL CLASS
  // ===============================
  const getTimeUntilClass = (startTime) => {
    const now = new Date();
    const classTime = new Date(startTime);
    const diff = classTime - now;
    
    if (diff < 0) return { text: 'Started', color: 'text-green-600' };
    if (diff < 3600000) return { text: 'Starting soon', color: 'text-orange-600' };
    
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return { text: `In ${hours}h`, color: 'text-blue-600' };
    
    const days = Math.floor(hours / 24);
    return { text: `In ${days}d`, color: 'text-gray-600' };
  };

  // ===============================
  // USE EFFECT
  // ===============================
  useEffect(() => {
    fetchClasses();
  }, []);

  // ===============================
  // SUBJECT OPTIONS
  // ===============================
  const subjectOptions = [
    'Web Development',
    'AI/ML',
    'DevOps',
    'Data Science',
    'Mobile Development',
    'Cloud Computing',
    'Cybersecurity',
    'Software Engineering'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Classes</h1>
            <p className="text-gray-600 text-lg">Manage and schedule your teaching sessions</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setClassDialog({ open: true, class: null });
            }}
            className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-semibold">Schedule Class</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
                <p className="text-gray-600 text-sm">Total Classes</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Globe className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.filter(c => c.classType === 'online').length}
                </p>
                <p className="text-gray-600 text-sm">Online</p> 
              </div>
            </div>
          </div>
        
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <GraduationCap className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(classes.map(c => c.subject)).size}
                </p>
                <p className="text-gray-600 text-sm">Subjects</p>
              </div>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        {classes.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="text-blue-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No classes scheduled yet</h3>
              <p className="text-gray-600 mb-8">
                Start by scheduling your first class. Your students are waiting to learn from you!
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setClassDialog({ open: true, class: null });
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
              >
                Create Your First Class
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {classes.map((classItem) => {
              const timeInfo = getTimeUntilClass(classItem.startTime);
              return (
                <div
                  key={classItem._id}
                  className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-500 transform hover:scale-105"
                >
                  <div className="p-6">
                    {/* Header with status */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {classItem.title}
                        </h3>
                        <span className={`text-sm font-medium ${timeInfo.color} mt-1 inline-block`}>
                          {timeInfo.text}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        classItem.classType === 'online' 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {classItem.classType === 'online' ? 
                          <Globe size={12} className="mr-1" /> : 
                          <MapPin size={12} className="mr-1" />
                        }
                        {classItem.classType === 'online' ? 'Online' : 'Offline'}
                      </span>
                    </div>

                    {/* Subject */}
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                      <BookOpen size={18} className="text-blue-600" />
                      <span className="text-gray-700 font-medium">{classItem.subject}</span>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                      <Clock size={18} className="text-purple-600" />
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {formatDateTime(classItem.startTime)}
                        </div>
                        <div className="text-gray-600">
                          to {formatDateTime(classItem.endTime)}
                        </div>
                      </div>
                    </div>

                    {/* Meeting Link */}
                    {classItem.meetingLink && classItem.classType === 'online' && (
                      <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <Video size={18} className="text-blue-600" />
                        <a
                          href={classItem.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:text-blue-900 font-medium text-sm transition-colors"
                        >
                          Join Meeting Room
                        </a>
                      </div>
                    )}

                    {/* Description */}
                    {classItem.description && (
                      <div className="mb-4">
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {classItem.description}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-gray-200/50">
                      <button
                        onClick={() => handleEdit(classItem)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-900 px-4 py-2 rounded-lg transition-all duration-300 font-medium"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(classItem._id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-900 px-4 py-2 rounded-lg transition-all duration-300 font-medium"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Class Dialog */}
        {classDialog.open && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20">
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-3xl">
                <h2 className="text-2xl font-bold text-white">
                  {classDialog.class ? 'Edit Class' : 'Schedule New Class'}
                </h2>
                <p className="text-blue-100 mt-1">
                  {classDialog.class ? 'Update your class details' : 'Create a new teaching session'}
                </p>
              </div>

              {/* Form */}
              <div className="p-8 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Class Title *
                  </label>
                  <input
                    type="text"
                    value={newClass.title}
                    onChange={(e) =>
                      setNewClass((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="e.g., Advanced React Patterns Workshop"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Subject *
                    </label>
                    <select
                      value={newClass.subject}
                      onChange={(e) =>
                        setNewClass((prev) => ({ ...prev, subject: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select a subject</option>
                      {subjectOptions.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Class Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Class Type *
                    </label>
                    <select
                      value={newClass.classType}
                      onChange={(e) =>
                        setNewClass((prev) => ({ ...prev, classType: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="online">Online</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Start Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={newClass.startTime}
                      onChange={(e) =>
                        setNewClass((prev) => ({ ...prev, startTime: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  {/* End Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      End Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={newClass.endTime}
                      onChange={(e) =>
                        setNewClass((prev) => ({ ...prev, endTime: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Meeting Link (only for online classes) */}
                {newClass.classType === 'online' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Meeting Link
                    </label>
                    <input
                      type="url"
                      value={newClass.meetingLink}
                      onChange={(e) =>
                        setNewClass((prev) => ({ ...prev, meetingLink: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="https://meet.google.com/abc-def-ghi"
                    />
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Description
                  </label>
                  <textarea
                    value={newClass.description}
                    onChange={(e) =>
                      setNewClass((prev) => ({ ...prev, description: e.target.value }))
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Describe what students will learn in this class..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="px-8 py-6 border-t border-gray-200/50 bg-gray-50 rounded-b-3xl flex justify-end gap-4">
                <button
                  onClick={() => {
                    setClassDialog({ open: false, class: null });
                    resetForm();
                  }}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveClass}
                  disabled={
                    !newClass.title ||
                    !newClass.subject ||
                    !newClass.startTime ||
                    !newClass.endTime ||
                    submitting
                  }
                  className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                >
                  {submitting && <Loader size={18} className="animate-spin" />}
                  {classDialog.class ? 'Update Class' : 'Schedule Class'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorClasses;