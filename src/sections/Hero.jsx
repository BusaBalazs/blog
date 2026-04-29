const Hero = () => {
  return (
    <section className="bg-white text-center py-14 px-4">
      <h2 className="text-2xl md:text-3xl font-semibold mb-2">
        Mögöttünk álló történetek
      </h2>
      <p className="text-gray-500 mb-6">
        Iratkozz fel, hogy ne maradj le semmiről!
      </p>

      <div className="flex flex-col md:flex-row gap-3 justify-center max-w-md mx-auto">
        <input
          placeholder="email cím"
          className="border rounded-full px-4 py-3 w-full"
        />
        <button className="bg-primary px-6 py-3 rounded-full">
          Feliratkozás
        </button>
      </div>
    </section>
  );
};

export default Hero;