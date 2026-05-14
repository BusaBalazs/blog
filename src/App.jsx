import { useState } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PostsProvider } from "./data/Postcontext";

import Root from "./pages/Root";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import PostPage from "./pages/PostPage";
import ArticlePage from "./pages/ArticlePage";
import ContactPage from "./pages/ContactPage";
import CoachingPage from "./pages/CoachingPage";
import ContactCoachingPage from "./pages/ContactCoachingPage";

import ConfirmLetter from "./components/ConfirmLetter";

//--------------------------------------------------
// Admin
import Adminhome from "./components/admin/Adminhome";
import AdminpostUpload from "./components/admin/AdminpostUpload";
import Admineditposts from "./components/admin/Admineditposts";
import Adminnewsletter from "./components/admin/Adminnewsletter";
import AdminGate from "./components/admin/AdminGate";

//-------------------------------------------------------------------
//-------------------------------------------------------------------

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/posts/:category",
        element: <PostPage />,
      },
      {
        path: "/article/:id",
        element: <ArticlePage />,
      },
      {
        path: "/coaching",
        element: <CoachingPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/contactCoaching",
        element: <ContactCoachingPage />,
      },
    ],
  },
  {
    path: "/confirm",
    element: <ConfirmLetter />,
  },
  {
    path: "/admin",
    element: (
      <AdminGate>
        <Adminhome />
      </AdminGate>
    ),
  },
  {
    path: "/admin/new",
    element: (
      <AdminGate>
        <AdminpostUpload />
      </AdminGate>
    ),
  },
  {
    path: "/admin/edit",
    element: (
      <AdminGate>
        <Admineditposts />
      </AdminGate>
    ),
  },
  {
    path: "/admin/newsletter",
    element: (
      <AdminGate>
        <Adminnewsletter />
      </AdminGate>
    ),
  },
]);
//------------------------------------------------------------------
export default function App() {
  return (
    <PostsProvider>
      <RouterProvider router={router} />
    </PostsProvider>
  );
}
