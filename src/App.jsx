import { useState } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./pages/Root";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import Posts from "./components/Posts";


//-------------------------------------------------------------------
//-------------------------------------------------------------------

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <LandingPage />
      },
      {
        path: "/about",
        element: <AboutPage />
      },
      {
        path: "/posts/:id",
        element: <Posts />
      }
    ]
  }

])
//------------------------------------------------------------------
export default function App() {
  return (
    <RouterProvider router={router} />
  );
}
