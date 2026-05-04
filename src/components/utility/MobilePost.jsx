import React from 'react'
import { Link } from 'react-router-dom';

import PostMetaData from './PostMetaData'
//-----------------------------------------------------
//-----------------------------------------------------
const MobilePost = ({ post }) => {
  return (
    <Link to={`/article/${post.id}`}>
      <article className="cursor-pointer group">
        <div className="overflow-hidden rounded-sm mb-3 aspect-[510/390]">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <PostMetaData category={post.category} date={post.date} />
        <h3 className="font-display text-lg font-bold text-gray-900 mb-1 group-hover:text-[#b8963e] transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">{post.excerpt}</p>
      </article>
    </Link>
  );
}

export default MobilePost