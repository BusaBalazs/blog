import React from "react";
import Posts from "../components/Posts";

import HeroSection from "../components/HeroSection";
import Videos from "../components/Videos";
//-----------------------------------------------------
const PostPage = () => {
  return(
     <>
      <HeroSection />
      <Posts />
      <Videos />
    </>
  ) 
};

export default PostPage;
