"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

const phoneHref = "tel:02556394";
const mapsHref = "https://www.google.com/maps/dir/?api=1&destination=M%C3%BChlentor%2019%2C%2048629%20Metelen";

type Slot = [number, number];
const hours: Slot[][] = [
  [[630, 840], [1020, 1230]],
  [],
  [[1020, 1260]],
  [[690, 840], [1020, 1380]],
  [[690, 840], [1020, 1380]],
  [[690, 840], [1020, 1440]],
  [[690, 840], [1020, 1440]],
];

function clock(minutes: number) {
  if (minutes === 1440) return "00:00";
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function openingStatus() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(value("weekday"));
  const minutes = Number(value("hour")) * 60 + Number(value("minute"));
  const slots = hours[weekday] ?? [];
  if (!slots.length) return "Heute geschlossen";
  const active = slots.find(([start, end]) => minutes >= start && minutes < end);
  if (active) return `Jetzt geöffnet · schließt um ${clock(active[1])} Uhr`;
  const next = slots.find(([start]) => start > minutes);
  if (next) return `Heute wieder ab ${clock(next[0])} Uhr`;
  return "Heute geschlossen";
}

const gallery = [
  { src: "/images/restaurant.webp", alt: "Festlich eingedeckter Tisch im Restaurant Landhaus Leuters", tag: "Restaurant", demo: false },
  { src: "/images/gericht-steak.webp", alt: "Hochwertig angerichtetes Fleischgericht aus einer offiziellen Aufnahme", tag: "Gerichte", demo: false },
  { src: "/images/biergarten.webp", alt: "Der großzügige Biergarten von Landhaus Leuters", tag: "Biergarten", demo: false },
  { src: "/images/gericht-schnitzel.webp", alt: "Schnitzelgericht aus einer offiziellen Aufnahme", tag: "Gerichte", demo: false },
  { src: "/images/familie-leuters.webp", alt: "Familie Leuters vor dem Landhaus", tag: "Familie", demo: false },
  { src: "/images/kegelbahn-demo.webp", alt: "Stimmungsvolle beispielhafte Kegelbahn in Landhausatmosphäre", tag: "Kegelbahn", demo: true },
];

