import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Award,
  Edit2,
  Save,
  X,
  Upload,
  Shield,
  Bell,
  FileText,
  Download,
  Star,
} from "lucide-react";
import { toast } from "react-toastify";

const Profile = ({ user, setUser, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user || {});
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEditedUser(user);
    }
  }, [user]);

  const getToken = () => {
    return localStorage.getItem("HiringTeamToken");
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.put(
        "/api/hiring/profile",
        editedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setUser(response.data.data);
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        onUpdate?.();
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const token = getToken();
      const response = await axios.post(
        "/api/hiring/profile/upload-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setEditedUser({ ...editedUser, profileImage: response.data.imageUrl });
        toast.success("Profile image updated!");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#09435F]">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#2E84AE] text-white rounded-lg hover:bg-[#09435F] transition-colors shadow-md"
          >
            <Edit2 size={18} />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X size={18} />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={editedUser.profileImage || `https://ui-avatars.com/api/?name=${editedUser.name}&background=2E84AE&color=fff`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-[#CDE7F4] shadow-lg"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-[#2E84AE] text-white p-2 rounded-full cursor-pointer hover:bg-[#09435F] transition-colors">
                    <Upload size={18} />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>

              {/* Profile Details */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={editedUser.name || ""}
                          onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E84AE] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={editedUser.email || ""}
                          onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E84AE] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={editedUser.phone || ""}
                          onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E84AE] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Experience (Years)
                        </label>
                        <input
                          type="number"
                          value={editedUser.experience || 0}
                          onChange={(e) => setEditedUser({ ...editedUser, experience: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E84AE] focus:border-transparent"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    {/* Bio Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        value={editedUser.bio || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E84AE] focus:border-transparent"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-[#09435F]">{user.name}</h2>
                    <p className="text-gray-600 flex items-center mt-2">
                      <Mail className="mr-2 text-[#2E84AE]" size={16} />
                      {user.email}
                    </p>
                    {user.phone && (
                      <p className="text-gray-600 flex items-center mt-2">
                        <Phone className="mr-2 text-[#2E84AE]" size={16} />
                        {user.phone}
                      </p>
                    )}
                    <p className="text-gray-600 flex items-center mt-2">
                      <Briefcase className="mr-2 text-[#2E84AE]" size={16} />
                      {user.role} • {user.experience || 0} years experience
                    </p>
                    
                    {/* Display Bio */}
                    {user.bio && (
                      <div className="mt-4 p-3 bg-[#CDE7F4] rounded-lg">
                        <p className="text-sm text-gray-700">{user.bio}</p>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        user.isactive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {user.isactive ? (
                          <>
                            <Briefcase size={14} className="mr-1" />
                            Active
                          </>
                        ) : (
                          "Inactive"
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;