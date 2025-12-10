import Footer from "../WelcomePage/Footer";
import Navbar from "../WelcomePage/Navbar";
import CompetitiveAnalysisCard from "./CompetitiveAnalysisCard";
import Hero from "./Cvhero";
import FeaturesBar from "./FeaturesBar";
import ModulesAccordion from "./ModulesAccordion";
import PricingCard from "./PricingCard";
import Testimonials from "./Testimonials";


function Course() {
  return (
    <div className="overflow-x-hidden overflow-y-auto">
      <Navbar />
      <Hero />
      <FeaturesBar />
      <CompetitiveAnalysisCard />
      <PricingCard />
      <ModulesAccordion/>
      <Testimonials/>
      
      <Footer />

    </div>
  );
}

export default Course;
