import React from "react";

import HeroSection from "../components/HeroSection";
import Latest from "../components/Latest";
import Videos from "../components/Videos";


//-------------------------------------------------------------
//-------------------------------------------------------------
const LandingPage = () => {
  return (
    <>
      <HeroSection />
      <Latest />
      <Videos />
    </>
  );
};

export default LandingPage;
