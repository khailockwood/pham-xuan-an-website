import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Pause, Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/use-page-title";
import { interviews, voices, voiceNotes, type Voice } from "@/content/interviews";
import { cite, citeLinkNote, citeNote, partners } from "@/content/project";
import { doubleRecord, recordHeads } from "@/content/bio";
import { sources } from "@/content/bibliography";
import { segmentCountOf, segmentHref } from "@/lib/ohms-highlights";
import { cn } from "@/lib/utils";

/* The homepage: the footage and his name fill the first screen; below it the
   testimony and the written record sit side by side at equal width, then the
   double record, how to cite, and who made the archive. The subject is the
   man, not any one recording, so no voice or pillar is set above another. */

/* The footage: a silent 26-second loop cut from McMorris part 2, starting at
   16:26, with its first frame as the poster. Both live in public/media/. */
const HERO_VIDEO = "/media/hero-mcmorris.mp4";
const HERO_POSTER = "/media/hero-mcmorris.jpg";

/* Surname order, so no voice is placed ahead of another by medium or by whose
   recordings came first. */
const surname = (name: string) => name.split(" ").pop() ?? name;
const byName = [...voices].sort((a, b) => surname(a.name).localeCompare(surname(b.name)));

/** Where a voice opens: its first passage about Ẩn when one is indexed. */
const voiceHref = (v: Voice) => {
  const start = voiceNotes[v.name]?.start;
  return start ? segmentHref(start.slug, start.time) : `/interviews/${v.recordings[0].slug}`;
};

const ownWords = byName.filter((v) => v.withAn);
const knewHim = byName.filter((v) => !v.withAn);

const passageCount = interviews.reduce((n, iv) => n + segmentCountOf(iv), 0);

/** A gallery's heading block: the name of the room, and its wall text. */
const GalleryHead = ({ id, title, children, onDark = false }: { id: string; title: string; children: string; onDark?: boolean }) => (
  <div className="mb-stack grid gap-x-12 gap-y-4 lg:grid-cols-[5fr_7fr] lg:items-end">
    {/* Template strings, not cn(): tailwind-merge reads the custom size ranks
        (text-title, text-lead) as colours and drops them beside text-paper. */}
    <h2 id={id} className={`font-display text-title font-normal ${onDark ? "text-paper" : ""}`}>
      {title}
    </h2>
    <p className={`max-w-[36em] text-pretty font-display text-lead ${onDark ? "text-pine-pale" : "text-ink-soft"}`}>
      {children}
    </p>
  </div>
);

