import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/client-dashboard", "/admin", "/messages", "/checkout", "/payments", "/orders", "/disputes", "/contracts"],
      },
    ],
    sitemap: "https://freelamz-frontend.vercel.app/sitemap.xml",
  };
}
