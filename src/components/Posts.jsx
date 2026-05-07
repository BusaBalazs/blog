import React from "react";
import { useParams } from "react-router-dom";

import { usePosts, slugify } from "../data/Postcontext";
import Loading from "./utility/Loading";

import SidePost from "./utility/SidePost";

import MobilePost from "./utility/MobilePost";

//----------------------------------------------
//----------------------------------------------
const Posts = () => {
  const params = useParams();

  const { getPostsByCategory, loading } = usePosts();

  const posts = getPostsByCategory(params.category);

  return (
    <section className="bg-light  px-4 sm:px-6 lg:px-8 pb-12">
      {loading && <Loading />}
      <div className="max-w-[1200px]  mx-auto">
        {/* Section header */}
        <div className="inline-block ">
          <h2 className="font-display text-2xl font-bold bg-gold px-2 py-4">
            {posts && posts.length > 0 && posts[0].category}
          </h2>
        </div>

        {/* Desktop layout: featured left, side posts right */}
        <div className="hidden md:grid grid-cols-2 gap-x-20 gap-y-10 w-full">
          {posts.map((post) => (
            <div key={post.id} className="pt-6">
              <SidePost post={post} />
            </div>
          ))}
        </div>

        {/* Mobile layout: stacked cards */}
        <div className="md:hidden flex flex-col gap-8 md:mt-0 mt-8">
          {posts.map((post) => (
            <MobilePost key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Posts;
