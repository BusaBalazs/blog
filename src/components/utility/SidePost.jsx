import React from "react";
import { Link } from "react-router-dom";
import PostMetaData from "./PostMetaData";
//---------------------------------------------------------------
//---------------------------------------------------------------
const SidePost = ({ post }) => {
  return (
    <Link to={`/article/${post.id}`}>
      <article className="flex gap-4 cursor-pointer group">
        <div className="flex-shrink-0 w-40 aspect-[510/390] overflow-hidden rounded-md shadow-md">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="flex-1 min-w-0">
          <PostMetaData category={post.category} date={post.date} />
          <h3 className="font-display text-base font-bold text-gray-900 mb-1 group-hover:text-[#b8963e] transition-colors leading-snug">
            {post.title}
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
            {post.excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
}

export default SidePost