import { useState } from "react";
import { Link } from "react-router-dom";
import JobsSlider from "./JobsSlider";

function WelcomePage() {
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  return (
    <>
      {/* Main Container */}
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100">

        {/* Header */}
        <header className="bg-white shadow-sm border-b border-blue-100">
          <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/GraphuraLogo.jpg"
                alt="Graphura Logo"
                className="h-8 sm:h-10 md:h-12 w-auto"
              />
            </div>

            {/* Login Section */}
            <div className="relative">
              <button
                className="bg-sky-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg shadow-sm font-medium hover:bg-sky-700 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
                onClick={() => setShowLoginOptions((prev) => !prev)}
              >
                <span>Login</span>
                <svg className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showLoginOptions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showLoginOptions && (
                <div className="absolute right-0 top-10 sm:top-12 bg-white rounded-lg shadow-lg border border-blue-100 py-2 w-48 z-10">
                  <Link
                    to="/intern-login"
                    className="block text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-blue-50"
                  >
                    <div className="font-medium text-gray-800 text-sm sm:text-base">Intern Login</div>
                    <div className="text-xs sm:text-sm text-gray-500">For internship candidates</div>
                  </Link>

                  <Link
                    to="/mentor-login"
                    className="block text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-blue-50"
                  >
                    <div className="font-medium text-gray-800 text-sm sm:text-base">Mentor Login</div>
                    <div className="text-xs sm:text-sm text-gray-500">For mentors and reviewers</div>
                  </Link>

                  <Link
                    to="/hiring-team-login"
                    className="block text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-blue-50"
                  >
                    <div className="font-medium text-gray-800 text-sm sm:text-base">Hiring Team</div>
                    <div className="text-xs sm:text-sm text-gray-500">For HR and hiring members</div>
                  </Link>

                  <Link
                    to="/admin-login"
                    className="block text-left px-4 py-3 hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium text-gray-800 text-sm sm:text-base">Admin Login</div>
                    <div className="text-xs sm:text-sm text-gray-500">System administrators</div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 lg:py-20">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-10 sm:-left-20 top-10 sm:top-20 w-48 h-48 sm:w-72 sm:h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            <div className="absolute -right-10 sm:-right-20 top-20 sm:top-40 w-48 h-48 sm:w-72 sm:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
            <div className="absolute left-20 sm:left-40 -bottom-10 sm:-bottom-20 w-48 h-48 sm:w-72 sm:h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-500"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">

              {/* Left Content */}
              <div className="text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                    Graphura
                  </span>
                </h1>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-700 mb-4">
                  Placement Portal
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl">
                  Connect with top companies and kickstart your career journey.
                  We bridge the gap between talented individuals and exceptional opportunities.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-sky-600">500+</div>
                    <div className="text-gray-600 text-xs sm:text-sm">Happy Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-sky-600">1000+</div>
                    <div className="text-gray-600 text-xs sm:text-sm">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-sky-600">300%</div>
                    <div className="text-gray-600 text-xs sm:text-sm">Growth</div>
                  </div>
                </div>

              </div>

              {/* Right Image */}
              <div className="relative order-first lg:order-last mb-8 lg:mb-0">
                <div className="bg-white rounded-2xl shadow-lg p-2 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt="Successful team collaboration"
                    className="rounded-xl w-full h-48 sm:h-64 md:h-80 object-cover"
                  />
                </div>
                {/* Floating elements */}
                <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white rounded-xl shadow-lg p-3 sm:p-4 w-24 sm:w-32 transform -rotate-6">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-sky-600">95%</div>
                  <div className="text-xs text-gray-600">Placement Rate</div>
                </div>
                <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-white rounded-xl shadow-lg p-3 sm:p-4 w-24 sm:w-32 transform rotate-6">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-sky-600">50+</div>
                  <div className="text-xs text-gray-600">Partner Companies</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400 mb-3 sm:mb-4">
                Why Choose Graphura?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                We provide comprehensive placement services to help you achieve your career goals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Feature 1 */}
              <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-sky-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Premium Opportunities</h3>
                <p className="text-gray-600 text-sm sm:text-base">Access exclusive job openings from leading companies across various industries.</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-sky-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Career Guidance</h3>
                <p className="text-gray-600 text-sm sm:text-base">Get personalized career counseling and interview preparation from industry experts.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-sky-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Network Building</h3>
                <p className="text-gray-600 text-sm sm:text-base">Connect with professionals and alumni to expand your professional network.</p>
              </div>
            </div>
          </div>
        </section>
        <JobsSlider />
        {/* Who We Are Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-sky-50 to-blue-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-400 mb-3 sm:mb-4">
                Who We Are
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Leading digital marketing agency dedicated to helping businesses grow their online presence
              </p>
              
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">

              {/* Left Content */}
              <div className="space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  <span className="font-semibold text-sky-600">Graphura India Private Limited</span> is a leading digital marketing agency dedicated to helping small businesses and companies grow their online presence.
                </p>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  Founded in 2015, we've helped over 500 clients achieve their digital marketing goals through innovative strategies and data-driven approaches.
                </p>

                {/* Stats in Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
                  <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 text-center hover:shadow-md transition-shadow duration-300">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-sky-600 mb-1 sm:mb-2">2+</div>
                    <div className="text-gray-700 font-medium text-sm sm:text-base">Years of Experience</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 text-center hover:shadow-md transition-shadow duration-300">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-sky-600 mb-1 sm:mb-2">500+</div>
                    <div className="text-gray-700 font-medium text-sm sm:text-base">Satisfied Clients</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 text-center hover:shadow-md transition-shadow duration-300">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-sky-600 mb-1 sm:mb-2">97%</div>
                    <div className="text-gray-700 font-medium text-sm sm:text-base">Client Retention Rate</div>
                  </div>
                </div>
              </div>

              {/* Right Image Box */}
              <div className="space-y-4 pt-2">
                <div className="overflow-hidden transition-shadow duration-300">
                  <img
                    src="/team.svg"
                    alt="Our Team at Work"
                    className="w-full h-auto max-w-md mx-auto lg:max-w-full object-cover"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white py-2 sm:py-10 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.3),_transparent_60%)] pointer-events-none"></div>

        <div className="container mx-auto px-4 sm:px-8 relative z-10">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-y-6 md:gap-y-0">

            {/* Logo & Brand */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4 group">
              <img
                src="/Graphura.jpg"
                alt="Graphura Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border border-blue-500/30 shadow-md transition-transform duration-300 group-hover:scale-105"
              />
              <div className="mt-3 sm:mt-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                  Graphura
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm md:text-base font-light mt-1">
                  Empowering Innovation & Growth
                </p>
              </div>
            </div>

            {/* Company Info */}
            <div className="text-gray-400">
              <div className="text-sm sm:text-base md:text-lg font-medium">Graphura India Pvt. Ltd.</div>
              <div className="text-xs sm:text-sm md:text-base opacity-80 mt-1">
                © {new Date().getFullYear()} All Rights Reserved.
              </div>
            </div>
          </div>

          {/* Divider & Tagline */}
          <div className="border-t border-gray-800 mt-8 sm:mt-10 pt-6 sm:pt-8 text-center">
            <p className="text-gray-500 text-xs sm:text-sm md:text-base italic tracking-wide leading-relaxed px-4">
              “Building careers, shaping futures — one placement at a time.”
            </p>

          </div>
        </div>
      </footer>


    </>
  );
}

export default WelcomePage;