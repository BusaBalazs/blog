import React, { useState } from "react";
import { doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../../data/firebase";
import { slugify, usePosts } from "../../data/Postcontext";
import Imageuploader from "./Imageuploader";

// ── Konstansok ────────────────────────────────────────────
const CATEGORIES = [
  "Életmód",
  "Egészség",
  "Kapcsolatok",
  "Szépség",
  "Pszichológia",
  "Karrier",
];

// ── Segéd komponensek ─────────────────────────────────────
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

function StatusBanner({ status, onClose }) {
  if (!status) return null;
  const isSuccess = status.type === "success";
  return (
    <div
      className={`flex items-center justify-between gap-3 px-5 py-4 rounded-sm text-sm font-medium mb-6 border
      ${isSuccess ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
    >
      <span className="flex items-center gap-2">
        <span className="text-lg">{isSuccess ? "✓" : "✕"}</span>
        {status.message}
      </span>
      <button
        onClick={onClose}
        className="text-lg leading-none opacity-50 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}

// ── Törlés megerősítő modal ───────────────────────────────
function DeleteConfirmModal({ title, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-sm shadow-xl max-w-sm w-full p-6">
        <p className="text-2xl mb-3">🗑️</p>
        <h3 className="font-display font-bold text-gray-900 text-lg mb-2">
          Biztosan törlöd?
        </h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          <span className="font-semibold text-gray-700">"{title}"</span> — Ez a
          művelet nem vonható vissza.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white
              font-semibold text-sm py-2.5 rounded-sm transition-colors flex items-center justify-center gap-2"
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
                Törlés...
              </>
            ) : (
              "Igen, törlöm"
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 border border-gray-300 text-gray-600 hover:border-gray-400
              font-medium text-sm py-2.5 rounded-sm transition-colors"
          >
            Mégse
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Validáció ─────────────────────────────────────────────
function validate(form) {
  const errors = {};
  if (!form.title?.trim()) errors.title = "A cím kötelező.";
  if (!form.category) errors.category = "Válassz kategóriát.";
  if (!form.excerpt?.trim()) errors.excerpt = "A kivonat kötelező.";
  if (!form.article?.trim()) errors.article = "A cikk szövege kötelező.";
  return errors;
}

function validateVideo(form) {
  const errors = {};
  if (!form.title?.trim()) errors.title = "A cím kötelező.";
  if (!form.category) errors.category = "Válassz kategóriát.";
  if (!form.videoUrl?.trim()) {
    errors.videoUrl = "A YouTube link kötelező.";
  } else if (!/youtube\.com|youtu\.be/.test(form.videoUrl)) {
    errors.videoUrl = "Érvényes YouTube URL-t adj meg.";
  }
  return errors;
}

// ── Cikk lista kártya ─────────────────────────────────────
function PostListItem({ post, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex gap-4 p-4 rounded-sm border transition-all duration-150 group
        ${isSelected ? "border-[#d4af37] bg-[#fdf8ec] shadow-sm" : "border-gray-100 bg-white hover:border-[#d4af37]/50 hover:bg-[#fdf8ec]/50"}`}
    >
      <div className="flex-shrink-0 w-16 h-16 rounded-sm overflow-hidden bg-gray-100">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">
            📄
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-xs text-gray-400">{post.category}</span>
          {post.featured && (
            <span className="text-xs bg-[#d4af37] text-white px-1.5 py-0.5 rounded-sm font-semibold leading-none">
              Kiemelt
            </span>
          )}
        </div>
        <p className="text-sm font-semibold text-gray-800 truncate leading-snug">
          {post.title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{post.excerpt}</p>
      </div>
      <div
        className={`flex-shrink-0 self-center text-gray-300 transition-transform duration-150 ${isSelected ? "text-[#d4af37] translate-x-0.5" : "group-hover:translate-x-0.5"}`}
      >
        ›
      </div>
    </button>
  );
}

// ── Videó lista kártya ────────────────────────────────────
function VideoListItem({ video, isSelected, onClick }) {
  const getThumb = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/,
    );
    return match
      ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`
      : null;
  };
  const thumb = getThumb(video.videoUrl);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex gap-4 p-4 rounded-sm border transition-all duration-150 group
        ${isSelected ? "border-[#d4af37] bg-[#fdf8ec] shadow-sm" : "border-gray-100 bg-white hover:border-[#d4af37]/50 hover:bg-[#fdf8ec]/50"}`}
    >
      <div className="flex-shrink-0 w-16 h-16 rounded-sm overflow-hidden bg-gray-100 flex items-center justify-center">
        {thumb ? (
          <img
            src={thumb}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-2xl">🎬</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs text-gray-400">{video.category}</span>
        <p className="text-sm font-semibold text-gray-800 truncate leading-snug mt-0.5">
          {video.title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{video.date}</p>
      </div>
      <div
        className={`flex-shrink-0 self-center text-gray-300 transition-transform duration-150 ${isSelected ? "text-[#d4af37] translate-x-0.5" : "group-hover:translate-x-0.5"}`}
      >
        ›
      </div>
    </button>
  );
}

// ── YouTube előnézet ──────────────────────────────────────
function YoutubePreview({ url }) {
  if (!url?.trim()) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  if (!match)
    return <p className="text-xs text-red-400 mt-2">Érvénytelen YouTube URL</p>;
  return (
    <div className="mt-3 rounded-sm overflow-hidden aspect-video bg-gray-900">
      <iframe
        src={`https://www.youtube.com/embed/${match[1]}`}
        title="Előnézet"
        className="w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
}

// ── Cikk előnézet ─────────────────────────────────────────
function ArticlePreview({ article }) {
  if (!article?.trim())
    return (
      <p className="text-gray-300 text-xs italic">
        A cikk előnézete itt jelenik meg...
      </p>
    );
  return (
    <div className="space-y-2 text-xs leading-relaxed">
      {article.split("\n").map((line, i) => {
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

// ── Cikk szerkesztő panel ─────────────────────────────────
function EditPanel({ post, onSaved, onDeleted }) {
  const [form, setForm] = useState({ ...post });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [articleTab, setArticleTab] = useState("editor");

  const set = (field) => (e) => {
    const val =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await updateDoc(doc(db, "posts", post.id), {
        category: form.category,
        date: form.date,
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        imageUrl: form.imageUrl?.trim() ?? "",
        featured: form.featured,
        article: form.article.trim(),
        slug: slugify(form.title),
        updatedAt: serverTimestamp(),
      });
      onSaved({
        type: "success",
        message: `"${form.title}" sikeresen frissítve!`,
      });
    } catch (err) {
      onSaved({ type: "error", message: `Hiba: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      if (post.imageUrl) {
        try {
          await deleteObject(ref(storage, post.imageUrl));
        } catch (e) {
          console.warn("Kép törlési hiba:", e);
        }
      }
      await deleteDoc(doc(db, "posts", post.id));
      onSaved({
        type: "success",
        message: `"${post.title}" sikeresen törölve!`,
      });
      onDeleted?.(post.id);
    } catch (err) {
      onSaved({ type: "error", message: `Törlési hiba: ${err.message}` });
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      {showDeleteModal && (
        <DeleteConfirmModal
          title={post.title}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          loading={deleting}
        />
      )}

      <form onSubmit={handleSave} noValidate className="space-y-5">
        {/* Alapadatok */}
        <div className="bg-white rounded-sm border border-gray-100 p-5">
          <h3 className="font-display font-bold text-gray-700 text-sm mb-4 pb-3 border-b border-gray-100 uppercase tracking-wider">
            Alapadatok
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-category" required>
                Kategória
              </Label>
              <select
                id="edit-category"
                value={form.category}
                onChange={set("category")}
                className="w-full bg-white border border-gray-200 rounded-sm px-4 py-2.5 text-sm text-gray-800
                  focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition-all"
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
              <Label htmlFor="edit-date">Dátum</Label>
              <Input
                id="edit-date"
                type="date"
                value={form.date}
                onChange={set("date")}
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={form.featured}
              onClick={() => setForm((p) => ({ ...p, featured: !p.featured }))}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 ${form.featured ? "bg-[#d4af37]" : "bg-gray-200"}`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.featured ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
            <span
              className="text-sm text-gray-700 cursor-pointer select-none"
              onClick={() => setForm((p) => ({ ...p, featured: !p.featured }))}
            >
              Kiemelt cikk
            </span>
          </div>
        </div>

        {/* Cím */}
        <div className="bg-white rounded-sm border border-gray-100 p-5">
          <h3 className="font-display font-bold text-gray-700 text-sm mb-4 pb-3 border-b border-gray-100 uppercase tracking-wider">
            Cím
          </h3>
          <Label htmlFor="edit-title" required>
            Cím
          </Label>
          <Input
            id="edit-title"
            type="text"
            value={form.title}
            onChange={set("title")}
            maxLength={120}
          />
          <div className="flex justify-between mt-1">
            <FieldError msg={errors.title} />
            <span className="text-xs text-gray-300 ml-auto">
              {form.title?.length ?? 0}/120
            </span>
          </div>
        </div>

        {/* Kép & Kivonat */}
        <div className="bg-white rounded-sm border border-gray-100 p-5">
          <h3 className="font-display font-bold text-gray-700 text-sm mb-4 pb-3 border-b border-gray-100 uppercase tracking-wider">
            Kép & Kivonat
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-imageUrl">Kép</Label>
              <Imageuploader
                currentUrl={form.imageUrl || null}
                onUploadDone={(url) =>
                  setForm((prev) => ({ ...prev, imageUrl: url ?? "" }))
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-excerpt" required>
                Kivonat
              </Label>
              <Textarea
                id="edit-excerpt"
                value={form.excerpt}
                onChange={set("excerpt")}
                rows={3}
                maxLength={300}
              />
              <div className="flex justify-between mt-1">
                <FieldError msg={errors.excerpt} />
                <span className="text-xs text-gray-300 ml-auto">
                  {form.excerpt?.length ?? 0}/300
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cikk szövege */}
        <div className="bg-white rounded-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <h3 className="font-display font-bold text-gray-700 text-sm uppercase tracking-wider">
              Cikk szövege
            </h3>
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
                id="edit-article"
                value={form.article}
                onChange={set("article")}
                rows={16}
                className="font-mono text-xs leading-relaxed"
                placeholder={`## Headline szöveg\n\nSima bekezdés...\n\n# Alcím szöveg\n\nTovábbi bekezdés...`}
              />
              <div className="flex justify-between mt-1">
                <FieldError msg={errors.article} />
                <span className="text-xs text-gray-500 ml-auto">
                  {form.article?.length ?? 0} karakter · ~
                  {Math.ceil(
                    (form.article?.split(/\s+/).filter(Boolean).length ?? 0) /
                      200,
                  )}{" "}
                  perc
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
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || deleting}
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
                Mentés...
              </>
            ) : (
              "💾 Változások mentése"
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            disabled={loading || deleting}
            className="bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed
              text-white font-semibold text-sm px-5 py-3 rounded-sm transition-colors"
          >
            🗑️
          </button>
        </div>
      </form>
    </>
  );
}

// ── Videó szerkesztő panel ────────────────────────────────
function VideoEditPanel({ video, onSaved, onDeleted }) {
  const [form, setForm] = useState({ ...video });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validateVideo(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await updateDoc(doc(db, "videos", video.id), {
        category: form.category,
        date: form.date,
        title: form.title.trim(),
        videoUrl: form.videoUrl.trim(),
        updatedAt: serverTimestamp(),
      });
      onSaved({
        type: "success",
        message: `"${form.title}" sikeresen frissítve!`,
      });
    } catch (err) {
      onSaved({ type: "error", message: `Hiba: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "videos", video.id));
      onSaved({
        type: "success",
        message: `"${video.title}" videó sikeresen törölve!`,
      });
      onDeleted?.(video.id);
    } catch (err) {
      onSaved({ type: "error", message: `Törlési hiba: ${err.message}` });
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      {showDeleteModal && (
        <DeleteConfirmModal
          title={video.title}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          loading={deleting}
        />
      )}

      <form onSubmit={handleSave} noValidate className="space-y-5">
        {/* Alapadatok */}
        <div className="bg-white rounded-sm border border-gray-100 p-5">
          <h3 className="font-display font-bold text-gray-700 text-sm mb-4 pb-3 border-b border-gray-100 uppercase tracking-wider">
            Alapadatok
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vid-category" required>
                Kategória
              </Label>
              <select
                id="vid-category"
                value={form.category}
                onChange={set("category")}
                className="w-full bg-white border border-gray-200 rounded-sm px-4 py-2.5 text-sm text-gray-800
                  focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition-all"
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
              <Label htmlFor="vid-date">Dátum</Label>
              <Input
                id="vid-date"
                type="date"
                value={form.date}
                onChange={set("date")}
              />
            </div>
          </div>
        </div>

        {/* Cím */}
        <div className="bg-white rounded-sm border border-gray-100 p-5">
          <h3 className="font-display font-bold text-gray-700 text-sm mb-4 pb-3 border-b border-gray-100 uppercase tracking-wider">
            Cím
          </h3>
          <Label htmlFor="vid-title" required>
            Videó címe
          </Label>
          <Input
            id="vid-title"
            type="text"
            value={form.title}
            onChange={set("title")}
            maxLength={120}
          />
          <div className="flex justify-between mt-1">
            <FieldError msg={errors.title} />
            <span className="text-xs text-gray-300 ml-auto">
              {form.title?.length ?? 0}/120
            </span>
          </div>
        </div>

        {/* YouTube URL */}
        <div className="bg-white rounded-sm border border-gray-100 p-5">
          <h3 className="font-display font-bold text-gray-700 text-sm mb-4 pb-3 border-b border-gray-100 uppercase tracking-wider">
            YouTube link
          </h3>
          <Label htmlFor="vid-url" required>
            YouTube URL
          </Label>
          <Input
            id="vid-url"
            type="url"
            value={form.videoUrl}
            onChange={set("videoUrl")}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <FieldError msg={errors.videoUrl} />
          <p className="text-xs text-gray-400 mt-1">
            Elfogadott: youtube.com/watch?v=... · youtu.be/... ·
            youtube.com/shorts/...
          </p>
          <YoutubePreview url={form.videoUrl} />
        </div>

        {/* Gombok */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || deleting}
            className="flex-1 bg-[#d4af37] hover:bg-[#b8963e] disabled:opacity-60 disabled:cursor-not-allowed
              text-white font-semibold text-sm px-8 py-3 rounded-sm transition-colors
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
                Mentés...
              </>
            ) : (
              "💾 Változások mentése"
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            disabled={loading || deleting}
            className="bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed
              text-white font-semibold text-sm px-5 py-3 rounded-sm transition-colors"
          >
            🗑️
          </button>
        </div>
      </form>
    </>
  );
}

// ── Keresés / szűrő sáv ───────────────────────────────────
function SearchBar({ search, onSearch, categoryFilter, onCategoryFilter }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <input
        type="search"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Keresés cím alapján..."
        className="flex-1 bg-white border border-gray-200 rounded-sm px-4 py-2 text-sm
          focus:outline-none focus:border-[#d4af37] transition-all placeholder:text-gray-300"
      />
      <select
        value={categoryFilter}
        onChange={(e) => onCategoryFilter(e.target.value)}
        className="bg-white border border-gray-200 rounded-sm px-4 py-2 text-sm text-gray-700
          focus:outline-none focus:border-[#d4af37] transition-all"
      >
        <option value="">Minden kategória</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}

//------------------------------------------------------------
const Admineditposts = () => {
  const { posts, videos, loading, error } = usePosts();

  // ── Fő tab: cikkek vagy videók ────────────────────────
  const [mainTab, setMainTab] = useState("posts"); // "posts" | "videos"

  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [status, setStatus] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const selectedPost = posts.find((p) => p.id === selectedPostId) ?? null;
  const selectedVideo = videos.find((v) => v.id === selectedVideoId) ?? null;

  const filteredPosts = posts.filter((p) => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const filteredVideos = videos.filter((v) => {
    const matchSearch = v.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || v.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleTabChange = (tab) => {
    setMainTab(tab);
    setStatus(null);
    setSearch("");
    setCategoryFilter("");
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
            {mainTab === "posts"
              ? "Cikkek szerkesztése"
              : "Videók szerkesztése"}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/admin/new"
            className="text-xs bg-[#d4af37] hover:bg-[#b8963e] text-white font-semibold px-4 py-2 rounded-sm transition-colors"
          >
            + Új tartalom
          </a>
          <a
            href="/"
            className="text-xs text-gray-500 hover:text-[#b8963e] transition-colors underline underline-offset-2"
          >
            ← Főoldal
          </a>
        </div>
      </header>

      {/* Fő tab váltó */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex gap-2 p-1 bg-white border border-gray-100 rounded-sm w-fit">
          {[
            { value: "posts", label: `📝 Cikkek (${posts.length})` },
            { value: "videos", label: `🎬 Videók (${videos.length})` },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`px-5 py-2 text-sm font-semibold rounded-sm transition-all duration-200
                ${mainTab === tab.value ? "bg-[#d4af37] text-white shadow-sm" : "text-gray-500 hover:text-[#b8963e]"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <StatusBanner status={status} onClose={() => setStatus(null)} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ── BAL: Lista ── */}
          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <SearchBar
                search={search}
                onSearch={setSearch}
                categoryFilter={categoryFilter}
                onCategoryFilter={setCategoryFilter}
              />

              <p className="text-xs text-gray-400 mb-3">
                {mainTab === "posts"
                  ? filteredPosts.length
                  : filteredVideos.length}{" "}
                elem
                {categoryFilter && ` · ${categoryFilter}`}
                {search && ` · "${search}"`}
              </p>

              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
                {loading && (
                  <div className="text-center py-12 text-gray-400 text-sm">
                    Betöltés...
                  </div>
                )}
                {error && (
                  <div className="text-center py-12 text-red-400 text-sm">
                    Hiba: {error}
                  </div>
                )}

                {/* Cikkek listája */}
                {mainTab === "posts" &&
                  !loading &&
                  (filteredPosts.length === 0 ? (
                    <div className="text-center py-12 text-gray-300 text-sm">
                      Nincs találat
                    </div>
                  ) : (
                    filteredPosts.map((post) => (
                      <PostListItem
                        key={post.id}
                        post={post}
                        isSelected={post.id === selectedPostId}
                        onClick={() => {
                          setSelectedPostId(post.id);
                          setStatus(null);
                        }}
                      />
                    ))
                  ))}

                {/* Videók listája */}
                {mainTab === "videos" &&
                  !loading &&
                  (filteredVideos.length === 0 ? (
                    <div className="text-center py-12 text-gray-300 text-sm">
                      Nincs találat
                    </div>
                  ) : (
                    filteredVideos.map((video) => (
                      <VideoListItem
                        key={video.id}
                        video={video}
                        isSelected={video.id === selectedVideoId}
                        onClick={() => {
                          setSelectedVideoId(video.id);
                          setStatus(null);
                        }}
                      />
                    ))
                  ))}
              </div>
            </div>
          </div>

          {/* ── JOBB: Szerkesztő ── */}
          <div className="lg:col-span-3">
            {/* Cikk szerkesztő */}
            {mainTab === "posts" &&
              (!selectedPost ? (
                <div className="bg-white rounded-sm border border-gray-100 h-64 flex flex-col items-center justify-center text-center px-8">
                  <span className="text-4xl mb-3">←</span>
                  <p className="text-gray-400 text-sm">
                    Válassz ki egy cikket a listából a szerkesztéshez
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest">
                        Szerkesztés
                      </p>
                      <h2 className="font-display font-bold text-gray-800 text-lg leading-tight truncate max-w-xs">
                        {selectedPost.title}
                      </h2>
                    </div>
                    <span className="text-xs font-mono text-gray-300 hidden sm:block">
                      {selectedPost.id}
                    </span>
                  </div>
                  <EditPanel
                    key={selectedPostId}
                    post={selectedPost}
                    onSaved={(s) => {
                      setStatus(s);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onDeleted={() => {
                      setSelectedPostId(null);
                    }}
                  />
                </div>
              ))}

            {/* Videó szerkesztő */}
            {mainTab === "videos" &&
              (!selectedVideo ? (
                <div className="bg-white rounded-sm border border-gray-100 h-64 flex flex-col items-center justify-center text-center px-8">
                  <span className="text-4xl mb-3">←</span>
                  <p className="text-gray-400 text-sm">
                    Válassz ki egy videót a listából a szerkesztéshez
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest">
                        Videó szerkesztése
                      </p>
                      <h2 className="font-display font-bold text-gray-800 text-lg leading-tight truncate max-w-xs">
                        {selectedVideo.title}
                      </h2>
                    </div>
                    <span className="text-xs font-mono text-gray-300 hidden sm:block">
                      {selectedVideo.id}
                    </span>
                  </div>
                  <VideoEditPanel
                    key={selectedVideoId}
                    video={selectedVideo}
                    onSaved={(s) => {
                      setStatus(s);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onDeleted={() => {
                      setSelectedVideoId(null);
                    }}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admineditposts;
