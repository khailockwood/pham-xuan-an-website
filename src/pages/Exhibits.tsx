import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/use-page-title";
import { exhibits } from "@/content/exhibits";

const inPreparation = { en: "In preparation", vi: "Đang chuẩn bị" };

/* A register of the exhibits. One still in preparation is listed by its
   working title and marked so, without a link, since there is nothing behind
   it to open yet. */
const Exhibits = () => {
  const { t } = useLanguage();
  usePageTitle({ en: "Exhibits", vi: "Triển lãm" });
  return (
    <div className="container py-section lg:py-section-lg">
      <h1 className="font-display text-title">{t({ en: "Exhibits", vi: "Triển lãm" })}</h1>
      <p className="prose-measure mt-5 font-display text-lead text-ink-soft">
        {t({
          en: "Essays and data visualizations built from the recordings. Neither is published yet.",
          // TODO: verify VI
          vi: "Các tiểu luận và trực quan hóa dữ liệu dựng từ các bản ghi. Chưa có triển lãm nào được công bố.",
        })}
      </p>

      <ul className="mt-stack border-t border-border">
        {exhibits.map((ex) => {
          const body = (
            <>
              <span className="block font-display text-sub font-normal leading-snug transition-colors group-hover:text-pine">
                {t(ex.title)}
              </span>
              <span className="prose-measure mt-2 block text-body text-ink-soft">{t(ex.dek)}</span>
              {!ex.published && <span className="meta-label mt-3 block">{t(inPreparation)}</span>}
            </>
          );
          return (
            <li key={ex.slug} className="border-b border-border">
              {ex.published ? (
                <Link to={`/exhibits/${ex.slug}`} className="group block px-4 py-7 transition-colors hover:bg-paper-2 sm:px-5">
                  {body}
                </Link>
              ) : (
                <div className="px-4 py-7 sm:px-5">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Exhibits;
