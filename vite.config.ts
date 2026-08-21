import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

/**
 * The absolute origin this site is served from in production, e.g.
 * "https://pham-xuan-an.vercel.app". Open Graph and Twitter card scrapers want
 * absolute URLs, but the production domain is not fixed yet — so we never write
 * one into the repo. It is resolved at build time instead:
 *
 *  1. SITE_ORIGIN — an explicit escape hatch (full origin, with scheme) for
 *     building outside Vercel or overriding a preview.
 *  2. VERCEL_PROJECT_PRODUCTION_URL — Vercel's own system env var. Per Vercel's
 *     docs it is "a production domain name of the project… the shortest
 *     production custom domain, or vercel.app domain if no custom domain is
 *     available", is "always set, even in preview deployments", and is
 *     explicitly intended for "reliably generat[ing] links that point to
 *     production such as OG-image URLs". It carries the host only, no scheme,
 *     so we prefix https://. Attaching a custom domain later changes this value
 *     automatically — no edit to this repo.
 *
 * Caveat worth knowing: Vercel only exposes system env vars when "Enable access
 * to System Environment Variables" is checked in Project Settings →
 * Environment Variables. If it is off, the var is absent and we fall back to "",
 * which leaves the tags root-relative — degraded, not broken.
 */
function siteOrigin(): string {
  const explicit = (process.env.SITE_ORIGIN || "").trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const host = (process.env.VERCEL_PROJECT_PRODUCTION_URL || "").trim();
  if (!host) return ""; // local dev / non-Vercel build → root-relative URLs
  return `https://${host.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;
}

/**
 * Substitute %SITE_ORIGIN% in index.html at build time.
 *
 * Vite's built-in `%VAR%` substitution only covers VITE_-prefixed variables, and
 * VERCEL_PROJECT_PRODUCTION_URL is not one, hence this plugin. `order: "pre"`
 * runs it before Vite's own HTML env hook sees the token.
 *
 * With no origin available the token collapses to "", so `%SITE_ORIGIN%/og-image.jpg`
 * becomes `/og-image.jpg` — the root-relative form every major scraper resolves
 * against the page URL. og:url is dropped entirely in that case: a bare "/" is a
 * useless canonical, whereas a relative image still works. The literal token and
 * the string "undefined" can never reach the output.
 */
function siteOriginHtml(): Plugin {
  const TOKEN = "%SITE_ORIGIN%";
  return {
    name: "pxa:site-origin-html",
    transformIndexHtml: {
      order: "pre",
      handler(html: string) {
        const origin = siteOrigin();
        let out = origin
          ? html
          : html.replace(/^[ \t]*<meta property="og:url"[^>]*>[ \t]*\r?\n/m, "");
        out = out.split(TOKEN).join(origin);
        if (out.includes(TOKEN)) {
          throw new Error(`${TOKEN} survived substitution in index.html`);
        }
        return out;
      },
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), siteOriginHtml(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
