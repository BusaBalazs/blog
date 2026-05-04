import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FooterSubscribe from "../components/FooterSubscribe";

//-------------------------------------------------------------------
const Root = () => {
  return (
    <>
      <div className="h-screen flex flex-col justify-between">
        <main>
          <Navbar />
          <Outlet />
        </main>
        <div>
          <FooterSubscribe />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Root;
