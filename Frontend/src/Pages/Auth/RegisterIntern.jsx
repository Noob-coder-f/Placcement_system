import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    User,
    Mail,
    Phone,
    Lock,
    BookOpen,
    GraduationCap,
    Briefcase,
    Code,
    FileText,
    Linkedin,
    Github,
    Shield,
    RefreshCw,
    CheckCircle,
    XCircle,
    Camera,
    Upload
} from "lucide-react";

const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const createCaptcha = () => {
    const operations = [
        { op: "+", fn: (a, b) => a + b },
        { op: "-", fn: (a, b) => a - b },
        { op: "×", fn: (a, b) => a * b }
    ];
    const operation = operations[getRandomInt(0, 2)];
    const a = getRandomInt(1, 12);
    const b = getRandomInt(1, 12);
    const answer = operation.fn(a, b);
    return {
        question: `${a} ${operation.op} ${b}`,
        answer: answer.toString(),
        operation: operation.op
    };
};

const RegisterPage = () => {
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        // 👤 Basic Details
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",

        // 🎓 Academic Info
        college: "",
        course: "",
        yearOfStudy: "",
        domain: "",

        // 💼 Professional Info
        skills: [],
        resumeUrl: "",
        linkedinUrl: "",
        githubUrl: "",

        // Single skill input
        currentSkill: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [captcha, setCaptcha] = useState(createCaptcha());
    const [captchaInput, setCaptchaInput] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [shake, setShake] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        feedback: ""
    });
    const [suggestions, setSuggestions] = useState([]);
    const [imagePreview, setImagePreview] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [profileImageFile, setProfileImageFile] = useState(null);

    // Password strength checker
    const checkPasswordStrength = (password) => {
        let score = 0;
        let feedback = [];

        if (password.length >= 8) score++;
        else feedback.push("At least 8 characters");

        if (/[A-Z]/.test(password)) score++;
        else feedback.push("One uppercase letter");

        if (/[a-z]/.test(password)) score++;
        else feedback.push("One lowercase letter");

        if (/[0-9]/.test(password)) score++;
        else feedback.push("One number");

        if (/[^A-Za-z0-9]/.test(password)) score++;
        else feedback.push("One special character");

        return {
            score,
            feedback: feedback.length > 0 ? `Missing: ${feedback.join(", ")}` : "Strong password!"
        };
    };

    useEffect(() => {
        if (error) {
            setShake(true);
            const timer = setTimeout(() => setShake(false), 500);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Check password strength in real-time
        if (field === "password") {
            setPasswordStrength(checkPasswordStrength(value));
        }
    };

    // Profile Image Handler
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError("Please select a valid image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("Image size should be less than 5MB");
            return;
        }

        setIsUploading(true);
        setError("");

        try {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Store the file object for later upload
            setProfileImageFile(file);

        } catch (err) {
            setError("Failed to process image. Please try again.");
            console.error("Image processing error:", err);
        } finally {
            setIsUploading(false);
        }
    };

    const removeProfileImage = () => {
        setImagePreview("");
        setProfileImageFile(null);
    };

    const addSkill = () => {
        const skillToAdd = formData.currentSkill.trim();
        if (skillToAdd && !formData.skills.includes(skillToAdd)) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, skillToAdd],
                currentSkill: ""
            }));
            setSuggestions([]); // Clear suggestions after adding
        }
    };

    const addSuggestedSkill = (skill) => {
        if (!formData.skills.includes(skill)) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, skill],
                currentSkill: "" // Clear the input field
            }));
        }
        setSuggestions([]);
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSkillKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill();
        }
    };

    const validateForm = () => {
        // Required fields validation
        const requiredFields = [
            'name', 'email', 'phone', 'password',
            'college', 'course', 'yearOfStudy'
        ];

        const missingFields = requiredFields.filter(field => !formData[field]);
        if (missingFields.length > 0) {
            setError(`Please fill in all required fields: ${missingFields.join(", ")}`);
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address");
            return false;
        }

        // Phone validation (basic)
        if (formData.phone.length < 10) {
            setError("Please enter a valid phone number");
            return false;
        }

        // Password confirmation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }

        // Password strength
        if (passwordStrength.score < 3) {
            setError("Please choose a stronger password");
            return false;
        }

        // Year of study validation
        const year = parseInt(formData.yearOfStudy);
        if (isNaN(year) || year < 1 || year > 5) {
            setError("Year of study must be between 1 and 5");
            return false;
        }

        // Skills validation
        if (formData.skills.length === 0) {
            setError("Please add at least one skill");
            return false;
        }

        return true;
    };

    const allSkills = [
        "JavaScript", "TypeScript", "Python", "Java", "C", "C++", "C#", "Go", "PHP", "Ruby",
        "HTML", "CSS", "Tailwind CSS", "Bootstrap", "SASS",
        "React", "Next.js", "Vue.js", "Angular", "Svelte",
        "Node.js", "Express.js", "NestJS", "Django", "Flask", "Spring Boot",
        "MongoDB", "MySQL", "PostgreSQL", "SQLite", "Firebase", "Oracle",
        "Git", "GitHub", "GitLab", "Bitbucket",
        "Machine Learning", "Deep Learning", "Data Science", "Data Analysis",
        "TensorFlow", "Keras", "PyTorch",
        "Pandas", "NumPy", "Matplotlib", "Scikit-learn",
        "Prompt Engineering", "AI Tools", "NLP", "Computer Vision",
        "React Native", "Android Development", "Kotlin", "Java (Android)",
        "Swift", "iOS Development", "Flutter", "Dart",
        "Cyber Security", "Ethical Hacking", "Penetration Testing",
        "AWS", "Azure", "Google Cloud", "DevOps",
        "Docker", "Kubernetes", "Linux", "Shell Scripting",
        "UI/UX Design", "Figma", "Adobe XD", "Photoshop", "Illustrator",
        "Canva", "Graphic Design", "Video Editing",
        "After Effects", "Premiere Pro",
        "SEO", "Content Writing", "Copywriting",
        "Social Media Management", "Facebook Ads",
        "Google Ads", "Email Marketing", "Influencer Marketing",
        "Brand Management",
        "Business Development", "Sales", "Marketing",
        "Cold Calling", "Lead Generation",
        "Operations Management", "Project Management",
        "Product Management", "Research & Analysis",
        "Human Resources", "Recruitment", "Talent Acquisition",
        "Employee Engagement", "Training & Development",
        "Interview Skills", "Payroll Processing",
        "Accounting", "Finance", "Investment Analysis",
        "Bookkeeping", "Tally", "GST Filing",
        "Financial Modeling", "Excel", "Power BI",
        "Data Visualization",
        "MS Word", "MS Excel", "MS PowerPoint",
        "Email Communication", "Professional Writing",
        "Customer Support", "Client Handling",
        "Documentation", "Report Writing",
        "Communication", "Leadership", "Teamwork", "Problem Solving",
        "Creativity", "Time Management", "Critical Thinking",
        "Adaptability", "Public Speaking", "Negotiation",
        "Event Management", "Photography", "Video Editing",
        "Blogging", "Content Creation", "Podcast Editing",
        "Typing", "Data Entry", "Customer Service",
    ];

    const handleSkillInput = (value) => {
        handleInputChange("currentSkill", value);

        if (value.length >= 1) {
            const filtered = allSkills.filter(skill =>
                skill.toLowerCase().startsWith(value.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 6)); // show only top 6
        } else {
            setSuggestions([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        if (captchaInput !== captcha.answer) {
            setError("Captcha answer is incorrect. Please try again.");
            setCaptcha(createCaptcha());
            setCaptchaInput("");
            return;
        }

        setIsLoading(true);

        try {
            // Create FormData for file upload
            const submitFormData = new FormData();

            // Append all form fields
            Object.keys(formData).forEach(key => {
                if (key === "skills") {
                    // convert ["React"] → [{name: "React"}]
                    const formattedSkills = formData.skills.map(skill => ({ name: skill }));
                    submitFormData.append("skills", JSON.stringify(formattedSkills));
                }
                else if (key !== "confirmPassword" && key !== "currentSkill") {
                    submitFormData.append(key, formData[key]);
                }
            });


            // Append profile image if exists
            if (profileImageFile) {
                submitFormData.append("profileImage", profileImageFile);
            }

            // Make POST request with FormData
            await axios.post("/api/register/intern", submitFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccess("Registration successful! Redirecting to login...");

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/intern-login");
            }, 2000);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
            setCaptcha(createCaptcha());
            setCaptchaInput("");
        } finally {
            setIsLoading(false);
        }
    };

    const refreshCaptcha = () => {
        setCaptcha(createCaptcha());
        setCaptchaInput("");
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength.score === 0) return "bg-gray-200";
        if (passwordStrength.score <= 2) return "bg-red-500";
        if (passwordStrength.score <= 3) return "bg-yellow-500";
        return "bg-green-500";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-200 py-8 px-4 sm:px-6 lg:px-8 overflow-auto">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-center flex-col mb-8 ">
                    <img src="/GraphuraLogo.jpg" alt="Graphura Logo" className="h-24 rounded-full" />
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                        Join Placement Programme
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Create your account and start your internship journey
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 👤 Basic Details Section */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <User className="w-5 h-5 mr-2 text-blue-500" />
                                Basic Details
                            </h2>

                            {/* Profile Image Upload */}
                            <div className="mb-6">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                                    <Camera className="w-4 h-4 mr-2 text-blue-500" />
                                    Profile Image
                                </label>

                                <div className="flex items-center space-x-6">
                                    {/* Image Preview */}
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="Profile preview"
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            ) : (
                                                <User className="w-8 h-8 text-gray-400" />
                                            )}
                                        </div>

                                        {/* Remove button */}
                                        {imagePreview && (
                                            <button
                                                type="button"
                                                onClick={removeProfileImage}
                                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Upload Controls */}
                                    <div className="flex-1">
                                        <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                {isUploading ? (
                                                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <>
                                                        <Upload className="w-6 h-6 text-gray-400" />
                                                        <span className="text-sm text-gray-600 font-medium">
                                                            Click to upload profile image
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={isUploading}
                                            />
                                        </label>
                                        <p className="text-xs text-gray-500 mt-2 text-center">
                                            JPG, PNG, WEBP (Max 5MB)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <User className="w-4 h-4 mr-2 text-blue-500" />
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Mail className="w-4 h-4 mr-2 text-blue-500" />
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Phone className="w-4 h-4 mr-2 text-blue-500" />
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Lock className="w-4 h-4 mr-2 text-blue-500" />
                                        Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a strong password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange("password", e.target.value)}
                                            className="w-full p-3 pr-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    {formData.password && (
                                        <div className="mt-2">
                                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                <span>Password Strength:</span>
                                                <span>{passwordStrength.feedback}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Lock className="w-4 h-4 mr-2 text-blue-500" />
                                        Confirm Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                            className="w-full p-3 pr-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    {/* Password Match Indicator */}
                                    {formData.confirmPassword && (
                                        <div className="mt-2 flex items-center space-x-2">
                                            {formData.password === formData.confirmPassword ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    <span className="text-xs text-green-600">Passwords match</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                    <span className="text-xs text-red-600">Passwords don't match</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 🎓 Academic Info Section */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <GraduationCap className="w-5 h-5 mr-2 text-green-500" />
                                Academic Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <BookOpen className="w-4 h-4 mr-2 text-green-500" />
                                        College/University *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your college name"
                                        value={formData.college}
                                        onChange={(e) => handleInputChange("college", e.target.value)}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <BookOpen className="w-4 h-4 mr-2 text-green-500" />
                                        Course/Program *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., B.Tech, B.Sc, BCA"
                                        value={formData.course}
                                        onChange={(e) => handleInputChange("course", e.target.value)}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <BookOpen className="w-4 h-4 mr-2 text-green-500" />
                                        Year of Study *
                                    </label>
                                    <select
                                        value={formData.yearOfStudy}
                                        onChange={(e) => handleInputChange("yearOfStudy", e.target.value)}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        required
                                    >
                                        <option value="">Select Year</option>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="4">4th Year</option>
                                        {/* 📘 Diploma Levels */}
                                        <option value="Post Diploma">Post Diploma</option>
                                        <option value="Higher Diploma">Higher Diploma (HD)</option>
                                        {/* 🎓 Completed */}
                                        <option value="Graduate">Graduated</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 💼 Professional Info Section */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <Briefcase className="w-5 h-5 mr-2 text-purple-500" />
                                Professional Information
                            </h2>

                            <div className="mb-4">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <BookOpen className="w-4 h-4 mr-2 text-green-500" />
                                    Domain
                                </label>

                                <select
                                    value={formData.domain}
                                    onChange={(e) => handleInputChange("domain", e.target.value)}
                                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
                                >
                                    <option value="">Select Domain</option>
                                    <optgroup label="Technical Domains">
                                        <option value="Frontend Development">Frontend Development</option>
                                        <option value="Backend Development">Backend Development</option>
                                        <option value="Full Stack Development">Full Stack Development</option>
                                        <option value="MERN Stack">MERN Stack</option>
                                        <option value="MEAN Stack">MEAN Stack</option>
                                        <option value="Data Science">Data Science</option>
                                        <option value="Machine Learning">Machine Learning</option>
                                        <option value="Artificial Intelligence">Artificial Intelligence</option>
                                        <option value="DevOps">DevOps</option>
                                        <option value="Cloud Computing">Cloud Computing</option>
                                        <option value="Cyber Security">Cyber Security</option>
                                        <option value="UI/UX Design">UI / UX Design</option>
                                        <option value="Android Development">Android Development</option>
                                        <option value="iOS Development">iOS Development</option>
                                        <option value="Software Testing / QA">Software Testing / QA</option>
                                        <option value="Blockchain Development">Blockchain Development</option>
                                        <option value="Game Development">Game Development</option>
                                    </optgroup>
                                    <optgroup label="Non-Technical Domains">
                                        <option value="Human Resources">Human Resources (HR)</option>
                                        <option value="Business Development">Business Development (BD)</option>
                                        <option value="Digital Marketing">Digital Marketing</option>
                                        <option value="Social Media Management">Social Media Management</option>
                                        <option value="Content Writing">Content Writing</option>
                                        <option value="Graphic Design">Graphic Design</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Accounting">Accounting</option>
                                        <option value="Sales & Marketing">Sales & Marketing</option>
                                        <option value="Customer Support">Customer Support</option>
                                        <option value="Operations Management">Operations Management</option>
                                        <option value="Project Management">Project Management</option>
                                        <option value="Email and Outreaching">Email and Outreaching</option>
                                        <option value="Event Management">Event Management</option>
                                        <option value="Quality Assurance">Quality Assurance</option>
                                    </optgroup>
                                </select>

                                <span className="text-xs text-green-500 block mt-1 ml-2">
                                    # Select your domain as per Graphura India Private Limited Internship Programme.
                                </span>
                            </div>

                            {/* Skills Input */}
                            <div className="mb-4">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <Code className="w-4 h-4 mr-2 text-purple-500" />
                                    Skills *
                                </label>

                                <div className="relative">
                                    {/* Input */}
                                    <div className="flex space-x-2 mb-3">
                                        <input
                                            type="text"
                                            placeholder="Add a skill (e.g., JavaScript, Python)"
                                            value={formData.currentSkill}
                                            onChange={(e) => handleSkillInput(e.target.value)}
                                            onKeyPress={handleSkillKeyPress}
                                            className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={addSkill}
                                            className="px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    {/* 🔽 Auto Suggestions Dropdown */}
                                    {suggestions.length > 0 && (
                                        <div className="absolute z-20 bg-white border border-gray-200 rounded-xl shadow-lg w-full max-h-48 overflow-y-auto">
                                            {suggestions.map((skill, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => addSuggestedSkill(skill)}
                                                    className="px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm"
                                                >
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Skill Tags */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.skills.map((skill, index) => (
                                        <div
                                            key={index}
                                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                                        >
                                            <span>{skill}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
                                                className="text-blue-600 hover:text-blue-800 ml-1"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {formData.skills.length === 0 && (
                                    <p className="text-sm text-gray-500 mt-2">Add at least one skill</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <FileText className="w-4 h-4 mr-2 text-purple-500" />
                                        Resume URL
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="Link to your resume (Google Drive, etc.)"
                                        value={formData.resumeUrl}
                                        required
                                        onChange={(e) => handleInputChange("resumeUrl", e.target.value)}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Linkedin className="w-4 h-4 mr-2 text-purple-500" />
                                        LinkedIn Profile
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://linkedin.com/in/yourprofile"
                                        value={formData.linkedinUrl}
                                        onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Github className="w-4 h-4 mr-2 text-purple-500" />
                                        GitHub Profile
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://github.com/yourusername"
                                        value={formData.githubUrl}
                                        onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 🔒 Security Check */}
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <Shield className="w-4 h-4 mr-2 text-green-500" />
                                Security Check *
                            </label>
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 border-2 border-gray-200 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-gray-700">Solve this:</span>
                                    <button
                                        type="button"
                                        onClick={refreshCaptcha}
                                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        <span>New Challenge</span>
                                    </button>
                                </div>
                                <div className="flex items-center justify-between space-x-4">
                                    <div className="flex-1 bg-white border-2 border-gray-300 rounded-lg p-3 text-center">
                                        <span className="text-xl font-bold text-gray-800 font-mono">
                                            {captcha.question}
                                        </span>
                                    </div>
                                    <span className="text-xl font-bold text-gray-600">=</span>
                                    <input
                                        type="text"
                                        placeholder="?"
                                        value={captchaInput}
                                        onChange={(e) => setCaptchaInput(e.target.value)}
                                        className="w-20 p-3 border-2 border-gray-300 rounded-lg text-center text-xl font-bold font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Error/Success Messages */}
                        {error && (
                            <div className={`bg-red-50 border-2 border-red-200 rounded-xl p-4 transform transition-all duration-300 ${shake ? 'animate-shake' : ''}`}>
                                <div className="flex items-center space-x-2 text-red-700">
                                    <XCircle className="w-5 h-5" />
                                    <span className="font-medium">{error}</span>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                                <div className="flex items-center space-x-2 text-green-700">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-medium">{success}</span>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl text-lg"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : null}
                            <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{" "}
                            <button
                                onClick={() => navigate("/intern-login")}
                                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 underline underline-offset-2"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            {/* Custom CSS for shake animation */}
            <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
        </div>
    );
};

export default RegisterPage;