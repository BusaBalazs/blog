import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../data/firebase";
import { usePosts } from "../data/Postcontext";

// ── Like gomb ─────────────────────────────────────────────
function LikeButton({ postId, initialLikes = 0 }) {
  // localStorage-ból olvassuk, hogy like-olta-e már ezt a cikket
  const storageKey = `liked_post_${postId}`;
  const [liked, setLiked] = useState(() => {
    return localStorage.getItem(storageKey) === "true";
  });
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  // Frissítjük a likes számát a Firebase adatból
  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  const handleLike = async () => {
    if (liked || loading) return;

    setLoading(true);
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        likes: increment(1),
      });
      // Csak a liked állapotot állítjuk be — a szám frissítését
      // a Firestore onSnapshot végzi az initialLikes propomon keresztül
      setLiked(true);
      localStorage.setItem(storageKey, "true");
    } catch (err) {
      console.error("Like mentési hiba:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={liked || loading}
      aria-label={liked ? "Már kedvelted ezt a cikket" : "Cikk kedvelése"}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 group
        ${liked
          ? "border-[#d4af37] bg-[#fdf8ec] cursor-default"
          : "border-gray-200 hover:border-[#d4af37] cursor-pointer"
        }
        ${loading ? "opacity-60" : ""}
      `}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={liked ? "#d4af37" : "none"}
        stroke={liked ? "#d4af37" : "#9ca3af"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-all duration-200 ${!liked ? "group-hover:stroke-[#d4af37]" : ""}`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>

      {/* Like szám */}
      <span className={`text-sm font-medium transition-colors duration-200
        ${liked ? "text-[#d4af37]" : "text-gray-400 group-hover:text-[#d4af37]"}`}>
        {likes > 0 ? likes : ""}
      </span>

      {/* Szöveg */}
      <span className={`text-xs transition-colors duration-200
        ${liked ? "text-[#b8963e]" : "text-gray-400 group-hover:text-[#d4af37]"}`}>
        {liked ? "Kedvelted" : "Tetszik"}
      </span>
    </button>
  );
}

// ── Cikk szöveg renderelő ─────────────────────────────────
function ArticleBody({ text }) {
  if (!text) return null;

  const blocks = text.split(/\n\s*\n/).filter(Boolean);

  return (
    <div>
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="font-display font-bold text-gray-900 text-xl mt-8 mb-2">
              {block.replace(/^## /, "")}
            </h2>
          );
        }
        if (block.startsWith("# ")) {
          return (
            <h2 key={i} className="font-display font-bold text-gray-900 text-lg mt-8 mb-2">
              {block.replace(/^# /, "")}
            </h2>
          );
        }
        return (
          <p key={i} className="text-sm md:text-base text-gray-700 leading-relaxed">
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-end">
          <div className="bg-gray-200 rounded-sm h-72 lg:h-[420px]" />
          <div className="lg:pl-12 pt-6 lg:pt-0">
            <div className="bg-gray-200 rounded h-8 w-3/4 mb-3" />
            <div className="bg-gray-100 rounded h-4 w-1/2" />
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-3 pb-16">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`bg-gray-200 rounded h-4 ${i % 3 === 2 ? "w-2/3" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
}

// ── Fő komponens ──────────────────────────────────────────
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
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

            {/* Cím + meta */}
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
        <section className="w-full bg-[#f0efed]">
          <div className="max-w-5xl mx-auto pb-4 lg:pt-32 pt-8 px-12">
            {post.subtitle && (
              <div className="mb-6">
                <h2 className="font-display font-bold text-gray-900 text-lg mb-3">
                  {post.subtitle}
                </h2>
              </div>
            )}

            <ArticleBody text={post.article} />

            {/* Like gomb */}
            <div className="flex justify-end mt-10 mb-4">
              <LikeButton postId={post.id} initialLikes={post.likes ?? 0} />
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Article;