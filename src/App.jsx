import { useState } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PostsProvider } from "./data/Postcontext";

import Root from "./pages/Root";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import PostPage from "./pages/PostPage";
import ArticlePage from "./pages/ArticlePage";
import AdminPage from "./pages/AdminPage";

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
    ],
  },
  {
    path: "/admin",
    element: <AdminPage />,
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
