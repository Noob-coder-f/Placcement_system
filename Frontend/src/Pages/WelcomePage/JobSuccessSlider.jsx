import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import  girlimg  from "/girl-removebg.png"

import "swiper/css";
import "swiper/css/pagination";

const successSlides = [
  {
    img: "/jobslider/student1.png",
    name: "Kabhi Bhatt",
    text: "I took the course and applied from Graphura to Lenskart and I cracked it, Woohoo...",
    companyLogo: "/jobslider/company1.png",
  },
  {
    img: "/jobslider/student2.png",
    name: "Aarav Sharma",
    text: "The placement preparation was amazing. I cracked interviews confidently!",
    companyLogo: "/jobslider/company2.png",
  },
  {
    img: "/jobslider/student3.png",
    name: "Riya Verma",
    text: "Graphura boosted my confidence and skill-set. I got the job!",
    companyLogo: "/jobslider/company3.png",
  },
];

export default function JobSuccessSlider() {
  return ( 
    <section className="w-full px-4 py-12 bg-gradient-to-r from-[#63B6DD] via-[#9AD6F2] to-[#1C7EAC]">
  <div className="max-w-7xl mx-auto">
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{ clickable: true }}
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      loop={true}
      slidesPerView={1}
      className="pb-10"
    >
      {successSlides.map((slide, i) => (
        <SwiperSlide key={i}>
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-xl 
                          flex flex-col md:flex-row items-center md:items-start gap-8
                          min-h-[360px] relative overflow-hidden">

            {/* Student Image */}
            <img
              src={slide.img}
              alt="student"
              className="w-[120px] sm:w-[150px] md:w-[200px] lg:w-[230px] drop-shadow-xl z-10"
            />

            {/* Right Side */}
            <div className="flex-1 w-full">
              
              {/* Heading */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold 
                             text-[#093554] text-center md:text-left mb-4 md:mb-6">
                I GOT THE JOB, GUYS!!!
              </h2>

              {/* Name + Message + Logo Container */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">

                {/* Name & Text */}
                <div className="flex items-start gap-4 bg-white/20 backdrop-blur-md 
                                border border-white/40 px-4 py-3 rounded-xl shadow-lg w-full sm:w-auto">

                  <img src={slide.studentimg} className="h-10 w-10 rounded-full" />

                  <div>
                    <p className="font-extrabold text-[#093554] text-lg">{slide.name}</p>
                    <p className="text-[#093554] text-sm mt-1">{slide.text}</p>
                  </div>
                </div>

                {/* Company Logo */}
                <div className="bg-white/30 backdrop-blur-xl px-4 py-4 rounded-xl 
                                border border-white/40 shadow-md w-fit mx-auto sm:mx-0">
                  <img src={slide.companyLogo} className="h-10 w-10 object-contain" />
                </div>

              </div>

              {/* Button */}
              <div className="flex justify-center md:justify-start mt-6">
                <button className="px-6 py-2 bg-white text-[#093554] font-semibold 
                                   rounded-xl shadow-md hover:bg-gray-100 transition">
                  Enroll Now
                </button>
              </div>

            </div>

          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
</section>

  );
}
