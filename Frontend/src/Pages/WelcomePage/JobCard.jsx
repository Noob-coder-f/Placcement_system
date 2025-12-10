// src/components/JobCard.jsx
import React from "react";

export default function JobCard({ job }) {
  return (
    <div
      className="snap-start mb-5 h-75 ml-[0.8rem]  min-w-[320px] max-w-xs bg-transparent backdrop-blur-mdborder border-white/20 rounded-2xl p-5 shadow-lg relative hover:shadow-[0_24px_55px_rgba(15,23,42,0.35)] transition-shadow duration-300 max-w-[380px]:ml-[0.3rem] "
      
    >
      
      <div className="absolute left-4 top-4">
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${
            job.badge === "Hiring" ? "bg-green-200/40 text-green-800" : "bg-indigo-200/30 text-indigo-900"
          } border border-white/10`}
        >
          {job.badge}
        </span>
      </div>

      
      <div className="absolute right-4 top-4 w-12 h-12 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
        
        <div className="text-sm font-semibold text-slate-800/60"><img src={job.logo} alt="" /></div>
      </div>

   
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-slate-900/90 w-[80%]">{job.title}</h3>
        <p className="text-sm text-slate-700/80 mt-2">{job.company}</p>

        <hr className="my-4 border-white/10" />

        <p className="text-sm text-slate-800"><span className="font-semibold">📍 </span>{job.location}</p>
        <p className="mt-2 text-sm text-slate-800"><span className="font-semibold">💰 </span>{job.salary}</p>

       
      </div>

      
      <div className="absolute left-2 bottom-2 w-24 h-12 rounded-lg bg-white/8 filter blur-sm" />
    </div>
  );
}
