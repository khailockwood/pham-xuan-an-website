import { useLanguage } from "@/contexts/LanguageContext";
import { partners } from "@/content/project";
import { cn } from "@/lib/utils";

/** The three partner institutions, each linking out. Logos stay in full brand
 *  colour. `showRole` adds what each one contributes (the project page). */
export const Partners = ({ showRole = false }: { showRole?: boolean }) => {
  const { t } = useLanguage();
  return (
    <div className="grid border border-border sm:grid-cols-3">
      {partners.map((p, i) => (
        <a
          key={p.go}
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group flex min-w-0 flex-col px-8 py-9 transition-colors hover:bg-paper-2",
            i < partners.length - 1 && "border-b border-border sm:border-b-0 sm:border-r"
          )}
        >
          <div className="flex h-20 w-full items-center">
            <img
              src={p.logo}
              alt={p.logoAlt}
              loading="lazy"
              className="max-h-full w-auto max-w-[80%] object-contain object-left"
            />
          </div>
          <div className="mt-7 font-display text-lead leading-snug">{t(p.name)}</div>
          <div className="mt-1 text-label text-ink-muted">{t(p.sub)}</div>
          {showRole && <p className="mt-4 text-body text-ink-soft">{t(p.role)}</p>}
          <span className="mt-5 text-label text-pine transition-colors group-hover:text-pine-deep">
            {p.go}
          </span>
        </a>
      ))}
    </div>
  );
};
