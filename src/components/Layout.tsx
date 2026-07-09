import { ReactNode, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { nav, siteName, ui } from "@/content/site";
import { cite } from "@/content/project";
import { LanguageToggle } from "./LanguageToggle";
import { cn } from "@/lib/utils";

export const Layout = ({ children }: { children: ReactNode }) => {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  // On the homepage the nav rides transparently inside the dark hero at the top
  // (one unbroken "classified cover"), then settles into a solid paper bar once
  // you scroll past the hero. Elsewhere, and with the mobile menu open, it stays
  // the paper bar so content beneath it reads.
  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const overlay = isHome && !scrolled && !open;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header
        className={cn(
          "sticky top-0 z-40 transition-colors duration-300",
          overlay
            ? "border-b border-transparent bg-transparent text-paper"
            : "border-b border-border bg-paper/[0.86] text-foreground backdrop-blur-md"
        )}
      >
        <div className="container flex h-16 items-center justify-between md:h-[68px]">
          <Link to="/" className="font-display text-lg leading-tight tracking-[0.01em]">
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
                    overlay
                      ? isActive
                        ? "text-gold-bright"
                        : "text-paper/75 hover:text-paper"
                      : isActive
                        ? "text-pine"
                        : "text-ink-soft hover:text-pine"
                  )
                }
              >
                {t(n.label)}
              </NavLink>
            ))}
            <LanguageToggle onDark={overlay} />
          </nav>

          <div className="flex items-center gap-3 lg:hidden">
            <LanguageToggle onDark={overlay} />
            <button
              type="button"
              className="-mr-2 p-2"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border bg-paper">
            <nav className="container py-4 flex flex-col gap-3 text-sm">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "py-1.5 transition-colors",
                      isActive ? "text-pine" : "text-ink-soft"
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

      <footer className="bg-pine-deep text-paper/[0.82]">
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