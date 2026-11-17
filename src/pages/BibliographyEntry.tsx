import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { notFoundTitle, usePageTitle } from "@/hooks/use-page-title";
import { sources } from "@/content/bibliography";
import { Emphasis } from "@/components/Emphasis";
import NotFound from "./NotFound";

/* One published account: the record, the project's summary of it, the
   context it was written in, and how to cite it. The summary and context are
   interpretation, so the page labels them as the project's own reading. */
const BibliographyEntry = () => {
  const { slug } = useParams();
  const { t } = useLanguage();
  const source = sources.find((s) => s.slug === slug);
  usePageTitle(source ? source.title : notFoundTitle);
  if (!source) return <NotFound />;

  const record: { label: string; value: string }[] = [
    { label: t({ en: "Author", vi: "Tác giả" }), value: source.author },
    { label: t({ en: "Published", vi: "Xuất bản" }), value: `${source.place}: ${source.publisher}, ${source.year}` },
    { label: t({ en: "Kind", vi: "Loại" }), value: t(source.kind) },
    {
      label: t({ en: "Language", vi: "Ngôn ngữ" }),
      value: source.lang === "en" ? t({ en: "English", vi: "Tiếng Anh" }) : t({ en: "Vietnamese", vi: "Tiếng Việt" }),
    },
  ];

  const sections = [
    { id: "summary", title: { en: "Summary", vi: "Tóm tắt" }, body: source.summary },
    { id: "context", title: { en: "Context", vi: "Bối cảnh" }, body: source.context },
  ];

  return (
    <article className="container py-section lg:py-section-lg">
      <Link to="/bibliography" className="inline-flex items-center gap-2 text-label text-pine hover:text-pine-deep">
        <ArrowLeft size={14} aria-hidden /> {t({ en: "The bibliography", vi: "Thư mục" })}
      </Link>

      <header className="mt-8 max-w-[44rem]">
        <h1 lang={source.lang} className="text-balance font-display text-title font-normal italic">
          {source.title}
        </h1>
        {source.subtitle && (
          <p lang={source.lang} className="mt-3 text-pretty font-display text-lead italic text-ink-soft">
            {source.subtitle}
          </p>
        )}
        <p className="mt-5 font-display text-lead">
          {source.author}, {source.year}
        </p>
      </header>

      <div className="mt-stack grid gap-x-12 gap-y-10 lg:grid-cols-[1fr_17rem]">
        <div className="prose-measure space-y-10">
          {sections.map((s) => (
            <section key={s.id} aria-labelledby={`bib-${s.id}`}>
              <h2 id={`bib-${s.id}`} className="font-display text-sub">
                {t(s.title)}
              </h2>
              <div className="mt-3 space-y-4 text-ink-soft">
                {t(s.body)
                  .split("\n\n")
                  .map((p, i) => (
                    <p key={i}>
                      <Emphasis text={p} />
                    </p>
                  ))}
              </div>
            </section>
          ))}
          <p className="meta-label border-t border-border pt-4">
            {t({
              en: "The project's researchers wrote the summary and context. They are not part of the book.",
              // TODO: verify VI
              vi: "Phần tóm tắt và bối cảnh do các nhà nghiên cứu của dự án viết, không thuộc về cuốn sách.",
            })}
          </p>
        </div>

        {/* The record, then the citation: what a reader copies. */}
        <aside className="space-y-8">
          <dl className="border-t border-ink">
            {record.map((r) => (
              <div key={r.label} className="border-b border-border py-3">
                <dt className="meta-label">{r.label}</dt>
                <dd className="mt-0.5 text-body">{r.value}</dd>
              </div>
            ))}
          </dl>
          <div>
            <h2 className="font-display text-lead">{t({ en: "Cite this source", vi: "Trích dẫn nguồn này" })}</h2>
            <p className="mt-3 border-l border-strong pl-4 text-body text-ink">
              <Emphasis text={source.citation} />
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
};

export default BibliographyEntry;
