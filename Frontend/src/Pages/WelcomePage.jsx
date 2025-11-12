import { useState } from "react";
import { Link } from "react-router-dom";
// If you want to use an imported logo, add: 
// import logo from '../assets/WhatsApp-Image-2025-11-09-at-20.34.09_49c61fca.jpg';

function WelcomePage() {
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  return (
    <>
      <div className="h-[120vh] flex flex-col bg-gradient-to-br from-blue-700 via-purple-500 to-pink-400 items-center justify-center relative ">
        {/* Logo */}
        <div className="absolute top-7 left-12">
          <div className="p-2 flex items-center">
            <img
              src="/GraphuraLogo.jpg" // or use {logo}
              alt="Graphura Logo"
              className="h-15 w-40"
            />
          </div>
        </div>
        {/* Login Button and Options */}
        <div className="absolute top-8 right-8 flex flex-col items-end">
          <button
            className="bg-gradient-to-r from-pink-600 via-purple-500 to-indigo-500 text-white px-5 py-2 rounded-full shadow-md font-semibold hover:from-pink-700 hover:to-indigo-600 transition"
            onClick={() => setShowLoginOptions((prev) => !prev)}
          >
             Login
          </button>
          {showLoginOptions && (
            <div className="flex flex-col gap-3 mt-3">
              <button className="w-48 bg-blue-600 text-white font-semibold py-2 rounded-full shadow hover:bg-blue-700 transition text-left px-6">
                Intern Login
              </button>
              <button className="w-48 bg-green-600 text-white font-semibold py-2 rounded-full shadow hover:bg-green-700 transition text-left px-6">
                HR Login
              </button>
              <button className="w-48 bg-purple-600 text-white font-semibold py-2 rounded-full shadow hover:bg-purple-700 transition text-left px-6">
                Admin Login
              </button>
            </div>
          )}
        </div>
        {/* Main Content */}
        <div className="text-center flex flex-col items-center pt-12 mt-12">
          <h2 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-white via-purple-300 to-blue-400 bg-clip-text text-transparent drop-shadow-lg tracking-wide">
            Welcome to Graphura
          </h2>
          <div className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent tracking-wide">
            Placement Portal
          </div>
          <h4 className="text-6xl font-extrabold text-white mb-2">
            Shape Your Future With
          </h4>
          <span className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-blue-300 to-purple-400 bg-clip-text text-transparent">
            Excellence
          </span>
          <p className="text-lg text-white/90 max-w-xl mb-8 mx-auto">
            Join Graphura’s innovative placement program where talent meets opportunity. We connect exceptional individuals with transformative career paths.
          </p>
          {/* Stats Cards Section */}
          <div className="flex flex-col md:flex-row gap-8 justify-center my-10 mt-5">
            <div className="bg-white rounded-xl shadow-lg px-12 py-8 flex flex-col items-center w-70">
              <span className="text-5xl font-extrabold text-blue-500 mb-2">500</span>
              <span className="text-lg text-gray-600">Happy Clients</span>
            </div>
            <div className="bg-white rounded-xl shadow-lg px-12 py-8 flex flex-col items-center w-70">
              <span className="text-5xl font-extrabold text-blue-500 mb-2">1000</span>
              <span className="text-lg text-gray-600">Projects Completed</span>
            </div>
            <div className="bg-white rounded-xl shadow-lg px-12 py-8 flex flex-col items-center w-70">
              <span className="text-5xl font-extrabold text-blue-500 mb-2">300</span>
              <span className="text-lg text-gray-600">% Average Growth</span>
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex gap-6 justify-center">
            <Link to="/opportunities">
              <button className="bg-[#E6E6FF] text-gray-900 rounded-full px-8 py-3 font-semibold shadow-md hover:bg-purple-100 transition">
                Explore Opportunities &rarr;
              </button>
            </Link>
            <Link to="/learn-more">
              <button className="bg-[#E6E6FF] text-gray-900 rounded-full px-8 py-3 font-semibold shadow-md hover:bg-purple-100 transition">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </div>
     <footer className="bg-gray-900 text-white py-12">
  <div className="max-w-6xl mx-auto px-6">
    <div className="flex flex-col md:flex-row items-center md:justify-start gap-4">
      <img
        src="/GraphuraLogo.jpg" // or use {logo} if imported
        alt="Graphura Logo"
        className="w-28 h-auto object-contain"
      />
      <div className="text-gray-400 text-center md:text-left ml-60">
        © {new Date().getFullYear()} Graphura India Pvt Ltd. All rights reserved.
      </div>
    </div>
  </div>
</footer>

    </>
  );
}

export default WelcomePage;