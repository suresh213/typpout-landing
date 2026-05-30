import { getCollection } from "astro:content";
import { SITE } from "../data/site";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog");
  const siteUrl = context.site?.toString().replace(/\/$/, "") ?? SITE.url;

  const today = new Date().toISOString().slice(0, 10);

  // Sort posts newest-first so Googlebot sees freshest content first
  const sortedPosts = [...posts].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  type UrlEntry = {
    loc: string;
    lastmod: string;
    changefreq: string;
    priority: string;
  };

  const staticPages: UrlEntry[] = [
    { loc: siteUrl,                     lastmod: today,  changefreq: "daily",   priority: "1.0" },
    { loc: `${siteUrl}/blog`,           lastmod: today,  changefreq: "daily",   priority: "0.9" },
    { loc: `${siteUrl}/pricing`,        lastmod: today,  changefreq: "weekly",  priority: "0.8" },
    { loc: `${siteUrl}/integrations`,   lastmod: today,  changefreq: "weekly",  priority: "0.7" },
    { loc: `${siteUrl}/testimonials`,   lastmod: today,  changefreq: "weekly",  priority: "0.7" },
    { loc: `${siteUrl}/changelog`,      lastmod: today,  changefreq: "weekly",  priority: "0.6" },
    { loc: `${siteUrl}/privacy`,        lastmod: today,  changefreq: "monthly", priority: "0.3" },
    { loc: `${siteUrl}/security`,       lastmod: today,  changefreq: "monthly", priority: "0.3" },
    { loc: `${siteUrl}/terms`,          lastmod: today,  changefreq: "monthly", priority: "0.3" },
  ];

  const blogUrls: UrlEntry[] = sortedPosts.map((post) => ({
    loc: `${siteUrl}/blog/${post.id}`,
    lastmod: (post.data.updatedDate ?? post.data.pubDate).toISOString().slice(0, 10),
    changefreq: "weekly",
    priority: post.data.featured ? "0.9" : "0.8",
  }));

  const allUrls = [...staticPages, ...blogUrls];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allUrls
  .map(
    ({ loc, lastmod, changefreq, priority }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemapXml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
