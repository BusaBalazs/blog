import React, { useState } from "react";

// ── Tartalom szerkezet ────────────────────────────────────
const SECTIONS = [
  {
    id: "adatkezelo",
    title: "Az adatkezelő adatai",
    content: `
Az adatkezelő neve: Farkas Emese
Tevékenység: Life coach, kommunikációs szakember, tartalom-előállító
Weboldal: valtozakor.hu
Kapcsolat: info@valtozakor.hu

Az adatkezelés jogalapja: az érintett önkéntes hozzájárulása (GDPR 6. cikk (1) bekezdés a) pont), illetve az adatkezelő jogos érdeke (GDPR 6. cikk (1) bekezdés f) pont).
    `.trim(),
  },
  {
    id: "gyujtott-adatok",
    title: "Milyen adatokat gyűjtünk?",
    subsections: [
      {
        title: "Hírlevél feliratkozás",
        content: `
Kezelt adat: email cím
Cél: rendszeres hírlevél küldése, új tartalmakról való értesítés
Jogalap: önkéntes hozzájárulás
Tárolás helye: Brevo (Sendinblue SAS, Franciaország / EU)
Megőrzési idő: a leiratkozásig, illetve legfeljebb 3 évig
        `.trim(),
      },
      {
        title: "Kapcsolatfelvételi űrlap",
        content: `
Kezelt adatok: teljes név, email cím, telefonszám (opcionális), üzenet szövege
Cél: kapcsolatfelvétel megválaszolása, coaching program iránti érdeklődés kezelése
Jogalap: önkéntes hozzájárulás
Adattovábbítás: EmailJS (Reflow, Inc., USA) — az üzenet az adatkezelő email fiókjába érkezik
Megőrzési idő: az üzenet megválaszolásától számított 1 évig, coaching kapcsolat esetén a kapcsolat megszűnéséig
        `.trim(),
      },
      {
        title: "Cikkek kedvelése (like)",
        content: `
Kezelt adat: cikkhez kapcsolódó like-számláló (számadat, személyes adat nélkül)
Cél: a tartalom népszerűségének mérése
Jogalap: az adatkezelő jogos érdeke
Tárolás helye: Google Firebase Firestore (Google LLC, USA)
Megjegyzés: az egyedi like-ok böngésző szintű tárolással (localStorage) vannak jelölve — ez kizárólag a böngészőben marad, szerverre nem kerül.
        `.trim(),
      },
      {
        title: "Automatikusan gyűjtött adatok",
        content: `
A weboldal látogatása során automatikusan naplózódhat: IP-cím, böngésző típusa, látogatott oldalak, látogatás időpontja.
Ezeket az adatokat kizárólag a weboldal biztonságos működésének fenntartása érdekében tároljuk, és harmadik félnek nem adjuk át.
        `.trim(),
      },
    ],
  },
  {
    id: "adatfeldolgozo",
    title: "Adatfeldolgozók és harmadik felek",
    content: null,
    table: [
      {
        name: "Google Firebase (Firestore + Storage)",
        role: "Adatbázis és képtároló szolgáltatás",
        location: "USA (EU–US Data Privacy Framework)",
        purpose: "Cikkek, videók, képek tárolása",
      },
      {
        name: "Brevo (Sendinblue)",
        role: "Hírlevél küldő platform",
        location: "Franciaország (EU)",
        purpose: "Hírlevél feliratkozók kezelése, emailek küldése",
      },
      {
        name: "EmailJS (Reflow, Inc.)",
        role: "Email közvetítő szolgáltatás",
        location: "USA",
        purpose: "Kapcsolatfelvételi űrlap üzeneteinek továbbítása",
      },
      {
        name: "YouTube (Google LLC)",
        role: "Videótartalom szolgáltatás",
        location: "USA",
        purpose: "Beágyazott videók megjelenítése",
      },
      {
        name: "Netlify / i-MSCP tárhely",
        role: "Webtárhely és hosting",
        location: "EU / Magyarország",
        purpose: "Weboldal üzemeltetése",
      },
    ],
  },
  {
    id: "cookie",
    title: "Sütik (cookies)",
    content: `
A weboldal az alábbi típusú sütiket használja:

Munkamenet-sütik (session cookies): a weboldal működéséhez szükségesek, a böngésző bezárásakor törlődnek.

localStorage (böngészőtár): a like funkció esetén a böngésző helyi tárhelyén jelöljük meg, hogy az adott cikket kedvelted-e már. Ez az adat kizárólag a saját eszközödön tárolódik, szerverre nem kerül.

Harmadik féltől származó sütik: a YouTube beágyazott videók saját sütiket helyezhetnek el. Ezek kezeléséről a Google adatvédelmi tájékoztatója ad felvilágosítást: policies.google.com/privacy
    `.trim(),
  },
  {
    id: "jogok",
    title: "Az érintett jogai",
    items: [
      {
        title: "Hozzáférés joga",
        desc: "Tájékoztatást kérhetsz arról, hogy milyen adataidat kezeljük.",
      },
      {
        title: "Helyesbítés joga",
        desc: "Kérheted a pontatlan vagy hiányos adataid javítását.",
      },
      {
        title: "Törlés joga (elfeledtetés joga)",
        desc: "Kérheted adataid törlését, ha az adatkezelés jogalapja megszűnt.",
      },
      {
        title: "Hozzájárulás visszavonása",
        desc: "A hírlevélről bármikor leiratkozhatsz az emailekben található leiratkozási linkre kattintva, vagy az info@valtozakor.hu címre küldött üzenettel.",
      },
      {
        title: "Adathordozhatóság joga",
        desc: "Kérheted adataidat géppel olvasható formátumban.",
      },
      {
        title: "Tiltakozás joga",
        desc: "Tiltakozhatsz az adatkezelés ellen, ha az jogos érdeken alapul.",
      },
      {
        title: "Panasz benyújtásának joga",
        desc: "Panasszal élhetsz a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH): naih.hu, 1055 Budapest, Falk Miksa utca 9-11.",
      },
    ],
  },
  {
    id: "adatbiztonasag",
    title: "Adatbiztonság",
    content: `
Az adatok védelme érdekében az alábbi technikai intézkedéseket alkalmazzuk:

— A weboldal HTTPS protokollon keresztül érhető el (titkosított kapcsolat)
— A Firebase adatbázishoz kizárólag az adatkezelő és az adminisztrátori jogosultsággal rendelkező személyek férnek hozzá, Firebase Authentication segítségével
— A Brevo rendszerben tárolt email-listák harmadik félnek nem kerülnek átadásra
— Az EmailJS szolgáltatáson átmenő üzenetek kizárólag az adatkezelő email fiókjába kerülnek

Adatvédelmi incidens esetén az érintetteket és a hatóságot a GDPR által előírt határidőn belül értesítjük.
    `.trim(),
  },
  {
    id: "modositas",
    title: "A tájékoztató módosítása",
    content: `
Fenntartjuk a jogot, hogy ezt az adatkezelési tájékoztatót módosítsuk. A változásokról a weboldalon adunk tájékoztatást. A tájékoztató mindig hatályos verziója ezen az oldalon érhető el.

Utolsó frissítés: 2026. május
    `.trim(),
  },
];

