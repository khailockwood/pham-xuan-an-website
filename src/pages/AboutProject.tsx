import { Link } from "react-router-dom";
import { useLanguage, type Bilingual } from "@/contexts/LanguageContext";
import { interviews, type Interview } from "@/content/interviews";
import {
  bilingualNote,
  cite,
  citeNote,
  collectionNote,
  indexedTopicsLabel,
  methodology,
  mission,
  noIndexYet,
  partners,
  partnersNote,
  passagesLabel,
  pendingIndexLine,
  presentation,
  recordingsLine,
  runtimeLabel,
  standfirst,
  teamNote,
} from "@/content/project";
import {
  highlightsOf,
  segmentCountOf,
  segmentHref,
  type OhmsIndexSegment,
} from "@/lib/ohms-highlights";
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

  /* The composition of the collection, read off the records themselves and off
     the OHMS exports, so the page cannot drift out of date as interviews are
     added or indexed. Nothing below is a hardcoded count. */

  const span = (years: string[]) => {
    const sorted = [...years].sort();
    return sorted.length > 1 ? `${sorted[0]}–${sorted[sorted.length - 1]}` : sorted[0];
  };

  const seconds = (hhmmss: string) => {
    const parts = hhmmss.split(":").map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return 0; // "—" when OHMS carries no duration
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  };

  /* Truncated rather than rounded, the way a duration is normally reported: a
     recording that runs 9:55:42 is nine hours and fifty-five minutes long, not
     fifty-six. Truncating everywhere also keeps the rows and the total from
     rounding in opposite directions. */
  const hoursMinutes = (total: number) => ({
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
  });

  /** One sampled topic, carrying the recording it belongs to so it can link. */
  type Topic = OhmsIndexSegment & { slug: string };

  /** Topics shown per voice. Three fits a row without turning it into a list. */
  const TOPICS_PER_VOICE = 3;

  /* Sampled round-robin — the first topic of each of a person's recordings,
     then the second of each — rather than straight down the first recording.
     Morrow's first interview is entirely childhood and Dartmouth, so reading it
     in order would describe him as a student and never reach Vietnam. */
  const sampleTopics = (recordings: Interview[]): Topic[] => {
    const perRecording = recordings.map((iv) =>
      highlightsOf(iv, TOPICS_PER_VOICE).map((s) => ({ ...s, slug: iv.slug }))
    );
    const picked: Topic[] = [];
    for (let rank = 0; rank < TOPICS_PER_VOICE; rank += 1) {
      for (const list of perRecording) {
        if (picked.length >= TOPICS_PER_VOICE) break;
        if (list[rank]) picked.push(list[rank]);
      }
    }
    return picked;
  };

  /* Group by interviewee, keeping the order the records are published in. */
  const grouped = new Map<string, Interview[]>();
  for (const iv of interviews) {
    const found = grouped.get(iv.interviewee);
    if (found) found.push(iv);
    else grouped.set(iv.interviewee, [iv]);
  }

  const subjects = [...grouped].map(([name, recordings]) => {
    const total = recordings.reduce((sum, iv) => sum + seconds(iv.duration), 0);
    return {
      name,
      count: recordings.length,
      span: span([...new Set(recordings.map((iv) => iv.date.slice(0, 4)))]),
      interviewers: [...new Set(recordings.map((iv) => iv.interviewer))],
      runtime: hoursMinutes(total),
      passages: recordings.reduce((sum, iv) => sum + segmentCountOf(iv), 0),
      topics: sampleTopics(recordings),
      /* Berman 1a/1b publish no index, and they sit under An alongside five
         recordings that do. Without this the row's passage count reads as
         covering everything he recorded. */
      unindexed: recordings.filter((iv) => segmentCountOf(iv) === 0).length,
    };
  });

  const collection = {
    recordings: interviews.length,
    people: subjects.length,
    ...hoursMinutes(interviews.reduce((sum, iv) => sum + seconds(iv.duration), 0)),
    segments: interviews.reduce((sum, iv) => sum + segmentCountOf(iv), 0),
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
          A scope-and-extent register of the archive's voices. Each entry states
          how much material there is (derived from `interviews.ts`) and what the
          OHMS index actually covers (derived from the exports, via
          `ohms-highlights`), with the topics linking into the recording at the
          point they begin. Segment titles come from the exports and are
          English-only — `title_alt` is empty in every current export — so they
          carry `lang="en"` and the labels around them stay bilingual. */}
      <section className="border-t border-border bg-paper-2">
        <div className="container py-section lg:py-section-lg">
          <h2 className="font-display text-head">
            {t({ en: "What the collection holds", vi: "Kho lưu trữ gồm những gì" })}
          </h2>
          <p className="prose-measure mt-4 text-body text-ink-soft">
            {t(collectionNote(collection))}
          </p>

          <dl className="mt-stack border-t border-border">
            {subjects.map((s) => (
              <div
                key={s.name}
                className="grid gap-x-10 gap-y-3 border-b border-border py-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:py-8"
              >
                <dt className="font-display text-sub leading-snug sm:col-start-1 sm:row-start-1">
                  {s.name}
                </dt>

                {/* Extent. Stated in words, not as a timecode, so it stays out
                    of the mono register reserved for machine values. */}
                <dd className="sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:text-right">
                  <span className="block font-display text-lead tabular-nums">
                    {t(runtimeLabel(s.runtime.hours, s.runtime.minutes))}
                  </span>
                  <span className="meta-label mt-1 block">{t(passagesLabel(s.passages))}</span>
                </dd>

                <dd className="sm:col-start-1 sm:row-start-2">
                  <p className="meta-label">
                    {t(recordingsLine({ count: s.count, span: s.span, interviewers: s.interviewers }))}
                  </p>

                  {s.topics.length > 0 ? (
                    <>
                      <p className="meta-label mt-4">{t(indexedTopicsLabel)}</p>
                      <ul className="mt-1.5 space-y-1.5">
                        {s.topics.map((topic) => (
                          <li key={`${topic.slug}-${topic.time}`}>
                            <Link
                              to={segmentHref(topic.slug, topic.time)}
                              lang="en"
                              className="text-body text-ink-soft underline decoration-gold underline-offset-4 transition-colors hover:text-pine"
                            >
                              {topic.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="meta-label mt-4">{t(noIndexYet)}</p>
                  )}

                  {s.unindexed > 0 && s.topics.length > 0 && (
                    <p className="meta-label mt-3">
                      {t(pendingIndexLine({ unindexed: s.unindexed, total: s.count }))}
                    </p>
                  )}
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
