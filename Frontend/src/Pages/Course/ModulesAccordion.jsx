// ModulesAccordion.jsx
import React, { useState } from "react";

const MODULES = [
  {
    id: 1,
    title: "CV Fundamentals & Recruiter Mindset",
    meta: "Module 1 • Around 1 hour to complete",
    summary:
      "CV basics, recruiter mindset, how to tailor your CV to JD and stand out. Learn what recruiters look for and how to present your story.",
    details:
      "This module covers the foundational CV structure, headline craft, common recruiter signals, and short exercises to practice tailoring to job descriptions.",
  },
  {
    id: 2,
    title: "Building a High-Impact CV Structure & Personal Branding",
    meta: "Module 2 • Around 1 hour to complete",
    summary:
      "Structure, headlines, branding and storytelling for CVs — learn to write impact-driven summaries and role-focused achievements.",
    details:
      "You will learn how to write compelling profile summary, skills sections, and arrange experience to highlight results rather than tasks.",
  },
  {
    id: 3,
    title: "ATS Optimization, Keywords & Job-Description Tailoring",
    meta: "Module 3 • Around 1 hour to complete",
    summary:
      "JD decoding, keyword bank creation, ATS optimization and testing so your resume passes filters and reaches recruiters.",
    details:
      "Practice building a keyword map from job descriptions and test optimizations to maximize ATS score without keyword stuffing.",
  },
  {
    id: 4,
    title: "Live Domain-Specific CV Customization Workshop",
    meta: "Module 4 • Around 1 hour to complete",
    summary:
      "Hands-on live sessions with domain-specific examples and edits — IT, Finance, Design, MBA, Core Engineering, etc.",
    details:
      "Live editing sessions where we apply module learnings to real CVs from attendees and provide personalized feedback.",
  },
  {
    id: 5,
    title: "Final Review + LinkedIn Optimization + Application Strategy",
    meta: "Module 5 • Around 1 hour to complete",
    summary:
      "Final review, LinkedIn polishing and application scripts & strategy to increase interview callbacks.",
    details:
      "We finish with final reviews, LinkedIn headline & summary tweaks, and outreach/application scripts to start sending targeted applications.",
  },
];

export default function ModulesAccordion() {
  const [openId, setOpenId] = useState(0);
  const toggle = (id) => setOpenId((prev) => (prev === id ? 0 : id));

  return (
    <section className="max-w-8xl w-full bg-white/40 backdrop-blur-xl shadow-xl  border border-white/40 p-6 md:p-8"
    style={{
    background: "radial-gradient(circle, #F0FAFF 0%, #A7DDF3 40%, #6BB2D6 70%, #3A80A8 100%)",
  }}
    >
      <h3 className="text-lg md:text-xl font-bold text-black mb-3">
        There are 5 modules :
      </h3>

      <div className="space-y-3 text-black bg-transparent shadow-[0_24px_55px_rgba(15,23,42,0.35)] p-10">
        {MODULES.map((m) => (
          <ModuleItem
            key={m.id}
            module={m}
            isOpen={openId === m.id}
            onToggle={() => toggle(m.id)}
          />
        ))}
      </div>
    </section>
  );
}

function ModuleItem({ module, isOpen, onToggle }) {
  return (
    <div
      className={`rounded-lg border transition-shadow duration-200 ${
        isOpen
          ? "border-black shadow-md bg-white/40"
          : "border-black/30 bg-white/20"
      }`}
    >
      {/* header */}
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex items-start gap-4 focus:outline-none"
        aria-expanded={isOpen}
        aria-controls={`module-panel-${module.id}`}
      >
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm md:text-base font-bold text-black">
              {module.title}
            </h4>
            <div className="text-xs text-black/80">{module.meta}</div>
          </div>

          <p className="mt-2 text-sm text-black/90">{module.summary}</p>
        </div>

        <div
          className={`ml-4 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border ${
            isOpen
              ? "bg-black text-white border-black"
              : "bg-white/40 text-black border-black/40"
          }`}
          aria-hidden="true"
        >
          <Chevron isOpen={isOpen} />
        </div>
      </button>

      {/* panel */}
      <div
        id={`module-panel-${module.id}`}
        className={`px-4 pb-4 transition-[max-height,opacity] duration-300 overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mt-2 text-sm text-black/90">{module.details}</div>

        <div className="mt-3 flex items-center justify-between">
          <a href="#!" className="text-sm text-black underline">
            Show more details →
          </a>
          <div className="text-xs text-black/80">Estimated: ~1 hour</div>
        </div>
      </div>
    </div>
  );
}

function Chevron({ isOpen }) {
  return (
    <svg
      className={`w-4 h-4 transform transition-transform duration-200 ${
        isOpen ? "rotate-180" : "rotate-0"
      }`}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 8.5L10 13.5L15 8.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
