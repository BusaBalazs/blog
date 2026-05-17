import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../data/firebase";
import { slugify } from "../../data/Postcontext";
import Imageuploader from "./Imageuploader";

const EMPTY_FORM = {
  category: "",
  date: new Date().toISOString().split("T")[0],
  title: "",
  excerpt: "",
  imageUrl: "",
  featured: false,
  article: "",
};

const EMPTY_VIDEO_FORM = {
  category: "",
  date: new Date().toISOString().split("T")[0],
  title: "",
  videoUrl: "",
};

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
      ${isSuccess ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
    >
      <span className="text-lg">{isSuccess ? "✓" : "✕"}</span>
      {status.message}
    </div>
  );
}

function ArticlePreview({ article }) {
  if (!article?.trim())
    return (
      <p className="text-gray-300 text-xs italic">
        A cikk előnézete itt jelenik meg...
      </p>
    );
  const lines = article.split("\n");
  return (
    <div className="space-y-2 text-xs leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith("## "))
          return (
            <p
              key={i}
              className="font-display font-bold text-gray-900 text-sm pt-2"
            >
              {line.replace(/^## /, "")}
            </p>
          );
        if (line.startsWith("# "))
          return (
            <p key={i} className="font-medium text-[#b8963e] pt-1">
              {line.replace(/^# /, "")}
            </p>
          );
        if (line.trim() === "") return <div key={i} className="h-1" />;
        return (
          <p key={i} className="text-gray-600">
            {line}
          </p>
        );
      })}
    </div>
  );
}

function PreviewCard({ form }) {
  const hasContent = form.title || form.imageUrl || form.excerpt;
  if (!hasContent)
    return (
      <div className="h-full flex items-center justify-center text-gray-300 text-sm italic">
        Az előnézet itt jelenik meg...
      </div>
    );
  return (
    <article className="font-body">
      {form.imageUrl && (
        <div className="overflow-hidden rounded-sm mb-4 border-b-2 border-[#d4af37] aspect-[510/390]">
          <img
            src={form.imageUrl}
            alt={form.title}
            className="w-full h-full object-cover"
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
      {form.excerpt && (
        <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
          {form.excerpt}
        </p>
      )}
    </article>
  );
}

function YoutubePreview({ url }) {
  if (!url?.trim()) return null;
  const getYoutubeId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };
  const videoId = getYoutubeId(url);
  if (!videoId)
    return (
      <p className="text-xs text-red-400 mt-2">
        Érvénytelen YouTube URL — pl. https://www.youtube.com/watch?v=xxxxx
      </p>
    );
  return (
    <div className="mt-3 rounded-sm overflow-hidden aspect-video bg-gray-900">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube videó előnézet"
        className="w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
}

function validate(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "A cím kötelező.";
  if (!form.category) errors.category = "Válassz kategóriát.";
  if (!form.excerpt.trim()) errors.excerpt = "A kivonat kötelező.";
  if (!form.article.trim()) errors.article = "A cikk szövege kötelező.";
  return errors;
}

function validateVideo(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "A cím kötelező.";
  if (!form.category) errors.category = "Válassz kategóriát.";
  if (!form.videoUrl.trim()) {
    errors.videoUrl = "A YouTube link kötelező.";
  } else if (!/youtube\.com|youtu\.be/.test(form.videoUrl)) {
    errors.videoUrl = "Érvényes YouTube URL-t adj meg.";
  }
  return errors;
}

const AdminpostUpload = () => {
  const [mainTab, setMainTab] = useState("article");

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [articleTab, setArticleTab] = useState("editor");

  const [videoForm, setVideoForm] = useState(EMPTY_VIDEO_FORM);
  const [videoErrors, setVideoErrors] = useState({});
  const [videoStatus, setVideoStatus] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);

  const set = (field) => (e) => {
    const val =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const setVideo = (field) => (e) => {
    setVideoForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (videoErrors[field])
      setVideoErrors((prev) => ({ ...prev, [field]: undefined }));
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
        excerpt: form.excerpt.trim(),
        imageUrl: form.imageUrl.trim(),
        featured: form.featured,
        article: form.article.trim(),
        createdAt: serverTimestamp(),
      });
      setStatus({
        type: "success",
        message: `Cikk sikeresen feltöltve! (ID: ${docRef.id})`,
      });
      setForm(EMPTY_FORM);
      setErrors({});
    } catch (err) {
      setStatus({
        type: "error",
        message: `Hiba a feltöltés során: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    const errs = validateVideo(videoForm);
    if (Object.keys(errs).length) {
      setVideoErrors(errs);
      return;
    }
    setVideoLoading(true);
    setVideoStatus(null);
    try {
      const docRef = await addDoc(collection(db, "videos"), {
        category: videoForm.category,
        date: videoForm.date,
        title: videoForm.title.trim(),
        videoUrl: videoForm.videoUrl.trim(),
        createdAt: serverTimestamp(),
      });
      setVideoStatus({
        type: "success",
        message: `Videó sikeresen feltöltve! (ID: ${docRef.id})`,
      });
      setVideoForm(EMPTY_VIDEO_FORM);
      setVideoErrors({});
    } catch (err) {
      setVideoStatus({
        type: "error",
        message: `Hiba a feltöltés során: ${err.message}`,
      });
    } finally {
      setVideoLoading(false);
    }
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setStatus(null);
  };
  const handleVideoReset = () => {
    setVideoForm(EMPTY_VIDEO_FORM);
    setVideoErrors({});
    setVideoStatus(null);
  };

  return (
    <div className="min-h-screen bg-[#f0efed] font-body">
      <div className="h-1 w-full bg-gradient-to-r from-[#b8963e] via-[#f0d060] to-[#b8963e]" />

      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
            Admin
          </p>
          <h1 className="font-display text-xl font-bold text-gray-900">
            {mainTab === "article"
              ? "Új cikk feltöltése"
              : "Új videó feltöltése"}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="text-xs text-gray-500 hover:text-[#b8963e] transition-colors underline underline-offset-2"
          >
            ← Ugrás a blogra
          </a>
          <a
            href="/admin"
            className="text-xs text-gray-500 hover:text-[#b8963e] transition-colors underline underline-offset-2"
          >
            ← Vissza
          </a>
        </div>
      </header>

      {/* Fő tab váltó */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex gap-2 p-1 bg-white border border-gray-100 rounded-sm w-fit">
          {[
            { value: "article", label: "📝 Cikk feltöltése" },
            { value: "video", label: "🎬 Videó feltöltése" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setMainTab(tab.value)}
              className={`px-6 py-2.5 text-sm font-semibold rounded-sm transition-all duration-200
                ${mainTab === tab.value ? "bg-[#d4af37] text-white shadow-sm" : "text-gray-500 hover:text-[#b8963e]"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* CIKK */}
        {mainTab === "article" && (
          <>
            <StatusBanner status={status} />
            <div className="flex lg:hidden mb-6 border border-gray-200 rounded-sm overflow-hidden">
              {["form", "preview"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors
                    ${activeTab === tab ? "bg-[#d4af37] text-white" : "bg-white text-gray-500 hover:text-gray-800"}`}
                >
                  {tab === "form" ? "📝 Form" : "👁 Előnézet"}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <form
                onSubmit={handleSubmit}
                noValidate
                className={`lg:col-span-2 space-y-6 ${activeTab === "preview" ? "hidden lg:block" : ""}`}
              >
                {/* Alapadatok */}
                <div className="bg-white rounded-sm border border-gray-100 p-6">
                  <h2 className="font-display font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100">
                    Alapadatok
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="category" required>
                        Kategória
                      </Label>
                      <input
                        id="category"
                        value={form.category}
                        onChange={set("category")}
                        className="w-full bg-white border border-gray-200 rounded-sm px-4 py-2.5 text-sm
                          text-gray-800 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition-all"
                      />
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
                  <div className="mt-5 flex items-center gap-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={form.featured}
                      onClick={() =>
                        setForm((p) => ({ ...p, featured: !p.featured }))
                      }
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 ${form.featured ? "bg-[#d4af37]" : "bg-gray-200"}`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.featured ? "translate-x-5" : "translate-x-0"}`}
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

                {/* Cím */}
                <div className="bg-white rounded-sm border border-gray-100 p-6">
                  <h2 className="font-display font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100">
                    Cím
                  </h2>
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
                </div>

                {/* Kép + Kivonat */}
                <div className="bg-white rounded-sm border border-gray-100 p-6">
                  <h2 className="font-display font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100">
                    Kép & Kivonat
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="imageUrl">Kép</Label>
                      <Imageuploader
                        currentUrl={form.imageUrl || null}
                        onUploadDone={(url) =>
                          setForm((prev) => ({ ...prev, imageUrl: url ?? "" }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="excerpt" required>
                        Kivonat
                      </Label>
                      <Textarea
                        id="excerpt"
                        value={form.excerpt}
                        onChange={set("excerpt")}
                        placeholder="Rövid összefoglaló..."
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
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                    <h2 className="font-display font-bold text-gray-800">
                      Cikk szövege
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                        ## szöveg
                      </span>
                      <span>= Headline</span>
                      <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                        # szöveg
                      </span>
                      <span>= Alcím</span>
                    </div>
                  </div>
                  <div className="flex border border-gray-200 rounded-sm overflow-hidden mb-3 w-fit">
                    {["editor", "preview"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setArticleTab(t)}
                        className={`px-4 py-1.5 text-xs font-medium transition-colors ${articleTab === t ? "bg-[#d4af37] text-white" : "bg-white text-gray-500 hover:text-gray-700"}`}
                      >
                        {t === "editor" ? "✏️ Szerkesztő" : "👁 Előnézet"}
                      </button>
                    ))}
                  </div>
                  {articleTab === "editor" ? (
                    <>
                      <Textarea
                        id="article"
                        value={form.article}
                        onChange={set("article")}
                        placeholder={`## Ez egy headline (vastag fejléc)\n\nSima bekezdés szövege üres sorral elválasztva.\n\n# Ez egy alcím (arany, kisebb)\n\nTovábbi bekezdés szövege...`}
                        rows={16}
                        className="font-mono text-xs leading-relaxed"
                      />
                      <div className="flex justify-between mt-1">
                        <FieldError msg={errors.article} />
                        <span className="text-xs text-gray-500 ml-auto">
                          {form.article.length} karakter · ~
                          {Math.ceil(
                            form.article.split(/\s+/).filter(Boolean).length /
                              200,
                          )}{" "}
                          perc olvasás
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="min-h-48 border border-gray-100 rounded-sm p-4 bg-[#fafaf9]">
                      <ArticlePreview article={form.article} />
                    </div>
                  )}
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
                    className="sm:w-auto border border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800 font-medium text-sm px-6 py-3 rounded-sm transition-colors"
                  >
                    Törlés
                  </button>
                </div>
              </form>

              {/* Előnézet */}
              <aside
                className={`lg:col-span-1 ${activeTab === "form" ? "hidden lg:block" : ""}`}
              >
                <div className="sticky top-6 space-y-4">
                  <div className="bg-white rounded-sm border border-gray-100 p-6 min-h-64">
                    <h2 className="font-display font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100 text-sm uppercase tracking-wider">
                      Kártya előnézet
                    </h2>
                    <PreviewCard form={form} />
                  </div>
                  <div className="bg-white rounded-sm border border-gray-100 p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                      Szintaxis referencia
                    </p>
                    <div className="space-y-2 text-xs">
                      {[
                        { code: "## szöveg", desc: "Headline (vastag fejléc)" },
                        { code: "# szöveg", desc: "Alcím" },
                        { code: "üres sor", desc: "új bekezdés" },
                        { code: "sima szöveg", desc: "normál bekezdés" },
                      ].map((item) => (
                        <div key={item.code} className="flex gap-2 items-start">
                          <code className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 shrink-0">
                            {item.code}
                          </code>
                          <span className="text-gray-500">→ {item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}

        {/* VIDEÓ */}
        {mainTab === "video" && (
          <>
            <StatusBanner status={videoStatus} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <form
                onSubmit={handleVideoSubmit}
                noValidate
                className="lg:col-span-2 space-y-6"
              >
                {/* Alapadatok */}
                <div className="bg-white rounded-sm border border-gray-100 p-6">
                  <h2 className="font-display font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100">
                    Alapadatok
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="video-category" required>
                        Kategória
                      </Label>
                      <input
                        id="video-category"
                        value={videoForm.category}
                        onChange={setVideo("category")}
                        className="w-full bg-white border border-gray-200 rounded-sm px-4 py-2.5 text-sm
                          text-gray-800 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition-all"
                      />
                      <FieldError msg={videoErrors.category} />
                    </div>
                    <div>
                      <Label htmlFor="video-date">Dátum</Label>
                      <Input
                        id="video-date"
                        type="date"
                        value={videoForm.date}
                        onChange={setVideo("date")}
                      />
                    </div>
                  </div>
                </div>

                {/* Cím */}
                <div className="bg-white rounded-sm border border-gray-100 p-6">
                  <h2 className="font-display font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100">
                    Cím
                  </h2>
                  <Label htmlFor="video-title" required>
                    Videó címe
                  </Label>
                  <Input
                    id="video-title"
                    type="text"
                    value={videoForm.title}
                    onChange={setVideo("title")}
                    placeholder="pl. Változókor – mit érdemes tudni"
                    maxLength={120}
                  />
                  <div className="flex justify-between mt-1">
                    <FieldError msg={videoErrors.title} />
                    <span className="text-xs text-gray-300 ml-auto">
                      {videoForm.title.length}/120
                    </span>
                  </div>
                </div>

                {/* YouTube link */}
                <div className="bg-white rounded-sm border border-gray-100 p-6">
                  <h2 className="font-display font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100">
                    YouTube link
                  </h2>
                  <Label htmlFor="video-url" required>
                    YouTube URL
                  </Label>
                  <Input
                    id="video-url"
                    type="url"
                    value={videoForm.videoUrl}
                    onChange={setVideo("videoUrl")}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <FieldError msg={videoErrors.videoUrl} />
                  <p className="text-xs text-gray-400 mt-1">
                    Elfogadott formátumok: youtube.com/watch?v=... ·
                    youtu.be/... · youtube.com/shorts/...
                  </p>
                  <YoutubePreview url={videoForm.videoUrl} />
                </div>

                {/* Gombok */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={videoLoading}
                    className="flex-1 bg-[#d4af37] hover:bg-[#b8963e] disabled:opacity-60 disabled:cursor-not-allowed
                      text-white font-semibold text-sm px-8 py-3 rounded-sm transition-colors duration-200
                      flex items-center justify-center gap-2"
                  >
                    {videoLoading ? (
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
                      "↑ Videó feltöltése Firestore-ba"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleVideoReset}
                    className="sm:w-auto border border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800 font-medium text-sm px-6 py-3 rounded-sm transition-colors"
                  >
                    Törlés
                  </button>
                </div>
              </form>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminpostUpload;