const seasonCards = [
  {
    season: "Frühling",
    title: "Spargelzeit",
    text: "Westfälischer Spargel, klassische Beilagen und frische Frühlingsküche.",
    image: "/images/season-spring.webp",
    alt: "Beispielhaft angerichteter weißer Spargel mit Kartoffeln, Sauce und frischen Kräutern – Demo-Bild",
  },
  {
    season: "Sommer",
    title: "Pfifferlinge & Gartengenuss",
    text: "Pfifferlinge, leichte Gerichte und sommerliche Küche für entspannte Stunden.",
    image: "/images/season-summer.webp",
    alt: "Beispielhaft angerichtete Pfifferlinge mit frischen Kräutern und sommerlichen Beilagen – Demo-Bild",
  },
  {
    season: "Herbst",
    title: "Herzhafte Herbstküche",
    text: "Pilze, Kürbis, Wurzelgemüse und kräftige Aromen für die kühleren Tage.",
    image: "/images/season-autumn.webp",
    alt: "Beispielhaft angerichtetes warmes Herbstgericht mit Pilzen und Kürbis – Demo-Bild",
  },
  {
    season: "Winter",
    title: "Westfälische Winterzeit",
    text: "Grünkohl, deftige Klassiker und festliche Gerichte in gemütlicher Landhausatmosphäre.",
    image: "/images/season-winter.webp",
    alt: "Beispielhaftes westfälisches Wintergericht in warmer Landhausatmosphäre – Demo-Bild",
  },
];

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [status, setStatus] = useState("Öffnungsstatus wird geladen …");
  const [submitted, setSubmitted] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [galleryFilter, setGalleryFilter] = useState("Alle");
  const [contactConcern, setContactConcern] = useState("Tischreservierung");
  const kegelnRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateStatus = () => setStatus(openingStatus());
    updateStatus();
    const timer = window.setInterval(updateStatus, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 981px)");
    const onScroll = () => {
      const kitchen = document.getElementById("kueche");
      const end = kitchen ? kitchen.offsetTop + kitchen.offsetHeight : window.innerHeight * 2;
      const progress = Math.min(1, Math.max(0, window.scrollY / Math.max(1, end - window.innerHeight * 0.35)));
      document.documentElement.style.setProperty("--story-progress", String(progress));
      document.documentElement.style.setProperty("--hero-shift", `${Math.min(52, window.scrollY * 0.055)}px`);
    };
    const syncScrollEffect = () => {
      window.removeEventListener("scroll", onScroll);
      if (desktop.matches) {
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
      } else {
        document.documentElement.style.setProperty("--story-progress", "0");
        document.documentElement.style.setProperty("--hero-shift", "0px");
      }
    };
    syncScrollEffect();
    desktop.addEventListener("change", syncScrollEffect);
    return () => {
      desktop.removeEventListener("change", syncScrollEffect);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const section = kegelnRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        section.classList.add("is-visible");
        observer.disconnect();
      },
      { threshold: 0.42 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }),
      { threshold: 0.12, rootMargin: "0px 0px -7%" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, lightbox]);

  const filteredGallery = useMemo(
    () => gallery.map((item, index) => ({ ...item, originalIndex: index })).filter((item) => galleryFilter === "Alle" || item.tag === galleryFilter),
    [galleryFilter],
  );

  const submitReservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "LocalBusiness"],
    name: "Landhaus Leuters",
    description: "Familiengeführtes Restaurant mit saisonaler westfälischer Küche, Biergarten und Kegelbahn.",
    telephone: "+49 2556 394",
    email: "landhaus.leuters@web.de",
    url: "https://landhausleuters.leonossendorf.de",
    image: "https://landhausleuters.leonossendorf.de/images/restaurant.webp",
    sameAs: ["https://www.instagram.com/landhaus_leuters/", "https://www.facebook.com/gaststatte.leuters/"],
    servesCuisine: ["Westfälisch", "Deutsch", "Saisonal"],
    hasMenu: { "@type": "Menu", name: "Speisekarte Landhaus Leuters", url: "https://landhausleuters.leonossendorf.de/speisekarte", description: "Demo-Gerüst der späteren internen Speisekarte ohne erfundene Preise." },
    address: { "@type": "PostalAddress", streetAddress: "Mühlentor 19", postalCode: "48629", addressLocality: "Metelen", addressCountry: "DE" },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Tuesday", opens: "17:00", closes: "21:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Wednesday", "Thursday"], opens: "11:30", closes: "14:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Wednesday", "Thursday"], opens: "17:00", closes: "23:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday", "Saturday"], opens: "11:30", closes: "14:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday", "Saturday"], opens: "17:00", closes: "00:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "10:30", closes: "14:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "17:00", closes: "20:30" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <a className="skip-link" href="#main">Zum Inhalt springen</a>
      <div className="mobile-opening-status" role="status" aria-live="polite"><span><i />Heute</span><strong>{status}</strong></div>
      <div className="demo-bar">Unverbindlicher Website-Entwurf – noch nicht die offizielle Website von Landhaus Leuters.</div>

      <header className="site-header">
        <a className="brand" href="#start" aria-label="Landhaus Leuters – Startseite">
          <img src={(process.env.NEXT_PUBLIC_BASE_PATH || "") + "/images/logo-landhaus-leuters.webp"} alt="Landhaus Leuters" />
        </a>
        <nav className="desktop-nav" aria-label="Hauptnavigation">
          <a href="#kueche">Unsere Küche</a><Link href="/speisekarte">Speisekarte</Link><a href="#biergarten">Biergarten</a>
          <a href="#kegelbahn">Kegelbahn</a><a href="#feiern">Feiern</a><a href="#galerie">Galerie</a><a href="#zeiten">Öffnungszeiten</a><a href="#anfahrt">Anfahrt</a>
        </nav>
        <a className="button button-small header-cta" href="#kontakt" onClick={() => setContactConcern("Tischreservierung")}>Tisch anfragen</a>
        <button className="menu-toggle" type="button" onClick={() => setMobileOpen(true)} aria-label="Menü öffnen" aria-expanded={mobileOpen}>
          <span /><span />
        </button>
      </header>

      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`} aria-hidden={!mobileOpen}>
        <div className="mobile-menu-head"><img src={(process.env.NEXT_PUBLIC_BASE_PATH || "") + "/images/logo-landhaus-leuters.webp"} alt="Landhaus Leuters" /><button onClick={() => setMobileOpen(false)} aria-label="Menü schließen">Schließen ×</button></div>
        <nav aria-label="Mobile Navigation">
          {[["Start", "#start"], ["Unsere Küche", "#kueche"], ["Biergarten", "#biergarten"], ["Kegelbahn", "#kegelbahn"], ["Feiern", "#feiern"], ["Galerie", "#galerie"], ["Öffnungszeiten", "#zeiten"], ["Anfahrt", "#anfahrt"]].map(([label, href]) => <a key={href} href={href} onClick={() => setMobileOpen(false)}>{label}<span>↘</span></a>)}
          <Link href="/speisekarte" onClick={() => setMobileOpen(false)}>Speisekarte<span>↗</span></Link>
          <a href="#kontakt" onClick={() => { setMobileOpen(false); setContactConcern("allgemeine Frage"); }}>Kontakt<span>↘</span></a>
        </nav>
        <a className="button button-copper" href={phoneHref}>02556 394 anrufen</a>
      </div>

      <main id="main">
        <section className="hero" id="start">
          <svg className="season-line" viewBox="0 0 180 820" aria-hidden="true"><path pathLength="1" d="M112 0 C58 90 154 150 87 240 C28 320 148 390 92 490 C42 585 122 640 72 820" /></svg>
          <div className="hero-copy">
            <p className="eyebrow">Saisonale Küche · Biergarten · Kegelbahn</p>
            <h1>Westfälisch genießen.<br /><em>Herzlich willkommen.</em></h1>
            <p className="hero-lead">Frische saisonale Küche, persönliche Gastlichkeit und gemütliche Landhausatmosphäre – mitten in Metelen.</p>
            <div className="button-row hero-actions"><a className="button button-copper" href={phoneHref}>Tisch telefonisch reservieren</a><a className="button button-ghost" href="#kontakt" onClick={() => setContactConcern("Tischreservierung")}>Tischanfrage senden</a><Link className="hero-menu-link" href="/speisekarte">Speisekarte ansehen ↗</Link></div>
            <div className="hero-facts">
              <span><b>Mühlentor 19</b>48629 Metelen</span><span><b>02556 394</b>Direkt anrufen</span><span className="live-status"><b><i />{status}</b>Zeiten bitte bestätigen</span>
            </div>
          </div>
          <div className="hero-art" aria-label="Austauschbares Demo-Stimmungsbild einer westfälischen Landhaustafel">
            <div className="hero-image-wrap"><img src={(process.env.NEXT_PUBLIC_BASE_PATH || "") + "/images/hero-landhaus.webp"} alt="Westfälisches Gericht auf einer warm eingedeckten Landhaustafel – Demo-Stimmungsbild" /></div>
            <span className="image-note">Demo-Stimmungsbild · austauschbar</span>
            <span className="herb herb-one">✦</span><span className="herb herb-two">⌇</span>
          </div>
        </section>

        <section className="info-ribbon" aria-label="Schnellinformationen">
          <div><small>Heute</small><strong>{status}</strong></div>
          <div><small>Unsere Küche</small><strong>Frisch &amp; saisonal</strong></div>
          <div><small>Gemeinsamer Abend</small><span className="ribbon-links"><a href={phoneHref}>02556 394</a><a href="#kontakt" onClick={() => setContactConcern("Kegelbahn")}>Anfrage senden ↗</a></span></div>
          <div><small>Im Herzen von Metelen</small><a href={mapsHref} target="_blank" rel="noreferrer">Route planen ↗</a></div>
        </section>

        <section className="section kitchen" id="kueche" data-reveal>
          <div className="section-heading split-heading"><div><p className="eyebrow">Unsere Küche</p><h2>Westfälische Küche.<br /><em>Frisch gedacht.</em></h2></div><p>Im Landhaus Leuters trifft traditionelle westfälische Küche auf eine moderne, liebevolle Präsentation. Gekocht wird frisch, saisonal und mit dem Anspruch, dass sich jeder Gast willkommen fühlt.</p></div>
          <div className="food-grid">
            <article className="food-card food-card-large"><img src={(process.env.NEXT_PUBLIC_BASE_PATH || "") + "/images/gericht-schnitzel.webp"} alt="Offizielle Aufnahme eines Schnitzelgerichts bei Landhaus Leuters" /><div><span>Von Gästen häufig empfohlen</span><h3>Schnitzel &amp; Cordon bleu</h3><p>Knusprig, großzügig und bodenständig. Aktuelle Varianten und Verfügbarkeit bitte direkt erfragen.</p></div></article>
            <article className="food-card"><img src={(process.env.NEXT_PUBLIC_BASE_PATH || "") + "/images/gericht-steak.webp"} alt="Offizielle Aufnahme eines angerichteten Fleischgerichts bei Landhaus Leuters" /><div><span>Beliebte Beispiele</span><h3>Steaks &amp; Fleischgerichte</h3><p>Hochwertig angerichtet – ohne hier eine aktuelle Kartenverfügbarkeit zu behaupten.</p></div></article>
            <article className="food-card"><img src={(process.env.NEXT_PUBLIC_BASE_PATH || "") + "/images/hero-landhaus.webp"} alt="Beispielhafte westfälische Landhausküche – Demo-Stimmungsbild" /><div><span>Saisonal wechselnd</span><h3>Westfälische Klassiker</h3><p>Bauernpfanne, Fleischspieße und saisonale Spezialitäten werden von Gästen wiederkehrend genannt.</p></div></article>
          </div>
          <p className="source-note">Gerichte sind beliebte Beispiele aus öffentlichen Gästestimmen, keine Zusage der aktuellen Verfügbarkeit. Es werden bewusst keine Preise erfunden.</p>
        </section>

        <section className="season-block" id="saison" data-reveal>
          <div className="season-heading">
            <div><p className="eyebrow light">Saisonal genießen</p><h2>Jede Jahreszeit<br />hat ihren Geschmack.</h2></div>
            <p>Unsere Küche orientiert sich an der Jahreszeit. Welche Gerichte aktuell angeboten werden, erfahren Sie direkt bei uns oder auf Instagram.</p>
          </div>
          <div className="season-grid">
            {seasonCards.map((item) => (
              <article className="season-card" key={item.season}>
                <div className="season-card-media"><img src={(process.env.NEXT_PUBLIC_BASE_PATH || "") + item.image} alt={item.alt} /><span>Austauschbares Demo-Bild</span></div>
                <div className="season-card-copy"><small>{item.season} · Beispiel</small><h3>{item.title}</h3><p>{item.text}</p></div>
              </article>
            ))}
          </div>
          <p className="season-disclaimer">Beispielhafte Saisonangebote – aktuelle Gerichte und Verfügbarkeit bitte direkt erfragen.</p>
          <div className="button-row season-actions"><a className="button button-copper season-request" href="#kontakt" onClick={() => setContactConcern("allgemeine Frage")}>Aktuelle Empfehlungen anfragen</a><a className="button button-outline-light" href="https://www.instagram.com/landhaus_leuters/" target="_blank" rel="noreferrer">Auf Instagram ansehen</a></div>
        </section>

        <section className="section menu-teaser" id="speisekarte" data-reveal>
          <div className="menu-sheet"><p className="eyebrow">Speisekarte</p><h2>Appetit bekommen?</h2><p>Die spätere Karte ist direkt auf der Website lesbar, durchsuchbar und für Smartphones optimiert. Bis zur Abstimmung zeigen wir ausschließlich ein klar gekennzeichnetes Demo-Gerüst – ohne erfundene Preise.</p><div className="menu-tags"><span>Westfälische Klassiker</span><span>Schnitzel &amp; Cordon bleu</span><span>Saisonal</span><span>Desserts</span></div><Link className="button button-copper" href="/speisekarte">Demo-Speisekarte öffnen</Link></div>
          <aside className="menu-quote"><span>„</span><p>Die vollständige aktuelle Speisekarte wird gemeinsam mit Landhaus Leuters ergänzt.</p></aside>
        </section>

        <section className="garden" id="biergarten" data-reveal>
          <div className="garden-image"><img src={(process.env.NEXT_PUBLIC_BASE_PATH || "") + "/images/biergarten.webp"} alt="Großzügiger Biergarten von Landhaus Leuters in Metelen" /><span>Offizielle Aufnahme</span></div>
          <div className="garden-copy"><p className="eyebrow">Biergarten</p><h2>Draußen schmeckt’s<br />noch besser.</h2><p>Der großzügige Biergarten bietet den passenden Platz für entspannte Stunden, ein kühles Getränk und westfälische Küche unter freiem Himmel.</p><p className="weather-note">Öffnung wetterabhängig</p><div className="button-row"><a className="button button-dark" href={phoneHref}>Jetzt anrufen · 02556 394</a><a className="button button-ghost dark" href="#kontakt" onClick={() => setContactConcern("Biergarten")}>Biergartenanfrage senden</a></div><a className="inline-route" href={mapsHref} target="_blank" rel="noreferrer">Route zum Biergarten planen ↗</a></div>
        </section>

        <section className="kegel section" id="kegelbahn" ref={kegelnRef} data-reveal>
          <div className="kegel-copy"><p className="eyebrow light">Kegelbahn</p><h2>Gut Holz im<br />Landhaus Leuters.</h2><p>Ob regelmäßiger Kegelabend, Geburtstag oder ein geselliger Abend mit Freunden – die Kegelbahn können Sie direkt anfragen.</p><ul><li>Gewünschtes Datum</li><li>Uhrzeit</li><li>Anzahl der Personen</li></ul><div className="button-row"><a className="button button-copper" href={phoneHref}>Kegelbahn telefonisch anfragen</a><a className="button button-outline-light" href="#kontakt" onClick={() => setContactConcern("Kegelbahn")}>Kegelbahn-Anfrage senden</a></div><strong className="contact-number">02556 394</strong></div>
          <div className="kegel-image"><img src={(process.env.NEXT_PUBLIC_BASE_PATH || "") + "/images/kegelbahn-demo.webp"} alt="Beispielhafte Kegelbahn in warmer Landhausatmosphäre – Demo-Stimmungsbild" /><span>Demo-Stimmungsbild · wird durch Originalaufnahme ersetzt</span><i className="rolling-ball" aria-hidden="true" /></div>
        </section>

        <section className="section celebrations" id="feiern" data-reveal>
          <div className="celebration-intro"><p className="eyebrow">Feiern &amp; Gruppen</p><h2>Zusammenkommen.<br /><em>Gemeinsam genießen.</em></h2><p>Sie planen eine Feier oder möchten mit einer größeren Gruppe zu uns kommen? Sprechen Sie uns gerne persönlich an – gemeinsam klären wir, was möglich ist.</p></div>
          <div className="occasion-grid"><span>Geburtstage</span><span>Familienfeiern</span><span>Vereinsabende</span><span>Kegelgruppen</span><span>Gemeinsames Essen</span><span>Gesellschaften</span></div>
          <div className="button-row"><a className="button button-dark" href={phoneHref}>Persönlich besprechen · 02556 394</a><a className="button button-ghost dark" href="#kontakt" onClick={() => setContactConcern("Feier oder größere Gruppe")}>Feier anfragen</a></div>
        </section>

        <section className="family" data-reveal>
          <div className="family-image"><img src={(process.env.NEXT_PUBLIC_BASE_PATH || "") + "/images/familie-leuters.webp"} alt="Familie Leuters vor dem Landhaus Leuters in Metelen" /><span>Offizielle Aufnahme</span></div>
          <div className="family-copy"><p className="eyebrow light">Familie Leuters</p><h2>Gastlichkeit, die<br />von Herzen kommt.</h2><p>Landhaus Leuters ist ein familiengeführtes Restaurant. Persönlicher Service, eine gemütliche Atmosphäre und frische Küche gehören für Familie Leuters zusammen.</p><div className="signature">Familie · Küche · Gastlichkeit</div></div>
        </section>

        <section className="section voices" data-reveal>
          <div className="section-heading"><p className="eyebrow">Stimmen der Gäste</p><h2>Hier fühlt man sich<br /><em>willkommen.</em></h2><p className="rating">4,8 / 5 <span>bei Tripadvisor · 13 Bewertungen · geprüft am 17.08.2026</span></p></div>
          <div className="voice-grid">
            <article><div className="stars" aria-label="Fünf Sterne">★★★★★</div><p>Besonders häufig werden der freundliche, aufmerksame Service und die gemütliche Atmosphäre hervorgehoben.</p><small>Sinngemäß aus öffentlichen Gästestimmen</small></article>
            <article><div className="stars" aria-label="Fünf Sterne">★★★★★</div><p>Frisch zubereitete Gerichte, große Portionen und ein gutes Preis-Leistungs-Verhältnis prägen viele Rückmeldungen.</p><small>Sinngemäß aus öffentlichen Gästestimmen</small></article>
            <article><div className="stars" aria-label="Fünf Sterne">★★★★★</div><p>Cordon bleu und Herrencreme werden in einer aktuellen Bewertung besonders gelobt; auch der Biergarten findet viel Zuspruch.</p><small>Sinngemäß, ohne erfundene Namen</small></article>
          </div>
        </section>

        <section className="gallery-section" id="galerie" data-reveal>
          <div className="section-heading"><p className="eyebrow light">Einblicke</p><h2>Landhausmomente.</h2></div>
          <div className="gallery-filters" role="group" aria-label="Galerie filtern">{["Alle", "Gerichte", "Restaurant", "Biergarten", "Kegelbahn", "Familie"].map((filter) => <button key={filter} className={galleryFilter === filter ? "active" : ""} onClick={() => setGalleryFilter(filter)}>{filter}</button>)}</div>
          <div className="gallery-grid">{filteredGallery.map((item) => <button key={item.src} onClick={() => setLightbox(item.originalIndex)} aria-label={`${item.alt} vergrößern`}><img src={(process.env.NEXT_PUBLIC_BASE_PATH || "") + item.src} alt={item.alt} /><span>{item.tag}{item.demo ? " · Demo" : ""}</span></button>)}</div>
        </section>

        <section className="voucher" data-reveal>
          <span className="voucher-mark">M</span><div><p className="eyebrow">Metelen-Gutschein</p><h2>Regional schenken.<br />Gemeinsam genießen.</h2></div><div><p>Der Metelen-Gutschein kann bei Landhaus Leuters eingelöst werden. Diese Information wurde am 17.08.2026 im offiziellen Akzeptanzstellen-Verzeichnis geprüft.</p><a className="text-link" href="https://metelen-gutschein.de/handler/828" target="_blank" rel="noreferrer">Zum Metelen-Gutschein ↗</a></div>
        </section>

        <section className="hours-contact section" id="zeiten" data-reveal>
          <div className="hours-panel"><p className="eyebrow light">Öffnungszeiten</p><h2>{status}</h2><div className="hours-list">
            <div><span>Montag</span><b>geschlossen</b></div><div><span>Dienstag</span><b>17:00–21:00</b></div><div><span>Mittwoch</span><b>11:30–14:00 · 17:00–23:00</b></div><div><span>Donnerstag</span><b>11:30–14:00 · 17:00–23:00</b></div><div><span>Freitag</span><b>11:30–14:00 · 17:00–00:00</b></div><div><span>Samstag</span><b>11:30–14:00 · 17:00–00:00</b></div><div><span>Sonntag</span><b>10:30–14:00 · 17:00–20:30</b></div>
          </div><p className="verify-note">Zuletzt auffindbare Zeiten für die Demo. Vor offizieller Veröffentlichung mit Landhaus Leuters bestätigen.</p></div>
          <div className="contact-panel" id="anfahrt"><p className="eyebrow">Kontakt &amp; Anfahrt</p><h2>Mitten in Metelen.</h2><address><b>Landhaus Leuters</b><br />Mühlentor 19<br />48629 Metelen</address><div className="contact-action-row"><a className="button button-dark" href={phoneHref}>Jetzt anrufen · 02556 394</a><a className="button button-ghost dark" href="#kontakt" onClick={() => setContactConcern("allgemeine Frage")}>Nachricht schreiben</a></div><div className="contact-links"><a href="mailto:landhaus.leuters@web.de"><small>E-Mail</small>landhaus.leuters@web.de ↗</a><a href={mapsHref} target="_blank" rel="noreferrer"><small>Anfahrt</small>Route mit Google Maps ↗</a></div><div className="social-links"><a href="https://www.instagram.com/landhaus_leuters/" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.facebook.com/gaststatte.leuters/" target="_blank" rel="noreferrer">Facebook</a></div></div>
        </section>

        <section className="reservation section" id="kontakt" data-reveal>
          <div className="reservation-intro"><p className="eyebrow light">Kontaktformular · ohne Login</p><h2>Ihre Anfrage.<br /><em>Persönlich beantwortet.</em></h2><p>Das Formular zeigt, wie eine spätere Anfrage aussehen kann. Aktuell wird nichts versendet.</p><p className="call-first">Lieber persönlich? Rufen Sie uns unter <a href={phoneHref}>02556 394</a> an.</p></div>
          <form onSubmit={submitReservation}>
            <label>Anliegen<select required value={contactConcern} onChange={(event) => setContactConcern(event.target.value)}><option>Tischreservierung</option><option>Kegelbahn</option><option>Biergarten</option><option>Feier oder größere Gruppe</option><option>allgemeine Frage</option></select></label>
            <label>Gewünschtes Datum<input type="date" required /></label><label>Gewünschte Uhrzeit<input type="time" required /></label><label>Anzahl der Personen<input type="number" min="1" inputMode="numeric" required /></label><label>Name<input type="text" autoComplete="name" required /></label><label>Telefonnummer<input type="tel" autoComplete="tel" required /></label><label className="full">E-Mail-Adresse<input type="email" autoComplete="email" required /></label><label className="full">Nachricht<textarea rows={4} required /></label>
            <button className="button button-dark" type="submit">Anfrage prüfen</button>
            {submitted && <div className="form-message" role="status">Dies ist eine unverbindliche Demo. Reservierungen sind aktuell ausschließlich telefonisch unter <a href={phoneHref}>02556 394</a> möglich.</div>}
          </form>
        </section>
      </main>

      <footer><div className="footer-brand"><img src={(process.env.NEXT_PUBLIC_BASE_PATH || "") + "/images/logo-landhaus-leuters.webp"} alt="Landhaus Leuters" /><p>Familie · Küche · Gastlichkeit</p></div><div><b>Landhaus Leuters</b><p>Mühlentor 19 · 48629 Metelen<br /><a href={phoneHref}>02556 394</a> · <a href="#kontakt" onClick={() => setContactConcern("allgemeine Frage")}>Kontaktformular</a></p></div><div className="footer-links"><a href={phoneHref}>Jetzt anrufen</a><a href="#kontakt" onClick={() => setContactConcern("allgemeine Frage")}>Nachricht schreiben</a><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link><a href="#start">Nach oben ↑</a></div><p className="footer-demo">Unverbindlicher Website-Entwurf – noch nicht die offizielle Website.</p></footer>

      <nav className="mobile-quick" aria-label="Schnellzugriff"><a href={phoneHref}><span>☎</span>Anrufen</a><Link href="/speisekarte"><span>≡</span>Speisekarte</Link><a href="#kontakt" onClick={() => setContactConcern("allgemeine Frage")}><span>↘</span>Anfrage</a></nav>

      {lightbox !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Bildansicht" onClick={() => setLightbox(null)}><button aria-label="Bildansicht schließen" onClick={() => setLightbox(null)}>Schließen ×</button><figure onClick={(event) => event.stopPropagation()}><img src={(process.env.NEXT_PUBLIC_BASE_PATH || "") + gallery[lightbox].src} alt={gallery[lightbox].alt} /><figcaption>{gallery[lightbox].alt}<small>{gallery[lightbox].demo ? "Austauschbares Demo-Stimmungsbild – kein echtes Foto von Landhaus Leuters." : "Offizielle Aufnahme aus dem öffentlichen Metelen-Eintrag von Landhaus Leuters."}</small></figcaption></figure></div>}
    </>
  );
}
