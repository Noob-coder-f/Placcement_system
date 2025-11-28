import React from "react";
import hero from "/hero2bg.png"; // make sure path is correct

const Hero2 = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col relative"
      style={{
        backgroundImage: `url(${hero})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      
    </div>
  );
};

export default Hero2;
