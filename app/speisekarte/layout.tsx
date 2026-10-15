import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/speisekarte/" },
  title: "Speisekarte | Landhaus Leuters Metelen",
  description: "Interne, mobil lesbare Speisekarte von Landhaus Leuters – westfälische Klassiker, saisonale Küche und mehr.",
};

export default function MenuLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
