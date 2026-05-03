import React from "react";
import { useParams } from "react-router-dom";

import { usePosts } from "../data/Postcontext";
//------------------------------------------------
const Article = () => {
  const { posts, loading } = usePosts();
  const params = useParams();
  const article = posts.find((item) => item.id === params.id);
  console.log(article);
  return (
    <section>
      <div>Article</div>
      {article && (
        <>
          <div>{article.category}</div>
          <div>{article.title}</div>
          <div>{article.article}</div>
        </>
      )}
    </section>
  );
};

export default Article;
