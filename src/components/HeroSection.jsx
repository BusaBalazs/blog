import React, { useState } from "react";

const HeroSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Firebase integration point
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <section className=" bg-gray-50 py-16 md:py-20 text-center px-4">
      {/* Gold gradient line on top */}
      <div
        className="h-1 w-full bg-gradient-to-r from-[#b8963e] via-[#d4af37] to-[#b8963e] mb-0 -mt-0 absolute left-0"
        style={{ top: 64 }}
      />

      <h1 className="font-display default-color text-light text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        Mögöttünk álló történetek
      </h1>
      <p className="text-sm md:text-base text-gray-600 mb-6">
        Iratkozz fel, hogy ne maradj le semmiről!
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center justify-center md:gap-0 gap-2 max-w-md mx-auto"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email cím"
          required
          className="w-full sm:flex-1 border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#d4af37] rounded-l-lg rounded-bl-lg sm:rounded-r-none"
        />
        <button
          type="submit"
          className="w-full sm:w-auto bg-lemon border border-gray-300 hover:bg-[#b8963e] text-white font-semibold text-sm px-6 py-2.5 transition-colors rounded-lg rounded-tl-lg rounded-bl-lg  md:rounded-tr-lg rounded-br-lg md:rounded-tl-none md:rounded-bl-none"
        >
          Feliratkozás
        </button>
      </form>
    </section>
  );
};

export default HeroSection;
