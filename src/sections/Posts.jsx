import { usePosts } from "../hooks/usePosts";
import PostCard from "../components/PostCard";

const Posts = () => {
  const { featured, others, loading } = usePosts();

  if (loading) return <div className="p-10">Betöltés...</div>;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="inline-block bg-primary px-3 py-1 mb-6 font-semibold">
        Legfrissebb bejegyzések
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {featured && (
          <div>
            <img src={featured.image} className="rounded-xl mb-3" />
            <p className="text-xs text-gray-400">
              {featured.category} | {featured.date}
            </p>
            <h3 className="font-semibold text-lg">
              {featured.title}
            </h3>
          </div>
        )}

        <div>
          {others.map((p) => (
            <PostCard key={p.id} post={p} small />
          ))}
        </div>
      </div>

      <div className="text-right mt-6">Összes Bejegyzés →</div>
    </section>
  );
};

export default Posts;