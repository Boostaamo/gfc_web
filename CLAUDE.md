# web-pohja: ohjeet Claudelle

Tämä on Dimman verkkosivustopohja (Next.js, App Router, TypeScript), jolla Dimma tuottaa asiakassivustot ja konsernin yhtiöiden sivustot. Projekti etenee Dimman verkkosivuprosessin mukaan (taito `dimma-verkkosivu-prosessi`, repo `dimma`). Sisältö on Markdown-tiedostoina, eikä sisällön muokkaus vaadi koodia.

## Säännöt
- Sisältö muokataan kansiossa `content/` (sivut: `content/pages/*.md`, asetukset: `content/site.json`). Älä kirjoita sisältöä koodiin.
- Tyylit ja värit ovat CSS-muuttujina tiedostossa `app/globals.css`. Vaihda design systemin arvot siellä.
- Älä lisää riippuvuuksia ilman perustetta. Pidä sivusto staattisena, kun mahdollista.
- Älä koskaan commitoi salaisuuksia tai henkilötietoja. Käytä `.env.local` (paikallinen) ja Vercelin ympäristömuuttujia. Vain `.env.example` on repossa.
- Lomakkeen liidit lähtevät reitille `app/api/lead/route.ts` ja sieltä `LEAD_WEBHOOK_URL`-osoitteeseen. Älä tallenna liidejä repoon.
- Analytiikka latautuu vain suostumuksen jälkeen. Älä lisää seurantaskriptejä ilman suostumuksen tarkistusta.
- Aja `npm run build` ennen jokaista pushia. Älä pushaa rikkinäistä koodia.
- Työskentele haarassa (`feature/...`), älä suoraan `main`-haaraan. `main` julkaistaan tuotantoon.
- Esikatselut eivät saa näkyä hakukoneissa (tämä on jo päällä: robots ja noindex).
- Tekstit: asiakassivustolla sävy ja sanasto hyväksytyn briefin mukaan; konsernin yhtiösivustolla yhtiön repon `context/tyyli.md` ja `context/sanasto.md`. Älä keksi asiakascaseja, lukuja tai referenssejä.

## Rajat
- Räätälöity taustajärjestelmä, kirjautuminen, maksut ja integraatiot tavallista lomaketta ja analytiikkaa laajemmin kuuluvat Bistekille. Pysäytä työ ja kerro, jos tarve ylittää nämä.

## Growth Flame Companyn sivusto: lisäohjeet

Sivusto: Growth Flame Company | Domain: gfc.fi | Rekisteri: boostaamo-core/verkkosivut/sivustot.md
Tila: luonnos | Versio: v0.1 | Pvm: 2026-11-18 | Hyväksyjä: Hannu
Pohja: Boostaamon sivusto (boostaamo_web), Hannu 17.11.2026. Kokonaisohje: boostaamo-core/verkkosivut/claude-code-ohje.md.

### Lähteet
- Brief, sivukartta ja sivutekstit GFC v4 (Hannu hyväksyi 18.11.2026): Konserni/04 Markkinointi ja brändi/Verkkosivut/Luonnokset.
- Tuotannon materiaalit: Growth Flame Company/02 Palvelut ja tuotteet (Tuotanto 4.0, tuotannon kehittämisen viitekehys, Moderni tuotannon johtaminen).
- Linjaukset: boostaamo-core/verkkosivut/linjaukset.md. Ekosysteemilinkit: boostaamo-core/verkkosivut/ekosysteemi/ekosysteemi.json → content/site.json.
- Jos teksti puuttuu, jätä <täydennä> ja kerro, mitä tarvitaan. Älä kirjoita markkinointiviestejä itse.

### Säännöt
- Konversiopisteet: hakemus valmennukseen (haku päättyy ke 13.1.2027, valinnat to 14.1.2027) ja keskustelupyyntö (`generate_lead`, lahde-parametri), webinaari (`sign_up`).
- Ulkoasu: "GFC verkkosivujen värimääritykset v1" (19.11.2026): laivastonsininen #182A50, korostus #C2410C (painikkeet, linkit), koriste #E8590C (vain viivat), tausta #F5F7FB, teksti #16213A, tumma teema prefers-color-scheme. Tokenit app/globals.css lopussa. Archivo + IBM Plex Sans, ei Hehkua. Tekstilogo. Kuvat mustavalkoisina.
- Alalaidassa "A Boostaamo Company" ja ekosysteemilinkit.
- Liidit: Supabase (EU), GFC:n oma projekti (supabase/migrations). Säilytys 24 kk. Ei Upstashia.
- Hinnat: vain valmennuksen hinnat (Hannu 17.11.2026). Tuotanto 4.0:n ja kypsyysarvion hintoja ei julkaista.
- Ei keksittyjä caseja, lukuja, referenssejä, asiakaslogoja tai lupauksia.
- Ei salaisuuksia, .env-tiedostoja, liidejä, henkilötietoja eikä asiakasdataa repoon.
- Domainiin, DNS:ään ja Vercelin tuotantoasetuksiin ei kosketa ilman Hannun erillistä lupaa. Älä yhdistä main-haaraan: Hannu hyväksyy ja julkaisee.
- Kirjautuminen, maksut, taustajärjestelmät ja laajat integraatiot: pysäytä ja ehdota Bistekiä.