// ── Accordion szekció ─────────────────────────────────────
function Section({ section }) {
  const [open, setOpen] = useState(false);

  const renderContent = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, i) => {
      if (line.trim() === "") return <div key={i} className="h-3" />;
      if (line.startsWith("—"))
        return (
          <p
            key={i}
            className="flex gap-2 text-sm text-gray-600 leading-relaxed"
          >
            <span className="text-[#d4af37] flex-shrink-0 mt-0.5">—</span>
            <span>{line.replace(/^—\s*/, "")}</span>
          </p>
        );
      return (
        <p key={i} className="text-sm text-gray-600 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="font-display font-bold text-gray-900 text-base group-hover:text-[#b8963e] transition-colors">
          {section.title}
        </span>
        <span
          className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200
          ${open ? "bg-[#d4af37] border-[#d4af37]" : "border-gray-300 group-hover:border-[#d4af37]"}`}
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
        <div className="pb-6 space-y-4">
          {/* Sima szöveg */}
          {section.content && (
            <div className="space-y-1">{renderContent(section.content)}</div>
          )}

          {/* Alszakaszok */}
          {section.subsections?.map((sub) => (
            <div
              key={sub.title}
              className="bg-[#fdf8ec] border border-[#d4af37]/20 rounded-sm p-4"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-[#b8963e] mb-3">
                {sub.title}
              </p>
              <div className="space-y-1">{renderContent(sub.content)}</div>
            </div>
          ))}

          {/* Táblázat */}
          {section.table && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#3a3a3a] text-white">
                    <th className="text-left px-3 py-2 font-semibold">
                      Szolgáltató
                    </th>
                    <th className="text-left px-3 py-2 font-semibold">
                      Szerepkör
                    </th>
                    <th className="text-left px-3 py-2 font-semibold hidden sm:table-cell">
                      Székhely
                    </th>
                    <th className="text-left px-3 py-2 font-semibold hidden md:table-cell">
                      Cél
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {section.table.map((row, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-3 py-2 font-medium text-gray-800 border-b border-gray-100">
                        {row.name}
                      </td>
                      <td className="px-3 py-2 text-gray-600 border-b border-gray-100">
                        {row.role}
                      </td>
                      <td className="px-3 py-2 text-gray-500 border-b border-gray-100 hidden sm:table-cell">
                        {row.location}
                      </td>
                      <td className="px-3 py-2 text-gray-500 border-b border-gray-100 hidden md:table-cell">
                        {row.purpose}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Lista */}
          {section.items?.map((item) => (
            <div key={item.title} className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] flex-shrink-0 mt-2" />
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {item.title}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Fő oldal ──────────────────────────────────────────────
// ── Fő oldal ──────────────────────────────────────────────
const PrivacyPolicy = () => {
  return (
    <div className="font-body bg-[#f0efed] min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5f2ed] via-[#f0efed] to-[#ede8e0]" />
        <div className="absolute top-10 right-[5%] w-64 h-64 rounded-full bg-[#d4af37]/6 blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b8963e] mb-4">
            Jogi információk
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            Adatkezelési tájékoztató
          </h1>
          <div className="w-10 h-0.5 bg-[#d4af37] mb-6" />
          <p className="text-base text-gray-500 leading-relaxed max-w-2xl">
            A <strong className="text-gray-700">valtozakor.hu</strong> weboldal
            üzemeltetője elkötelezett a látogatók és felhasználók személyes
            adatainak védelme iránt. Ez a tájékoztató ismerteti, hogy milyen
            adatokat gyűjtünk, miért, és hogyan kezeljük azokat — összhangban az
            EU Általános Adatvédelmi Rendeletével (
            <strong className="text-gray-700">GDPR</strong>) és a hatályos
            magyar jogszabályokkal.
          </p>
        </div>
      </section>

      {/* Tartalom */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 md:py-16">
          {/* Gyors összefoglaló */}
          <div className="bg-[#f8f7f5] border border-[#d4af37]/20 rounded-sm p-6 mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-[#b8963e] mb-4">
              Összefoglalás
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: "📧",
                  title: "Hírlevél",
                  desc: "Email cím — Brevo rendszerben, leiratkozásig",
                },
                {
                  icon: "💬",
                  title: "Kapcsolatfelvétel",
                  desc: "Név, email, üzenet — EmailJS-en át a postaládánkba",
                },
                {
                  icon: "❤️",
                  title: "Like funkció",
                  desc: "Névtelen számláló — Firebase, személyes adat nélkül",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 items-start">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accordion szekciók */}
          <div className="divide-y divide-gray-200 border-t border-gray-200">
            {SECTIONS.map((section) => (
              <Section key={section.id} section={section} />
            ))}
          </div>

          {/* Kapcsolat */}
          <div className="mt-12 bg-[#3a3a3a] rounded-sm p-6 md:p-8">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#b8963e] via-[#f0d060] to-[#b8963e]" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4af37] mb-3">
              Kapcsolat
            </p>
            <h2 className="font-display text-xl font-bold text-white mb-3">
              Kérdésed van az adatkezeléssel kapcsolatban?
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-5">
              Adatkezeléssel kapcsolatos kéréseidet, kérdéseidet az alábbi
              elérhetőségen várjuk:
            </p>
            <a
              href="mailto:info@valtozakor.hu"
              className="inline-flex items-center gap-2 bg-[#d4af37] hover:bg-[#b8963e]
                text-white font-semibold text-sm px-6 py-3 rounded-sm transition-colors duration-200"
            >
              info@valtozakor.hu
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
