# Landhaus Leuters
Statische Next.js-Website für GitHub Pages. Keine Secrets oder Serverdienste erforderlich.

Inhalte: app/page.tsx; Speisekarte: app/speisekarte/page.tsx; Gestaltung: app/globals.css; Bilder: public/images/.
Änderungen auf main lösen den Pages-Workflow aus. npm ci und npm run build erzeugen out/.

Erst Pages mit GitHub Actions aktivieren und die Projektadresse testen. Anschließend public/CNAME mit landhausleuters.leonossendorf.de anlegen; dadurch baut der Workflow ohne Repository-Unterpfad. Custom Domain in Pages setzen. Nur den DNS-Eintrag für landhausleuters auf den CNAME leonossendorf.github.io umstellen. Andere Einträge erhalten. Zertifikat abwarten, dann Enforce HTTPS aktivieren.

Das Formular ist weiterhin eine lokale Demo ohne Versand. Rechtstexte enthalten aus der Originaldemo übernommene Ergänzungshinweise; Hosting wurde auf GitHub Pages angepasst.
