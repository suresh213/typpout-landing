export const SITE = {
  name: "Typpout",
  url: "https://www.typpout.com",
  tagline: "The Fastest way from ICP to Outreach to Revenue",
  description:
    "Typpout is the AI go-to-market platform that listens to social conversations on LinkedIn, X and Instagram, finds in-market buyers matching your ICP, and books meetings with personalised AI outreach and instant replies.",
  shortDescription: "Go-To-Market with socials data and the ability to act on it",
  ogImage: "/logo.png",
  twitter: "@typpout",
  email: "founders@typpout.com",
  appUrl: "https://dashboard.typpout.com",
  demoUrl: "https://cal.com/typpout/demo",
  founder: {
    name: "Founder, Typpout",
    handle: "@typpout",
    avatarInitials: "TP",
  },
} as const;

export const NAV = [
  { label: "Integrations", href: "/integrations" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blogs" },
] as const;

export const FOOTER_NAV = {
  Product: [
    { label: "Integrations", href: "/integrations" },
    { label: "Pricing", href: "/pricing" },
    { label: "Changelog", href: "/changelog" },
  ],
  Resources: [
    { label: "Blog", href: "/blogs" },
    { label: "Book a demo", href: "https://cal.com/typpout/demo" },
    { label: "Contact us", href: "mailto:founders@typpout.com" },
  ],
  Compare: [
    { label: "vs Jeeva AI", href: "/blogs/jeeva-ai-alternative" },
    { label: "vs Orange Slice", href: "/blogs/orange-slice-alternative" },
    { label: "vs HeyReach", href: "/blogs/heyreach-alternative" },
    { label: "vs Signalbase", href: "/blogs/signalbase-alternative" },
  ],
  Legal: [
    { label: "Terms of service", href: "/terms" },
    { label: "Privacy policy", href: "/privacy" },
    { label: "Security", href: "/security" },
  ],
};

export const SOCIAL = [
  { label: "X", href: "https://x.com/typpout", icon: "x" as const },
  { label: "LinkedIn", href: "https://linkedin.com/company/typpout", icon: "linkedin" as const },
  { label: "YouTube", href: "https://youtube.com/@typpout", icon: "youtube" as const },
  { label: "Instagram", href: "https://instagram.com/typpout", icon: "instagram" as const },
];

/* =========================================================================
   SEO keyword strategy - clusters mapped to user intent, informed by
   competitive analysis of jeeva.ai, orangeslice.ai, trysignalbase.com,
   heyreach.io, apollo.io, clay.com.

   Each cluster represents a search intent we rank for. Long-tail variations
   live in blog posts; short-tail anchors live on the home & pricing pages.
   ========================================================================= */
export const KEYWORD_CLUSTERS = {
  primary: [
    "AI go-to-market platform",
    "AI GTM platform",
    "social selling platform",
    "social listening for sales",
    "buying intent signals",
    "social intent data",
  ],
  product: [
    "AI SDR",
    "AI sales agent",
    "AI reply agent",
    "AI outreach platform",
    "ICP finder",
    "AI lead finder",
    "personalised AI outreach",
    "LinkedIn outreach automation",
  ],
  competitor: [
    "Jeeva AI alternative",
    "Orange Slice alternative",
    "HeyReach alternative",
    "Signalbase alternative",
    "Apollo alternative for social selling",
    "Clay alternative",
    "PhantomBuster alternative",
  ],
  longtail: [
    "how to find buyers on LinkedIn",
    "AI tools for SDRs 2026",
    "B2B intent data tools",
    "AI sales tools for founders",
    "AI outbound for PMM teams",
    "best social selling tool 2026",
    "intent-based outbound platform",
  ],
};

export const KEYWORDS = [
  ...KEYWORD_CLUSTERS.primary,
  ...KEYWORD_CLUSTERS.product,
  ...KEYWORD_CLUSTERS.competitor,
];
