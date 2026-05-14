import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import emailjs from "@emailjs/browser";

// ── EmailJS konfig ───────────────────────────
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

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

function Field({ id, label, required, error, children }) {
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputClass = `
  w-full bg-white border border-gray-200 rounded-sm px-4 py-3 text-sm text-gray-800
  placeholder:text-gray-300 focus:outline-none focus:border-[#d4af37]
  focus:ring-1 focus:ring-[#d4af37]/30 transition-all duration-200
`.trim();

// ── Validáció ─────────────────────────────────────────────
function validate({ name, email, message }) {
  const errors = {};
  if (!name.trim()) errors.name = "A neved megadása kötelező.";
  if (!email.trim()) {
    errors.email = "Az email cím megadása kötelező.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Érvénytelen email cím.";
  }
  if (!message.trim()) errors.message = "Kérjük írj egy üzenetet.";
  else if (message.trim().length < 10)
    errors.message = "Az üzenet legalább 10 karakter legyen.";
  return errors;
}

//----------------------------------------------------
//----------------------------------------------------
const CoachingForm = () => {
  const formRef = useRef(null);
  const location = useLocation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: location.state?.message ?? "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // null | "sending" | "success" | "error"

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setStatus("sending");

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY,
      );
      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
      setErrors({});
    } catch (err) {
      console.error("EmailJS hiba:", err);
      setStatus("error");
    }
  };

  const isSending = status === "sending";

  return (
    <section className="bg-[#f0efed] font-body py-12 md:py-16 px-4">
      <div className="max-w-xl mx-auto">
        {/* Fejléc */}
        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
            Coaching kapcsolatfelvétel
          </p>
          <div className="mb-4 h-0.5 w-12 bg-[#d4af37]" />
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            Érdekel a coaching program? Vedd fel velem a kapcsolatot!
          </h2>
          {/* Arany vonal */}
        </div>

        {/* Sikerüzenet */}
        {status === "success" && (
          <div
            className="mb-6 bg-green-50 border border-green-200 rounded-sm px-5 py-4
            flex items-start gap-3"
          >
            <span className="text-green-500 text-lg mt-0.5">✓</span>
            <div>
              <p className="text-sm font-semibold text-green-800">
                Üzenet elküldve!
              </p>
              <p className="text-xs text-green-700 mt-0.5">
                Hamarosan felvesszük veled a kapcsolatot.
              </p>
            </div>
          </div>
        )}

        {/* Hibaüzenet */}
        {status === "error" && (
          <div
            className="mb-6 bg-red-50 border border-red-200 rounded-sm px-5 py-4
            flex items-start gap-3"
          >
            <span className="text-red-500 text-lg mt-0.5">✕</span>
            <div>
              <p className="text-sm font-semibold text-red-800">Küldési hiba</p>
              <p className="text-xs text-red-700 mt-0.5">
                Valami hiba történt. Kérjük próbáld újra.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="bg-white border border-gray-100 rounded-sm p-6 md:p-8 space-y-5 shadow-sm"
        >
          {/* Név */}
          <Field id="name" label="Teljes neved" required error={errors.name}>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={set("name")}
              placeholder="pl. Kovács Mária"
              autoComplete="name"
              className={inputClass}
            />
          </Field>

          {/* Email */}
          <Field id="email" label="Email cím" required error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="pl. maria@email.hu"
              autoComplete="email"
              className={inputClass}
            />
          </Field>

          {/* Telefon (opcionális) */}
          <Field id="phone" label="Telefonszám" error={errors.phone}>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="+36 30 123 4567"
                autoComplete="tel"
                className={inputClass}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300 pointer-events-none">
                opcionális
              </span>
            </div>
          </Field>

          {/* Üzenet */}
          <Field id="message" label="Üzeneted" required error={errors.message}>
            <div className="relative">
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={set("message")}
                placeholder="Írd meg itt a történeted, kérdésed vagy gondolatod..."
                rows={5}
                maxLength={2000}
                className={`${inputClass} resize-none`}
              />
              <span className="absolute bottom-3 right-3 text-xs text-gray-300 pointer-events-none">
                {form.message.length}/2000
              </span>
            </div>
          </Field>

          {/* Küldés gomb */}
          <button
            type="submit"
            disabled={isSending}
            className="w-full bg-[#d4af37] hover:bg-[#b8963e] disabled:opacity-60
              disabled:cursor-not-allowed text-white font-semibold text-sm
              py-3 px-8 rounded-sm transition-colors duration-200
              flex items-center justify-center gap-2"
          >
            {isSending ? (
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
                Küldés folyamatban...
              </>
            ) : (
              "Üzenet küldése →"
            )}
          </button>

          <p className="text-xs text-gray-400 text-center">
            A csillaggal (<span className="text-[#d4af37]">*</span>) jelölt
            mezők kitöltése kötelező.
          </p>
        </form>
      </div>
    </section>
  );
};

export default CoachingForm;
