import { useState } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Latest from "./components/Latest";
import Videos from "./components/Videos";
import FooterSubscribe from "./components/FooterSubscribe";

import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f0efed] font-body">
      <Navbar />
      <main className="default-color">
        <HeroSection />
        <Latest />
        <Videos />
        <FooterSubscribe />
      </main>
      <Footer />
    </div>
  );
}
