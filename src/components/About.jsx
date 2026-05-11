import React from "react";
import { Link } from "react-router-dom";

//---------------------------------------------------------
const TOPICS = [
  {
    title: "Önismeret & identitás",
    desc: "Ki vagy te, ha nem anya, nem kolléga, nem feleség – csak önmagad?",
  },
  {
    title: "Párkapcsolat & egyedüllét",
    desc: "Hogyan alakulnak át a kapcsolataink ebben a korban?",
  },
  {
    title: "Üres fészek & szabadság",
    desc: "A gyerekek elmennek – és te maradtál. Ez veszteség, vagy lehetőség?",
  },
  {
    title: "Stílus & önkifejezés",
    desc: "Divat, lakás, megjelenés – hogyan tükrözzük, akik vagyunk?",
  },
  {
    title: "Utazás & kaland",
    desc: "Az utazás 50 felett nem kompromisszum – hanem végre a saját útiterved.",
  },
  {
    title: "Karrier & újrakezdés",
    desc: "Soha nem késő irányt váltani, ha már tudod, merre akarsz menni.",
  },
  {
    title: "Férfiak változókora",
    desc: "Az életközepi fordulat férfiaknak is szól – amikor először kérdezel rá, hogy te mit akarsz igazán.",
  },
];

//---------------------------------------------------------
//---------------------------------------------------------
const About = () => {
  return (
    <div className="font-body bg-[#f0efed] overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative md:min-h-[60vh] min-h-[30vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5f2ed] via-[#f0efed] to-[#ede8e0]" />
        <div className="md:block hidden absolute right-16 top-1/2 -translate-y-1/2 font-display text-[20vw] font-bold text-[#d4af37]/15 leading-none select-none pointer-events-none tracking-tighter">
          VK
        </div>

        <div className="relative max-w-6xl mx-auto px-6 lg:px-8 py-20 w-full">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b8963e] mb-6">
              Bemutatkozás
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] mb-6">
              Farkas
              <br />
              <span className="text-[#b8963e]">Emese</span>
            </h1>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-10 bg-[#d4af37]" />
              <p className="text-sm text-gray-500 tracking-wide">
                Kommunikációs szakember · Life coach · Szociológus
              </p>
            </div>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-xl mb-10">
              30 éve dolgozom kommunikációs területen. Amikor beléptem a
              változókorba, rájöttem: rengeteg ember érzi úgy, hogy{" "}
              <strong className="text-gray-800 font-semibold">
                egyedül maradt a kérdéseivel.
              </strong>{" "}
              Azóta elköteleztem magam amellett, hogy erről hangosan, őszintén
              és pozitívan beszéljek.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 bg-[#d4af37] hover:bg-[#b8963e]
                text-white font-semibold text-sm px-7 py-3.5 transition-all duration-200
                rounded-sm group shadow-lg shadow-[#d4af37]/20"
            >
              Vedd fel velem a kapcsolatot
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

      {/* ── IDÉZET SZEKCIÓ ── */}
      <section className="bg-[#3a3a3a] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#b8963e] via-[#f0d060] to-[#b8963e]" />

        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 md:py-20 text-center">
          <p className="font-display text-xl md:text-2xl lg:text-3xl text-white font-bold leading-snug mb-6 max-w-3xl mx-auto">
            Ez az az időszak, amikor először az életünkben igazán
            <span className="text-[#d4af37]"> magunkra figyelhetünk.</span>
          </p>
        </div>
      </section>

      {/* ── A TÖRTÉNET ── */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Bal: sticky fejléc */}
            <div className="lg:sticky lg:top-24">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b8963e] mb-4">
                A történet
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                Magunkra vagyunk hagyva –{" "}
                <span className="text-[#b8963e]">
                  de nem kell azoknak maradnunk
                </span>
              </h2>
              <div className="w-10 h-0.5 bg-[#d4af37] mb-6" />
              <p className="text-base text-gray-500 leading-relaxed">
                Amikor beléptem a változókorba, tünetek listáit és
                termékajánlókat találtam. Arról viszont alig volt szó, hogy{" "}
                <strong className="text-gray-700">
                  mi nyílik meg előttem.
                </strong>
              </p>
            </div>

            {/* Jobb: kártyák */}
            <div className="space-y-4">
              {[
                {
                  n: "01",
                  title: "A felismerés",
                  text: "Mennyivel szabadabbak, bölcsebbek, határozottabbak leszünk ebben a korban – ezt senki nem mondja el.",
                },
                {
                  n: "02",
                  title: "A döntés",
                  text: "Elköteleztem magam amellett, hogy erről hangosan, őszintén és pozitívan beszéljek.",
                },
                {
                  n: "03",
                  title: "Az oldal célja",
                  text: "Ez az oldal azért született, hogy ezt az életérzést erősítse – és hogy ne legyél egyedül az úton.",
                },
              ].map((item) => (
                <div
                  key={item.n}
                  className="group flex gap-5 p-6 bg-[#f8f7f5] hover:bg-[#fdf8ec]
                    border border-transparent hover:border-[#d4af37]/30
                    rounded-sm transition-all duration-300"
                >
                  <span
                    className="font-display text-3xl font-bold text-[#d4af37]/30
                    group-hover:text-[#d4af37]/60 transition-colors leading-none mt-1 flex-shrink-0"
                  >
                    {item.n}
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-gray-900 text-lg mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TÉMÁK ── */}
      <section className="bg-[#f0efed]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-20">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b8963e] mb-3">
              Miről olvasol itt?
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">
              Az élet minden területe, ahol{" "}
              <span className="text-[#b8963e]">50 felett más a nézőpont</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {TOPICS.map((topic) => (
              <div
                key={topic.title}
                className="topic-pill flex items-center gap-2.5 bg-white
                  border border-gray-200 hover:border-[#d4af37] px-5 py-3
                  rounded-full cursor-default transition-all duration-300
                  hover:shadow-md hover:shadow-[#d4af37]/10 hover:-translate-y-0.5"
              >
                <span className="pill-dot w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                <span className="font-display font-bold md:text-[1em] text-sm text-gray-800">
                  {topic.title}
                </span>
                <span className=" md:text-[1em] text-xs text-gray-600 hidden sm:inline">
                  — {topic.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COACHING CTA ── */}
      <section className="bg-[#f0efed] pb-16 md:pb-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-[#3a3a3a] rounded-sm overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#b8963e] via-[#f0d060] to-[#b8963e]" />
            <div className="absolute -right-12 -bottom-12 w-56 h-56 rounded-full bg-[#d4af37]/6" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 px-8 md:px-12 py-12">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-3">
                  Személyes coaching
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white leading-snug mb-3">
                  Szeretnél ebben személyes kísérőt?
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Egyéni coaching programomban együtt dolgozunk azon, hogy ez az
                  életszakasz ne csak elmúljon –{" "}
                  <span className="text-[#d4af37]">hanem a tiéd legyen.</span>
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link
                  to="/coaching"
                  className="inline-flex items-center gap-3 bg-[#d4af37] hover:bg-[#b8963e]
                    text-white font-semibold text-sm px-8 py-4 rounded-sm
                    transition-all duration-200 group shadow-lg shadow-black/20 whitespace-nowrap"
                >
                  Tudj meg többet
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

export default About;
