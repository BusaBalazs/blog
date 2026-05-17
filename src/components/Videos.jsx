import React from "react";
import { Play } from "lucide-react";
import { usePosts } from "../data/Postcontext";

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

// ---------- Sub-components ----------
function VideoCard({ video }) {
  const embedUrl = getYouTubeEmbedUrl(video.videoUrl);

  return (
    <article className="cursor-pointer group">
      <div className="relative overflow-hidden rounded-sm mb-3">
        {embedUrl ? (
          <div className="aspect-[16/9] w-full overflow-hidden bg-black">
            <iframe
              className="w-full h-full"
              src={embedUrl}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : (
          <>
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center group-hover:bg-[#d4af37] transition-colors duration-300">
                <Play size={20} fill="white" className="text-white ml-1" />
              </div>
            </div>
          </>
        )}
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

// ---------- Skeleton ----------
function VideoSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[16/9] w-full bg-gray-200 rounded-sm mb-3" />
      <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  );
}

//--------------------------------------------------------
const Videos = () => {
  const { videos, loading } = usePosts();

  return (
    <section className="bg-gray-50 px-4 sm:px-6 lg:px-8 pb-4">
      <div className="max-w-[1200px] mx-auto">
        {/* Section header */}
        <div className="inline-block mb-8">
          <h2 className="font-display text-2xl font-bold bg-gold px-2 py-4">
            Nézd meg videóinkat!
          </h2>
        </div>

        {/* Desktop: 2 oszlopos, arany elválasztóval */}
        <div className="hidden md:block relative">
          {videos.length > 0 && (
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#ede56b] -translate-x-1/2 z-10" />
          )}
          <div className="grid grid-cols-2 gap-10">
            {loading ? (
              [0, 1].map((i) => <VideoSkeleton key={i} />)
            ) : videos.length > 0 ? (
              videos.map((video) => <VideoCard key={video.id} video={video} />)
            ) : (
              <p className="text-sm text-gray-500 col-span-2 py-8 text-center font-bold">
                Még nincsenek videók.
              </p>
            )}
          </div>
        </div>

        {/* Mobile: stacked */}
        <div className="md:hidden flex flex-col gap-8">
          {loading ? (
            [0, 1].map((i) => <VideoSkeleton key={i} />)
          ) : videos.length > 0 ? (
            videos.map((video) => <VideoCard key={video.id} video={video} />)
          ) : (
            <p className="text-sm text-gray-500 py-8 text-center font-bold">
              Még nincsenek videók.
            </p>
          )}
        </div>

        {/* "Összes videó" link */}
        {videos.length > 0 && (
          <div className="flex justify-end mt-8">
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#b8963e] font-medium transition-colors group"
            >
              Összes Videó
              <span className="inline-block w-16 h-px bg-[#bda972] group-hover:w-20 transition-all duration-300" />
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-[#bda972]"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Videos;
