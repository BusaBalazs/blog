/**
 * useNewsletter — Brevo API alapú hírlevél feliratkozás
 * ─────────────────────────────────────────────────────────
 * .env fájlban szükséges:
 *   VITE_BREVO_API_KEY=xkeysib-...
 *   VITE_BREVO_LIST_ID=3          (a Brevo-ban létrehozott lista ID-ja)
 */

const BREVO_API_URL = "https://api.brevo.com/v3/contacts";

export function useNewsletter() {
  const subscribe = async (email) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Érvénytelen email cím.");
    }

    const listId = Number(import.meta.env.VITE_BREVO_LIST_ID);

    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": import.meta.env.VITE_BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true, // ha már létezik, frissíti (nem dob hibát)
      }),
    });

    // 204 = már létező kontakt frissítve (siker)
    if (response.status === 204 || response.status === 201) return;

    const data = await response.json();

    // Brevo hibakódok kezelése
    if (!response.ok) {
      if (data.code === "duplicate_parameter") return; // már feliratkozott — nem hiba
      throw new Error(data.message || "Ismeretlen hiba történt.");
    }
  };

  return { subscribe };
}
