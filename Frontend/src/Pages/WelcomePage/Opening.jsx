import React from 'react'

const logos = [
  "/logos/myntra.svg",
  "/logos/realme.png",

  "/logos/lenskart.png",
  "/logos/bajaj.png",
  "/logos/geeks.png",
  "/logos/myntra.svg",
  "/logos/realme.png",

  "/logos/lenskart.png",
  "/logos/bajaj.png",
  "/logos/geeks.png",
];

const Opening = () => {

  return (
    <div>
        <section className="w-full bg-transparent  overflow-hidden">
      <div className="relative w-full flex items-center">

 
        <div className="relative bg-gradient-to-r from-[#63B6DD] to-[#1C7EAC] 
                        h-[110px] w-[340px] rounded flex items-center px-6 shadow-xl">
          
         
          <div className="h-[60px] w-[3px] bg-white mr-4"></div>

         
          <h3 className="text-white text-2xl font-semibold tracking-wide">
            100+ &nbsp;Openings
          </h3>
        </div>

      
        <div className="flex-1 overflow-hidden ml-4">
          <div className="flex gap-12 animate-marquee">
            {logos.concat(logos).map((logo, i) => (
              <img
                key={i}
                src={logo}
                alt="brand"
                className="h-19 w-19 object-contain drop-shadow-md"
              />
            ))}
          </div>
        </div>

      </div>
    </section>
    </div>
  )
}

export default Opening