import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, RefreshCw, LogIn, Mail, Lock, Shield } from "lucide-react";

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

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [captcha, setCaptcha] = useState(createCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);


  useEffect(() => {
  const verifyAuth = async () => {
    const token = localStorage.getItem("interToken");
    if (!token) return;

    try {
      await axios.get("/api/check-auth/intern", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Token valid → redirect
      navigate("/dashboard/intern");
    } catch (err) {
      localStorage.removeItem("token", err);
    }
  };

  verifyAuth();
}, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email && !password) {
      setError("Please enter email or password to login.");
      setIsLoading(false);
      return;
    }

    if (captchaInput !== captcha.answer) {
      setError("Captcha answer is incorrect. Please try again.");
      setCaptcha(createCaptcha());
      setCaptchaInput("");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/login/intern", {
        email,
        password,
      });
      localStorage.setItem("interToken", res.data.token);
      navigate("/dashboard/intern");
    } catch (err) { 
      setError(
        err.response?.data?.message ||
        "Invalid credentials. Please check your email and password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCaptcha = () => {
    setCaptcha(createCaptcha());
    setCaptchaInput("");
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        
        <div className="absolute top-6 left-6">
        <img src="/GraphuraLogo.jpg" alt="Graphura Logo" className="h-24 rounded-full" />
        </div>

        {/* Left Section - Image */}
        <div className="hidden lg:flex relative w-full xl:w-1/2">
          <img
            src="/image.png"
            alt="Student Illustration"
            className="w-full h-full object-cover"
          />
          
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full xl:w-1/2 flex flex-col justify-center p-4 sm:p-5 md:p-6 lg:p-8">
          {/* Mobile Header */}
          <div className="lg:hidden mb-4 sm:mb-5">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Intern Login
            </h2>
            <p className="text-gray-600 text-sm">Welcome back! Please sign in to your account</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-5 lg:mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Intern Login
            </h2>
            <p className="text-gray-600 text-sm">Welcome back! Please sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-5">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Mail className="w-4 h-4 mr-2 text-blue-500" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 sm:p-3 lg:p-3 pl-9 sm:pl-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50/50 text-sm"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Lock className="w-4 h-4 mr-2 text-blue-500" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 sm:p-3 lg:p-3 pl-9 sm:pl-10 pr-9 sm:pr-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50/50 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Enhanced Captcha Section */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Shield className="w-4 h-4 mr-2 text-green-500" />
                Security Check
              </label>
              <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 border-2 border-gray-200 rounded-xl p-2.5 sm:p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Solve this:</span>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">New</span>
                  </button>
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex-1 bg-white border-2 border-gray-300 rounded-lg p-2 text-center min-w-0">
                    <span className="text-base sm:text-lg font-bold text-gray-800 font-mono break-all">
                      {captcha.question}
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-bold text-gray-600 flex-shrink-0">=</span>
                  <input
                    type="text"
                    placeholder="?"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className="w-12 sm:w-16 p-2 border-2 border-gray-300 rounded-lg text-center text-base sm:text-lg font-bold font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 flex-shrink-0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Error Message with Animation */}
            {error && (
              <div className={`bg-red-50 border-2 border-red-200 rounded-xl p-2.5 sm:p-3 transform transition-all duration-300 ${shake ? 'animate-shake' : ''}`}>
                <div className="flex items-center space-x-2 text-red-700">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold p-2.5 sm:p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl text-sm"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span>{isLoading ? "Signing In..." : "Sign In"}</span>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-4 sm:mt-5 text-center">
            <p className="text-gray-600 text-xs">
              Don't have an account?{" "}
              <a 
                href="/register-intern" 
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 underline underline-offset-2"
              >
                Create Account
              </a>
            </p>
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

export default LoginPage;