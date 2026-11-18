import { NextResponse } from "next/server";
import { ilmoita, tallennaLiidi, type Liidi } from "@/lib/liidit";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 20_000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
// Huom: serverless-ympäristössä tämä muisti nollautuu. Se hidastaa roskaa, ei korvaa varsinaista suojausta.
const hits = new Map<string, number[]>();

function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

const str = (v: unknown, max: number): string =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const LAHDE = { hakemus: "hakemus", yhteys: "yhteys", webinaari: "webinaari_gfc" } as const;

export async function POST(req: Request) {
  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Liian suuri pyyntö." }, { status: 413 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "Liian monta lähetystä. Yritä myöhemmin uudelleen." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Virheellinen pyyntö." }, { status: 400 });
  }

  // Honeypot: oikeat käyttäjät eivät täytä tätä kenttää. Vastataan onnistuneesti, ettei botti opi.
  if (str(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const kindRaw = str(body.kind, 20);
  const kind = (kindRaw in LAHDE ? kindRaw : "yhteys") as keyof typeof LAHDE;
  const name = str(body.name, 200);
  const email = str(body.email, 200);

  if (!name) return NextResponse.json({ ok: false, error: "Kirjoita nimesi." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Tarkista sähköpostiosoite." }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ ok: false, error: "Hyväksy yhteydenotto ennen lähettämistä." }, { status: 400 });
  }

  let answers: Record<string, string> | null = null;
  if (kind === "hakemus" && body.answers && typeof body.answers === "object") {
    answers = {};
    for (const [k, v] of Object.entries(body.answers as Record<string, unknown>).slice(0, 20)) {
      answers[k.slice(0, 40)] = str(v, 2000);
    }
  }

  const lead: Liidi = {
    lahde: LAHDE[kind],
    nimi: name,
    sahkoposti: email,
    puhelin: str(body.phone, 60),
    yritys: str(body.company, 200),
    tehtava: str(body.role, 200),
    tarve: str(body.need, 200),
    viesti: str(body.message, 4000),
    vastaukset: answers,
    webinaari: str(body.webinar, 200),
    suostumus: true,
    sivu: str(body.page, 300),
    lahde_sivu: str(body.source, 100),
    viittaaja: str(body.referrer, 300),
    utm: {
      source: str(body.utm_source, 100),
      medium: str(body.utm_medium, 100),
      campaign: str(body.utm_campaign, 100),
      term: str(body.utm_term, 100),
      content: str(body.utm_content, 100),
    },
    esikatselu: process.env.VERCEL_ENV !== "production",
  };

  const saved = await tallennaLiidi(lead);
  if (!saved) {
    return NextResponse.json({ ok: false, error: "Lähetys epäonnistui. Yritä myöhemmin uudelleen tai lähetä sähköpostia." }, { status: 502 });
  }
  await ilmoita(lead);
  return NextResponse.json({ ok: true });
}
