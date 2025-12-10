import React from "react";

const FeaturesBar = () => {
  return (
    <div className="w-full bg-gradient-to-r from-[#0a73b8] to-[#02507a] text-white   flex items-center gap-3 md:gap-7 lg:gap-10 xl:gap-20">

      {/* Left Title */}
      <div className="relative bg-gradient-to-r from-[#63B6DD] to-[#1C7EAC] 
                        lg:h-[90px] md:h-[70px] h-50px w-[18%]  rounded flex items-center xl:px-15 shadow-xl md:pl-5 ">
        <div className="h-[60px] w-[3px] bg-white md:mr-4"></div>

         
          <h3 className="text-white lg:text-2xl md:text-[15px] text-xs font-semibold tracking-wide">
            Features
          </h3>
      </div>

      {/* Content Items */}
      <div className="flex items-center gap-3 md:gap-8 xl:gap-40 md:text-[15px] lg:text-2xl text-xs">

        {/* 5 Sessions + Live Badge */}
        <div className="flex items-center gap-2 md:text-[15px] lg:text-2xl text-[8px]">
          <span>5 Sessions</span>
          <span className="bg-red-600 text-white md:text-[15px] lg:text-2xl text-[8px] px-2 py-0.5 rounded">
            Live
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center md:text-[15px] gap-2 lg:text-2xl text-[8px]">
          <span>4.6</span>
          <span className="text-yellow-300 text-lg">★</span>
          <img width="24" height="24" src="https://img.icons8.com/color/48/google-logo.png" alt="google-logo"/>
          <span className="text-gray-200  md:text-[15px] text-[8px]">(550+ Reviews)</span>
        </div>

        {/* Flexible Schedule */}
        <div className="lg:text-2xl md:text-[15px] text-[8px]">
          Flexible Schedule
        </div>

        {/* Languages */}
        <div className="lg:text-2xl md:text-[15px] text-[8px]">
          Eng/Hindi
        </div>

      </div>
    </div>
  );
};

export default FeaturesBar;
