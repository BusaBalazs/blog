const POSTS = [
  {
    id: 1,
    title: "Lorem ipsum dolores",
    category: "Életmód",
    date: "2026.04.26.",
    image: "/img/post1.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "Lorem ipsum dolores",
    category: "Életmód",
    date: "2026.04.26.",
    image: "/img/post2.jpg",
  },
  {
    id: 3,
    title: "Lorem ipsum dolores",
    category: "Egészség",
    date: "2026.04.26.",
    image: "/img/post3.jpg",
  },
];

export const getPosts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(POSTS), 300);
  });
};