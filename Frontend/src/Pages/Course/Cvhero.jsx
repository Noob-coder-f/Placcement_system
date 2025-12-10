import React from "react";

const Hero = () => {
  return (
    <div
      className="w-full md:min-h-[95vh] min-h-[80vh]  flex flex-col md:flex-row items-center justify-between px-10 md:px-20 md:pt-30 md:pl-25"
      style={{
        background: "radial-gradient(circle, #88D9FF 0%, #0D6691 100%)",
      }}
    >

      {/* LEFT CONTENT */}
      <div className="text-white max-w-xl md:pt-0 md:text-left text-center pt-70 md:ml-[50px]">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
          CV MASTERY <br /> COURSE
        </h1>

        <p className="mt-4 text-lg md:text-2xl opacity-90">
          Turn your resume into a powerful, impactful, and
          interview-winning document.
        </p>

        <button className="mt-6 bg-white text-gray-900 font-semibold px-10 py-5 rounded-md shadow hover:bg-gray-100">
          Enroll Now
        </button>
      </div>

      {/* RIGHT IMAGE */}
      <div className="md:mr-[-150px] md:mt-0 flex mr-0 justify-center w-full md:w-full hidden lg:block">
        <img
          src="/courseshero.png"
          alt="CV Illustration"
          className="w-[330px] md:w-[850px]"
        />
      </div>
    </div>
  );
};

export default Hero;
