import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../data/firebase";
import { slugify } from "../../data/Postcontext";

// ── Konstansok ────────────────────────────────────────────
const CATEGORIES = [
  "Életmód",
  "Egészség",
  "Kapcsolatok",
  "Szépség",
  "Pszichológia",
  "Karrier",
];

const EMPTY_FORM = {
  category: "",
  date: new Date().toISOString().split("T")[0],
  title: "",
  subtitle: "",
  excerpt: "",
  imageUrl: "",
  featured: false,
  article: "",
};

// ── Kis segéd komponensek ─────────────────────────────────
function Label({ htmlFor, children, required }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5"
    >
      {children}
      {required && <span className="text-[#d4af37] ml-1">*</span>}
    </label>
  );
}

function Input({ id, className = "", ...props }) {
  return (
    <input
      id={id}
      className={`w-full bg-white border border-gray-200 rounded-sm px-4 py-2.5 text-sm text-gray-800
        placeholder:text-gray-300 focus:outline-none focus:border-[#d4af37] focus:ring-1
        focus:ring-[#d4af37]/30 transition-all ${className}`}
      {...props}
    />
  );
}

function Textarea({ id, className = "", ...props }) {
  return (
    <textarea
      id={id}
      className={`w-full bg-white border border-gray-200 rounded-sm px-4 py-2.5 text-sm text-gray-800
        placeholder:text-gray-300 focus:outline-none focus:border-[#d4af37] focus:ring-1
        focus:ring-[#d4af37]/30 transition-all resize-none ${className}`}
      {...props}
    />
  );
}

function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-500">{msg}</p>;
}

function StatusBanner({ status }) {
  if (!status) return null;
  const isSuccess = status.type === "success";
  return (
    <div
      className={`flex items-center gap-3 px-5 py-4 rounded-sm text-sm font-medium mb-6 border
        ${
          isSuccess
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-red-50 border-red-200 text-red-800"
        }`}
    >
      <span className="text-lg">{isSuccess ? "✓" : "✕"}</span>
      {status.message}
    </div>
  );
}

