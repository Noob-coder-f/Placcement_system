import React from "react";
import JobCard from "./JobCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const JobsSlider = () => {
  const jobs = [
    {
      id: 1,
      badge: "Hiring",
      title: "Front-end Developer",
      company: "Unacademy (Sorting Hat Technologies Private Limited)",
      location: "Mumbai, Bandra",
      salary: "₹ 5,00,000 - 7,00,000",
      logo: null,
    },
    {
      id: 2,
      badge: "Upcoming",
      title: "Business Development Associate",
      company: "Lenskart Solution Limited (Eyewear Solution)",
      location: "Gurgaon, Haryana",
      salary: "₹ 8,00,000 - 10,00,000",
      logo: null,
    },
    {
      id: 3,
      badge: "Hiring",
      title: "Front-end Developer",
      company: "Unacademy (Sorting Hat Technologies Private Limited)",
      location: "Mumbai, Bandra",
      salary: "₹ 5,00,000 - 7,00,000",
      logo: null,
    },
    {
      id: 4,
      badge: "Upcoming",
      title: "Business Development Associate",
      company: "Lenskart Solution Limited (Eyewear Solution)",
      location: "Gurgaon, Haryana",
      salary: "₹ 8,00,000 - 10,00,000",
      logo: null,
    },
    {
      id: 1,
      badge: "Hiring",
      title: "Front-end Developer",
      company: "Unacademy (Sorting Hat Technologies Private Limited)",
      location: "Mumbai, Bandra",
      salary: "₹ 5,00,000 - 7,00,000",
      logo: null,
    },
    {
      id: 2,
      badge: "Upcoming",
      title: "Business Development Associate",
      company: "Lenskart Solution Limited (Eyewear Solution)",
      location: "Gurgaon, Haryana",
      salary: "₹ 8,00,000 - 10,00,000",
      logo: null,
    },
    {
      id: 3,
      badge: "Hiring",
      title: "Front-end Developer",
      company: "Unacademy (Sorting Hat Technologies Private Limited)",
      location: "Mumbai, Bandra",
      salary: "₹ 5,00,000 - 7,00,000",
      logo: null,
    },
    {
      id: 4,
      badge: "Upcoming",
      title: "Business Development Associate",
      company: "Lenskart Solution Limited (Eyewear Solution)",
      location: "Gurgaon, Haryana",
      salary: "₹ 8,00,000 - 10,00,000",
      logo: null,
    },
  ];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "320px",
        backgroundImage: `url("/mnt/data/d56a3172-a35e-4e02-a283-f703ccab9961.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      
      <div className="absolute inset-0 bg-gradient-to-r from-[#63B6DD] via-[#9AD6F2] to-[#1C7EAC] pointer-events-none" />

     
      <div className="p-8 relative z-10">
        <h2 className="text-3xl font-semibold text-slate-900 pl-6 border-l-4 border-slate-900/30">
          Jobs for You
        </h2>
      </div>

      <div className="relative px-10 pb-10 z-20">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".jobs-next",
            prevEl: ".jobs-prev",
          }}
          
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1400: { slidesPerView: 4 },
          }}
        >
          {jobs.map((job) => (
            <SwiperSlide key={job.id}>
              <JobCard job={job} />
            </SwiperSlide>
          ))}
        </Swiper>

        
        <button className="jobs-prev absolute left-2 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:scale-105 transition">
          ❮
        </button>

        <button className="jobs-next absolute right-2 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:scale-105 transition">
          ❯
        </button>
      </div>
    </div>
  );
};

export default JobsSlider;
