import type { Metadata } from "next";
import "./globals.css";
import LanguageExperience from "@/components/language-experience";

export const metadata: Metadata = {
  title: "YOSHA STORE | Shop the world",
  description: "A modern multi-vendor marketplace.",
  icons: {
    icon: [{ url: "/ys-logo.svg", type: "image/svg+xml" }],
    shortcut: "/ys-logo.svg",
    apple: "/ys-logo.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ar" dir="rtl"><body><LanguageExperience />{children}</body></html>;
}