// ── Előnézet kártya ───────────────────────────────────────
function PreviewCard({ form }) {
  const hasContent = form.title || form.imageUrl || form.excerpt;
  if (!hasContent) {
    return (
      <div className="h-full flex items-center justify-center text-gray-300 text-sm italic">
        Az előnézet itt jelenik meg...
      </div>
    );
  }
  return (
    <article className="font-body">
      {form.imageUrl && (
        <div className="overflow-hidden rounded-sm mb-4 aspect-[510/390]">
          <img
            src={form.imageUrl}
            alt={form.title}
            className="block w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}
      {form.category && (
        <p className="text-xs text-gray-400 mb-1">
          {form.category} <span className="mx-1">|</span>
          {form.date || "—"}
        </p>
      )}
      {form.featured && (
        <span className="inline-block text-xs bg-[#d4af37] text-white px-2 py-0.5 rounded-sm mb-2 font-semibold">
          Kiemelt
        </span>
      )}
      {form.title && (
        <h3 className="font-display text-lg font-bold text-gray-900 leading-snug mb-1">
          {form.title}
        </h3>
      )}
      {form.subtitle && (
        <p className="text-sm text-[#b8963e] font-medium mb-2">
          {form.subtitle}
        </p>
      )}
      {form.excerpt && (
        <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
          {form.excerpt}
        </p>
      )}
    </article>
  );
}

// ── Validáció ─────────────────────────────────────────────
function validate(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "A cím kötelező.";
  if (!form.category) errors.category = "Válassz kategóriát.";
  if (!form.excerpt.trim()) errors.excerpt = "A kivonat kötelező.";
  if (!form.article.trim()) errors.article = "A cikk szövege kötelező.";
  if (form.imageUrl && !/^https?:\/\/.+/.test(form.imageUrl)) {
    errors.imageUrl = "Érvényes URL-t adj meg (https://...).";
  }
  return errors;
}

//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------
const AdminpostUpload = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("form"); // "form" | "preview"

  const set = (field) => (e) => {
    const val =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const docRef = await addDoc(collection(db, "posts"), {
        category: form.category,
        date: form.date,
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        excerpt: form.excerpt.trim(),
        imageUrl: form.imageUrl.trim(),
        featured: form.featured,
        article: form.article.trim(),
        slug: slugify(form.title),
        createdAt: serverTimestamp(),
      });

      setStatus({
        type: "success",
        message: `Cikk sikeresen feltöltve! (ID: ${docRef.id})`,
      });
      setForm(EMPTY_FORM);
      setErrors({});
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: `Hiba a feltöltés során: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setStatus(null);
  };

  return (
    <div className="min-h-screen bg-[#f0efed] font-body">
      {/* Top gold bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#b8963e] via-[#f0d060] to-[#b8963e]" />

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
            Admin
          </p>
          <h1 className="font-display text-xl font-bold text-gray-900">
            Új cikk feltöltése
          </h1>
        </div>
        <a
          href="/"
          className="text-xs text-gray-500 hover:text-[#b8963e] transition-colors underline underline-offset-2"
        >
          ← Vissza a főoldalra
        </a>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <StatusBanner status={status} />

        {/* Mobile tab switcher */}
        <div className="flex lg:hidden mb-6 border border-gray-200 rounded-sm overflow-hidden">
          {["form", "preview"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors
                ${
                  activeTab === tab
                    ? "bg-[#d4af37] text-white"
                    : "bg-white text-gray-500 hover:text-gray-800"
                }`}
            >
              {tab === "form" ? "📝 Form" : "👁 Előnézet"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── FORM ── */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className={`lg:col-span-2 space-y-6 ${activeTab === "preview" ? "hidden lg:block" : ""}`}
          >
            {/* Kategória + Dátum */}
            <div className="bg-white rounded-sm border border-gray-100 p-6">
              <h2 className="font-display font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100">
                Alapadatok
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="category" required>
                    Kategória
                  </Label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={set("category")}
                    className="w-full bg-white border border-gray-200 rounded-sm px-4 py-2.5 text-sm
                      text-gray-800 focus:outline-none focus:border-[#d4af37] focus:ring-1
                      focus:ring-[#d4af37]/30 transition-all"
                  >
                    <option value="">Válassz...</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <FieldError msg={errors.category} />
                </div>

                <div>
                  <Label htmlFor="date">Dátum</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={set("date")}
                  />
                </div>
              </div>

              {/* Featured toggle */}
              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.featured}
                  onClick={() =>
                    setForm((p) => ({ ...p, featured: !p.featured }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none
                    focus:ring-2 focus:ring-[#d4af37]/50
                    ${form.featured ? "bg-[#d4af37]" : "bg-gray-200"}`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
                      ${form.featured ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
                <label
                  className="text-sm text-gray-700 cursor-pointer select-none"
                  onClick={() =>
                    setForm((p) => ({ ...p, featured: !p.featured }))
                  }
                >
                  Kiemelt cikk{" "}
                  <span className="text-gray-400 text-xs">
                    (landing page-en featured)
                  </span>
                </label>
              </div>
            </div>

            {/* Cím + alcím */}
            <div className="bg-white rounded-sm border border-gray-100 p-6">
              <h2 className="font-display font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100">
                Cím & Alcím
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" required>
                    Cím
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={form.title}
                    onChange={set("title")}
                    placeholder="pl. A változás nem veszteség"
                    maxLength={120}
                  />
                  <div className="flex justify-between mt-1">
                    <FieldError msg={errors.title} />
                    <span className="text-xs text-gray-300 ml-auto">
                      {form.title.length}/120
                    </span>
                  </div>
                  {form.title && (
                    <p className="mt-1 text-xs text-gray-400">
                      Slug:{" "}
                      <span className="font-mono text-[#b8963e]">
                        /cikk/{slugify(form.title)}
                      </span>
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="subtitle">Alcím</Label>
                  <Input
                    id="subtitle"
                    type="text"
                    value={form.subtitle}
                    onChange={set("subtitle")}
                    placeholder="Rövid kiegészítő mondat"
                    maxLength={200}
                  />
                </div>
              </div>
            </div>

            {/* Kép + Kivonat */}
            <div className="bg-white rounded-sm border border-gray-100 p-6">
              <h2 className="font-display font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100">
                Kép & Kivonat
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="imageUrl">Kép URL</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={form.imageUrl}
                    onChange={set("imageUrl")}
                    placeholder="https://..."
                  />
                  <FieldError msg={errors.imageUrl} />
                  <p className="mt-1 text-xs text-gray-400">
                    Firebase Storage URL vagy külső kép link
                  </p>
                </div>

                <div>
                  <Label htmlFor="excerpt" required>
                    Kivonat
                  </Label>
                  <Textarea
                    id="excerpt"
                    value={form.excerpt}
                    onChange={set("excerpt")}
                    placeholder="Rövid összefoglaló, ami megjelenik a kártyán és a listázó oldalakon..."
                    rows={3}
                    maxLength={300}
                  />
                  <div className="flex justify-between mt-1">
                    <FieldError msg={errors.excerpt} />
                    <span className="text-xs text-gray-300 ml-auto">
                      {form.excerpt.length}/300
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cikk szövege */}
            <div className="bg-white rounded-sm border border-gray-100 p-6">
              <h2 className="font-display font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100">
                Cikk szövege
              </h2>
              <Label htmlFor="article" required>
                Tartalom
              </Label>
              <Textarea
                id="article"
                value={form.article}
                onChange={set("article")}
                placeholder="A teljes cikk szövege ide kerül. Bekezdéseket üres sorral válaszd el."
                rows={14}
              />
              <div className="flex justify-between mt-1">
                <FieldError msg={errors.article} />
                <span className="text-xs text-gray-300 ml-auto">
                  {form.article.length} karakter · ~
                  {Math.ceil(
                    form.article.split(/\s+/).filter(Boolean).length / 200,
                  )}{" "}
                  perc olvasás
                </span>
              </div>
            </div>

            {/* Gombok */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#d4af37] hover:bg-[#b8963e] disabled:opacity-60 disabled:cursor-not-allowed
                  text-white font-semibold text-sm px-8 py-3 rounded-sm transition-colors duration-200
                  flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
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
                    Feltöltés...
                  </>
                ) : (
                  "↑ Feltöltés Firestore-ba"
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="sm:w-auto border border-gray-300 text-gray-600 hover:border-gray-400
                  hover:text-gray-800 font-medium text-sm px-6 py-3 rounded-sm transition-colors"
              >
                Törlés
              </button>
            </div>
          </form>

          {/* ── ELŐNÉZET ── */}
          <aside
            className={`lg:col-span-1 ${activeTab === "form" ? "hidden lg:block" : ""}`}
          >
            <div className="sticky top-6">
              <div className="bg-white rounded-sm border border-gray-100 p-6 min-h-64">
                <h2 className="font-display font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100 text-sm uppercase tracking-wider">
                  Kártya előnézet
                </h2>
                <PreviewCard form={form} />
              </div>

              {/* Firestore struktúra */}
              <div className="mt-4 bg-gray-800 rounded-sm p-4">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
                  Firestore mező struktúra
                </p>
                <pre className="text-xs text-green-400 leading-relaxed overflow-x-auto">
                  {`posts/{auto-id} {
  category: "${form.category || "…"}",
  date: "${form.date}",
  title: "${form.title ? form.title.slice(0, 20) + (form.title.length > 20 ? "…" : "") : "…"}",
  subtitle: "…",
  excerpt: "…",
  imageUrl: "…",
  featured: ${form.featured},
  article: "…",
  slug: "${slugify(form.title) || "…"}",
  createdAt: Timestamp
}`}
                </pre>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AdminpostUpload;
