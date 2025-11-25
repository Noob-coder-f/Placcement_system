// components/Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        college: '',
        course: '',
        yearOfStudy: 1,
        domain: '',
        skills: [],
        linkedinUrl: '',
        githubUrl: '',
        resumeUrl: '',
        profileImage: ''
    });
    const [newSkill, setNewSkill] = useState('');
    const [profileImage, setProfileImage] = useState('/default-avatar.png');

    // Skill color mapping for different technologies
    const getSkillColor = (skill) => {
        const skillLower = skill.toLowerCase();

        if (['react', 'javascript', 'typescript', 'html', 'css', 'vue', 'angular', 'sass', 'tailwind'].includes(skillLower))
            return 'bg-blue-100 text-blue-800 border-blue-200';
        if (['node.js', 'express', 'python', 'django', 'flask', 'java', 'spring boot', 'php', 'laravel', 'ruby', 'rails'].includes(skillLower))
            return 'bg-green-100 text-green-800 border-green-200';
        if (['mongodb', 'mysql', 'postgresql', 'redis', 'sqlite', 'oracle', 'firebase'].includes(skillLower))
            return 'bg-purple-100 text-purple-800 border-purple-200';
        if (['react native', 'flutter', 'android', 'ios', 'swift', 'kotlin'].includes(skillLower))
            return 'bg-orange-100 text-orange-800 border-orange-200';
        if (['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'git', 'jenkins', 'linux'].includes(skillLower))
            return 'bg-red-100 text-red-800 border-red-200';
        if (['figma', 'adobe xd', 'sketch', 'photoshop', 'illustrator'].includes(skillLower))
            return 'bg-pink-100 text-pink-800 border-pink-200';
        return 'bg-gray-100 text-gray-800 border-gray-200';
    };

    // Fetch profile data on component mount
    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/intern/profile');
            const internData = response.data;

            // Transform skills from [{name: "React"}] to ["React"]
            const skillsArray = internData.skills ? internData.skills.map(skill => skill.name) : [];

            setFormData({
                name: internData.name || '',
                email: internData.email || '',
                phone: internData.phone || '',
                college: internData.college || '',
                course: internData.course || '',
                yearOfStudy: internData.yearOfStudy || 1,
                domain: internData.domain || '',
                skills: skillsArray,
                linkedinUrl: internData.linkedinUrl || '',
                githubUrl: internData.githubUrl || '',
                resumeUrl: internData.resumeUrl || '',
                profileImage: internData.profileImage || ''
            });

            if (internData.profileImage) {
                setProfileImage(internData.profileImage);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            alert('Error loading profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageDataUrl = e.target.result;
                setProfileImage(imageDataUrl);
                setFormData(prev => ({ ...prev, profileImage: imageDataUrl }));
            };
            reader.readAsDataURL(file);
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Transform skills array to match backend schema before sending
            const skillsForBackend = formData.skills.map(skill => ({ name: skill }));

            // Update profile API call
            await axios.put('/api/intern/profile', {
                ...formData,
                skills: skillsForBackend, // Send skills in backend format
                profileImage
            });
            setIsEditing(false);
            alert('Profile updated successfully!');

            // Refresh data to ensure consistency
            await fetchProfileData();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile');
        }
    };

    const handleCancel = () => {
        // Refresh data to discard changes
        fetchProfileData();
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                        <p className="text-gray-600 mt-1">Manage your personal information</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-8">
                            {/* Profile Image & Resume */}
                            <div className="flex items-start space-x-6">
                                <div className="relative">
                                    <img
                                        src={profileImage || '/default-avatar.png'}
                                        alt="Profile"
                                        className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                    {isEditing && (
                                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-md">
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                            📷
                                        </label>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-gray-900">{formData.name || 'No Name Provided'}</h2>
                                    <p className="text-gray-600">{formData.email || 'No Email Provided'}</p>
                                    <p className="text-sm text-gray-500">{formData.college || 'No College Provided'}</p>

                                    {/* Resume Section */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
                                        {formData.resumeUrl ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-4">
                                                    <a
                                                        href={formData.resumeUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                    >
                                                        📄 View Resume
                                                    </a>
                                                </div>
                                                {isEditing && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Resume URL</label>
                                                        <input
                                                            type="url"
                                                            name="resumeUrl"
                                                            value={formData.resumeUrl}
                                                            onChange={handleInputChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="https://drive.google.com/your-resume-link"
                                                        />
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Or paste your resume URL (Google Drive, Dropbox, etc.)
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {isEditing ? (
                                                    <>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Or enter resume URL</label>
                                                            <input
                                                                type="url"
                                                                name="resumeUrl"
                                                                value={formData.resumeUrl}
                                                                onChange={handleInputChange}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                placeholder="https://drive.google.com/your-resume-link"
                                                            />
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Paste your resume URL (Google Drive, Dropbox, etc.)
                                                            </p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p className="text-gray-500">No resume uploaded</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
                                    <input
                                        type="text"
                                        name="domain"
                                        value={formData.domain}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                    />
                                </div>
                            </div>

                            {/* Academic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">College</label>
                                    <input
                                        type="text"
                                        name="college"
                                        value={formData.college}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                                    <input
                                        type="text"
                                        name="course"
                                        value={formData.course}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Year of Study</label>
                                    <select
                                        name="yearOfStudy"
                                        value={formData.yearOfStudy}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                    >
                                        <option value={1}>1st Year</option>
                                        <option value={2}>2nd Year</option>
                                        <option value={3}>3rd Year</option>
                                        <option value={4}>4th Year</option>
                                        <option value={"Post Diploma"}>Post Diploma</option>
                                        <option value={"Higher Diploma"}>Higher Diploma (HD)</option>
                                        <option value={"Graduate"}>Graduated</option>
                                    </select>
                                </div>
                            </div>

                            {/* Skills */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {formData.skills && formData.skills.length > 0 ? (
                                        formData.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getSkillColor(skill)}`}
                                            >
                                                {skill}
                                                {isEditing && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveSkill(skill)}
                                                        className="ml-2 hover:opacity-70 transition-opacity"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm">No skills added yet</p>
                                    )}
                                </div>
                                {isEditing && (
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            placeholder="Add a skill (e.g., React, Spring Boot, MongoDB)"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddSkill();
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddSkill}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Social Links */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                                    <input
                                        type="url"
                                        name="linkedinUrl"
                                        value={formData.linkedinUrl}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                        placeholder="https://linkedin.com/in/yourprofile"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                                    <input
                                        type="url"
                                        name="githubUrl"
                                        value={formData.githubUrl}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                        placeholder="https://github.com/yourusername"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                            <div className="flex justify-end space-x-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;