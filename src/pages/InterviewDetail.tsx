import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { interviews } from "@/content/interviews";
import { ui } from "@/content/site";
import OhmsViewer from "@/components/OhmsViewer";
import OhmsNativePlayer from "@/components/OhmsNativePlayer";
import { Eyebrow } from "@/components/Eyebrow";
import NotFound from "./NotFound";

const InterviewDetail = () => {
  const { slug } = useParams();
  const { t, lang } = useLanguage();
  const iv = interviews.find((i) => i.slug === slug);
  if (!iv) return <NotFound />;

  const showOriginalNote = iv.originalLanguage !== lang && iv.originalLanguage !== "en";

  return (
    <article className="container py-16 md:py-24 max-w-4xl">
      <Link
        to="/interviews"
        className="mono-label mb-8 inline-flex items-center gap-2 text-[10.5px] text-ink-soft transition-colors hover:text-pine"
      >
        <ArrowLeft size={13} /> {t({ en: "Back to interviews", vi: "Quay lại phỏng vấn" })}
      </Link>

      <Eyebrow>{t({ en: "Interview", vi: "Phỏng vấn" })}</Eyebrow>
      <h1 className="mb-6 font-display text-3xl leading-tight md:text-5xl">{t(iv.title)}</h1>

      <dl className="mb-10 grid grid-cols-2 gap-6 border-y border-border py-6 text-sm md:grid-cols-4">
        <div>
          <dt className="mono-label text-[10.5px] text-ink-soft/55">{t(ui.interviewee)}</dt>
          <dd className="mt-1.5 font-display text-lg leading-tight">{iv.interviewee}</dd>
        </div>
        <div>
          <dt className="mono-label text-[10.5px] text-ink-soft/55">{t(ui.interviewer)}</dt>
          <dd className="mt-1.5 font-display text-lg leading-tight">{iv.interviewer}</dd>
        </div>
        <div>
          <dt className="mono-label text-[10.5px] text-ink-soft/55">{t(ui.date)}</dt>
          <dd className="mt-1.5 font-display text-lg leading-tight">
            {iv.dateDisplay ??
              new Date(iv.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </dd>
        </div>
        <div>
          <dt className="mono-label text-[10.5px] text-ink-soft/55">{t(ui.duration)}</dt>
          <dd className="mt-1.5 font-display text-lg leading-tight">
            {iv.duration} · {iv.originalLanguage.toUpperCase()}
          </dd>
        </div>
      </dl>

      <p className="mb-10 max-w-[46em] font-display text-xl italic leading-relaxed text-ink-soft">
        {t(iv.summary)}
      </p>

      {/* Primary experience: the synchronized OHMS interview, in order of
          preference — (1) a hosted OHMS Viewer iframe, if one exists; (2) the
          native in-browser player, which needs only the OHMS XML export; (3) the
          placeholder, with the local audio + transcript below as the fallback. */}
      <div className="mb-12">
        {iv.ohmsUrl ? (
          <OhmsViewer url={iv.ohmsUrl} title={t(iv.title)} />
        ) : iv.ohmsXml ? (
          <OhmsNativePlayer src={iv.ohmsXml} title={t(iv.title)} />
        ) : (
          <OhmsViewer title={t(iv.title)} />
        )}
      </div>

      <h2 className="mb-3 font-display text-2xl">
        {iv.ohmsUrl || iv.ohmsXml
          ? t({ en: "Audio (download)", vi: "Âm thanh (tải về)" })
          : t({ en: "Listen", vi: "Nghe" })}
      </h2>
      <div className="mb-12 border border-border bg-card p-5">
        <audio controls preload="metadata" src={iv.audio} className="w-full">
          {t({ en: "Your browser does not support audio playback.", vi: "Trình duyệt không hỗ trợ phát âm thanh." })}
        </audio>
        <a
          href={iv.audio}
          download
          className="mono-label mt-3.5 inline-flex items-center gap-2 text-[10.5px] text-ink-soft transition-colors hover:text-pine"
        >
          <Download size={12} /> {t(ui.download)}
        </a>
      </div>

      <h2 className="mb-2 font-display text-2xl">{t(ui.transcript)}</h2>
      {showOriginalNote && (
        <p className="mb-6 text-[13px] italic text-ink-soft/70">
          {t({
            en: `Originally recorded in ${iv.originalLanguage.toUpperCase()}. Translation provided.`,
            vi: `Ghi âm gốc bằng ${iv.originalLanguage.toUpperCase()}. Bản dịch được cung cấp.`,
          })}
        </p>
      )}

      <div className="border-t border-border">
        {iv.transcript.map((seg, i) => (
          <div
            key={i}
            className="grid grid-cols-[64px_1fr] gap-4 border-b border-border py-5 text-sm md:grid-cols-[80px_150px_1fr]"
          >
            <div className="mono-label pt-1 text-[10.5px] tabular-nums text-pine">{seg.timestamp}</div>
            <div className="mono-label hidden pt-1 text-[10.5px] text-ink-soft/60 md:block">
              {seg.speaker}
            </div>
            <div className="max-w-[46em] leading-relaxed text-ink-soft">
              <span className="mono-label mb-1.5 block text-[10.5px] text-ink-soft/60 md:hidden">
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