// src/components/JobsSlider.jsx
import React from "react";
import JobCard from "./JobCard";

/*
 Background image (user uploaded, local path):
 /mnt/data/d56a3172-a35e-4e02-a283-f703ccab9961.png
*/

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

export default function JobsSlider() {
  return (
    <div
      className="relative w-full overflow-hidden pl-15"
      style={{
        minHeight: "320px",
        backgroundImage: `url("/mnt/data/d56a3172-a35e-4e02-a283-f703ccab9961.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* subtle overlay to match screenshot tone */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200/40 via-blue-300/30 to-transparent pointer-events-none" />

      {/* decorative blurred shapes (like the screenshot) */}
      <div className="absolute left-10 top-28 w-56 h-56 rounded-full filter blur-2xl opacity-30 bg-white/30" />
      <div className="absolute right-32 top-8 w-48 h-48 rounded-full filter blur-2xl opacity-25 bg-white/20" />
      <div className="absolute right-4 bottom-8 w-40 h-40 rounded-full filter blur-2xl opacity-20 bg-white/10" />

      {/* header */}
      <div className="p-8">
        <h2 className="text-3xl font-semibold text-slate-900 pl-6 border-l-4 border-slate-900/30">
          Jobs for You
        </h2>
      </div>

      {/* horizontal scroll slider */}
      <div className="relative">
        <div
          className="px-8 pb-8 flex gap-6 overflow-x-auto scroll-snap-x snap-mandatory scrollbar-hide"
          style={{ scrollBehavior: "smooth" }}
        >
          {jobs.map((j) => (
            <JobCard key={j.id} job={j} />
          ))}
        </div>

        {/* small right arrows */}
        <div className="absolute right-6 bottom-6 text-slate-800/60 text-2xl select-none">
          &gt;&gt;
        </div>
      </div>
    </div>
  );
}
