const PostCard = ({ post, small }) => {
  return (
    <div className={`flex ${small ? "gap-4" : "flex-col"} mb-6`}>
      <img
        src={post.image}
        className={`rounded-xl ${
          small ? "w-32 h-24 object-cover" : "w-full"
        }`}
      />

      <div>
        <p className="text-xs text-gray-400">
          {post.category} | {post.date}
        </p>
        <h3 className="font-semibold">{post.title}</h3>
      </div>
    </div>
  );
};

export default PostCard;