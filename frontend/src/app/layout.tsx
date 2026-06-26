import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import NotificationToast from "@/components/NotificationToast";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Freelamz",
  description: "A plataforma de freelancers de Moçambique",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Freelamz",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    title: "Freelamz",
    description: "A plataforma de freelancers de Moçambique",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Freelamz" />
        <meta name="mobile-web-app-capable" content="yes" />
        <style>{`
          :root { color-scheme: light; }
          html, body { background-color: #ffffff; color: #404145; }
          input, select, textarea { color: #404145; background-color: #ffffff; }
          input::placeholder, textarea::placeholder { color: #74767e; opacity: 1; }
        `}</style>
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(reg) { console.log('SW registado:', reg.scope); })
                  .catch(function(err) { console.log('SW erro:', err); });
              });
            }
          `
        }} />
      </head>
      <body className={inter.className}>
        <GoogleOAuthProvider clientId="916098882078-aiavc6pl9nktkkdq26d5dvic4mfr73m6.apps.googleusercontent.com">
          <Navbar />
          {children}
          <NotificationToast />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
