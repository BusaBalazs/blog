const VideoCard = ({ img }) => (
  <div>
    <div className="relative">
      <img src={img} className="rounded-xl" />
      <div className="absolute inset-0 flex items-center justify-center text-3xl">
        ▶
      </div>
    </div>
    <p className="text-xs text-gray-400 mt-2">
      Életmód | 2026.04.26.
    </p>
    <h3 className="font-semibold">Lorem ipsum dolores</h3>
  </div>
);

const Videos = () => {
  return (
    <section className="bg-[#efefef] py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="inline-block bg-primary px-3 py-1 mb-6 font-semibold">
          Nézd meg videóinkat!
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <VideoCard img="/img/video1.jpg" />
          <VideoCard img="/img/video2.jpg" />
        </div>

        <div className="text-right mt-6">Összes Videó →</div>
      </div>
    </section>
  );
};

export default Videos;