import { MetadataRoute } from "next";

const BASE_URL = "https://freelamz-frontend.vercel.app";
const API_URL = "https://freelamz-production.up.railway.app/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Paginas estaticas
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/freelancers`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // Paginas dinamicas — projectos
  let projectPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/projects`, { next: { revalidate: 3600 } });
    const projects = await res.json();
    if (Array.isArray(projects)) {
      projectPages = projects.map((p: any) => ({
        url: `${BASE_URL}/projects/${p.id}`,
        lastModified: new Date(p.created_at || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch {}

  // Paginas dinamicas — freelancers
  let freelancerPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/users/freelancers`, { next: { revalidate: 3600 } });
    const freelancers = await res.json();
    if (Array.isArray(freelancers)) {
      freelancerPages = freelancers.map((f: any) => ({
        url: `${BASE_URL}/freelancer/${f.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch {}

  return [...staticPages, ...projectPages, ...freelancerPages];
}