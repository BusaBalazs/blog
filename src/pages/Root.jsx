import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FooterSubscribe from "../components/FooterSubscribe";

//-------------------------------------------------------------------
const Root = () => {
  return (
    <>
      <main>
        <Navbar />
        <Outlet />
        <FooterSubscribe />
      </main>
      <Footer />
    </>
  );
};

export default Root;
