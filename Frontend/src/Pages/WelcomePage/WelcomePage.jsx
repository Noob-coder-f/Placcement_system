import { useState } from "react";
import { Link } from "react-router-dom";
import JobsSlider from "./JobsSlider";
import Navbar from "./Navbar";
import Hero from "./HeroPage";
import Testimonials from "./Testimonial";
import Opening from "./Opening";
import JobSuccessSlider from "./JobSuccessSlider";
import Partners from "./Partners";
import Footer from "./Footer";
import Hero2 from "./Hero2";

function WelcomePage() {
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  return (
    <>
     
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 ">
        
              <Hero2 />
              <Navbar />
              {/* <Hero /> */}
              <Opening />
              <JobsSlider />
              <JobSuccessSlider />
              <Testimonials />
              <Partners />
              <Footer />
        </div>

    
    </>
  );
}

export default WelcomePage;