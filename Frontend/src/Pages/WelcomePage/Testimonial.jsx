import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    title: "Got my dream Job at Myntra",
    text: "I applied through Graphura and got the job! I was not confident, but with Graphura’s training, I improved a lot...",
    img: "https://randomuser.me/api/portraits/men/75.jpg",
    name: "Yogesh Singh",
    role: "Placed at Myntra",
  },
  {
    title: "Got my dream Job at Amazon",
    text: "Graphura helped me through interview preparation and resume building. It boosted my confidence a lot...",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
    name: "Riya Verma",
    role: "Placed at Amazon",
  },
  {
    title: "Got my dream Job at TCS",
    text: "Best platform for interview prep. The techniques are industry-specific and very efficient...",
    img: "https://randomuser.me/api/portraits/men/15.jpg",
    name: "Karan Patel",
    role: "Placed at TCS",
  },
  {
    title: "Got my dream Job at Wipro",
    text: "I am thankful to Graphura for helping me build confidence & cracking interviews...",
    img: "https://randomuser.me/api/portraits/women/35.jpg",
    name: "Simran Kaur",
    role: "Placed at Wipro",
  },
  {
    title: "Got my dream Job at Myntra",
    text: "I applied through Graphura and got the job! I was not confident, but with Graphura’s training, I improved a lot...",
    img: "https://randomuser.me/api/portraits/men/75.jpg",
    name: "Yogesh Singh",
    role: "Placed at Myntra",
  },
  {
    title: "Got my dream Job at Amazon",
    text: "Graphura helped me through interview preparation and resume building. It boosted my confidence a lot...",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
    name: "Riya Verma",
    role: "Placed at Amazon",
  },
  {
    title: "Got my dream Job at TCS",
    text: "Best platform for interview prep. The techniques are industry-specific and very efficient...",
    img: "https://randomuser.me/api/portraits/men/15.jpg",
    name: "Karan Patel",
    role: "Placed at TCS",
  },
  {
    title: "Got my dream Job at Wipro",
    text: "I am thankful to Graphura for helping me build confidence & cracking interviews...",
    img: "https://randomuser.me/api/portraits/women/35.jpg",
    name: "Simran Kaur",
    role: "Placed at Wipro",
  },
];

export default function Testimonials() {
  return (
    <section className="relative bg-gradient-to-r from-[#63B6DD] via-[#9AD6F2] to-[#1C7EAC] py-16 px-10 rounded-xl">

      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-left mb-10">
        1500+ of Our Old Aspirants – Now it’s your turn
      </h2>

      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="pb-40"
      >
        {testimonials.map((t, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white/60 backdrop-blur-md border border-white/40 shadow-lg rounded-2xl p-5 min-h-[200px] flex flex-col justify-between">

              
              <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-2">
                {t.title}
              </h3>

              
              <p className="text-gray-700 text-sm leading-snug mb-4">
                {t.text}
              </p>

             
              <div className="flex items-center gap-3 mt-auto">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{t.name}</h4>
                  <p className="text-xs text-gray-600">{t.role}</p>
                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
