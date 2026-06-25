import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

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
        <GoogleOAuthProvider clientId="916098882078-aiavc6pl9nktkkdq26d5dvic4mfr73m6.apps.googleusercontent.com">
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}