import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Landhaus Leuters | Westfälische Küche in Metelen",
  description:
    "Frische saisonale westfälische Küche, gemütlicher Biergarten und Kegelbahn – willkommen im familiengeführten Landhaus Leuters in Metelen.",
  keywords: [
    "Restaurant Metelen",
    "Landhaus Leuters",
    "westfälische Küche Metelen",
    "Biergarten Metelen",
    "Kegelbahn Metelen",
    "Restaurant Münsterland",
  ],
  metadataBase: new URL("https://landhausleuters.leonossendorf.de"),
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
