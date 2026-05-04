import React from 'react'


// ---------- Sub-components ----------

function CategoryBadge({ category }) {
  return <span className="text-xs text-gray-500 font-medium">{category}</span>;
}

//------------------------------------------------------------
const PostMetaData = ({ category, date }) => {
   return (
    <p className="text-xs text-gray-500 mb-1 pt-1">
      <CategoryBadge category={category} />
      <span className="mx-1">|</span>
      {date}
    </p>
  );
}

export default PostMetaData