const Index = () => {
  const { t } = useLanguage();
  usePageTitle();

  /* The loop starts from script rather than `autoPlay` so that a visitor who
     asks for reduced motion gets the poster and a play button, not a video that
     starts and is then stopped. */
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoRef.current?.play().catch(() => {});
    }
  }, []);
  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <>
      {/* ---------- The first screen: the footage, his name, and little else ----------
          The footage fills the first screen; the doorways wait below it. Greyscale
          under a light pine-deep tint and a neutral ink gradient, so the green
          is a trace and the ink carries the contrast. */}
      <section className="on-dark relative isolate flex min-h-[max(30rem,calc(100svh-64px))] items-end overflow-hidden bg-pine-deep text-paper md:min-h-[max(32rem,calc(100svh-68px))]">
        <video
          ref={videoRef}
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[50%_22%] grayscale"
          src={HERO_VIDEO}
          poster={HERO_POSTER}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-pine-deep/35" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 from-5% via-ink/40 via-50% to-ink/0" />

        <div className="container flex flex-wrap items-end justify-between gap-x-10 gap-y-8 pb-10 pt-32 lg:pb-12">
          <div>
            <h1 className="font-display text-title font-normal leading-[1.02] lg:text-masthead lg:font-normal">Phạm Xuân Ẩn</h1>
            <p className="mt-3 font-display text-sub font-normal tabular-nums text-pine-pale">Hai Trung, 1927–2006</p>
            <p className="mt-5 max-w-[30em] text-pretty font-display text-lead text-paper/90">
              {t({
                en: "Correspondent for Reuters, the New York Herald Tribune and Time, and an intelligence officer for Hanoi.",
                // TODO: verify VI
                vi: "Phóng viên của Reuters, New York Herald Tribune và Time, đồng thời là sĩ quan tình báo cho Hà Nội.",
              })}
            </p>
          </div>

          {/* The footage's object label, kept to one line, with the pause
              control a looping video needs (WCAG 2.2.2). */}
          <div className="flex items-center gap-4 text-label text-paper/80">
            <span className="text-balance">{t({ en: "Filmed by Sean McMorris, around 2005", vi: "Do Sean McMorris quay, khoảng năm 2005" })}</span>
            <button
              type="button"
              onClick={togglePlayback}
              aria-label={playing ? t({ en: "Pause the footage", vi: "Tạm dừng đoạn phim" }) : t({ en: "Play the footage", vi: "Phát đoạn phim" })}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper/70 text-paper transition-colors hover:bg-paper/15"
            >
              {playing ? <Pause size={18} aria-hidden /> : <Play size={18} aria-hidden />}
            </button>
          </div>
        </div>
      </section>

      {/* ---------- The two records, side by side ----------
          Testimony and the written record share one section at equal width,
          so neither is placed above the other: the same recessed panel, the
          same row grammar (a broad line on what it covers, then who), and a
          link to its own page. */}
      <section aria-label={t({ en: "The archive", vi: "Kho lưu trữ" })} className="container py-section lg:py-section-lg">
        <div className="grid gap-6 md:grid-cols-2">
          <div id="testimony" className="flex scroll-mt-20 flex-col bg-paper-2 px-8 py-9">
            <h2 className="font-display text-head font-normal">{t({ en: "Testimony", vi: "Lời kể" })}</h2>
            <p className="mt-1 text-label text-ink-muted">
              {t({
                en: `${interviews.length} recordings, ${passageCount} indexed passages`,
                vi: `${interviews.length} bản ghi, ${passageCount} đoạn được lập chỉ mục`,
              })}
            </p>
            <ul className="mt-6">
              {[...ownWords, ...knewHim].map((v) => (
                <li key={v.name}>
                  <Link to={voiceHref(v)} className="group block border-t border-ink/[0.14] py-4">
                    <span className="block text-pretty font-display text-lead leading-snug transition-colors group-hover:text-pine">
                      {t(voiceNotes[v.name].subject)}
                    </span>
                    <span className="mt-1 block text-label text-ink-muted">
                      {v.withAn
                        ? t({ en: `Phạm Xuân Ẩn, interviewed by ${v.name}`, vi: `Phạm Xuân Ẩn, do ${v.name} phỏng vấn` })
                        : v.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/interviews" className="mt-auto self-start pt-6">
              <span className="border-b border-pine pb-0.5 text-body text-pine transition-colors hover:text-pine-deep">
                {t({ en: "Every recording", vi: "Tất cả bản ghi" })}
              </span>
            </Link>
          </div>

          <div id="written-record" className="flex scroll-mt-20 flex-col bg-paper-2 px-8 py-9">
            <h2 className="font-display text-head font-normal">{t({ en: "The written record", vi: "Tư liệu viết" })}</h2>
            <p className="mt-1 text-label text-ink-muted">
              {t({
                en: `${sources.length} books so far, more being compiled`,
                // TODO: verify VI
                vi: `Hiện có ${sources.length} cuốn sách, các nguồn khác đang được biên soạn`,
              })}
            </p>
            <ul className="mt-6">
              {sources.map((s) => (
                <li key={s.slug}>
                  <Link to={`/bibliography/${s.slug}`} className="group block border-t border-ink/[0.14] py-4">
                    <cite lang={s.lang} className="block font-display text-lead leading-snug transition-colors group-hover:text-pine">
                      {s.title}
                    </cite>
                    <span className="mt-1 block text-label text-ink-muted">
                      {s.author}, {s.year}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/bibliography" className="mt-auto self-start pt-6">
              <span className="border-b border-pine pb-0.5 text-body text-pine transition-colors hover:text-pine-deep">
                {t({ en: "The bibliography", vi: "Thư mục" })}
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- The double record ----------
          The second painted wall: one chronology with two sides, what his
          colleagues saw and what was also true. */}
      <section aria-labelledby="g-record" className="on-dark bg-pine-deep text-paper/90">
        <div className="container py-section lg:py-section-lg">
          <GalleryHead id="g-record" title={t({ en: "The double record", vi: "Hai mặt cuộc đời" })} onDark>
            {t({
              en: "1953 to 1976, read as one chronology with two sides. Only 1975 has an entry on both.",
              // TODO: verify VI
              vi: "Giai đoạn 1953 đến 1976, đọc như một biên niên có hai mặt. Chỉ năm 1975 có sự kiện ở cả hai bên.",
            })}
          </GalleryHead>

          <div aria-hidden className="hidden grid-cols-[1fr_6rem_1fr] gap-x-10 pb-2.5 text-label font-medium text-pine-pale md:grid">
            <span className="text-right">{t(recordHeads.seen)}</span>
            <span />
            <span>{t(recordHeads.also)}</span>
          </div>
          <ol className="border-t border-paper/30">
            {doubleRecord.map((r) => {
              const both = Boolean(r.seen && r.also);
              return (
                <li
                  key={r.year}
                  className={cn(
                    "grid grid-cols-[4.5rem_1fr] gap-x-6 gap-y-2 border-b border-paper/15 py-4 font-display text-lead md:grid-cols-[1fr_6rem_1fr] md:items-baseline md:gap-x-10",
                    both && "bg-paper/[0.07]"
                  )}
                >
                  <span className="row-span-2 text-paper tabular-nums md:order-2 md:row-span-1 md:text-center">{r.year}</span>
                  {r.seen ? (
                    <span className={cn("md:order-1 md:text-right", both && "text-paper")}>
                      <span className="block font-sans text-label text-pine-pale md:hidden">{t(recordHeads.seen)}</span>
                      {t(r.seen)}
                    </span>
                  ) : (
                    <span aria-hidden className="hidden md:order-1 md:block" />
                  )}
                  {r.also ? (
                    <span className={cn("md:order-3", both && "text-paper")}>
                      <span className="block font-sans text-label text-pine-pale md:hidden">{t(recordHeads.also)}</span>
                      {t(r.also)}
                    </span>
                  ) : (
                    <span aria-hidden className="hidden md:order-3 md:block" />
                  )}
                </li>
              );
            })}
          </ol>

          <Link
            to="/about-pxa"
            className="mt-8 inline-flex border-b border-paper/40 pb-0.5 text-body text-paper transition-colors hover:border-paper"
          >
            {t({ en: "His life in full", vi: "Cuộc đời ông" })}
          </Link>
        </div>
      </section>

      {/* ---------- Citing a recording ---------- */}
      <section aria-labelledby="g-cite" className="container grid gap-8 py-section lg:grid-cols-[5fr_7fr] lg:gap-12 lg:py-section-lg">
        <h2 id="g-cite" className="font-display text-head font-normal">
          {t({ en: "Citing a recording", vi: "Trích dẫn một bản ghi" })}
        </h2>
        <div className="prose-measure space-y-5 text-ink-soft">
          <p>{t(citeNote)}</p>
          <p className="border-l border-strong pl-5 font-display text-lead text-ink">{t(cite)}</p>
          <p>{t(citeLinkNote)}</p>
        </div>
      </section>

      {/* ---------- Credit line: who organised the exhibition ---------- */}
      <section aria-labelledby="g-org" className="border-t border-border">
        <div className="container py-12 lg:py-14">
          <h2 id="g-org" className="meta-label mb-6 font-medium">
            {t({ en: "This archive is organised by", vi: "Kho lưu trữ được thực hiện bởi" })}
          </h2>
          <ul className="grid gap-8 sm:grid-cols-3 sm:gap-10">
            {partners.map((p) => (
              <li key={p.go}>
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4">
                  <img src={p.logo} alt="" loading="lazy" className="h-10 w-auto max-w-[5.5rem] shrink-0 object-contain object-left" />
                  <span className="min-w-0">
                    <span className="block font-display text-body leading-snug transition-colors group-hover:text-pine">{t(p.name)}</span>
                    <span className="block text-label text-ink-muted">{t(p.sub)}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Index;
