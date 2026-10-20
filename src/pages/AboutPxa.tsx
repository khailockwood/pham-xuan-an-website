import { useLanguage } from "@/contexts/LanguageContext";
import { bioBody, bioIntro, doubleRecord, lifeDates, recordHeads } from "@/content/bio";

const AboutPxa = () => {
  const { t } = useLanguage();

  /** The chronology, stacked as two plain lists. Visible on small screens; kept
      in the accessibility tree at every size, because the spine below is a
      visual arrangement that does not read in a sensible order. */
  const RecordList = ({ side }: { side: "seen" | "also" }) => (
    <div>
      <h3 className="mb-4 border-b border-strong pb-2 font-display text-lead">
        {t(recordHeads[side])}
      </h3>
      <dl className="grid grid-cols-[3.75rem_1fr] gap-x-4 gap-y-3">
        {doubleRecord
          .filter((r) => r[side])
          .map((r) => (
            <div key={r.year} className="contents">
              <dt className="font-display text-lead leading-snug tabular-nums text-ink-muted">
                {r.year}
              </dt>
              <dd className="text-body text-ink-soft">{t(r[side]!)}</dd>
            </div>
          ))}
      </dl>
    </div>
  );

  return (
    <>
      <article className="container prose-measure py-section">
        <h1 className="font-display text-title">
          {t({ en: "Who Was Pham Xuan An?", vi: "Phạm Xuân Ẩn là ai?" })}
        </h1>

        <dl className="meta-label mb-10 mt-5 space-y-0.5">
          {lifeDates.map((d) => (
            <div key={d.label.en} className="flex gap-1.5">
              <dt>{t(d.label)}</dt>
              <dd>{t(d.value)}</dd>
            </div>
          ))}
        </dl>

        <div className="space-y-6 font-display text-lead leading-relaxed text-ink-soft">
          <p className="first-letter:font-display first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:leading-[0.9]">
            {t(bioIntro)}
          </p>
        </div>

        <div className="mt-10 space-y-6 text-ink-soft">
          {t(bioBody).split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>

      {/* ---------- The double record ----------
          Stays on the white ground: the spine's years knock a hole in the rule
          with `bg-paper`. */}
      <section className="container border-t border-border py-section lg:py-section-lg">
        <h2 className="max-w-[14em] font-display text-head">
          {t({ en: "Two lives, simultaneously.", vi: "Hai cuộc đời, cùng một lúc." })}
        </h2>

        {/* Stacked lists: the small-screen layout, and the reading order for
            assistive technology at every size. */}
        <div className="mt-stack grid gap-10 sm:grid-cols-2 md:sr-only">
          <RecordList side="seen" />
          <RecordList side="also" />
        </div>

        {/* The spine: one chronology, entries hanging off the years to the side
            they belong to. 1975 is the only year with both. */}
        <div className="mt-stack hidden max-w-[60rem] md:mx-auto md:block" aria-hidden="true">
          <div className="grid grid-cols-[1fr_5.5rem_1fr] items-end gap-x-8 border-b border-border pb-3">
            <h3 className="font-display text-lead text-ink-muted md:text-right">
              {t(recordHeads.seen)}
            </h3>
            <span />
            <h3 className="font-display text-lead text-ink-muted">{t(recordHeads.also)}</h3>
          </div>

          {doubleRecord.map((r) => (
            <div
              key={r.year}
              className="grid min-h-[5.75rem] grid-cols-[1fr_5.5rem_1fr] items-center gap-x-8"
            >
              <p className="py-3 text-right text-body leading-snug text-ink-soft">
                {r.seen && t(r.seen)}
              </p>
              {/* the year knocks a hole in the rule it sits on; `self-stretch`
                  keeps the rule spanning the full row while the year centres */}
              <div className="relative flex items-center justify-center self-stretch">
                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink/25" />
                <span className="relative bg-paper px-2.5 font-display text-sub leading-none tabular-nums">
                  {r.year}
                </span>
              </div>
              <p className="py-3 text-body leading-snug text-ink-soft">{r.also && t(r.also)}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default AboutPxa;
