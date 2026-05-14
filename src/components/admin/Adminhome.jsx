import React from "react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../../data/Postcontext";

const Adminhome = () => {
  const navigate = useNavigate();
  const { posts, videos, loading } = usePosts();

  const actions = [
    {
      icon: "✍️",
      label: "Új cikk feltöltése",
      description: "Írj és töltsd fel a következő bejegyzést a Firestore adatbázisba.",
      cta: "Feltöltés →",
      path: "/admin/new",
      accent: "#d4af37",
    },
    {
      icon: "✏️",
      label: "Cikk szerkesztése",
      description: "Módosítsd a már meglévő bejegyzések tartalmát, képét vagy adatait.",
      cta: "Szerkesztés →",
      path: "/admin/edit",
      accent: "#b8963e",
    },
    {
      icon: "📧",
      label: "Hírlevél küldése",
      description: "Állítsd össze és küldd el a hírlevelet a feliratkozóknak a Brevo API-n keresztül.",
      cta: "Hírlevél →",
      path: "/admin/newsletter",
      accent: "#d4af37",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0efed] font-body flex flex-col">
      {/* Gold bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#b8963e] via-[#f0d060] to-[#b8963e]" />

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Admin panel</p>
          <h1 className="font-display text-xl font-bold text-gray-900">Változó Kor</h1>
        </div>
        <a
          href="/"
          className="text-xs text-gray-500 hover:text-[#b8963e] transition-colors underline underline-offset-2"
        >
          ← Vissza a főoldalra
        </a>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
          Mit szeretnél csinálni?
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-12 text-center">
          Válassz egy műveletet
        </h2>

        {/* Action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
          {actions.map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="group bg-white border-2 border-gray-100 hover:border-[#d4af37] rounded-sm
                p-8 text-left flex flex-col gap-4 transition-all duration-200
                hover:shadow-lg hover:-translate-y-0.5"
            >
              <span className="text-4xl">{action.icon}</span>
              <div>
                <h3 className="font-display font-bold text-gray-900 text-lg mb-1 group-hover:text-[#b8963e] transition-colors">
                  {action.label}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{action.description}</p>
              </div>
              <span className="text-sm font-semibold mt-auto transition-colors" style={{ color: action.accent }}>
                {action.cta}
              </span>
            </button>
          ))}
        </div>

        {/* Stats */}
        {!loading && (
          <div className="flex gap-8 mt-12 text-center">
            <div>
              <p className="font-display text-3xl font-bold text-gray-900">{posts.length}</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Cikk</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div>
              <p className="font-display text-3xl font-bold text-gray-900">
                {posts.filter((p) => p.featured).length}
              </p>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Kiemelt</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div>
              <p className="font-display text-3xl font-bold text-gray-900">{videos.length}</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Videó</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Adminhome;