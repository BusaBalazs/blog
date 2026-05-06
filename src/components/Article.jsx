import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../data/Postcontext";

// ── Like gomb ─────────────────────────────────────────────
function LikeButton() {
  const [liked, setLiked] = useState(false);

  return (
    <button
      onClick={() => setLiked((p) => !p)}
      aria-label={liked ? "Kedvelés visszavonása" : "Cikk kedvelése"}
      className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-200
        hover:border-[#d4af37] transition-all duration-200 group"
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill={liked ? "#d4af37" : "none"}
        stroke={liked ? "#d4af37" : "#9ca3af"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-200 group-hover:stroke-[#d4af37]"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

// ── Cikk szöveg renderelő ─────────────────────────────────
// Az article mező sima szöveg, bekezdéseket üres sor választja el.
// Ha valaki markdown-szerű ## Alcím szintaxist akar, az itt bővíthető.
function ArticleBody({ text }) {
  if (!text) return null;

  const blocks = text.split(/\n\s*\n/).filter(Boolean);

  return (
    <div >
      {blocks.map((block, i) => {
        // ## Heading támogatás
        if (block.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="font-display font-bold text-gray-900 text-xl mt-8 mb-2"
            >
              {block.replace(/^## /, "")}
            </h2>
          );
        }
        // # subtitle támogatás
        if (block.startsWith("# ")) {
          return (
            <h2
              key={i}
              className="font-display font-bold text-gray-900 text-lg mt-8 mb-2"
            >
              {block.replace(/^# /, "")}
            </h2>
          );
        }
        // Sima bekezdés
        return (
          <p
            key={i}
            className="text-sm md:text-base text-gray-700 leading-relaxed"
          >
            {block.trim()}
          </p>
        );
      })}
    </div>
  );
}

// ── 404 ───────────────────────────────────────────────────
function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-24">
      <p className="text-5xl mb-6">🔍</p>
      <h1 className="font-display text-2xl font-bold text-gray-800 mb-3">
        A cikk nem található
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Lehet, hogy törölték, vagy érvénytelen a link.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-[#d4af37] hover:bg-[#b8963e] text-white font-semibold text-sm px-8 py-3 rounded-sm transition-colors"
      >
        ← Vissza a főoldalra
      </button>
    </div>
  );
}

// ── Loading skeleton ───────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero image skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-end">
          <div className="bg-gray-200 rounded-sm h-72 lg:h-[420px]" />
          <div className="lg:pl-12 pt-6 lg:pt-0">
            <div className="bg-gray-200 rounded h-8 w-3/4 mb-3" />
            <div className="bg-gray-100 rounded h-4 w-1/2" />
          </div>
        </div>
      </div>
      {/* Body skeleton */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-3 pb-16">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`bg-gray-200 rounded h-4 ${i % 3 === 2 ? "w-2/3" : "w-full"}`}
          />
        ))}
      </div>
    </div>
  );
}

//------------------------------------------------
const Article = () => {
  const { id } = useParams();
  const { getPostById, loading } = usePosts();

  if (loading) {
    return (
      <div className="bg-[#f0efed] font-body">
        <LoadingSkeleton />
      </div>
    );
  }

  const post = getPostById(id);
  if (!post) return <NotFound />;

  return (
    <div className="font-body">
      <section>
        {/* ── HERO: kép bal, cím jobb ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 items-end">
            {/* Kép */}
            <div className="relative top-[80px] lg:mb-0 mb-8 z-10 overflow-hidden rounded-sm aspect-[510/390]">
              {post.imageUrl ? (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="lg:w-full w-[90%] lg:h-full h-[90%] mx-auto object-cover"
                />
              ) : (
                <div className="w-full h-64 lg:h-[420px] bg-gray-200 flex items-center justify-center text-gray-400 text-4xl">
                  📄
                </div>
              )}
            </div>

            {/* Cím + meta — desktop: jobbra alulra igazítva */}
            <div className="lg:pl-12 lg:pb-4 text-left lg:text-right">
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3">
                {post.title}
              </h1>
              <p className="text-sm text-gray-500">
                {post.category}
                {post.category && post.date && <span className="mx-2">|</span>}
                {post.date}
              </p>
            </div>
          </div>
        </section>

        {/* ── CIKK TÖRZS ── */}
        <section className="w-full bg-[#f0efed] ">
          {/* Alcím */}
          <div className="max-w-5xl mx-auto pb-4 lg:pt-32 pt-8 px-12">
            {post.subtitle && (
              <div className="mb-6">
                <h2 className="font-display font-bold text-gray-900 text-lg mb-3">
                  {post.subtitle}
                </h2>
              </div>
            )}

            {/* Cikk szöveg */}
            <ArticleBody text={post.article} />

            {/* Like gomb — jobb oldalra igazítva, cikk alatt */}
            <div className="flex justify-end mt-10 mb-4">
              <LikeButton />
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Article;