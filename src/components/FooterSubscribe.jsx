import { useState } from "react";
import { useNewsletter } from "./hooks/useNewsletter";

const FooterSubscribe = () => {
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
    <section className="bg-gray-50 pt-5 md:py-8 px-4 sm:block hidden">
      <div className="bg-white max-w-xl mx-auto rounded-lg shadow-lg px-8 py-8 text-center relative top-[60px] z-10">
        <p className="text-sm text-gray-600 mb-5">
          Iratkozz fel, hogy ne maradj le semmiről!
        </p>

        {status === "success" ? (
          <p className="text-sm text-[#b8963e] font-medium py-1">
            ✓ Sikeresen feliratkoztál! Ellenőrizd az email fiókod.
          </p>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-0"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus(null); }}
                placeholder="email cím"
                required
                disabled={status === "loading"}
                className="flex-1 border border-gray-300 bg-white px-4 py-2.5 text-sm
                  focus:outline-none focus:border-[#d4af37] rounded-sm sm:rounded-r-none
                  disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-lemon hover:bg-[#b8963e] text-white font-semibold text-sm
                  px-6 py-2.5 transition-colors rounded-sm sm:rounded-l-none
                  disabled:opacity-60 flex items-center justify-center gap-2"
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
      </div>
    </section>
  );
};

export default FooterSubscribe;