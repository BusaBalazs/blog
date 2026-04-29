import { useEffect, useState } from "react";

// ---------- MOCK DATA (replace with Firebase fetching) ----------
const MOCK_POSTS = [
  {
    id: "1",
    category: "Életmód",
    date: "2026. 04. 26.",
    title: "Lorem ipsum dolores",
    excerpt:
      "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    imageUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=600&q=80",
    featured: true,
  },
  {
    id: "2",
    category: "Életmód",
    date: "2026. 04. 26.",
    title: "Lorem ipsum dolores",
    excerpt:
      "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80",
    featured: false,
  },
  {
    id: "3",
    category: "Egészség",
    date: "2026. 04. 26.",
    title: "Lorem ipsum dolores",
    excerpt:
      "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. nisi ut aliquip ex ea commodo consequat.",
    imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    featured: false,
  },
  {
    id: "4",
    category: "Életmód",
    date: "2026. 04. 26.",
    title: "Lorem ipsum dolores",
    excerpt:
      "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
    featured: false,
  },
];

// ---------- Sub-components ----------

function CategoryBadge({ category }) {
  return (
    <span className="text-xs text-gray-500 font-medium">
      {category}
    </span>
  );
}

function PostMeta({ category, date }) {
  return (
    <p className="text-xs text-gray-500 mb-1">
      <CategoryBadge category={category} />
      <span className="mx-1">|</span>
      {date}
    </p>
  );
}

function FeaturedPost({ post }) {
  return (
    <article className="cursor-pointer group">
      <div className="overflow-hidden rounded-sm border-b-2 border-[#d4af37] mb-3">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <PostMeta category={post.category} date={post.date} />
      <h2 className="font-display text-xl font-bold text-gray-900 mb-2 group-hover:text-[#b8963e] transition-colors">
        {post.title}
      </h2>
      <p className="text-sm text-gray-600 leading-relaxed">{post.excerpt}</p>
    </article>
  );
}

function SidePost({ post }) {
  return (
    <article className="flex gap-4 cursor-pointer group">
      <div className="flex-shrink-0 w-28 md:w-36 overflow-hidden rounded-sm">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-24 md:h-28 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="flex-1 min-w-0">
        <PostMeta category={post.category} date={post.date} />
        <h3 className="font-display text-base font-bold text-gray-900 mb-1 group-hover:text-[#b8963e] transition-colors leading-snug">
          {post.title}
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">{post.excerpt}</p>
      </div>
    </article>
  );
}

// Mobile: single column card
function MobilePost({ post }) {
  return (
    <article className="cursor-pointer group">
      <div className="overflow-hidden rounded-sm mb-3">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <PostMeta category={post.category} date={post.date} />
      <h3 className="font-display text-lg font-bold text-gray-900 mb-1 group-hover:text-[#b8963e] transition-colors">
        {post.title}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed">{post.excerpt}</p>
    </article>
  );
}

// ---------- Main section ----------
export default function LatestPosts({ posts = MOCK_POSTS }) {
  /**
   * Firebase integration:
   * Replace MOCK_POSTS with a useEffect that fetches from Firestore:
   *
   * useEffect(() => {
   *   const q = query(collection(db, "posts"), orderBy("date", "desc"), limit(4));
   *   const unsub = onSnapshot(q, (snap) => {
   *     setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
   *   });
   *   return unsub;
   * }, []);
   */

  const featured = posts.find((p) => p.featured);
  const sidePosts = posts.filter((p) => !p.featured);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Section header */}
      <div className="inline-block mb-8">
        <h2 className="font-display text-xl font-bold text-white bg-[#b8963e] px-4 py-2">
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
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#d4af37]">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}