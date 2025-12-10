import React from "react";

const CompetitiveAnalysisCard = () => {
  return (
    <div className="max-w-8xl w-full min-h-[580px] bg-white/40 backdrop-blur-xl shadow-xl  border border-white/40 p-6 md:p-20"
    style={{
    background: "radial-gradient(circle, #F0FAFF 0%, #A7DDF3 40%, #6BB2D6 70%, #3A80A8 100%)",
  }}
    >
      <div className="bg-transparent shadow-[0_24px_55px_rgba(15,23,42,0.35)] p-10">
      <h2 className="text-xl md:text-2xl font-semibold text-black mb-4">
        Competitive analysis
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-[10px] md:text-base text-left table-fixed text-black border-separate border-spacing-0">
          <thead>
            <tr className="text-black">
              <th className="w-1/4 border-b border-black pb-3 pr-4 border-r font-semibold">
                Feature
              </th>
              <th className="w-1/4 border-b border-black pb-3 px-4 border-r font-semibold">
                Ordinary Companies
              </th>
              <th className="w-1/2 border-b border-black pb-3 pl-4 font-semibold">
                Graphura CV Mastery Program
              </th>
            </tr>
          </thead>
          <tbody className="align-top">
            <tr className="border-b border-black">
              <td className="py-4 pr-4 font-semibold text-black border-r border-black">
                Live, Domain-Specific CV Guidance
              </td>
              <td className="py-4 px-4 text-black border-r border-black">
                No domain-specific guidance (generic templates only)
              </td>
              <td className="py-4 pl-4 text-black">
                Live sessions with domain-centric CV building (IT, HR, Finance,
                Core Engineering, Design, MBA, etc.)
              </td>
            </tr>

            <tr className="border-b border-black">
              <td className="py-4 pr-4 font-semibold text-black border-r border-black">
                ATS Optimization &amp; Job Description Alignment
              </td>
              <td className="py-4 px-4 text-black border-r border-black">
                No Job Description-based tailoring or keyword mapping
              </td>
              <td className="py-4 pl-4 text-black">
                JD decoding training + keyword bank creation + ATS optimization
              </td>
            </tr>

            <tr className="border-b border-black">
              <td className="py-4 pr-4 font-semibold text-black border-r border-black">
                Personalized Feedback
              </td>
              <td className="py-4 px-4 text-black border-r border-black">
                No personalised feedback on CVs
              </td>
              <td className="py-4 pl-4 text-black">
                Personalised CV review &amp; edits during live sessions
              </td>
            </tr>

            <tr className="border-b border-black">
              <td className="py-4 pr-4 font-semibold text-black border-r border-black">
                Templates &amp; Practical Tools
              </td>
              <td className="py-4 px-4 text-black border-r border-black">
                Only outputs a file, students do not learn lifelong skill
              </td>
              <td className="py-4 pl-4 text-black">
                Lifetime access to templates + exercises for permanent
                skill-building
              </td>
            </tr>

            <tr className="border-b border-black">
              <td className="py-4 pr-4 font-semibold text-black border-r border-black">
                LinkedIn &amp; Application Strategy
              </td>
              <td className="py-4 px-4 text-black border-r border-black">
                No LinkedIn or application support
              </td>
              <td className="py-4 pl-4 text-black">
                LinkedIn optimization, networking strategy, cover letter &amp;
                follow-up scripts
              </td>
            </tr>

            <tr className="border-b border-black">
              <td className="py-4 pr-4 font-semibold text-black border-r border-black">
                Recruiter Mindset &amp; Evaluation
              </td>
              <td className="py-4 px-4 text-black border-r border-black">
                No ATS testing or recruiter evaluation
              </td>
              <td className="py-4 pl-4 text-black">
                ATS score testing + recruiter mindset review included
              </td>
            </tr>

            <tr>
              <td className="py-4 pr-4 font-semibold text-black border-r border-black">
                Affordability
              </td>
              <td className="py-4 px-4 text-black border-r border-black">
                ₹999–₹15,000
              </td>
              <td className="py-4 pl-4 text-black">₹499 with certificate</td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default CompetitiveAnalysisCard;
