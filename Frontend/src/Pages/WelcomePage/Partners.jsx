import React from 'react'

const partners = [
  { img: "/logos/udemy.png", name: "Udemy" },
  { img: "/logos/lenskart.png", name: "Lenskart" },
  { img: "/logos/myntra.svg", name: "Myntra" },
  { img: "/logos/geeks.png", name: "Geeks for Geeks" },
  { img: "/logos/bajaj.png", name: "Bajaj" },
  { img: "/logos/policy.png", name: "Policy Bazaar" },
  { img: "/logos/realme.png", name: "Realme" },
];


const Partners = () => {
  return (
    
      <section
      className="
        w-full py-16  
        bg-gradient-to-r from-[#63B6DD] via-[#9AD6F2] to-[#1C7EAC]
        
        bg-opacity-30
      "
    >
      <div className="lg:max-w-8xl mx-auto ml-8 ">

      
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12">
          Proud to be the partners with such Companies
        </h2>

       
        <div className="
            grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7
            gap-10 justify-items-center ">
        
          {partners.map((p, i) => (
            <div key={i} className="flex flex-col items-center">

              
              <div className="
                  w-[150px] h-[150px] rounded-2xl
                  bg-white/50 backdrop-blur-md
                  border border-white/40 shadow-lg
                  flex justify-center items-center gap-10
                ">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-24 h-24 object-contain"
                />
              </div>

             
              <p className="text-gray-800 font-medium mt-3">{p.name}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  
  )
}

export default Partners