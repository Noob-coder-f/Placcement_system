import React from "react";

const testimonials = [
  {
    title: "Got my dream Job at Mynta",
    text: "I applied to Mynta After improving my CV in Graphura CV masterclass and directly got contacted by the HR. I attended the interview and got my dream job within 10 days. Thank you Graphura team for the guidance!",
    name: "Karan Bhat",
    role: "Graphic Designer",
  },
  {
    title: "Got my dream Job at Mynta",
    text: "I applied to Mynta After improving my CV in Graphura CV masterclass and directly got contacted by the HR. I attended the interview and got my dream job within 10 days. Thank you Graphura team for the guidance!",
    name: "Neeraj Singh",
    role: "Marketing",
  },
  {
    title: "Got my dream Job at Mynta",
    text: "I applied to Mynta After improving my CV in Graphura CV masterclass and directly got contacted by the HR. I attended the interview and got my dream job within 10 days. Thank you Graphura team for the guidance!",
    name: "Sneha Patel",
    role: "Product Designer",
  },
  {
    title: "Got my dream Job at Mynta",
    text: "I applied to Mynta After improving my CV in Graphura CV masterclass and directly got contacted by the HR. I attended the interview and got my dream job within 10 days. Thank you Graphura team for the guidance!",
    name: "Varun Soni",
    role: "UI Designer",
  },
  
];

const Testimonials = () => {
  return (
    <section className="max-w-8xl w-full bg-white/40 backdrop-blur-xl shadow-xl  border border-white/40 p-6 md:p-8"
    style={{
    background: "radial-gradient(circle, #E3F9FF 0%, #AEE7F6 45%, #5FB2D4 100%)",
  }}
    >
      <div className="relative max-w-6xl w-full px-10 py-12">
        <div className="relative">
          {/* Heading */}
          <h2 className="text-2xl font-semibold text-black mb-6">
            Why people choose GRAPHURA for their career
          </h2>

          {/* Cards row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-b from-sky-200/80 via-white/85 to-sky-50/90 backdrop-blur-xl border border-white/70 rounded-2xl px-5 pt-4 pb-5 text-black shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
              >
                <h3 className="text-sm font-semibold mb-2 text-black">
                  {item.title}
                </h3>
                <p className="text-[11px] leading-relaxed text-black mb-4">
                  {item.text}
                </p>

                {/* bottom line */}
                <div className="h-px w-full bg-black/10 mb-3" />

                {/* avatar + name */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-300 overflow-hidden">
                    {/* avatar img here */}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-black">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-neutral-700">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;
