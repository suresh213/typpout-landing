import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "../data/site";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog");
  return rss({
    title: `${SITE.name} Blog`,
    description: "GTM playbooks, AI sales insights, and social-selling comparisons from Typpout.",
    site: context.site ?? SITE.url,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `/blog/${post.id}/`,
        categories: post.data.tags,
      })),
  });
}
