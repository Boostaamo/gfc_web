-- Growth Flame Company (gfc.fi): lomakkeiden liidit.
-- Aja GFC:n omassa Supabase-projektissa (EU-alue): SQL Editor -> liitä -> Run.
-- Rekisterinpitäjä Growth Flame Company Oy. Säilytys 24 kk (tietosuojaseloste).

create table if not exists public.liidit (
  id bigint generated always as identity primary key,
  luotu timestamptz not null default now(),
  lahde text not null check (lahde in ('hakemus', 'yhteys', 'webinaari_gfc')),
  nimi text not null check (char_length(nimi) between 1 and 200),
  sahkoposti text not null default '' check (char_length(sahkoposti) <= 200),
  puhelin text not null default '' check (char_length(puhelin) <= 60),
  yritys text not null default '' check (char_length(yritys) <= 200),
  tehtava text not null default '' check (char_length(tehtava) <= 200),
  tarve text not null default '' check (char_length(tarve) <= 200),
  viesti text not null default '' check (char_length(viesti) <= 4000),
  vastaukset jsonb,
  webinaari text not null default '',
  suostumus boolean not null default false,
  sivu text not null default '',
  lahde_sivu text not null default '',
  viittaaja text not null default '',
  utm jsonb,
  esikatselu boolean not null default false
);

create index if not exists liidit_luotu on public.liidit (luotu);
create index if not exists liidit_lahde_luotu on public.liidit (lahde, luotu);

-- Vain palvelinavain (service_role) pääsee tauluun. Julkinen anon-avain ei näe eikä kirjoita mitään.
alter table public.liidit enable row level security;
revoke all on public.liidit from anon, authenticated;

-- Säilytys 24 kk: pg_cron poistaa vanhat rivit joka yö klo 3 (UTC).
-- Ota ensin käyttöön: Database -> Extensions -> pg_cron.
create extension if not exists pg_cron;
select cron.schedule(
  'liidit-sailytys',
  '0 3 * * *',
  $$delete from public.liidit where luotu < now() - interval '24 months'$$
);
