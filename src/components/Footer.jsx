// Simple SVG social icons to avoid installing an extra package
function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

//------------------------------------------------------
//------------------------------------------------------
export default function Footer() {
  return (
    <>
      <footer className="bg-[#3a3a3a] text-white pb-5 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social icons */}
            <div className="flex items-center gap-5 text-white">
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-[#d4af37] transition-colors"
              >
                <FacebookIcon />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-[#d4af37] transition-colors"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                aria-label="X / Twitter"
                className="hover:text-[#d4af37] transition-colors"
              >
                <XIcon />
              </a>
            </div>

            {/* Logo + copyright */}
            <div className="text-center">
              {/* Logo */}
              <p className="logo relative md:text-[2rem] text-2xl font-display font-bold text-gray-50 tracking-wide">
                Változó Kor
              </p>
              <p className="text-xs text-gray-400 mt-2">
                2026 Minden jog fenntartva
              </p>
            </div>

            {/* Legal link */}
            <div>
              <a
                href="#"
                className="text-xs text-gray-300 hover:text-white transition-colors underline underline-offset-2"
              >
                Adatkezelési tájékoztató
              </a>
            </div>
          </div>
        </div>
      </footer>
      <div className="w-full h-5 bg-gradient-to-r from-[#a37a09] to-[#ffff83]"></div>
    </>
  );
}
