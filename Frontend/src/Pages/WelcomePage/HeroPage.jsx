import React from "react";

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#3B91BA] via-[#64B7DF] to-[#A6D4EC] pt-28 pb-36">

      
      <div className="relative max-w-[1400px] mx-auto px-6">

        
        <h1 className="text-white text-4xl md:text-5xl font-extrabold text-center tracking-wide">
          GRAPHURA
        </h1>

        <h2 className="text-[#043b5c] text-5xl md:text-7xl font-extrabold tracking-wide text-center mt-3">
          BUILD YOUR FUTURE
        </h2>

       
        <div className="absolute top-[180px] left-1/2 -translate-x-1/2 
                        w-[1000px] h-[1000px] 
                        bg-[#0E4662] rounded-full opacity-90 shadow-xl">
        </div>

       
        <img
          src="/girl-removebg.png"
          alt="girl"
          className="relative z-20 w-[310px] md:w-[360px] mx-auto mt-[120px]"
        />

        <div className="absolute left-[20%] top-[200px] space-y-8 text-left z-30">

          <p className="text-white text-2xl md:text-4xl font-bold tracking-wide">
            PLACEMENT
          </p>

          <div className="w-[230px] text-center px-6 py-3 rounded-xl 
                          bg-white/25 backdrop-blur-lg border border-white/40 
                          text-white shadow-[0_4px_20px_rgba(255,255,255,0.2)] font-semibold">
            Select Packages
          </div>

          <div className="w-[230px] text-center px-6 py-3 rounded-xl 
                          bg-white/25 backdrop-blur-lg border border-white/40 
                          text-white shadow-[0_4px_20px_rgba(255,255,255,0.2)] font-semibold">
            CV Course
          </div>
        </div>

        
        <div className="absolute right-[9%] top-[300px] space-y-8 text-right z-30">

          <p className="text-white text-2xl md:text-3xl font-bold tracking-wide">
            PROGRAM
          </p>

          <div className="w-[230px] text-center px-6 py-3 rounded-xl 
                          bg-white/25 backdrop-blur-lg border border-white/40 
                          text-white shadow-[0_4px_20px_rgba(255,255,255,0.2)] font-semibold">
            Interview Preparation
          </div>

          <div className="w-[230px] text-center px-6 py-3 rounded-xl 
                          bg-white/25 backdrop-blur-lg border border-white/40 
                          text-white shadow-[0_4px_20px_rgba(255,255,255,0.2)] font-semibold">
            Best Offers
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
