import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import NotificationToast from "@/components/NotificationToast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://freelamz-frontend.vercel.app"),
  title: "Freelamz — O mercado freelance de Moçambique",
  description: "A plataforma de freelancers de Mocambique",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Freelamz" },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    title: "Freelamz — O mercado freelance de Moçambique",
    description: "Encontra trabalho. Contrata talento. Recebe em Meticais.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Freelamz" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Freelamz — O mercado freelance de Moçambique",
    description: "Encontra trabalho. Contrata talento. Recebe em Meticais.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0A100C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Freelamz" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js')
                .then(function(reg) { console.log('SW registado:', reg.scope); })
                .catch(function(err) { console.log('SW erro:', err); });
            });
          }
        `}} />
      </head>
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          {children}
          <NotificationToast />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}