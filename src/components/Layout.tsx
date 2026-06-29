import { ReactNode, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { nav, siteName, ui } from "@/content/site";
import { LanguageToggle } from "./LanguageToggle";
import { cn } from "@/lib/utils";

export const Layout = ({ children }: { children: ReactNode }) => {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16 md:h-20 bg-card">
          <Link to="/" className="font-display text-base md:text-lg leading-tight tracking-tight">
            <span className="block">{t(siteName)}</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  cn(
                    "transition-colors hover:text-accent text-sm",
                    isActive ? "text-accent" : "text-foreground/80"
                  )
                }
              >
                {t(n.label)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <button
              type="button"
              className="lg:hidden p-2 -mr-2"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border bg-background">
            <nav className="container py-4 flex flex-col gap-3 text-sm">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "py-1.5 transition-colors",
                      isActive ? "text-accent" : "text-foreground/80"
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

      <footer className="border-t border-border mt-24 bg-primary text-primary-foreground">
        <div className="container py-12 grid gap-8 md:grid-cols-3">
          <div>
            <div className="font-display text-lg mb-2">{t(siteName)}</div>
            <p className="text-sm opacity-80 leading-relaxed">{t(ui.footerRights)}</p>
          </div>
          <div className="text-sm space-y-2">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="block opacity-80 hover:opacity-100">
                {t(n.label)}
              </Link>
            ))}
          </div>
          <div className="text-xs opacity-60 md:text-right self-end">
            © {new Date().getFullYear()} The Pham Xuan An Project
            <div className="mt-1">{lang === "vi" ? "Phiên bản tiếng Việt" : "English edition"}</div>
          </div>
        </div>
      </footer>
    </div>
  );
};