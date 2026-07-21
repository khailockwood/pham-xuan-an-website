import { useLanguage } from "@/contexts/LanguageContext";
import { Eyebrow } from "@/components/Eyebrow";
import { bioBody, bioIntro, timeline } from "@/content/bio";

const AboutPxa = () => {
  const { t } = useLanguage();
  return (
    <article className="container py-16 md:py-24 max-w-4xl">
      <Eyebrow>{t({ en: "Biography", vi: "Tiểu sử" })}</Eyebrow>
      <h1 className="font-display text-4xl md:text-5xl leading-tight mb-8">
        {t({ en: "Who Was Pham Xuan An?", vi: "Phạm Xuân Ẩn là ai?" })}
      </h1>

      <div className="prose-style space-y-6 text-lg text-foreground/85 leading-relaxed font-display">
        <p className="first-letter:font-display first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:leading-[0.9]">
          {t(bioIntro)}
        </p>
      </div>

      <div className="space-y-6 mt-10 text-foreground/80 leading-relaxed">
        {t(bioBody).split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <h2 className="font-display text-2xl md:text-3xl mt-20 mb-8">
        {t({ en: "Timeline", vi: "Mốc thời gian" })}
      </h2>
      <ol className="border-l border-border pl-6 space-y-6">
        {timeline.map((entry) => (
          <li key={entry.year} className="relative">
            <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-accent" />
            <div className="font-display text-lg text-pine">{entry.year}</div>
            <div className="text-foreground/80">{t(entry.event)}</div>
          </li>
        ))}
      </ol>
    </article>
  );
};

export default AboutPxa;