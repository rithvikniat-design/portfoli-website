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
    default: "Ayalapu Rithvik Reddy",
    template: "%s | Ayalapu Rithvik Reddy",
  },
  description: "Official portfolio and filmography.",
  openGraph: {
    title: "Ayalapu Rithvik Reddy",
    description: "Official portfolio and filmography.",
    url: "https://portfoli-website-puce.vercel.app",
    siteName: "Ayalapu Rithvik Reddy",
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
