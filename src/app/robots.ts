// app/robots.ts
import type { MetadataRoute } from "next";

// ✅ Must be "export default function" — Next.js requires a default export
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/_next/",
          "/login",
          "/register",
        ],
      },
      // Block AI scrapers
      { userAgent: "GPTBot",       disallow: "/" },
      { userAgent: "ChatGPT-User", disallow: "/" },
      { userAgent: "CCBot",        disallow: "/" },
      { userAgent: "anthropic-ai", disallow: "/" },
      { userAgent: "Claude-Web",   disallow: "/" },
    ],
    sitemap: "https://www.calmatrip.com/sitemap.xml",
    host:    "https://www.calmatrip.com",
  };
}