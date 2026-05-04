import React from 'react'
import { useParams } from 'react-router-dom'

import SidePost from "./utility/SidePost";
import FeaturedPost from "./utility/FeaturedPost";
import MobilePost from "./utility/MobilePost";


//----------------------------------------------
//----------------------------------------------
const Posts = () => {
  const params = useParams();
  return (
    <>
    <div>Posts</div>
    <h2>{params.category}</h2>
    </>
  )
}

export default Posts