import React from "react";
import PostMetaData from "./PostMetaData";

import { Link } from "react-router-dom";
//-------------------------------------------------------
const FeaturedPost = ({ post }) => {
  return (
    <Link to={`/article/${post.id}`}>
      <article className="cursor-pointer group relative">
        <div className="featured-img overflow-hidden rounded-md mb-3 aspect-[510/390]">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="block w-full h-full object-cover bg-no-repeat mb-5 group-hover:scale-105 transition-transform duration-500 relative z-10"
          />
        </div>
        <PostMetaData category={post.category} date={post.date} />
        <h2 className="font-display text-xl font-bold text-gray-900 mb-2 group-hover:text-[#b8963e] transition-colors">
          {post.title}
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">{post.excerpt}</p>
      </article>
    </Link>
  );
};

export default FeaturedPost;
