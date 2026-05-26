import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ── Árcsomagok ────────────────────────────────────────────
const PACKAGES = [
  {
    id: "intro",
    name: "Bevezető csomag",
    sessions: "3 alkalmas program",
    tagline: "Egy konkrét kérdés, egy konkrét elindulás",
    price: "60 000 Ft",
    badge: "Bevezető ár · limitált férőhely",
    features: [
      "3 × 60 perces személyes alkalom",
      "Ingyenes bemutatkozó beszélgetés előtte",
    ],
    highlighted: false,
  },
  {
    id: "recommended",
    name: "Ajánlott csomag",
    sessions: "5 alkalmas program",
    tagline: "Mélyebb munka, tartósabb változás",
    price: "90 000 Ft",
    badge: "Bevezető ár · limitált férőhely",
    features: [
      "5 × 60 perces személyes alkalom",
      "Ingyenes bemutatkozó beszélgetés előtte",
      "Összefoglaló az utolsó alkalom után",
    ],
    highlighted: true,
  },
];

// ── GYIK ──────────────────────────────────────────────────
const FAQS = [
  {
    q: "Kinek szól ez a coaching?",
    a: "Elsősorban 45-60 év közötti nőknek és férfiaknak, akik valamilyen változás előtt állnak – legyen az üres fészek, párkapcsolati kérdés, életközepi válság, karrier-fordulat, vagy csak az az érzés, hogy több kellene ebből az életből, más minőségű életet szeretnének élni.",
  },
  {
    q: "Mi a különbség a 3 és az 5 alkalmas csomag között?",
    a: "A 3 alkalmas csomag egy konkrétabb kérdés körüljárására, egy irány megtalálására ideális. Az 5 alkalmas program mélyebb munkát tesz lehetővé, ha úgy érzed, hogy több területen szeretnél változást, ez a jobb választás.",
  },
  {
    q: "Hogyan tudok jelentkezni?",
    a: "Küldj egy üzenetet és egyeztetünk egy ingyenes, 30 perces bemutatkozó beszélgetést. Ez kötelezettség nélküli, és segít eldönteni, hogy együtt tudunk-e dolgozni.",
  },
  {
    q: "Hol zajlanak az alkalmak?",
    a: "Személyesen, Budapesten. A pontos helyszínről az első beszélgetés során egyeztetünk.",
  },
];

// ── A folyamat lépései ────────────────────────────────────
const STEPS = [
  {
    n: "01",
    title: "Ingyenes bemutatkozó beszélgetés",
    desc: "30 perc, kötelezettség nélkül. Megismerjük egymást, és megnézzük, hogy tudok-e neked segíteni.",
  },
  {
    n: "02",
    title: "Csomag kiválasztása",
    desc: "3 vagy 5 alkalmas program – attól függően, hol tartasz és mire van szükséged.",
  },
  {
    n: "03",
    title: "Személyes ülések",
    desc: "Budapest. Minden alkalom 60 perc, a te tempódban, a te témáiddal.",
  },
  {
    n: "04",
    title: "Továbblépés",
    desc: "Az utolsó alkalom után te döntöd el – folytatjuk, vagy már magabiztosan tudsz továbbmenni egyedül.",
  },
];

// ── FAQ accordion ─────────────────────────────────────────
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="font-display font-bold text-gray-900 text-base group-hover:text-[#b8963e] transition-colors">
          {q}
        </span>
        <span
          className={`flex-shrink-0 w-6 h-6 rounded-full border border-gray-300
          group-hover:border-[#d4af37] flex items-center justify-center transition-all duration-200
          ${open ? "bg-[#d4af37] border-[#d4af37]" : ""}`}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <path
              d="M2 3.5L5 6.5L8 3.5"
              stroke={open ? "white" : "#9ca3af"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {open && (
        <p className="text-sm text-gray-500 leading-relaxed pb-5">{a}</p>
      )}
    </div>
  );
}

