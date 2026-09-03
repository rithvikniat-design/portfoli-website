import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Director Portfolio",
    template: "%s | Director Portfolio",
  },
  description:
    "Award-winning filmmaker and novelist. Exploring the human condition through cinema and literature.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Director Portfolio",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-charcoal-950 text-white font-body antialiased">
        <div className="film-grain" />
        {children}
      </body>
    </html>
  );
}
