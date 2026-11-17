import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/use-page-title";
import { bibliographyDek, bibliographyNote, bibliographyTitle, sources } from "@/content/bibliography";

const Bibliography = () => {
  const { t } = useLanguage();
  usePageTitle({ en: "Bibliography", vi: "Thư mục" });

  return (
    <div className="container py-section lg:py-section-lg">
      <h1 className="font-display text-title">{t(bibliographyTitle)}</h1>
      <p className="prose-measure mt-5 font-display text-lead text-ink-soft">{t(bibliographyDek)}</p>
      <p className="prose-measure mt-stack border-t border-border pt-6 text-ink-soft">
        {t(bibliographyNote)}
      </p>

      {/* A register: one hairline-ruled row per work, the whole row a link. */}
      <ul className="mt-stack border-t border-border">
        {sources.map((s) => (
          <li key={s.slug}>
            <Link
              to={`/bibliography/${s.slug}`}
              className="group grid gap-x-8 gap-y-2 border-b border-border px-4 py-7 transition-colors hover:bg-paper-2 sm:px-5 md:grid-cols-[1fr_auto]"
            >
              <span>
                <cite lang={s.lang} className="block font-display text-sub font-normal leading-snug transition-colors group-hover:text-pine">
                  {s.title}
                </cite>
                {s.subtitle && (
                  <span lang={s.lang} className="mt-1 block font-display text-lead italic text-ink-soft">
                    {s.subtitle}
                  </span>
                )}
                <span className="mt-2 block text-body">{s.author}</span>
              </span>
              <span className="meta-label flex flex-wrap gap-x-4 md:flex-col md:items-end">
                <span className="tabular-nums">{s.year}</span>
                <span>{t(s.kind)}</span>
                <span>{s.lang === "en" ? t({ en: "English", vi: "Tiếng Anh" }) : t({ en: "Vietnamese", vi: "Tiếng Việt" })}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        to="/interviews"
        className="mt-9 inline-flex border-b border-gold pb-0.5 text-label text-pine"
      >
        {t({ en: "Go to the interviews", vi: "Đến phần phỏng vấn" })}
      </Link>
    </div>
  );
};

export default Bibliography;
