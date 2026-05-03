import React from 'react'
import { useParams } from 'react-router-dom'

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