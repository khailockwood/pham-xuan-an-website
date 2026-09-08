import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Named project palette (alpha-aware so bg-paper/60 etc. work) */
        paper: {
          DEFAULT: "hsl(var(--paper) / <alpha-value>)",
          2: "hsl(var(--paper-2) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "hsl(var(--ink) / <alpha-value>)",
          soft: "hsl(var(--ink-soft) / <alpha-value>)",
          /* Solid third rank on the ink ramp. Replaces the alpha-faded
             text-ink-soft/45…/65 that fell below 4.5:1 on paper. */
          muted: "hsl(var(--ink-muted) / <alpha-value>)",
        },
        pine: {
          DEFAULT: "hsl(var(--pine) / <alpha-value>)",
          deep: "hsl(var(--pine-deep) / <alpha-value>)",
        },
        gold: {
          DEFAULT: "hsl(var(--gold) / <alpha-value>)",
          bright: "hsl(var(--gold-bright) / <alpha-value>)",
        },
      },
      /* `border-strong`: the rule weight for real control boundaries (inputs,
         filter chips, buttons). `border-border` stays the hairline that
         separates records in a register — it is 1.39:1 and must not carry a
         control edge on its own. Lives on borderColor only so it cannot leak
         into bg-/text- utilities. */
      borderColor: {
        strong: "hsl(var(--rule-strong) / <alpha-value>)",
      },
      /* ---- Type scale ----------------------------------------------------
         Body ranks step by ~1.2 from a 17px base (14 · 17 · 20); display
         ranks step by 1.333 above it (27 · 36 · 48). Two ranks sit off the
         run on purpose: `micro` (13px) is the readability floor and exists
         only for machine-typed values, and `masthead` (82px) is the one
         place the page raises its voice — the hero name. Names are roles,
         not sizes, so a rank can be re-tuned without renaming 200 classes. */
      fontSize: {
        micro: ["0.8125rem", { lineHeight: "1.4" }], // 13px — floor: timecodes, record ids
        label: ["0.875rem", { lineHeight: "1.45" }], // 14px — metadata voice
        body: ["1.0625rem", { lineHeight: "1.65" }], // 17px — running prose (base)
        lead: ["1.25rem", { lineHeight: "1.55" }], // 20px — deks, standfirsts
        sub: ["1.6875rem", { lineHeight: "1.25", letterSpacing: "-0.005em" }], // 27px — h3
        head: ["2.25rem", { lineHeight: "1.14", letterSpacing: "-0.01em" }], // 36px — h2
        title: ["3rem", { lineHeight: "1.05", letterSpacing: "-0.015em" }], // 48px — h1
        masthead: ["5.125rem", { lineHeight: "0.98", letterSpacing: "-0.02em" }], // 82px — hero, once
      },
      /* ---- Spacing ranks -------------------------------------------------
         Only the rhythm that was being written as arbitrary pixels. Everything
         smaller keeps Tailwind's 4px step. `section` / `section-lg` collapse
         the old py-20 / py-[84px] / py-[88px] trio into two ranks. */
      spacing: {
        gutter: "1.75rem", // 28px — inner padding of a framed block
        stack: "2.75rem", // 44px — heading block to the content it introduces
        section: "5rem", // 80px — vertical rhythm of a page section
        "section-lg": "5.5rem", // 88px — the same at lg and up
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        display: ["Newsreader", "Georgia", "serif"],
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
        /* IBM Plex Mono, not Cutive Mono: Cutive ships no `vietnamese` unicode
           subset, so ạ ẩ ị ử ồ fell back mid-word. Plex Mono is the same
           superfamily as the sans and covers Vietnamese in full. */
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
