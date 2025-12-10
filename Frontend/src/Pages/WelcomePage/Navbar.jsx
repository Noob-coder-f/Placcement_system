import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Internships", path: "/internship" },
  ];

  return (
    <nav className="
      fixed top-0 left-0 z-50
      w-full md:w-[85%] h-25 md:h-18
      bg-white/80 backdrop-blur-xl
      border border-white/30
      shadow-[0_8px_30px_rgba(0,0,0,0.1)]
      md:rounded-full
      px-6 py-3
      flex items-center justify-between
      mx-auto md:left-1/2 md:-translate-x-1/2 md:mt-8 
    ">
      
    
      <Link to="/" className="flex items-center">
        <img src="/GraphuraLogo.jpg" className="h-15 w-auto" alt="logo" />
      </Link>

      
      <div className="hidden md:flex items-center space-x-8">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `font-semibold relative transition-all
               ${isActive ? "text-indigo-600" : "text-gray-800 hover:text-indigo-600"}
               after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px]
               ${isActive ? "after:bg-indigo-600" : "after:bg-transparent hover:after:bg-indigo-600"}`
            }
          >
            {link.name}
          </NavLink>
        ))}

       
        <div className="relative">
          <button
            className="bg-sky-600 text-white px-5 py-2 rounded-lg shadow-sm font-medium 
                       hover:bg-sky-700 transition-all flex items-center gap-2"
            onClick={() => setShowLoginOptions((prev) => !prev)}
          >
            Login
            <ChevronDown
              size={16}
              className={`transition-transform ${showLoginOptions ? "rotate-180" : ""}`}
            />
          </button>

          {showLoginOptions && (
            <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-blue-100 py-2 w-52 z-20">
              <Link
                to="/intern-login"
                className="block px-4 py-3 hover:bg-blue-50 border-b border-blue-50"
              >
                <div className="font-medium text-gray-800">Intern Login</div>
                <div className="text-xs text-gray-500">For intern candidates</div>
              </Link>

              <Link
                to="/mentor-login"
                className="block px-4 py-3 hover:bg-blue-50 border-b border-blue-50"
              >
                <div className="font-medium text-gray-800">Mentor Login</div>
                <div className="text-xs text-gray-500">For mentors & reviewers</div>
              </Link>

              <Link
                to="/hiring-team-login"
                className="block px-4 py-3 hover:bg-blue-50 border-b border-blue-50"
              >
                <div className="font-medium text-gray-800">Hiring Team</div>
                <div className="text-xs text-gray-500">For HR & hiring</div>
              </Link>

              <Link
                to="/admin-login"
                className="block px-4 py-3 hover:bg-blue-50"
              >
                <div className="font-medium text-gray-800">Admin Login</div>
                <div className="text-xs text-gray-500">For system admins</div>
              </Link>
            </div>
          )}
        </div>
      </div>

 
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

   
      {isOpen && (
        <div className="
          absolute top-[70px] left-1/2 -translate-x-1/2
          w-[90%]
          bg-white/90 backdrop-blur-xl
          shadow-lg rounded-2xl
          py-6 flex flex-col items-center
          space-y-4 text-center z-40
        ">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `font-semibold text-lg 
                 ${isActive ? "text-indigo-600 underline" : "text-gray-700 hover:text-indigo-600"}`
              }
            >
              {link.name}
            </NavLink>
          ))}


          <button
            onClick={() => {
              setIsOpen(false);
              navigate("/login");
            }}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full"
          >
            Login
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;