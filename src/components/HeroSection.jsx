import { useState } from "react";
import { useNewsletter } from "./hooks/useNewsletter";

const HeroSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");
  const { subscribe } = useNewsletter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await subscribe(email);
      setStatus("success");
      setEmail("");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  return (
    <section className="bg-gray-50 py-16 md:py-20 text-center px-4">
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

      {status === "success" ? (
        <p className="text-sm text-[#b8963e] font-medium">
          ✓ Sikeresen feliratkoztál! Hamarosan érkezik egy megerősítő email.
        </p>
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center md:gap-0 gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus(null); }}
              placeholder="email cím"
              required
              disabled={status === "loading"}
              className="w-full sm:flex-1 border border-gray-300 bg-white px-4 py-2.5 text-sm
                focus:outline-none focus:border-[#d4af37] rounded-l-lg rounded-bl-lg
                sm:rounded-r-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full sm:w-auto bg-lemon border border-gray-300 hover:bg-[#b8963e]
                text-white font-semibold text-sm px-6 py-2.5 transition-colors
                rounded-lg rounded-tl-lg rounded-bl-lg md:rounded-tr-lg rounded-br-lg
                md:rounded-tl-none md:rounded-bl-none disabled:opacity-60
                flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                  </svg>
                  Küldés...
                </>
              ) : "Feliratkozás"}
            </button>
          </form>
          {status === "error" && (
            <p className="mt-2 text-xs text-red-500">{errorMsg}</p>
          )}
        </>
      )}
    </section>
  );
};

export default HeroSection;