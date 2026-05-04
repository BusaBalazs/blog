import React, { useEffect, useState } from "react";


import { usePosts } from "../data/Postcontext";
import Loading from "./utility/Loading";

import SidePost from "./utility/SidePost";
import FeaturedPost from "./utility/FeaturedPost";
import MobilePost from "./utility/MobilePost";


//---------------------------------------------------------
//---------------------------------------------------------
// ---------- Main section ----------
const Latest = () => {
  const { getLatestPosts, loading } =
    usePosts();

    //----------------------------------------------------
  const posts = getLatestPosts(4); // top 4 cikk, sorted by createdAt descending

  const featured = posts[0]; // latest post
  const sidePosts = posts.slice(1); // remaining posts
console.log(loading)
  //----------------------------------------------------
  return (
    <section className="bg-light  px-4 sm:px-6 lg:px-8 pb-12">
      {loading && <Loading />}
      <div className="max-w-[1200px]  mx-auto">
        {/* Section header */}
        <div className="inline-block mb-8">
          <h2 className="font-display text-2xl font-bold bg-gold px-2 py-4">
            Legfrisebb bejegyzések
          </h2>
        </div>

        {/* Desktop layout: featured left, side posts right */}
        <div className="hidden md:grid grid-cols-2 gap-10 mb-8">
          {featured && <FeaturedPost post={featured} />}
          <div className="flex flex-col gap-6 divide-y divide-gray-200">
            {sidePosts.map((post) => (
              <div key={post.id} className="pt-6 first:pt-0">
                <SidePost post={post} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile layout: stacked cards */}
        <div className="md:hidden flex flex-col gap-8 mb-8">
          {posts.map((post) => (
            <MobilePost key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Latest;
