import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { NavLink, Link, useLocation } from "react-router-dom";

import { slugify, usePosts } from "../data/Postcontext";
//---------------------------------------------------------------
const NAV_ITEMS = [
  { label: "Főoldal", href: "/" },
  {
    label: "Bejegyzések",
    hasDropdown: true,
  },
  // { label: "Coaching", href: "/coaching" },
  { label: "Bemutatkozás", href: "/about" },
];

//---------------------------------------------------------------
//---------------------------------------------------------------
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const location = useLocation();

  const { categories } = usePosts();

  const isPostsPath = location.pathname.startsWith("/posts");

  const linkClass = ({ isActive }) =>
    `text-sm transition-colors ${
      isActive ? "text-gray-900 font-semibold underline decoration-[#d4af37] underline-offset-4" : "text-gray-700 hover:text-gray-900"
    }`;

  //---------------------------------------------------------------
  return (
    <div className="bg-gray-50 border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-4 lg:px-3">
        <header className="flex items-center justify-between pt-9 pb-4">
          {/* Logo */}
          <Link
            to={"/"}
            className="logo relative md:text-[2rem] text-2xl font-display font-bold text-gray-900 tracking-wide"
          >
            Változókor
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) =>
              item.hasDropdown ? (
                <div key={item.label} className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center gap-1 text-sm transition-colors ${
                      isPostsPath
                        ? "text-gray-900 font-semibold underline decoration-[#d4af37] underline-offset-4"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                    <ChevronDown size={14} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full mt-2 left-0 bg-white shadow-lg rounded border border-gray-100 min-w-[160px] py-1 z-50">
                      {categories &&
                        categories.map((cat) => (
                          <Link
                            key={cat}
                            to={`/posts/${slugify(cat)}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f0efed] transition-colors"
                             onClick={() => setDropdownOpen(!dropdownOpen)}
                          >
                            {cat}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.href}
                  end={item.href === "/"}
                  className={linkClass}
                >
                  {item.label}
                </NavLink>
              ),
            )}
            <Link
              to="/contact"
              className="text-sm border border-gray-800 px-5 py-2 rounded hover:bg-gray-800 hover:text-white transition-all duration-200"
            >
              Írd meg a Te történeted
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          {NAV_ITEMS.map((item) =>
            item.hasDropdown ? (
              <div key={item.label} className="flex flex-col gap-2">
                <button
                  onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                  className="flex items-center gap-1 text-sm text-gray-900 text-left"
                >
                  {item.label}
                  <ChevronDown size={14} />
                </button>
                {mobileDropdownOpen &&
                  categories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/posts/${slugify(cat)}`}
                      className="text-sm text-gray-700 hover:text-gray-900 pl-4"
                      onClick={() => setMenuOpen(false)}
                    >
                      {cat}
                    </Link>
                  ))}
              </div>
            ) : (
              <NavLink
                key={item.label}
                to={item.href}
                end={item.href === "/"}
                className={({ isActive }) =>
                  `text-sm transition-colors ${
                    isActive
                      ? "text-gray-900 font-semibold underline decoration-[#d4af37] underline-offset-4"
                      : "text-gray-700 hover:text-gray-900"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ),
          )}
          <Link
            to="/contact"
            className="text-sm border border-gray-800 px-5 py-2 rounded text-center hover:bg-gray-800 hover:text-white transition-all duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Írd meg a Te történeted
          </Link>
        </div>
      )}
    </div>
  );
}
