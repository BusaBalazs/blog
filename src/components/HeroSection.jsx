import { useState } from "react";
import { useNewsletter } from "./hooks/useNewsletter";
import { Link } from "react-router-dom";

//--------------------------------------------------------------
//--------------------------------------------------------------
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
    <>
      <section className="text-center px-4 py-16 md:py-20 bg-gray-50">
        {/* Gold gradient line on top */}
        <div
          className="h-1 w-full bg-gradient-to-r from-[#b8963e] via-[#d4af37] to-[#b8963e] mb-0 -mt-0 absolute left-0"
          style={{ top: 64 }}
        />

        <h1 className="font-display default-color text-light text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Az élet 50 fölött nem véget ér, hanem elkezdődik.
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  setStatus(null);
                }}
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
                    <svg
                      className="animate-spin w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                      />
                    </svg>
                    Küldés...
                  </>
                ) : (
                  "Feliratkozás"
                )}
              </button>
            </form>
            {status === "error" && (
              <p className="mt-2 text-xs text-red-500">{errorMsg}</p>
            )}
          </>
        )}
      </section>

      <section className="max-w-[1200px] mx-auto bg-white py-16 md:py-20 text-center px-4">
        <h2 className="font-display default-color text-light text-1xl md:text-2xl font-bold text-gray-900 mb-6">
          Élet 50 fölött. Te döntöd el, milyenné teszed.
        </h2>

        <p className="max-w-[80%] mx-auto text-sm md:text-base text-gray-600">
          Üdvözöllek egy olyan helyen, ahol a változókorról nem tünetek és
          termékek kapcsán beszélünk. Itt arról lesz szó, ami igazán számít:
          hogyan élheted a következő 25-30 évet teljes erővel, örömmel és
          önmagadhoz hűen.
        </p>

        {/* "All videos" link */}
        <div className="flex justify-end mt-8">
          <Link
            to="/about"
            className="flex items-center gap-2 text-m text-gray-700 hover:text-[#b8963e] font-medium transition-colors group"
          >
            Tudjon meg többet rólunk
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
          </Link>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
