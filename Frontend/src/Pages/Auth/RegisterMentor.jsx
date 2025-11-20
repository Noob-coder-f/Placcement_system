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
    Briefcase,
    Code,
    FileText,
    Linkedin,
    Github,
    Shield,
    RefreshCw,
    CheckCircle,
    XCircle,
    Award,
    Calendar,
    Upload,
    Key
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

const MentorRegister = () => {
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        // 👤 Basic Details
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        privateKey: "", // New private key field

        // 💼 Professional Details
        experience: "",
        domain: "", // Single domain selection
        profileImage: null,
        linkedinUrl: "",
        githubUrl: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [captcha, setCaptcha] = useState(createCaptcha());
    const [captchaInput, setCaptchaInput] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPrivateKey, setShowPrivateKey] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [shake, setShake] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        feedback: ""
    });
    const [imagePreview, setImagePreview] = useState("");

    // Admin-controlled domains
    const domains = [
        "Frontend Development",
        "Backend Development",
        "Full Stack Development",
        "MERN Stack",
        "MEAN Stack",

        "Data Science",
        "Machine Learning",
        "Artificial Intelligence",

        "DevOps",
        "Cloud Computing",
        "Cyber Security",

        "UI/UX Design",
        "Android Development",
        "iOS Development",

        "Software Testing / QA",
        "Blockchain Development",
        "Game Development",


        "Human Resources",
        "Business Development",
        "Digital Marketing",
        "Social Media Management",

        "Content Writing",
        "Graphic Design",
        "Finance",
        "Accounting",

        "Sales & Marketing",
        "Customer Support",
        "Operations Management",
        "Project Management",
        "Email and Outreaching",
        "Public Relations",
        "Event Management", 
        "Quality Assurance",
    ];


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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type and size
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!validTypes.includes(file.type)) {
                setError('Please select a valid image file (JPEG, PNG, GIF)');
                return;
            }

            if (file.size > maxSize) {
                setError('Image size should be less than 5MB');
                return;
            }

            setFormData(prev => ({
                ...prev,
                profileImage: file
            }));

            // Create image preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
            setError("");
        }
    };

    const validateForm = () => {
        // Required fields validation
        const requiredFields = [
            'name', 'email', 'phone', 'password', 'confirmPassword',
            'privateKey', 'experience', 'domain'
        ];

        const missingFields = requiredFields.filter(field => !formData[field]);
        if (missingFields.length > 0) {
            setError(`Please fill in all required fields`);
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

        // Experience validation
        const experience = parseInt(formData.experience);
        if (isNaN(experience) || experience < 0 || experience > 50) {
            setError("Experience must be between 0 and 50 years");
            return false;
        }

        // Private key validation (basic length check)
        if (formData.privateKey.length < 8) {
            setError("Private key must be at least 8 characters long");
            return false;
        }

        return true;
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
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('email', formData.email);
            submitData.append('phone', formData.phone);
            submitData.append('password', formData.password);
            submitData.append('privateKey', formData.privateKey);
            submitData.append('experience', formData.experience);
            submitData.append('domain', formData.domain);
            submitData.append('linkedinUrl', formData.linkedinUrl);
            submitData.append('githubUrl', formData.githubUrl);

            if (formData.profileImage) {
                submitData.append('profileImage', formData.profileImage);
            }

            await axios.post('/api/mentor/register', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccess("Mentor registered successfully! Redirecting to login...");

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/mentor-login");
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
                <div className="flex items-center justify-center flex-col mb-8">
                    <img src="/GraphuraLogo.jpg" alt="Graphura Logo" className="h-24 rounded-full" />
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                        Mentor Registration
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Join our platform as a mentor and guide the next generation
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
                                        <Key className="w-4 h-4 mr-2 text-blue-500" />
                                        Private Key *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPrivateKey ? "text" : "password"}
                                            placeholder="Enter your private key"
                                            value={formData.privateKey}
                                            onChange={(e) => handleInputChange("privateKey", e.target.value)}
                                            className="w-full p-3 pr-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPrivateKey(!showPrivateKey)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Contact admin to get your private registration key
                                    </p>
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

                        {/* 💼 Professional Details Section */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <Briefcase className="w-5 h-5 mr-2 text-purple-500" />
                                Professional Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                                        Years of Experience *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="50"
                                        placeholder="Enter years of experience"
                                        value={formData.experience}
                                        onChange={(e) => handleInputChange("experience", e.target.value)}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Code className="w-4 h-4 mr-2 text-purple-500" />
                                        Primary Domain *
                                    </label>
                                    <select
                                        value={formData.domain}
                                        onChange={(e) => handleInputChange("domain", e.target.value)}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
                                        required
                                    >
                                        <option value="">Select Your Domain</option>
                                        {domains.map((domain, index) => (
                                            <option key={index} value={domain}>
                                                {domain}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Select your primary expertise domain
                                    </p>
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

                        {/* 📸 Profile Photo Upload */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <Upload className="w-5 h-5 mr-2 text-green-500" />
                                Profile Photo
                            </h2>

                            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                                {/* Image Preview */}
                                <div className="flex-shrink-0">
                                    <div className="w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Profile preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-12 h-12 text-gray-400" />
                                        )}
                                    </div>
                                </div>

                                {/* Upload Area */}
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Profile Image
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="profileImage"
                                        />
                                        <label
                                            htmlFor="profileImage"
                                            className="cursor-pointer block"
                                        >
                                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                            <div className="flex flex-col items-center space-y-1">
                                                <span className="text-blue-600 font-medium">Click to upload</span>
                                                <span className="text-gray-500 text-sm">or drag and drop</span>
                                                <span className="text-gray-400 text-xs">PNG, JPG, GIF up to 5MB</span>
                                            </div>
                                        </label>
                                    </div>
                                    {formData.profileImage && (
                                        <p className="mt-2 text-sm text-green-600 flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Selected: {formData.profileImage.name}
                                        </p>
                                    )}
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
                            <span>{isLoading ? "Creating Mentor Account..." : "Register as Mentor"}</span>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{" "}
                            <button
                                onClick={() => navigate("/mentor-login")}
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

export default MentorRegister;