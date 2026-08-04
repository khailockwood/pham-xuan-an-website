import { ReactNode, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { nav, siteName, ui } from "@/content/site";
import { cite } from "@/content/project";
import { LanguageToggle } from "./LanguageToggle";
import { cn } from "@/lib/utils";

export const Layout = ({ children }: { children: ReactNode }) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Solid pine-green masthead on every page — it flows straight into the green
  // hero on the homepage (no seam) and reads as a formal bar over paper content
  // elsewhere. A hairline appears once scrolled to separate it from paper below.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-clip bg-background text-foreground">
      <header
        className={cn(
          "sticky top-0 z-40 bg-pine-deep text-paper transition-shadow duration-300",
          scrolled ? "shadow-[0_1px_0_hsl(var(--pine-deep)),0_6px_20px_-12px_rgba(0,0,0,0.5)]" : ""
        )}
      >
        <div className="container flex h-16 items-center justify-between md:h-[68px]">
          <Link to="/" className="font-display text-lg leading-tight tracking-[0.01em] text-paper">
            {t(siteName)}
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  cn(
                    "text-[13px] tracking-[0.01em] transition-colors",
                    isActive ? "text-gold-bright" : "text-paper/70 hover:text-paper"
                  )
                }
              >
                {t(n.label)}
              </NavLink>
            ))}
            <LanguageToggle onDark />
          </nav>

          <div className="flex items-center gap-3 lg:hidden">
            <LanguageToggle onDark />
            <button
              type="button"
              className="-mr-2 p-2 text-paper"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-paper/15 bg-pine-deep">
            <nav className="container py-4 flex flex-col gap-3 text-sm">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "py-1.5 transition-colors",
                      isActive ? "text-gold-bright" : "text-paper/75 hover:text-paper"
                    )
                  }
                >
                  {t(n.label)}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1" key={location.pathname}>
        {children}
      </main>

      {/* Mirrors the hero's gold masthead rule, bookending the paper body. */}
      <footer className="border-t-2 border-gold bg-pine-deep text-paper/[0.82]">
        <div className="container py-14">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <div className="mb-2.5 font-display text-[22px] text-paper">{t(siteName)}</div>
              <p className="max-w-[26em] text-sm leading-relaxed text-paper/60">
                {t(ui.footerRights)}
              </p>
            </div>
            <div>
              <div className="mono-label mb-3.5 text-[11px] text-gold-bright">
                {t({ en: "Explore", vi: "Khám phá" })}
              </div>
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="mb-2 block text-sm text-paper/[0.78] hover:text-paper"
                >
                  {t(n.label)}
                </Link>
              ))}
            </div>
            <div>
              <div className="mono-label mb-3.5 text-[11px] text-gold-bright">
                {t({ en: "Cite this archive", vi: "Trích dẫn kho lưu trữ" })}
              </div>
              <p className="text-[13px] leading-relaxed text-paper/60">{t(cite)}</p>
            </div>
          </div>
          <div className="mono-label mt-11 flex flex-col gap-2 border-t border-paper/[0.18] pt-5 text-[10.5px] tracking-[0.12em] text-paper/45 sm:flex-row sm:justify-between">
            <span>© {new Date().getFullYear()} The Pham Xuan An Project</span>
            <span>English Edition · Phiên bản Tiếng Việt</span>
          </div>
        </div>
      </footer>
    </div>
  );
};