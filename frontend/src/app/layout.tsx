import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Freelamz",
  description: "Plataforma freelance de Mocambique",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <head>
        <style>{`
          :root { color-scheme: light; }
          html, body { background-color: #ffffff; color: #404145; }
          input, select, textarea { color: #404145; background-color: #ffffff; }
          input::placeholder, textarea::placeholder { color: #74767e; opacity: 1; }
        `}</style>
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
