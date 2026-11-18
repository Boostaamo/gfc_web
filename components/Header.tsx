import Link from "next/link";
import { site } from "@/lib/site";

export default function Header() {
  return (
    <header className="top">
      <nav className="nav" aria-label="Päävalikko" style={{ maxWidth: 1168, margin: "0 auto" }}>
        <Link className="wm" href="/" style={{ fontSize: 20, letterSpacing: ".06em", lineHeight: 1.1 }}>
          GROWTH FLAME COMPANY
          <span className="badge">{site.badge}</span>
        </Link>
        <ul>
          {site.nav.map((item) => (
            <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
          ))}
        </ul>
        <Link className="btn" href={site.cta.href}>{site.cta.label}</Link>
      </nav>
    </header>
  );
}
