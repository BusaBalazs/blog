import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── Context létrehozása ───────────────────────────────────
const PostsContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────
export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let loadedPosts = false;
    let loadedVideos = false;

    const markLoaded = () => {
      if (loadedPosts && loadedVideos) setLoading(false);
    };

    // Posts listener
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );
    const unsubPosts = onSnapshot(
      postsQuery,
      (snap) => {
        setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        loadedPosts = true;
        markLoaded();
      },
      (err) => {
        console.error("Posts listener error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    // Videos listener
    const videosQuery = query(
      collection(db, "videos"),
      orderBy("createdAt", "desc")
    );
    const unsubVideos = onSnapshot(
      videosQuery,
      (snap) => {
        setVideos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        loadedVideos = true;
        markLoaded();
      },
      (err) => {
        console.error("Videos listener error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      unsubPosts();
      unsubVideos();
    };
  }, []);

  // ─── Derived helpers — számítás, nem újabb DB hívás ───────
  const getFeaturedPost = () => posts.find((p) => p.featured) ?? posts[0] ?? null;

  const getLatestPosts = (limit = 4) => posts.slice(0, limit);

  const getPostsByCategory = (categorySlug) =>
    posts.filter(
      (p) => slugify(p.category) === categorySlug
    );

  const getPostById = (id) => posts.find((p) => p.id === id) ?? null;

  const getLatestVideos = (limit = 2) => videos.slice(0, limit);

  const categories = [...new Set(posts.map((p) => p.category))];

  return (
    <PostsContext.Provider
      value={{
        // raw data
        posts,
        videos,
        // state
        loading,
        error,
        // helpers
        getFeaturedPost,
        getLatestPosts,
        getPostsByCategory,
        getPostById,
        getLatestVideos,
        categories,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────
export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePosts must be used within a PostsProvider");
  return ctx;
}

// ─── Util ─────────────────────────────────────────────────
export function slugify(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // ékezetek eltávolítása
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}