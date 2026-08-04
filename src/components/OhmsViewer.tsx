import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * OhmsViewer — embeds a hosted OHMS (Oral History Metadata Synchronizer) Viewer,
 * the synchronized audio/video + transcript + index player, via <iframe>.
 *
 * The OHMS Viewer is a separate PHP app that reads one OHMS XML export and serves
 * a URL of the form `https://<host>/viewer.php?cachefile=<name>.xml`. Only a
 * running viewer yields an embeddable URL — an XML file on its own is not
 * embeddable. This component takes that viewer URL and frames it responsively.
 *
 * Two well-known gotchas the viewer host must satisfy for the frame to render:
 *   1. HTTPS — a Vercel (https) page will block an http iframe as mixed content.
 *   2. Framing headers — the host must NOT send `X-Frame-Options: SAMEORIGIN`;
 *      ideally it sends `Content-Security-Policy: frame-ancestors <our-origin>`.
 *      (The uklibraries/ohms-viewer app sets no X-Frame-Options by default, so a
 *      fresh self-hosted install is cross-origin embeddable out of the box.)
 *
 * When `url` is omitted the component renders a bilingual placeholder, so every
 * interview page is complete now and simply "lights up" once its viewer URL
 * arrives — no layout change required.
 */
type OhmsViewerProps = {
  /** Hosted OHMS Viewer URL (…/viewer.php?cachefile=<file>.xml). Omit until it exists. */
  url?: string;
  /** Interview title, used for the iframe's accessible name. */
  title: string;
  /** Optional height override (Tailwind class). Synced viewers need real height. */
  heightClass?: string;
};

const OhmsViewer = ({ url, title, heightClass = "h-[clamp(560px,78vh,880px)]" }: OhmsViewerProps) => {
  const { t } = useLanguage();

  const label = t({
    en: "Synchronized audio & transcript",
    vi: "Âm thanh & bản ghi đồng bộ",
  });

  if (!url) {
    return (
      <figure className="border border-border bg-card">
        <figcaption className="flex items-center gap-2.5 border-b border-border px-5 py-3">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
          <span className="mono-label text-[10.5px] text-pine">{label} · OHMS</span>
        </figcaption>
        <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
          <p className="font-display text-lg text-foreground">
            {t({ en: "Synchronized viewer coming soon", vi: "Trình xem đồng bộ sắp ra mắt" })}
          </p>
          <p className="max-w-[38ch] text-sm leading-relaxed text-ink-soft">
            {t({
              en: "The synchronized audio-and-transcript player for this interview is being prepared. In the meantime you can listen and read below.",
              vi: "Trình phát âm thanh và bản ghi đồng bộ cho cuộc phỏng vấn này đang được chuẩn bị. Trong lúc chờ, bạn có thể nghe và đọc bên dưới.",
            })}
          </p>
        </div>
      </figure>
    );
  }

  return (
    <figure className="border border-border bg-card">
      <figcaption className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <span className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
          <span className="mono-label text-[10.5px] text-pine">{label} · OHMS</span>
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mono-label inline-flex items-center gap-1.5 text-[10.5px] text-ink-soft transition-colors hover:text-gold"
        >
          {t({ en: "Open in new tab", vi: "Mở trong tab mới" })}
          <ExternalLink size={12} aria-hidden />
        </a>
      </figcaption>
      {/* Paper "mat" around the viewer: the OHMS Viewer's own page background is
          solid white and otherwise runs flush to the frame edge. Matting it in the
          frame's paper tone (same as the header bar) gives the embed side/vertical
          breathing room and reads as a framed archival document rather than an
          abrupt cutoff — a touch more horizontal gutter than vertical. */}
      <div className="bg-card px-4 py-4 sm:px-6 md:px-8">
        <iframe
          src={url}
          title={t({ en: "Synchronized viewer — ", vi: "Trình xem đồng bộ — " }) + title}
          className={`w-full ${heightClass} border border-border bg-white`}
          loading="lazy"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </figure>
  );
};

export default OhmsViewer;
