"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const categories = [
  { name: "Vorspeisen", note: "Aktuelle Auswahl wird ergänzt.", items: [] },
  { name: "Suppen", note: "Saisonale Suppen werden nach Abstimmung ergänzt.", items: [] },
  { name: "Salate", note: "Aktuelle Salate werden ergänzt.", items: [] },
  { name: "Westfälische Klassiker", note: "Häufig von Gästen genannte Beispiele – Verfügbarkeit nicht bestätigt.", items: ["Bauernpfanne", "Fleischspieß", "Westfälische Saisonklassiker"] },
  { name: "Schnitzel & Cordon bleu", note: "Häufig von Gästen empfohlen – aktuelle Varianten werden ergänzt.", items: ["Schnitzel", "Cordon bleu"] },
  { name: "Steaks & Fleischgerichte", note: "Aktuelle Zuschnitte und Beilagen werden gemeinsam ergänzt.", items: ["Steakgerichte"] },
  { name: "Saisonale Gerichte", note: "Zum Beispiel Spargel, Pfifferlinge, Grünkohl oder Wild – nur wenn aktuell bestätigt.", items: [] },
  { name: "Vegetarisch", note: "Die aktuelle vegetarische Auswahl wird ergänzt und eindeutig gekennzeichnet.", items: [] },
  { name: "Für Kinder", note: "Aktuelle Kindergerichte werden ergänzt.", items: [] },
  { name: "Desserts", note: "Häufig von Gästen genannt – aktuelle Verfügbarkeit bitte erfragen.", items: ["Herrencreme"] },
  { name: "Getränke", note: "Die vollständige Getränkekarte wird ergänzt.", items: [] },
];

export default function Speisekarte() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return categories;
    return categories.filter((category) => `${category.name} ${category.note} ${category.items.join(" ")}`.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <>
      <div className="demo-bar">Unverbindlicher Website-Entwurf – noch nicht die offizielle Website von Landhaus Leuters.</div>
      <header className="subpage-header"><Link href="/" aria-label="Zur Startseite"><img src={(process.env.NEXT_PUBLIC_BASE_PATH || "") + "/images/logo-landhaus-leuters.webp"} alt="Landhaus Leuters" /></Link><Link className="back-link" href="/">← Zur Startseite</Link><a className="button button-copper" href="tel:02556394">Tisch reservieren</a></header>
      <main className="subpage menu-page">
        <section className="menu-page-hero"><p className="eyebrow light">Interne Speisekarte · Demo-Gerüst</p><h1>Was dürfen wir<br /><em>Ihnen servieren?</em></h1><p>Diese Seite zeigt bereits Struktur, Suche und mobile Lesbarkeit. Die vollständige aktuelle Speisekarte wird gemeinsam mit Landhaus Leuters ergänzt. Deshalb stehen hier bewusst keine erfundenen Preise.</p></section>
        <section className="menu-search" aria-label="Speisekarte durchsuchen"><label htmlFor="menu-query">Speisekarte durchsuchen</label><div><input id="menu-query" type="search" placeholder="Zum Beispiel Cordon bleu …" value={query} onChange={(event) => setQuery(event.target.value)} /><span aria-hidden="true">⌕</span></div><small>{filtered.length} von {categories.length} Kategorien sichtbar</small></section>
        <section className="menu-categories">
          {filtered.length ? filtered.map((category, index) => <article key={category.name} className="menu-category"><div className="category-number">{String(index + 1).padStart(2, "0")}</div><div className="category-content"><h2>{category.name}</h2><p>{category.note}</p>{category.items.length > 0 ? <ul>{category.items.map((item) => <li key={item}><span>{item}</span><em>Beispiel · ohne Preis</em></li>)}</ul> : <div className="empty-dish">Wird nach Freigabe ergänzt</div>}</div></article>) : <div className="no-results"><h2>Kein passender Eintrag</h2><p>Versuchen Sie einen allgemeineren Suchbegriff oder rufen Sie direkt unter <a href="tel:02556394">02556 394</a> an.</p></div>}
        </section>
        <section className="allergen-box"><div><p className="eyebrow">Kennzeichnungen</p><h2>Klar lesbar. Einfach pflegbar.</h2></div><div><p>Das finale Menü kann Allergene, Zusatzstoffe und vegetarische Gerichte direkt am jeweiligen Eintrag kennzeichnen. Die Zuordnungen werden erst mit der bestätigten Originalkarte eingepflegt.</p><div className="legend"><span><b>V</b> vegetarisch</span><span><b>A</b> Allergene</span><span><b>Z</b> Zusatzstoffe</span></div></div></section>
        <section className="menu-callout"><p>Sie möchten wissen, was heute angeboten wird?</p><h2>Rufen Sie uns gerne an.</h2><a className="button button-copper" href="tel:02556394">02556 394 anrufen</a></section>
      </main>
      <footer className="subpage-footer"><p>Landhaus Leuters · Mühlentor 19 · 48629 Metelen</p><div><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link></div></footer>
    </>
  );
}
