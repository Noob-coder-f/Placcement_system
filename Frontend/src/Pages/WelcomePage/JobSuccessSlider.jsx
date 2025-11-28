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
              <div className="bg-white/60 backdrop-blur-md 
                              rounded-3xl p-6 md:p-10 shadow-xl min-h-[340px] 
                              flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">

               
                <img
                  src={slide.img}
                  alt="student"
                  className="w-[160px] md:w-[200px] lg:w-[230px] drop-shadow-xl z-10"
                />

                
                <div className="flex-1">
                  
                 
                  <h2 className="text-2xl md:text-3xl lg:text-6xl lg:ml-40 font-extrabold text-[#093554] text-center md:text-left mb-5">
                    I GOT THE JOB, GUYS!!!
                  </h2>
                <div className="flex gap-8">
               
                  <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md 
                                  border w-180 border-white/40 px-4 py-3 rounded-xl shadow-lg h-30">

                    {/* Name + Message */}
                    <div className="text-left">
                      <div className="flex">
                          <img src={slide.studentimg} className="h-10 w-10" />
                      <p className="font-extrabold font-3xl text-[#093554] ml-7">{slide.name}</p>
                      </div>
                      
                      <div>
                        
                      <p className="text-[#093554] text-sm md:text-base ml-22 mt-2">{slide.text}</p>
                      </div>
                      
                    </div>

                    

                  </div>
                  <div>
                    <div className="bg-white/30 backdrop-blur-xl px-3 py-3 rounded-xl border border-white/40 shadow-md h-30 w-30">
                      <img src={slide.companyLogo} className="h-10 w-10" />
                    </div>
                  </div>
                  </div>

              
                  <div className="flex justify-center md:justify-start mt-6">
                    <button className="lg:ml-75 px-6 py-2 bg-white text-[#093554] font-semibold rounded-xl shadow-md hover:bg-gray-100">
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
