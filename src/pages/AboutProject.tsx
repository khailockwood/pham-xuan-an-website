import { Link } from "react-router-dom";
import { useLanguage, type Bilingual } from "@/contexts/LanguageContext";
import { interviews } from "@/content/interviews";
import {
  bilingualNote,
  cite,
  citeNote,
  methodology,
  mission,
  partners,
  partnersNote,
  presentation,
  standfirst,
  teamNote,
} from "@/content/project";
import { cn } from "@/lib/utils";

/** Heading + prose, set as a two-column spread on wide screens. */
const Spread = ({
  title,
  children,
  className,
}: {
  title: Bilingual;
  children: React.ReactNode;
  className?: string;
}) => {
  const { t } = useLanguage();
  return (
    <div className={cn("grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16", className)}>
      <h2 className="font-display text-head leading-tight">{t(title)}</h2>
      <div className="prose-measure space-y-4 text-ink-soft">{children}</div>
    </div>
  );
};

const AboutProject = () => {
  const { t } = useLanguage();

  /* The composition of the collection, read off the records themselves so the
     page cannot drift out of date as interviews are added. */
  const subjects = interviews.reduce<
    { name: string; count: number; years: string[]; interviewers: string[] }[]
  >((acc, iv) => {
    const year = iv.date.slice(0, 4);
    const found = acc.find((s) => s.name === iv.interviewee);
    if (found) {
      found.count += 1;
      if (!found.years.includes(year)) found.years.push(year);
      if (!found.interviewers.includes(iv.interviewer)) found.interviewers.push(iv.interviewer);
    } else {
      acc.push({ name: iv.interviewee, count: 1, years: [year], interviewers: [iv.interviewer] });
    }
    return acc;
  }, []);

  const span = (years: string[]) => {
    const sorted = [...years].sort();
    return sorted.length > 1 ? `${sorted[0]}–${sorted[sorted.length - 1]}` : sorted[0];
  };

  return (
    <>
      {/* ---------- Title ---------- */}
      <section className="border-b border-border">
        <div className="container py-section lg:py-section-lg">
          <h1 className="max-w-[12em] font-display text-title">
            {t({ en: "The Pham Xuan An Project", vi: "Dự án Phạm Xuân Ẩn" })}
          </h1>
          <p className="prose-measure mt-7 font-display text-lead text-ink-soft">
            {t(standfirst)}
          </p>
        </div>
      </section>

      {/* ---------- Mission & method ---------- */}
      <section className="container space-y-16 py-section lg:space-y-20 lg:py-section-lg">
        <Spread title={{ en: "Why this archive exists", vi: "Vì sao có kho lưu trữ này" }}>
          <p>{t(mission)}</p>
          <p>{t(methodology)}</p>
        </Spread>

        <Spread title={{ en: "How to read a recording", vi: "Cách đọc một bản ghi" }}>
          <p>{t(presentation)}</p>
          <Link
            to="/interviews"
            className="inline-flex border-b border-gold pb-0.5 text-label text-pine"
          >
            {t({ en: "Browse the interviews", vi: "Duyệt các cuộc phỏng vấn" })}
          </Link>
        </Spread>

        <Spread title={{ en: "Two languages", vi: "Hai ngôn ngữ" }}>
          <p>{t(bilingualNote)}</p>
        </Spread>
      </section>

      {/* ---------- What the collection holds ----------
          A register of the archive's voices, derived from `interviews.ts`. */}
      <section className="border-t border-border bg-paper-2">
        <div className="container py-section lg:py-section-lg">
          <h2 className="font-display text-head">
            {t({ en: "What the collection holds", vi: "Kho lưu trữ gồm những gì" })}
          </h2>
          <p className="prose-measure mt-4 text-body text-ink-soft">
            {t({
              en: `${interviews.length} recordings with ${subjects.length} people. The 2005 sessions are conversations with An himself, recorded by historians and writers in the last year of his life. The rest were recorded by the project, with colleagues and friends who knew him.`,
              vi: `${interviews.length} bản ghi với ${subjects.length} người. Các buổi ghi năm 2005 là những cuộc trò chuyện với chính ông Ẩn, do các nhà sử học và nhà văn thực hiện trong năm cuối đời ông. Số còn lại do dự án ghi, với đồng nghiệp và bạn bè từng quen biết ông.`,
            })}
          </p>

          <dl className="mt-stack border-t border-border">
            {subjects.map((s) => (
              <div
                key={s.name}
                className="grid gap-x-8 gap-y-2 border-b border-border px-4 py-6 sm:grid-cols-[1fr_auto] sm:px-5"
              >
                <div>
                  <dt className="font-display text-sub leading-snug">{s.name}</dt>
                  <dd className="meta-label mt-1.5">
                    {t({ en: "Interviewed by", vi: "Phỏng vấn bởi" })}{" "}
                    {s.interviewers.join(", ")}
                  </dd>
                </div>
                <dd className="meta-label tabular-nums sm:text-right">
                  <span className="text-ink-soft">
                    {s.count}{" "}
                    {s.count === 1
                      ? t({ en: "recording", vi: "bản ghi" })
                      : t({ en: "recordings", vi: "bản ghi" })}
                  </span>
                  <span className="block">{span(s.years)}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- Partners ---------- */}
      <section className="border-t border-border">
        <div className="container py-section lg:py-section-lg">
          <h2 className="font-display text-head">{t({ en: "Partners", vi: "Đối tác" })}</h2>
          <p className="prose-measure mt-4 text-body text-ink-soft">{t(partnersNote)}</p>

          <div className="mt-stack grid border border-border sm:grid-cols-3">
            {partners.map((p, i) => (
              <a
                key={p.go}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group flex flex-col px-8 py-9 transition-colors hover:bg-paper-2",
                  i < partners.length - 1 && "border-b border-border sm:border-b-0 sm:border-r"
                )}
              >
                <div className="flex h-20 items-center">
                  <img
                    src={p.logo}
                    alt={p.logoAlt}
                    loading="lazy"
                    className="max-h-full w-auto max-w-[80%] object-contain object-left"
                  />
                </div>
                <div className="mt-7 font-display text-lead leading-snug">{t(p.name)}</div>
                <div className="mt-1 text-label text-ink-muted">{t(p.sub)}</div>
                <p className="mt-4 text-body text-ink-soft">{t(p.role)}</p>
                <span className="mt-5 text-label text-pine transition-colors group-hover:text-pine-deep">
                  {p.go}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Team & citation ---------- */}
      <section className="border-t border-border bg-paper-2">
        <div className="container grid gap-16 py-section lg:grid-cols-2 lg:py-section-lg">
          <div>
            <h2 className="font-display text-head">{t({ en: "Who made it", vi: "Ai thực hiện" })}</h2>
            <p className="prose-measure mt-4 text-body text-ink-soft">{t(teamNote)}</p>
            <Link
              to="/contact"
              className="mt-6 inline-flex border-b border-gold pb-0.5 text-label text-pine"
            >
              {t({ en: "Get in touch", vi: "Liên hệ" })}
            </Link>
          </div>

          <div>
            <h2 className="font-display text-head">
              {t({ en: "How to cite", vi: "Cách trích dẫn" })}
            </h2>
            <p className="prose-measure mt-4 text-body text-ink-soft">{t(citeNote)}</p>
            {/* A citation format is a machine-typed pattern, so it keeps the mono face. */}
            <p className="mono-label mt-6 border-l-2 border-gold bg-paper p-gutter leading-relaxed text-ink-soft">
              {t(cite)}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutProject;
