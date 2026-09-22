import { useLanguage } from "@/contexts/LanguageContext";
import { bioBody, bioIntro, timeline } from "@/content/bio";

const AboutPxa = () => {
  const { t } = useLanguage();
  return (
    <article className="container py-section prose-measure">
      <h1 className="font-display text-title mb-8">
        {t({ en: "Who Was Pham Xuan An?", vi: "Phạm Xuân Ẩn là ai?" })}
      </h1>

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

      <h2 className="font-display text-head mt-20 mb-8">
        {t({ en: "Timeline", vi: "Mốc thời gian" })}
      </h2>
      <ol className="border-l border-border pl-6 space-y-6">
        {timeline.map((entry) => (
          <li key={entry.year} className="relative">
            <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-accent" />
            <div className="font-display text-lead tabular-nums text-pine">{entry.year}</div>
            <div className="text-ink-soft">{t(entry.event)}</div>
          </li>
        ))}
      </ol>
    </article>
  );
};

export default AboutPxa;