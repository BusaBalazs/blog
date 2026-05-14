/**
 * AdminNewsletter.jsx
 * ─────────────────────────────────────────────────────────
 * Hírlevél összeállítás és küldés Brevo API-n keresztül.
 *
 * .env változók:
 *   VITE_BREVO_API_KEY=xkeysib-...
 *   VITE_BREVO_LIST_ID=3
 *   VITE_BREVO_TEMPLATE_ID=2      ← a Brevo-ban feltöltött newsletter sablon ID-ja
 *   VITE_SITE_URL=https://valtozakor.hu
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../../data/Postcontext";

// ── Konstansok ────────────────────────────────────────────
const BREVO_API = "https://api.brevo.com/v3/emailCampaigns";
const BREVO_SEND_API = "https://api.brevo.com/v3/emailCampaigns/{id}/sendNow";

// ── Segéd komponensek ─────────────────────────────────────
function Label({ children, required }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
      {children}
      {required && <span className="text-[#d4af37] ml-1">*</span>}
    </label>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full bg-white border border-gray-200 rounded-sm px-4 py-2.5 text-sm
        text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[#d4af37]
        focus:ring-1 focus:ring-[#d4af37]/30 transition-all ${className}`}
      {...props}
    />
  );
}

function StatusBanner({ status, onClose }) {
  if (!status) return null;
  const isSuccess = status.type === "success";
  return (
    <div className={`flex items-center justify-between gap-3 px-5 py-4 rounded-sm text-sm
      font-medium mb-6 border ${isSuccess
        ? "bg-green-50 border-green-200 text-green-800"
        : "bg-red-50 border-red-200 text-red-800"}`}>
      <span className="flex items-center gap-2">
        <span className="text-lg">{isSuccess ? "✓" : "✕"}</span>
        {status.message}
      </span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg">×</button>
    </div>
  );
}

// ── Cikk kártya választó ──────────────────────────────────
function PostPicker({ label, value, onChange, posts }) {
  const selected = posts.find((p) => p.id === value);

  return (
    <div>
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-gray-200 rounded-sm px-4 py-2.5 text-sm
          text-gray-800 focus:outline-none focus:border-[#d4af37] transition-all"
      >
        <option value="">— Válassz cikket —</option>
        {posts.map((p) => (
          <option key={p.id} value={p.id}>
            {p.title} ({p.category} · {p.date})
          </option>
        ))}
      </select>

      {/* Mini előnézet */}
      {selected && (
        <div className="mt-2 flex gap-3 p-3 bg-[#fdf8ec] border border-[#d4af37]/20 rounded-sm">
          {selected.imageUrl && (
            <img
              src={selected.imageUrl}
              alt={selected.title}
              className="w-16 h-12 object-cover rounded-sm flex-shrink-0"
            />
          )}
          <div className="min-w-0">
            <p className="text-xs text-[#b8963e] font-medium">{selected.category} · {selected.date}</p>
            <p className="text-sm font-semibold text-gray-800 truncate">{selected.title}</p>
            <p className="text-xs text-gray-500 truncate">{selected.excerpt}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Brevo HTML email összeállítása ────────────────────────
// Szöveg renderelő: ## = nagy fekete fejléc, sima sor = bekezdés
function renderCustomTextHtml(text) {
  if (!text?.trim()) return "";
  const lines = text.split("\n");
  const blocks = [];
  let currentParagraph = [];

  lines.forEach((line) => {
    if (line.startsWith("## ")) {
      if (currentParagraph.length) {
        blocks.push(`<p style="font-size:15px;color:#374151;line-height:1.8;margin:0 0 16px;font-family:Georgia,serif;">${currentParagraph.join("<br/>")}</p>`);
        currentParagraph = [];
      }
      blocks.push(`<h2 style="font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#1a1a1a;margin:0 0 12px;line-height:1.3;">${line.replace(/^## /, "")}</h2>`);
    } else if (line.trim() === "") {
      if (currentParagraph.length) {
        blocks.push(`<p style="font-size:15px;color:#374151;line-height:1.8;margin:0 0 16px;font-family:Georgia,serif;">${currentParagraph.join("<br/>")}</p>`);
        currentParagraph = [];
      }
    } else {
      currentParagraph.push(line);
    }
  });

  if (currentParagraph.length) {
    blocks.push(`<p style="font-size:15px;color:#374151;line-height:1.8;margin:0 0 16px;font-family:Georgia,serif;">${currentParagraph.join("<br/>")}</p>`);
  }

  return blocks.join("\n");
}

function buildEmailHtml({ subject, preheader, featured, post1, post2, customText, featuredMode, siteUrl }) {
  const postRow = (post) => {
    if (!post) return "";
    return `
      <tr>
        <td style="padding: 0 40px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="130" style="vertical-align:top; padding-right:16px;">
                <a href="${siteUrl}/article/${post.id}">
                  <img src="${post.imageUrl || ""}" alt="${post.title}"
                    width="130" style="width:130px;height:90px;object-fit:cover;display:block;" />
                </a>
              </td>
              <td style="vertical-align:top;">
                <p style="font-size:10px;color:#9ca3af;margin:0 0 6px;font-family:Georgia,serif;">
                  ${post.category} &nbsp;|&nbsp; ${post.date}
                </p>
                <h3 style="font-family:Georgia,serif;font-size:16px;font-weight:bold;color:#1a1a1a;margin:0 0 6px;">
                  <a href="${siteUrl}/article/${post.id}" style="text-decoration:none;color:#1a1a1a;">
                    ${post.title}
                  </a>
                </h3>
                <p style="font-size:12px;color:#6b7280;line-height:1.6;margin:0;font-family:Georgia,serif;">
                  ${post.excerpt || ""}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
  };

  return `<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${subject}</title>
  <style>
    body{background:#f0efed;font-family:Georgia,'Times New Roman',serif;margin:0;padding:0;}
    img{border:0;display:block;max-width:100%;}
    a{color:inherit;}
    table{border-collapse:collapse;}
    @media only screen and (max-width:600px){
      .email-wrapper{width:100%!important;}
      .content-cell{padding:24px 20px!important;}
    }
  </style>
</head>
<body>
  <div style="display:none;max-height:0;overflow:hidden;">${preheader}&zwnj;&nbsp;&zwnj;&nbsp;</div>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:20px 12px 40px;">
        <table class="email-wrapper" width="600" cellpadding="0" cellspacing="0"
          style="max-width:600px;width:100%;background:#ffffff;">

          <!-- Gold bar -->
          <tr>
            <td style="height:4px;background:linear-gradient(to right,#b8963e,#f0d060,#d4af37,#f0d060,#b8963e);line-height:4px;font-size:4px;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="background:#ffffff;padding:28px 40px 24px;border-bottom:1px solid #f0eeeb;">
              <a href="${siteUrl}" style="text-decoration:none;">
                <span style="font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#1a1a1a;">
                  Változó Kor
                </span>
              </a>
            </td>
          </tr>

          ${featuredMode === "text" && customText ? `
          <!-- Egyéni szöveg blokk -->
          <tr>
            <td class="content-cell" style="padding:36px 40px;border-bottom:2px solid #d4af37;">
              ${renderCustomTextHtml(customText)}
            </td>
          </tr>` : featured ? `
          <!-- Hero cikk -->
          <tr>
            <td>
              <a href="${siteUrl}/article/${featured.id}">
                <img src="${featured.imageUrl || ""}" alt="${featured.title}"
                  width="600" style="width:100%;height:280px;object-fit:cover;display:block;"/>
              </a>
            </td>
          </tr>
          <tr>
            <td class="content-cell" style="padding:28px 40px 32px;border-bottom:2px solid #d4af37;">
              <p style="font-size:11px;color:#9ca3af;margin:0 0 10px;font-family:Georgia,serif;">
                ${featured.category} &nbsp;|&nbsp; ${featured.date}
              </p>
              <h2 style="font-family:Georgia,serif;font-size:26px;font-weight:bold;color:#1a1a1a;line-height:1.3;margin:0 0 14px;">
                <a href="${siteUrl}/article/${featured.id}" style="text-decoration:none;color:#1a1a1a;">
                  ${featured.title}
                </a>
              </h2>
              <p style="font-size:14px;color:#6b7280;line-height:1.7;margin:0 0 20px;font-family:Georgia,serif;">
                ${featured.excerpt || ""}
              </p>
              <a href="${siteUrl}/article/${featured.id}"
                style="display:inline-block;background:#d4af37;color:#ffffff;font-family:Georgia,serif;
                  font-size:13px;font-weight:bold;padding:11px 24px;text-decoration:none;">
                Olvasd el →
              </a>
            </td>
          </tr>` : ""}

          ${(post1 || post2) ? `
          <!-- Szekció cím -->
          <tr>
            <td style="padding:32px 40px 16px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#b8963e;padding:8px 16px;">
                    <span style="font-family:Georgia,serif;font-size:14px;font-weight:bold;color:#ffffff;">
                      Legfrissebb bejegyzések
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${postRow(post1)}
          ${post1 && post2 ? `<tr><td style="padding:0 40px;"><div style="height:1px;background:#f0eeeb;"></div></td></tr>` : ""}
          ${postRow(post2)}` : ""}

          <!-- CTA sáv -->
          <tr>
            <td style="background:#f8f7f5;padding:28px 40px;text-align:center;border-top:1px solid #f0eeeb;">
              <p style="font-size:13px;color:#6b7280;font-family:Georgia,serif;margin:0 0 14px;">
                Olvasd el az összes friss bejegyzést az oldalunkon!
              </p>
              <a href="${siteUrl}"
                style="display:inline-block;border:1.5px solid #1a1a1a;color:#1a1a1a;
                  font-family:Georgia,serif;font-size:13px;font-weight:bold;
                  padding:10px 24px;text-decoration:none;">
                Látogass el az oldalra
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#3a3a3a;padding:28px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <span style="font-family:Georgia,serif;font-size:16px;font-weight:bold;color:#ffffff;display:block;margin-bottom:4px;">
                      Változó Kor
                    </span>
                    <span style="font-size:10px;color:#9ca3af;font-family:Georgia,serif;">
                      2026 Minden jog fenntartva
                    </span>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <a href="{{unsubscribe}}"
                      style="font-size:10px;color:#9ca3af;font-family:Georgia,serif;text-decoration:underline;">
                      Leiratkozás
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Fő komponens ──────────────────────────────────────────
export default function AdminNewsletter() {
  const navigate = useNavigate();
  const { posts, loading } = usePosts();

  const [form, setForm] = useState({
    subject: "",
    preheader: "",
    featuredMode: "post", // "post" | "text"
    featuredId: "",
    customText: "",
    post1Id: "",
    post2Id: "",
  });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);
  const [preview, setPreview] = useState(false);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const featured = posts.find((p) => p.id === form.featuredId) || null;
  const post1    = posts.find((p) => p.id === form.post1Id) || null;
  const post2    = posts.find((p) => p.id === form.post2Id) || null;

  const siteUrl = import.meta.env.VITE_SITE_URL || "https://valtozakor.hu";
  const listId  = Number(import.meta.env.VITE_BREVO_LIST_ID);
  const apiKey  = import.meta.env.VITE_BREVO_API_KEY;

  const htmlContent = buildEmailHtml({
    subject: form.subject || "Változó Kor Hírlevél",
    preheader: form.preheader,
    featuredMode: form.featuredMode,
    featured,
    customText: form.customText,
    post1,
    post2,
    siteUrl,
  });

  const handleSend = async () => {
    if (!form.subject.trim()) {
      setStatus({ type: "error", message: "A tárgysor kitöltése kötelező." });
      return;
    }
    if (form.featuredMode === "post" && !featured) {
      setStatus({ type: "error", message: "Legalább a kiemelt cikket válaszd ki." });
      return;
    }
    if (form.featuredMode === "text" && !form.customText.trim()) {
      setStatus({ type: "error", message: "Az egyéni szöveg mező nem lehet üres." });
      return;
    }

    setSending(true);
    setStatus(null);

    try {
      // 1. Kampány létrehozása
      const createRes = await fetch(BREVO_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          name: `${form.subject} — ${new Date().toLocaleDateString("hu-HU")}`,
          subject: form.subject,
          sender: { name: "Változó Kor", email: import.meta.env.VITE_BREVO_SENDER_EMAIL || "info@valtozakor.hu" },
          type: "classic",
          htmlContent,
          recipients: { listIds: [listId] },
        }),
      });

      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err.message || "Kampány létrehozási hiba.");
      }

      const { id: campaignId } = await createRes.json();

      // 2. Azonnali küldés
      const sendRes = await fetch(
        BREVO_SEND_API.replace("{id}", campaignId),
        {
          method: "POST",
          headers: { "api-key": apiKey },
        }
      );

      if (!sendRes.ok) {
        const err = await sendRes.json().catch(() => ({}));
        throw new Error(err.message || "Küldési hiba.");
      }

      setStatus({
        type: "success",
        message: `Hírlevél sikeresen elküldve! (Kampány ID: ${campaignId})`,
      });
      setForm({ subject: "", preheader: "", featuredMode: "post", featuredId: "", customText: "", post1Id: "", post2Id: "" });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: err.message });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0efed] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Betöltés...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0efed] font-body">
      {/* Gold bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#b8963e] via-[#f0d060] to-[#b8963e]" />

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Admin</p>
          <h1 className="font-display text-xl font-bold text-gray-900">Hírlevél küldése</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin")}
            className="text-xs text-gray-500 hover:text-[#b8963e] transition-colors underline underline-offset-2"
          >
            ← Admin főoldal
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <StatusBanner status={status} onClose={() => setStatus(null)} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── BAL: FORM ── */}
          <div className="space-y-5">

            {/* Tárgy */}
            <div className="bg-white border border-gray-100 rounded-sm p-6">
              <h2 className="font-display font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100">
                Email alapadatok
              </h2>
              <div className="space-y-4">
                <div>
                  <Label required>Tárgysor</Label>
                  <Input
                    value={form.subject}
                    onChange={set("subject")}
                    placeholder="pl. Új cikkek a Változó Koron – május"
                    maxLength={150}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Ez jelenik meg az email tárgymezőjében.
                  </p>
                </div>
                <div>
                  <Label>Előnézet szöveg</Label>
                  <Input
                    value={form.preheader}
                    onChange={set("preheader")}
                    placeholder="pl. Ebben a hónapban ezekről írtunk..."
                    maxLength={150}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Az inbox-ban a tárgy mellett megjelenő kis szöveg.
                  </p>
                </div>
              </div>
            </div>

            {/* Kiemelt tartalom */}
            <div className="bg-white border border-gray-100 rounded-sm p-6">
              <h2 className="font-display font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100">
                Kiemelt tartalom
              </h2>

              {/* Toggle */}
              <div className="flex gap-2 mb-5">
                {[
                  { value: "post", label: "📰 Cikk" },
                  { value: "text", label: "✍️ Egyéni szöveg" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, featuredMode: opt.value }))}
                    className={`flex-1 py-2 text-sm font-medium rounded-sm border transition-all duration-200
                      ${form.featuredMode === opt.value
                        ? "bg-[#d4af37] border-[#d4af37] text-white"
                        : "bg-white border-gray-200 text-gray-500 hover:border-[#d4af37] hover:text-[#b8963e]"
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Cikk mód */}
              {form.featuredMode === "post" && (
                <PostPicker
                  label="⭐ Kiemelt cikk (kötelező)"
                  value={form.featuredId}
                  onChange={(v) => setForm((p) => ({ ...p, featuredId: v }))}
                  posts={posts}
                />
              )}

              {/* Egyéni szöveg mód */}
              {form.featuredMode === "text" && (
                <div>
                  <Label required>Szöveg</Label>
                  <textarea
                    value={form.customText}
                    onChange={set("customText")}
                    rows={8}
                    placeholder={"## Ez egy nagyobb fejléc\n\nEz egy sima bekezdés szövege. A ## jellel kezdődő sorok nagyobb, félkövér fekete betűkkel jelennek meg az emailben.\n\nTovábbi bekezdés..."}
                    className="w-full bg-white border border-gray-200 rounded-sm px-4 py-3 text-sm
                      font-mono text-gray-800 placeholder:text-gray-300 focus:outline-none
                      focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30
                      transition-all resize-none leading-relaxed"
                  />
                  <div className="flex items-start gap-4 mt-2">
                    <p className="text-xs text-gray-400">
                      <span className="font-mono bg-gray-100 px-1 rounded">## szöveg</span>
                      {" "}→ nagy fekete fejléc &nbsp;·&nbsp;
                      üres sor → új bekezdés
                    </p>
                    <span className="text-xs text-gray-300 ml-auto flex-shrink-0">
                      {form.customText.length} karakter
                    </span>
                  </div>

                  {/* Szöveg előnézet */}
                  {form.customText && (
                    <div className="mt-3 p-4 bg-[#fdf8ec] border border-[#d4af37]/20 rounded-sm space-y-2">
                      <p className="text-xs text-[#b8963e] font-semibold uppercase tracking-wider mb-3">
                        Szöveg előnézet
                      </p>
                      {form.customText.split("\n").map((line, i) => {
                        if (line.startsWith("## "))
                          return <p key={i} className="font-bold text-gray-900 text-lg leading-snug">{line.replace(/^## /, "")}</p>;
                        if (line.trim() === "")
                          return <div key={i} className="h-2" />;
                        return <p key={i} className="text-sm text-gray-700 leading-relaxed">{line}</p>;
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cikkek */}
            <div className="bg-white border border-gray-100 rounded-sm p-6">
              <h2 className="font-display font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100">
                További cikkek
              </h2>
              <div className="space-y-5">
                <PostPicker
                  label="2. cikk (opcionális)"
                  value={form.post1Id}
                  onChange={(v) => setForm((p) => ({ ...p, post1Id: v }))}
                  posts={posts}
                />
                <PostPicker
                  label="3. cikk (opcionális)"
                  value={form.post2Id}
                  onChange={(v) => setForm((p) => ({ ...p, post2Id: v }))}
                  posts={posts}
                />
              </div>
            </div>

            {/* .env info */}
            <div className="bg-gray-800 rounded-sm p-4 text-xs text-gray-400 space-y-1">
              <p className="text-gray-300 font-semibold mb-2">Szükséges .env változók:</p>
              <p><span className="text-green-400">VITE_BREVO_API_KEY</span> — Brevo API kulcs</p>
              <p><span className="text-green-400">VITE_BREVO_LIST_ID</span> — Feliratkozók lista ID</p>
              <p><span className="text-green-400">VITE_BREVO_SENDER_EMAIL</span> — Küldő email cím</p>
              <p><span className="text-green-400">VITE_SITE_URL</span> — pl. https://valtozakor.hu</p>
            </div>

            {/* Gombok */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPreview((p) => !p)}
                className="flex-1 border border-gray-300 text-gray-600 hover:border-[#d4af37]
                  hover:text-[#b8963e] font-medium text-sm px-6 py-3 rounded-sm transition-colors"
              >
                {preview ? "← Szerkesztő" : "👁 Előnézet"}
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={sending}
                className="flex-1 bg-[#d4af37] hover:bg-[#b8963e] disabled:opacity-60
                  disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-3
                  rounded-sm transition-colors flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"/>
                    </svg>
                    Küldés...
                  </>
                ) : "📧 Hírlevél küldése"}
              </button>
            </div>
          </div>

          {/* ── JOBB: ELŐNÉZET ── */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Email előnézet
                </p>
                {form.subject && (
                  <p className="text-xs text-gray-500 truncate max-w-[200px]">
                    Tárgy: <span className="font-medium text-gray-700">{form.subject}</span>
                  </p>
                )}
              </div>
              <div className="overflow-auto max-h-[70vh]">
                <iframe
                  srcDoc={htmlContent}
                  title="Email előnézet"
                  className="w-full border-0"
                  style={{ height: "600px" }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}