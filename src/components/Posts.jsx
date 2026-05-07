import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { usePosts } from "../data/Postcontext";
import Loading from "./utility/Loading";
import SidePost from "./utility/SidePost";
import MobilePost from "./utility/MobilePost";

// ── Rendezés gomb ─────────────────────────────────────────
function SortButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-sm border
        ${active
          ? "bg-[#d4af37] border-[#d4af37] text-white"
          : "bg-white border-gray-200 text-gray-500 hover:border-[#d4af37] hover:text-[#b8963e]"
        }`}
    >
      {children}
    </button>
  );
}

// ── Fő komponens ──────────────────────────────────────────
const Posts = () => {
  const params = useParams();
  const { getPostsByCategory, loading } = usePosts();
  const [sortBy, setSortBy] = useState("date"); // "date" | "likes"

  const rawPosts = getPostsByCategory(params.category);

  // Rendezés — useMemo hogy ne fusson le minden renderelésnél
  const posts = useMemo(() => {
    if (!rawPosts) return [];
    const copy = [...rawPosts];

    if (sortBy === "likes") {
      return copy.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    }
    // default: dátum — legfrissebb először
    return copy.sort((a, b) => {
      // Firestore Timestamp vagy string dátum kezelése
      const dateA = a.createdAt?.toDate?.() ?? new Date(a.date ?? 0);
      const dateB = b.createdAt?.toDate?.() ?? new Date(b.date ?? 0);
      return dateB - dateA;
    });
  }, [rawPosts, sortBy]);

  const categoryName = rawPosts?.[0]?.category ?? "";

  return (
    <section className="bg-light px-4 sm:px-6 lg:px-8 pb-12">
      {loading && <Loading />}
      <div className="max-w-[1200px] mx-auto">

        {/* Fejléc + rendezés */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-2">
          <div className="inline-block">
            <h2 className="font-display text-2xl font-bold bg-gold px-2 py-4">
              {categoryName}
            </h2>
          </div>

          {/* Rendező gombok */}
          <div className="flex items-center gap-2 pb-1">
            <span className="text-xs text-gray-400 mr-1">Rendezés:</span>
            <SortButton
              active={sortBy === "date"}
              onClick={() => setSortBy("date")}
            >
              {/* Naptár ikon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Legújabb
            </SortButton>

            <SortButton
              active={sortBy === "likes"}
              onClick={() => setSortBy("likes")}
            >
              {/* Szív ikon */}
              <svg width="14" height="14" viewBox="0 0 24 24"
                fill={sortBy === "likes" ? "white" : "none"}
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Legnépszerűbb
            </SortButton>
          </div>
        </div>

        {/* Üres állapot */}
        {!loading && posts.length === 0 && (
          <p className="text-sm text-gray-400 py-12 text-center">
            Még nincsenek bejegyzések ebben a kategóriában.
          </p>
        )}

        {/* Desktop layout */}
        <div className="hidden md:grid grid-cols-2 gap-x-20 gap-y-10 w-full">
          {posts.map((post) => (
            <div key={post.id} className="pt-6">
              <SidePost post={post} />
            </div>
          ))}
        </div>

        {/* Mobile layout */}
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