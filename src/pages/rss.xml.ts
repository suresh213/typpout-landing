import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "../data/site";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog");
  const siteUrl = (context.site?.toString() ?? SITE.url).replace(/\/$/, "");

  return rss({
    title: `${SITE.name} Blog`,
    description: "GTM playbooks, AI sales insights, and social-selling comparisons from Typpout.",
    site: siteUrl,
    trailingSlash: false,
    customData: [
      `<language>en-US</language>`,
      `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
      `<managingEditor>${SITE.email} (${SITE.founder.name})</managingEditor>`,
      `<image>`,
      `  <url>${siteUrl}/logo-full.webp</url>`,
      `  <title>${SITE.name} Blog</title>`,
      `  <link>${siteUrl}/blog</link>`,
      `</image>`,
      `<atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom"/>`,
    ].join("\n"),
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.seoTitle ?? post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `/blog/${post.id}`,
        categories: post.data.tags,
      })),
  });
}
