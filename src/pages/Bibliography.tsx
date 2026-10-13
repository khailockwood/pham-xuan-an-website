import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { bibliographyDek, bibliographyNote, bibliographyTitle } from "@/content/bibliography";

const Bibliography = () => {
  const { t } = useLanguage();

  return (
    <div className="container py-section lg:py-section-lg">
      <h1 className="font-display text-title">{t(bibliographyTitle)}</h1>
      <p className="prose-measure mt-5 font-display text-lead text-ink-soft">{t(bibliographyDek)}</p>
      <p className="prose-measure mt-stack border-t border-border pt-6 text-ink-soft">
        {t(bibliographyNote)}
      </p>
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
