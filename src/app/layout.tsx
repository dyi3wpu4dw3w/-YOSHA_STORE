import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "YOSHA STORE | Shop the world", description: "A modern multi-vendor marketplace." };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="ar" dir="rtl"><body>{children}</body></html>; }
