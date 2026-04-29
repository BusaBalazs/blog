import React, { useState } from "react";

//-----------------------------------------------------
//-----------------------------------------------------
const FooterSubscribe = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <section className="bg-gray-50 pt-5 md:py-8 px-4 sm:block hidden">
      <div className="bg-white max-w-xl mx-auto rounded-lg shadow-lg px-8 py-8 text-center relative top-[60px] z-50  ">
        <p className="text-sm text-gray-600 mb-5">
          Iratkozz fel, hogy ne maradj le semmiről!
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-0"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email cím"
            required
            className="flex-1 border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#d4af37] rounded-sm sm:rounded-r-none"
          />
          <button
            type="submit"
            className="bg-lemon hover:bg-[#b8963e] text-white font-semibold text-sm px-6 py-2.5 transition-colors rounded-sm sm:rounded-l-none"
          >
            Feliratkozás
          </button>
        </form>
      </div>
    </section>
  );
};

export default FooterSubscribe;
