import { useEffect, useState } from "react";
import { getPosts } from "../api/postsApi";

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  const featured = posts.find((p) => p.featured);
  const others = posts.filter((p) => !p.featured);

  return { featured, others, loading };
};