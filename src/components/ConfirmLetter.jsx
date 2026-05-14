import React from "react";
import { Link } from "react-router-dom";



//-----------------------------------------------
//-----------------------------------------------
const ConfirmLetter = () => {
  return (
    <>
      <div className="font-body bg-[#f0efed] min-h-screen flex items-center justify-center px-4 ">
        <div className="max-w-lg w-full text-center">
          {/* Ikon */}{" "}
          <Link
            to={"/"}
            className="logo relative md:text-[2rem] text-2xl font-display font-bold text-gray-900 tracking-wide mb-16 block"
          >
            Változókor
          </Link>
          <div className="w-16 h-16 rounded-full bg-[#d4af37]/15 flex items-center justify-center mx-auto mb-8">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d4af37"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          {/* Arany vonal */}
          <div className="w-12 h-0.5 bg-gradient-to-r from-[#b8963e] to-[#d4af37] mx-auto mb-8" />
          {/* Szöveg */}
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b8963e] mb-4">
            Sikeres feliratkozás
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5">
            Köszönjük, hogy{" "}
            <span className="text-[#b8963e]">velünk tartasz!</span>
          </h1>
          <p className="text-base text-gray-500 leading-relaxed mb-10 max-w-md mx-auto">
            Feliratkozásod rögzítettük. Hamarosan megkapod első hírlevelünket —
            addig is olvasd el legfrissebb bejegyzéseinket.
          </p>
          {/* Gombok */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-[#d4af37]
              hover:bg-[#b8963e] text-white font-semibold text-sm px-7 py-3.5
              rounded-sm transition-colors duration-200 group shadow-lg shadow-[#d4af37]/20"
            >
              Vissza a főoldalra
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                className="group-hover:translate-x-0.5 transition-transform duration-200"
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
            <Link
              to="/cikkek"
              className="inline-flex items-center justify-center gap-2 border border-gray-300
              hover:border-[#d4af37] text-gray-600 hover:text-[#b8963e] font-semibold
              text-sm px-7 py-3.5 rounded-sm transition-all duration-200"
            >
              Legújabb cikkek
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmLetter;
