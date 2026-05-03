import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { usePosts } from "../data/Postcontext";

// ---------- Sub-components ----------

function CategoryBadge({ category }) {
  return <span className="text-xs text-gray-500 font-medium">{category}</span>;
}

function PostMeta({ category, date }) {
  return (
    <p className="text-xs text-gray-500 mb-1 pt-1">
      <CategoryBadge category={category} />
      <span className="mx-1">|</span>
      {date}
    </p>
  );
}

function FeaturedPost({ post }) {
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
        <PostMeta category={post.category} date={post.date} />
        <h2 className="font-display text-xl font-bold text-gray-900 mb-2 group-hover:text-[#b8963e] transition-colors">
          {post.title}
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">{post.excerpt}</p>
      </article>
    </Link>
  );
}

function SidePost({ post }) {
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
          <PostMeta category={post.category} date={post.date} />
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

// Mobile: single column card
function MobilePost({ post }) {
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
        <PostMeta category={post.category} date={post.date} />
        <h3 className="font-display text-lg font-bold text-gray-900 mb-1 group-hover:text-[#b8963e] transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">{post.excerpt}</p>
      </article>
    </Link>
  );
}

//---------------------------------------------------------
//---------------------------------------------------------
// ---------- Main section ----------
const Latest = () => {
  const { getLatestPosts, getFeaturedPost, getLatestVideos, loading } =
    usePosts();
  /*
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("date", "desc"), limit(4));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    console.log(unsub);
    return unsub;
  }, []);*/

  const posts = getLatestPosts(4); // top 4 cikk, sorted by createdAt descending
  const featured = posts[0]; // latest post
  const sidePosts = posts.slice(1); // remaining posts
  return (
    <section className="bg-light  px-4 sm:px-6 lg:px-8 md:pb-14">
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

        {/* "All posts" link */}
        <div className="flex justify-end">
          <a
            href="#"
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#b8963e] font-medium transition-colors group"
          >
            Összes Bejegyzés
            <span className="inline-block w-16 h-px bg-[#d4af37] group-hover:w-20 transition-all duration-300" />
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-[#d4af37]"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Latest;
