import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

/** Break a string into lines, each ≤ maxChars characters */
function wrapText(text: string, maxChars = 32): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

/** Trim description to max chars */
function trimDesc(str: string, max = 90): string {
  return str.length <= max ? str : str.slice(0, max).trimEnd() + "…";
}

// logo-full.png was cropped from the WEBP → 4922 × 1006 px
const LOGO_H = 36;
const LOGO_W = Math.round(LOGO_H * (4922 / 1006)); // ≈ 176

// Load once per request (Astro pre-renders at build time, so this is fine)
let _fontRegular: Buffer | null = null;
let _fontBold:    Buffer | null = null;
let _logo:        Buffer | null = null;

async function loadAssets(cwd: string) {
  if (_fontRegular && _fontBold && _logo) {
    return { fontRegular: _fontRegular, fontBold: _fontBold, logo: _logo };
  }
  const ttfDir = join(cwd, "src/assets/fonts");
  [_fontRegular, _fontBold, _logo] = await Promise.all([
    readFile(join(ttfDir, "Inter-400.ttf")),
    readFile(join(ttfDir, "Inter-700.ttf")),
    readFile(join(cwd, "public/logo-full.png")),
  ]);
  return { fontRegular: _fontRegular!, fontBold: _fontBold!, logo: _logo! };
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props;
  const { fontRegular, fontBold, logo } = await loadAssets(process.cwd());

  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  const category     = post.data.category ?? "Go-to-market";
  const titleLines   = wrapText(post.data.title, 32);
  const titleSize    = titleLines.length >= 3 ? 56 : titleLines.length === 2 ? 64 : 72;
  const description  = trimDesc(post.data.description ?? "", 90);
  const readingTime  = post.data.readingTime ?? "";

  const isComp     = category === "Comparisons";
  const accentClr  = isComp ? "#a78bfa" : "#60a5fa";   // violet / blue
  const badgeBg    = isComp ? "rgba(167,139,250,0.1)" : "rgba(96,165,250,0.1)";
  const badgeBdr   = isComp ? "rgba(167,139,250,0.28)" : "rgba(96,165,250,0.28)";

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width:         "1200px",
          height:        "630px",
          display:       "flex",
          flexDirection: "column",
          background:    "#0e0d0d",
          fontFamily:    "Inter",
        },
        children: [

          // ━━ Top accent bar ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          {
            type: "div",
            props: {
              style: {
                width:      "1200px",
                height:     "6px",
                background: "linear-gradient(90deg,#5b21b6 0%,#7C5AC5 40%,#a78bfa 100%)",
                flexShrink: 0,
              },
            },
          },

          // ━━ Content ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          {
            type: "div",
            props: {
              style: {
                flex:          1,
                display:       "flex",
                flexDirection: "column",
                padding:       "48px 72px 46px",
              },
              children: [

                // ── Header: logo  +  category badge ─────────────
                {
                  type: "div",
                  props: {
                    style: {
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "space-between",
                      marginBottom:   "44px",
                    },
                    children: [
                      // Real Typpout logo (PNG — purple icon + wordmark)
                      {
                        type: "img",
                        props: {
                          src:    logoSrc,
                          width:  LOGO_W,
                          height: LOGO_H,
                          style:  { display: "flex" },
                        },
                      },
                      // Category pill
                      {
                        type: "div",
                        props: {
                          style: {
                            display:       "flex",
                            alignItems:    "center",
                            padding:       "9px 22px",
                            borderRadius:  "100px",
                            background:    badgeBg,
                            border:        `1.5px solid ${badgeBdr}`,
                            fontSize:      "13px",
                            fontWeight:    700,
                            color:         accentClr,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                          },
                          children: category,
                        },
                      },
                    ],
                  },
                },

                // ── Title (up to 3 lines) ────────────────────────
                {
                  type: "div",
                  props: {
                    style: {
                      display:       "flex",
                      flexDirection: "column",
                      gap:           "2px",
                      marginBottom:  "18px",
                    },
                    children: titleLines.map((line) => ({
                      type: "div",
                      props: {
                        style: {
                          fontSize:      `${titleSize}px`,
                          fontWeight:    700,
                          color:         "#ffffff",
                          lineHeight:    "1.12",
                          letterSpacing: "-0.028em",
                        },
                        children: line,
                      },
                    })),
                  },
                },

                // ── Description ─────────────────────────────────
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize:      "19px",
                      fontWeight:    400,
                      color:         "rgba(255,255,255,0.42)",
                      lineHeight:    "1.55",
                      letterSpacing: "-0.005em",
                      flex:          1,
                    },
                    children: description,
                  },
                },

                // ── Footer: author left / reading time right ─────
                {
                  type: "div",
                  props: {
                    style: {
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "space-between",
                      paddingTop:     "20px",
                      borderTop:      "1px solid rgba(255,255,255,0.07)",
                    },
                    children: [
                      // Author
                      {
                        type: "div",
                        props: {
                          style: { display: "flex", alignItems: "center", gap: "12px" },
                          children: [
                            // Avatar circle
                            {
                              type: "div",
                              props: {
                                style: {
                                  width:          "40px",
                                  height:         "40px",
                                  borderRadius:   "50%",
                                  background:     "#7C5AC5",
                                  display:        "flex",
                                  alignItems:     "center",
                                  justifyContent: "center",
                                  fontSize:       "17px",
                                  fontWeight:     700,
                                  color:          "#fff",
                                },
                                children: "S",
                              },
                            },
                            // Name + role
                            {
                              type: "div",
                              props: {
                                style: { display: "flex", flexDirection: "column", gap: "2px" },
                                children: [
                                  {
                                    type: "div",
                                    props: {
                                      style: { fontSize: "15px", fontWeight: 600, color: "#fff" },
                                      children: "Suresh",
                                    },
                                  },
                                  {
                                    type: "div",
                                    props: {
                                      style: { fontSize: "13px", color: "rgba(255,255,255,0.35)" },
                                      children: "Founder · Typpout",
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },

                      // Reading time pill
                      readingTime
                        ? {
                            type: "div",
                            props: {
                              style: {
                                fontSize:     "14px",
                                color:        "rgba(255,255,255,0.32)",
                                fontWeight:   400,
                                letterSpacing: "0.01em",
                              },
                              children: readingTime,
                            },
                          }
                        : { type: "div", props: { style: {}, children: " " } },
                    ],
                  },
                },

              ],
            },
          },
        ],
      },
    },
    {
      width:  1200,
      height: 630,
      fonts: [
        {
          name:  "Inter",
          data:  fontRegular.buffer as ArrayBuffer,
          weight: 400,
          style: "normal",
        },
        {
          name:  "Inter",
          data:  fontBold.buffer as ArrayBuffer,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );

  // Render at 2× then Resvg scales to 1200 — sharper output
  const resvg = new Resvg(svg, {
    fitTo:      { mode: "width", value: 1200 },
    shapeRendering: 2,   // geometricPrecision
    textRendering:  2,   // optimizeLegibility
    imageRendering: 0,   // optimizeQuality
  });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      "Content-Type":  "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
