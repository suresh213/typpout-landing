import { getCollection } from "astro:content";
import { SITE } from "../data/site";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog");
  const siteUrl = context.site?.toString().replace(/\/$/, "") ?? SITE.url;

  const staticPages = [
    "",
    "blog",
    "changelog",
    "integrations",
    "pricing",
    "privacy",
    "security",
    "terms",
  ];

  const urls = [
    siteUrl,
    ...staticPages.filter(Boolean).map((page) => `${siteUrl}/${page}`),
    ...posts.map((post) => `${siteUrl}/blog/${post.id}`),
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemapXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
