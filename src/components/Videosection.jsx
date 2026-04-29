import { Play } from "lucide-react";

// ---------- MOCK DATA (replace with Firebase) ----------
const MOCK_VIDEOS = [
  {
    id: "v1",
    category: "Életmód",
    date: "2026. 04. 26.",
    title: "Lorem ipsum dolores",
    thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
    videoUrl: "#",
  },
  {
    id: "v2",
    category: "Életmód",
    date: "2026. 04. 26.",
    title: "Lorem ipsum dolores",
    thumbnailUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80",
    videoUrl: "#",
  },
];

function VideoCard({ video }) {
  return (
    <article className="cursor-pointer group">
      <div className="relative overflow-hidden rounded-sm mb-3">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center group-hover:bg-[#d4af37] transition-colors duration-300">
            <Play size={20} fill="white" className="text-white ml-1" />
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-1">
        {video.category} <span className="mx-1">|</span> {video.date}
      </p>
      <h3 className="font-display text-base font-bold text-gray-900 group-hover:text-[#b8963e] transition-colors">
        {video.title}
      </h3>
    </article>
  );
}

export default function VideoSection({ videos = MOCK_VIDEOS }) {
  /**
   * Firebase integration:
   * Replace MOCK_VIDEOS with Firestore fetch from "videos" collection
   */

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Section header */}
      <div className="inline-block mb-8">
        <h2 className="font-display text-xl font-bold text-white bg-[#b8963e] px-4 py-2">
          Nézd meg videóinkat!
        </h2>
      </div>

      {/* Vertical gold separator line — desktop only */}
      <div className="hidden md:block relative">
        {/* Center divider line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#d4af37] -translate-x-1/2 z-10" />

        <div className="grid grid-cols-2 gap-10">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>

      {/* Mobile: stacked */}
      <div className="md:hidden flex flex-col gap-8">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {/* "All videos" link */}
      <div className="flex justify-end mt-8">
        <a
          href="#"
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#b8963e] font-medium transition-colors group"
        >
          Összes Videó
          <span className="inline-block w-16 h-px bg-[#d4af37] group-hover:w-20 transition-all duration-300" />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#d4af37]">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}