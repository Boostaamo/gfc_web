"use client";

import { FormEvent, useId, useState } from "react";
import { track } from "@/lib/analytics";

// Lomakkeet: hakemus (lomake 1), yhteys (lomake 2), webinaari (lomake 3). Lähde: sivutekstit GFC v4.
export type FormKind = "hakemus" | "yhteys" | "webinaari";

type Status = "idle" | "sending" | "ok" | "error";

export const TARPEET = [
  "Tuotannon kehittämiseen (Tuotanto 4.0, tuotannon kypsyysarvio)",
  "Moderni tuotannon johtaminen -valmennukseen",
  "Johtamisen kehittämiseen",
  "Kasvuanalyysiin ja kasvusuunnitelmaan",
  "Kasvujohtajaan palveluna",
  "Kasvun rahoitukseen",
  "Markkinoinnin johtamiseen",
  "IT-johtamiseen ja automaatioon",
  "Talousjohtamiseen",
];

const SUBMIT: Record<FormKind, string> = {
  hakemus: "Lähetä hakemus",
  yhteys: "Lähetä viesti",
  webinaari: "Ilmoittaudu webinaariin",
};

const THANKS: Record<FormKind, string> = {
  hakemus: "/moderni-tuotannon-johtaminen/hae/kiitos",
  yhteys: "/yhteys/kiitos",
  webinaari: "/webinaari/kiitos",
};

const CONSENT: Record<FormKind, string> = {
  hakemus: "Hyväksyn, että Growth Flame Company ottaa minuun yhteyttä hakemukseni käsittelyä varten.",
  yhteys: "Hyväksyn, että Growth Flame Company tai konsernin yhtiö, jolle viestini ohjataan, ottaa minuun yhteyttä.",
  webinaari: "Hyväksyn, että Growth Flame Company lähettää minulle webinaarin tiedot ja nauhoitteen.",
};

function Field({ label, name, type = "text", required, autoComplete, textarea }: {
  label: string; name: string; type?: string; required?: boolean; autoComplete?: string; textarea?: boolean;
}) {
  const id = `${useId()}-${name}`;
  return (
    <label htmlFor={id} style={{ display: "grid", gap: 4 }}>
      <span className="mono" style={{ color: "#5E5959" }}>{label}{required ? " *" : ""}</span>
      {textarea
        ? <textarea id={id} name={name} rows={4} className="fld" maxLength={4000} required={required} />
        : <input id={id} name={name} type={type} className="fld" required={required} autoComplete={autoComplete} maxLength={200} />}
    </label>
  );
}

function Choice({ label, name, options, required, defaultValue }: {
  label: string; name: string; options: string[]; required?: boolean; defaultValue?: string;
}) {
  const id = `${useId()}-${name}`;
  return (
    <label htmlFor={id} style={{ display: "grid", gap: 4 }}>
      <span className="mono" style={{ color: "#5E5959" }}>{label}{required ? " *" : ""}</span>
      <select id={id} name={name} className="fld" required={required} defaultValue={defaultValue ?? ""}>
        <option value="" disabled>Valitse</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

export default function Form({ kind, arg, source }: { kind: FormKind; arg?: string; source: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    const g = (k: string) => (d.get(k) as string | null) ?? "";
    const q = new URLSearchParams(window.location.search);
    const payload = {
      kind,
      webinar: kind === "webinaari" ? arg ?? "" : "",
      name: g("name"),
      company: g("company"),
      role: g("role"),
      email: g("email"),
      phone: g("phone"),
      need: kind === "yhteys" ? g("need") : "",
      message: g("message"),
      answers: kind === "hakemus"
        ? {
            tiimin_koko: g("team"),
            tuotannon_tyyppi: g("production"),
            johtamishaaste: g("challenge"),
            tunnusluku: g("metric"),
            esihenkilon_tuki: g("support"),
            esihenkilon_yhteystieto: g("supervisor"),
            useampi_hakija: g("several"),
            mista_kuuli: g("heard"),
          }
        : undefined,
      consent: d.get("consent") === "on",
      website: g("website"), // honeypot
      source,
      page: window.location.pathname,
      referrer: document.referrer,
      utm_source: q.get("utm_source") ?? "",
      utm_medium: q.get("utm_medium") ?? "",
      utm_campaign: q.get("utm_campaign") ?? "",
      utm_term: q.get("utm_term") ?? "",
      utm_content: q.get("utm_content") ?? "",
    };
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setError(json.error || "Lähetys epäonnistui. Yritä uudelleen.");
        return;
      }
      setStatus("ok");
      if (kind === "webinaari") track("sign_up", { method: "webinaari", lahde: "webinaari_gfc", webinaari: arg ?? "" });
      else track("generate_lead", { lahde: kind, tarve: payload.need, form_source: source });
      window.location.assign(THANKS[kind]);
    } catch {
      setStatus("error");
      setError("Verkkovirhe. Yritä uudelleen.");
    }
  }

  if (status === "ok") {
    return <p className="formok" role="status">Kiitos! Lähetys vastaanotettu.</p>;
  }

  return (
    <form className="rform" onSubmit={onSubmit}>
      <Field label="Nimi" name="name" required autoComplete="name" />
      <Field label="Yritys" name="company" required={kind !== "yhteys"} autoComplete="organization" />
      {kind === "hakemus" && <Field label="Tehtävä" name="role" required autoComplete="organization-title" />}
      <Field label="Sähköposti" name="email" type="email" required autoComplete="email" />
      {kind !== "webinaari" && <Field label="Puhelin" name="phone" type="tel" required={kind === "hakemus"} autoComplete="tel" />}
      {kind === "hakemus" && (
        <>
          <Field label="Montako ihmistä johdat?" name="team" required />
          <Field label="Mikä on tuotantosi tyyppi?" name="production" />
          <Field label="Mikä on suurin johtamishaasteesi juuri nyt?" name="challenge" textarea required />
          <Field label="Mikä tunnusluku kertoisi, että olet kehittynyt?" name="metric" textarea />
          <Choice label="Tukeeko esihenkilösi hakemusta ja välitehtävien tekoa?" name="support" options={["Kyllä", "Ei", "En tiedä"]} required />
          <Field label="Esihenkilön yhteystieto" name="supervisor" />
          <Choice label="Hakeeko yrityksestänne useampi?" name="several" options={["Kyllä", "Ei"]} />
          <Choice label="Mistä kuulit koulutuksesta?" name="heard" options={["Kontakti", "Webinaari", "LinkedIn", "Muu"]} />
        </>
      )}
      {kind === "yhteys" && (
        <>
          <Choice label="Minulla on tarvetta" name="need" options={TARPEET} required defaultValue={arg && TARPEET.includes(arg) ? arg : undefined} />
          <Field label="Viesti" name="message" textarea />
        </>
      )}
      <label className="chk">
        <input type="checkbox" name="consent" required /> <span>{CONSENT[kind]} Tietojen käsittely: <a href="/tietosuoja">tietosuojaseloste</a>. *</span>
      </label>
      <div className="hp" aria-hidden="true">
        <label>Älä täytä tätä kenttää<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <button className="btn" type="submit" disabled={status === "sending"} style={{ fontFamily: "var(--font-otsikko)", cursor: "pointer", textAlign: "center" }}>
        {status === "sending" ? "Lähetetään…" : SUBMIT[kind]}
      </button>
      {status === "error" && <p className="ferr" role="alert">{error}</p>}
    </form>
  );
}
