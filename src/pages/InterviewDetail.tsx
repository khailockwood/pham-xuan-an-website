import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { interviews } from "@/content/interviews";
import { ui } from "@/content/site";
import NotFound from "./NotFound";

const InterviewDetail = () => {
  const { slug } = useParams();
  const { t, lang } = useLanguage();
  const iv = interviews.find((i) => i.slug === slug);
  if (!iv) return <NotFound />;

  const showOriginalNote = iv.originalLanguage !== lang && iv.originalLanguage !== "en";

  return (
    <article className="container py-16 md:py-24 max-w-4xl">
      <Link to="/interviews" className="inline-flex items-center gap-2 text-sm text-accent hover:underline mb-8">
        <ArrowLeft size={14} /> {t({ en: "Back to interviews", vi: "Quay lại phỏng vấn" })}
      </Link>

      <div className="uppercase tracking-[0.25em] text-accent mb-3 text-sm font-bold">
        {t({ en: "Interview", vi: "Phỏng vấn" })}
      </div>
      <h1 className="font-display text-3xl md:text-5xl leading-tight mb-6">{t(iv.title)}</h1>

      <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm border-y border-border py-6 mb-10">
        <div>
          <dt className="text-xs uppercase tracking-wider text-foreground/50">{t(ui.interviewee)}</dt>
          <dd className="mt-1">{iv.interviewee}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-foreground/50">{t(ui.interviewer)}</dt>
          <dd className="mt-1">{iv.interviewer}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-foreground/50">{t(ui.date)}</dt>
          <dd className="mt-1">{new Date(iv.date).toLocaleDateString()}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-foreground/50">{t(ui.duration)}</dt>
          <dd className="mt-1">{iv.duration} · {iv.originalLanguage.toUpperCase()}</dd>
        </div>
      </dl>

      <p className="text-lg text-foreground/80 leading-relaxed mb-8">{t(iv.summary)}</p>

      <div className="bg-card border border-border p-5 mb-12">
        <audio controls preload="metadata" src={iv.audio} className="w-full">
          {t({ en: "Your browser does not support audio playback.", vi: "Trình duyệt không hỗ trợ phát âm thanh." })}
        </audio>
        <a
          href={iv.audio}
          download
          className="mt-3 inline-flex items-center gap-2 text-xs text-accent hover:underline"
        >
          <Download size={12} /> {t(ui.download)}
        </a>
      </div>

      <h2 className="font-display text-2xl mb-2">{t(ui.transcript)}</h2>
      {showOriginalNote && (
        <p className="text-xs text-foreground/60 mb-6 italic">
          {t({
            en: `Originally recorded in ${iv.originalLanguage.toUpperCase()}. Translation provided.`,
            vi: `Ghi âm gốc bằng ${iv.originalLanguage.toUpperCase()}. Bản dịch được cung cấp.`,
          })}
        </p>
      )}

      <div className="space-y-6 border-t border-border pt-6">
        {iv.transcript.map((seg, i) => (
          <div key={i} className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_140px_1fr] gap-4 text-sm">
            <div className="text-xs text-accent tabular-nums pt-1">{seg.timestamp}</div>
            <div className="hidden md:block text-xs uppercase tracking-wider text-foreground/60 pt-1">
              {seg.speaker}
            </div>
            <div className="leading-relaxed text-foreground/85">
              <span className="md:hidden block text-xs uppercase tracking-wider text-foreground/60 mb-1">
                {seg.speaker}
              </span>
              {t(seg.text)}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};

export default InterviewDetail;