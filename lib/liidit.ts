// Liidien tallennus Supabaseen (EU), GFC:n oma projekti. REST-rajapinta, ei erillistä kirjastoa
// (sama malli kuin muissa konsernin sivustoissa). Taulu: supabase/migrations/20261118_liidit.sql.
// Älä lokita henkilötietoja.

export type Liidi = {
  lahde: "hakemus" | "yhteys" | "webinaari_gfc";
  nimi: string;
  sahkoposti: string;
  puhelin: string;
  yritys: string;
  tehtava: string;
  tarve: string;
  viesti: string;
  vastaukset: Record<string, string> | null;
  webinaari: string;
  suostumus: boolean;
  sivu: string;
  lahde_sivu: string;
  viittaaja: string;
  utm: Record<string, string>;
  esikatselu: boolean;
};

function yhteys(): { url: string; avain: string } | null {
  // Vercelin Supabase-integraatio lisää SUPABASE_URL- ja SUPABASE_SERVICE_ROLE_KEY-muuttujat.
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const avain = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && avain ? { url: url.replace(/\/$/, ""), avain } : null;
}

export const tallennusKaytossa = () => yhteys() !== null;

/** Tallentaa liidin. Palauttaa false, jos tallennus epäonnistui. */
export async function tallennaLiidi(l: Liidi): Promise<boolean> {
  const y = yhteys();
  if (!y) return false;
  try {
    const res = await fetch(`${y.url}/rest/v1/liidit`, {
      method: "POST",
      headers: {
        apikey: y.avain,
        Authorization: `Bearer ${y.avain}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(l),
      cache: "no-store",
    });
    if (!res.ok) console.error(`Liidin tallennus epäonnistui, tila ${res.status}.`);
    return res.ok;
  } catch {
    console.error("Liidin tallennus epäonnistui (verkkovirhe).");
    return false;
  }
}

/** Valinnainen sähköposti-ilmoitus webhookilla (LEAD_WEBHOOK_URL). Ei estä lähetystä, jos epäonnistuu. */
export async function ilmoita(l: Liidi): Promise<void> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return;
  const secret = process.env.LEAD_WEBHOOK_SECRET;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(secret ? { "X-Webhook-Secret": secret } : {}) },
      body: JSON.stringify({ ...l, secret: secret || undefined, sivusto: "gfc.fi" }),
      cache: "no-store",
    });
  } catch {
    console.error("Liidi-ilmoitus epäonnistui (verkkovirhe).");
  }
}