// ── Fő oldal ──────────────────────────────────────────────
const Coaching = () => {
  const navigate = useNavigate();

  //--------------------------------------------------
  return (
    <div className="font-body bg-[#f0efed] overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 font-display text-[18vw] font-bold
          text-[#d4af37]/5 leading-none select-none pointer-events-none tracking-tighter"
        >
          VK
        </div>

        <div className="relative max-w-6xl mx-auto px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b8963e] mb-6">
              Coaching
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] mb-6">
              Nem kell egyedül{" "}
              <span className="text-[#b8963e]">végigjárd ezt az utat.</span>
            </h1>
            <div className="w-10 h-0.5 bg-[#d4af37] mb-8" />
            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-xl mb-10">
              A változókor egy átalakulás – és mint minden átalakulásnak, ennek
              is könnyebb nekivágni, ha valaki ott van melletted. Nem megmondja,
              hogy mit csinálj, hanem segít megtalálni, hogy{" "}
              <strong className="text-gray-800 font-semibold">
                te mit szeretnél.
              </strong>
            </p>
            <Link
              to="/contactCoaching"
              className="inline-flex items-center gap-3 bg-[#d4af37] hover:bg-[#b8963e]
                text-white font-semibold text-sm px-7 py-3.5 transition-all duration-200
                rounded-sm group shadow-lg shadow-[#d4af37]/20"
            >
              Ingyenes bemutatkozó beszélgetés
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="group-hover:translate-x-1 transition-transform duration-200"
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
        </div>
      </section>

      {/* ── MI AZ A COACHING ── */}
      <section className="bg-[#3a3a3a] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#b8963e] via-[#f0d060] to-[#b8963e]" />

        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-4">
                Mi az a coaching?
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white leading-snug mb-6">
                Egy folyamat, ami rólad szól.{" "}
                <span className="text-[#d4af37]">Csak rólad.</span>
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                A coaching nem terápia és nem tanácsadás. Nem azt mondom meg,
                hogyan kell élned az életedet – hanem együtt feltárjuk, te
                hogyan szeretnéd. Milyen az az élet, amit igazán akarsz? Mi tart
                vissza tőle? Mi az, ami már benned van, csak még nem látod
                tisztán?
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                30 éves kommunikációs tapasztalattal, szociológusi szemlélettel
                és saját változókoros múlttal a hátam mögött kísérlek végig ezen
                az úton –
                <span className="text-white font-medium">
                  {" "}
                  őszintén, nyíltan, ítélkezés nélkül.
                </span>
              </p>
            </div>
            <div className="border-l border-[#d4af37]/20 pl-12 hidden lg:block">
              <div className="text-[#d4af37] font-display text-5xl leading-none mb-4 opacity-50">
                "
              </div>
              <p className="font-display text-lg text-white font-bold leading-snug italic">
                Az élet 50 felett nemcsak folytatódik – meg is újulhat. De ehhez
                először tisztán kell látnod, hogy mit akarsz tőle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── A FOLYAMAT LÉPÉSEI ── */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="lg:sticky lg:top-24">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b8963e] mb-4">
                Hogyan dolgozunk együtt?
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                A folyamat <span className="text-[#b8963e]">lépései</span>
              </h2>
              <div className="w-10 h-0.5 bg-[#d4af37] mb-6" />
              <p className="text-base text-gray-500 leading-relaxed">
                Minden lépés a te saját tempódban, a te témáiddal – én csak
                kísérlek az úton.
              </p>
            </div>

            <div className="space-y-4">
              {STEPS.map((step) => (
                <div
                  key={step.n}
                  className="group flex gap-5 p-6 bg-[#f8f7f5] hover:bg-[#fdf8ec]
                    border border-transparent hover:border-[#d4af37]/30
                    rounded-sm transition-all duration-300"
                >
                  <span
                    className="font-display text-3xl font-bold text-[#d4af37]/30
                    group-hover:text-[#d4af37]/60 transition-colors leading-none mt-1 flex-shrink-0"
                  >
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-gray-900 text-base mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ÁRCSOMAGOK ── */}
      <section className="bg-[#f0efed]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b8963e] mb-3">
              Csomagok & árak
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
              Válaszd azt,{" "}
              <span className="text-[#b8963e]">ami hozzád illik</span>
            </h2>
          </div>

          {/* Ingyenes beszélgetés note */}
          <p className="text-center text-m text-gray-800 mb-8">
            Mindkét csomag előtt ingyenes, 30 perces bemutatkozó beszélgetés.{" "}
            <Link
              to="/contactCoaching"
              className="text-[#b8963e] underline underline-offset-2 hover:text-[#d4af37]"
            >
              Foglalj időpontot →
            </Link>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-sm overflow-hidden flex flex-col
                  transition-all duration-300 hover:-translate-y-1
                  ${
                    pkg.highlighted
                      ? "bg-[#3a3a3a] shadow-2xl shadow-black/20"
                      : "bg-white border border-gray-100 shadow-lg shadow-gray-200/60"
                  }`}
              >
                {/* Ajánlott badge */}
                {pkg.highlighted && (
                  <div
                    className="bg-[#d4af37] text-white text-xs font-bold
                    uppercase tracking-widest text-center py-2 px-4"
                  >
                    Leggyakrabban választott
                  </div>
                )}

                {/* Arany vonal */}
                {!pkg.highlighted && (
                  <div className="h-0.5 w-full bg-gradient-to-r from-[#b8963e] via-[#f0d060] to-[#b8963e]" />
                )}

                <div className="p-8 flex flex-col flex-1">
                  {/* Fejléc */}
                  <div className="mb-6">
                    <p
                      className={`text-xs font-semibold uppercase tracking-widest mb-1
                      ${pkg.highlighted ? "text-[#d4af37]" : "text-[#b8963e]"}`}
                    >
                      {pkg.sessions}
                    </p>
                    <h3
                      className={`font-display text-xl font-bold mb-2
                      ${pkg.highlighted ? "text-white" : "text-gray-900"}`}
                    >
                      {pkg.name}
                    </h3>
                    <p
                      className={`text-sm italic
                      ${pkg.highlighted ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {pkg.tagline}
                    </p>
                  </div>

                  {/* Ár */}
                  <div
                    className={`border-t border-b py-5 mb-6
                    ${pkg.highlighted ? "border-white/10" : "border-gray-100"}`}
                  >
                    <p
                      className={`font-display text-4xl font-bold
                      ${pkg.highlighted ? "text-white" : "text-gray-900"}`}
                    >
                      {pkg.price}
                    </p>
                    <p
                      className={`text-xs mt-1.5
                      ${pkg.highlighted ? "text-[#d4af37]" : "text-[#b8963e]"}`}
                    >
                      {pkg.badge}
                    </p>
                  </div>

                  {/* Tartalmazza */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="flex-shrink-0 mt-0.5"
                        >
                          <circle
                            cx="8"
                            cy="8"
                            r="7"
                            fill={pkg.highlighted ? "#d4af37" : "#d4af37"}
                            fillOpacity="0.15"
                          />
                          <path
                            d="M5 8l2 2 4-4"
                            stroke="#d4af37"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span
                          className={`text-sm leading-relaxed
                          ${pkg.highlighted ? "text-gray-300" : "text-gray-600"}`}
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() =>
                      navigate("/contactCoaching", {
                        state: { message: `A választott csomag: ${pkg.name}` },
                      })
                    }
                    className={`w-full text-center font-semibold text-sm px-6 py-3 rounded-sm
                      transition-all duration-200
                      ${
                        pkg.highlighted
                          ? "bg-[#d4af37] hover:bg-[#b8963e] text-white shadow-lg shadow-[#d4af37]/20"
                          : "border-2 border-[#d4af37] text-[#b8963e] hover:bg-[#d4af37] hover:text-white"
                      }`}
                  >
                    Érdekel ez a csomag
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GYIK ── */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="lg:sticky lg:top-24">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b8963e] mb-4">
                Gyakori kérdések
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                A legfontosabb{" "}
                <span className="text-[#b8963e]">tudnivalók</span>
              </h2>
              <div className="w-10 h-0.5 bg-[#d4af37]" />
            </div>
            <div>
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#f0efed] pb-16 md:pb-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-[#3a3a3a] rounded-sm overflow-hidden">
            <div
              className="relative flex flex-col md:flex-row items-center justify-between
              gap-8 px-8 md:px-12 py-12"
            >
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-3">
                  Készen állsz az első lépésre?
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white leading-snug mb-3">
                  Írj nekem, és egyeztessünk egy ingyenes bemutatkozó
                  beszélgetést.
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Az első lépés mindig a legfontosabb.{" "}
                  <span className="text-[#d4af37]">Kötelezettség nélkül.</span>
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link
                  to="/kapcsolat"
                  className="inline-flex items-center gap-3 bg-[#d4af37] hover:bg-[#b8963e]
                    text-white font-semibold text-sm px-8 py-4 rounded-sm
                    transition-all duration-200 group shadow-lg shadow-black/20 whitespace-nowrap"
                >
                  Írj nekem most
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="group-hover:translate-x-1 transition-transform duration-200"
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Coaching;
