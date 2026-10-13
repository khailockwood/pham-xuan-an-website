import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Pause, Play } from "lucide-react";
import { useLanguage, type Bilingual } from "@/contexts/LanguageContext";
import { Partners } from "@/components/Partners";
import { cn } from "@/lib/utils";
import { voices, type Voice } from "@/content/interviews";
import millerWithAn from "@/assets/interview-pxa.jpg";
import anPortrait from "@/assets/pxa-hero.webp";
import exhibitViz1 from "@/assets/exhibit-viz-1.jpg";
import exhibitViz2 from "@/assets/exhibit-viz-2.jpg";

/* The hero footage: a silent 26-second loop cut from McMorris part 2, starting
   at 16:26, with its first frame as the poster. Both live in public/media/. */
const HERO_VIDEO = "/media/hero-mcmorris.mp4";
const HERO_POSTER = "/media/hero-mcmorris.jpg";
const HERO_SOURCE = "/interviews/mcmorris-pham-xuan-an-2";

/* Photographs for the voice tiles, keyed by `Voice.name`; `focus` is the
   object-position that keeps the faces in a wide crop. A voice without an entry
   gets a plain tile, so adding a photograph here is all it takes to give it one.
   - McMorris: a frame from his own footage (public/media/).
   - Miller: Ẩn with Miller.
   - Berman: a portrait of Ẩn, standing in until a photograph of the two of them
     is cleared. TODO: replace; the Larry Berman Collection at Texas Tech's
     Vietnam Archive (collection 1237) holds his "Perfect Spy" photographs.
   TODO: photographs of Morrow, Swanson and Cloud. */
const TILE_IMAGES: Record<string, { src: string; focus: string }> = {
  "Sean McMorris": { src: "/media/mcmorris-still.jpg", focus: "50% 12%" },
  "Edward G. Miller": { src: millerWithAn, focus: "50% 18%" },
  "Larry Berman": { src: anPortrait, focus: "50% 38%" },
};

/* McMorris filmed his interviews; everyone else recorded audio. */
const isFilmed = (v: Voice) => v.recordings.some((iv) => iv.audio.endsWith(".mp4"));

const archiveLinks: { to: string; label: Bilingual }[] = [
  { to: "/about-project", label: { en: "About the project", vi: "Về dự án" } },
  { to: "/interviews", label: { en: "Interviews", vi: "Phỏng vấn" } },
  { to: "/bibliography", label: { en: "Bibliography", vi: "Thư mục" } },
];

/* Exhibits in preparation. `exhibits.ts` still carries "Coming soon" titles, so
   the working titles live here alongside the status marker — the section says
   plainly that neither is published yet rather than presenting them as ready.
   TODO: drop this block once exhibits.ts holds final bilingual content. */
const forthcomingExhibits: {
  slug: string;
  cover: string;
  kind: Bilingual;
  title: Bilingual;
  blurb: Bilingual;
}[] = [
  {
    slug: "the-double-life",
    cover: exhibitViz1,
    kind: { en: "Data visualization", vi: "Trực quan hóa dữ liệu" },
    title: { en: "Mapping a divided career", vi: "Bản đồ một sự nghiệp bị chia đôi" },
    blurb: {
      en: "Where An filed from and when, mapped against what he was sending to Hanoi over the same years.",
      vi: "Ông Ẩn gửi bài từ đâu và khi nào, đối chiếu với những gì ông chuyển về Hà Nội trong cùng quãng thời gian đó.",
    },
  },
  {
    slug: "time-magazine-years",
    cover: exhibitViz2,
    kind: { en: "Essay", vi: "Tiểu luận" },
    title: { en: "Inside the Saigon bureau", vi: "Bên trong văn phòng Sài Gòn" },
    blurb: {
      en: "How Time's Saigon bureau worked between 1965 and 1975, and how its reporting reached readers in the United States.",
      vi: "Cách văn phòng Time tại Sài Gòn vận hành giai đoạn 1965–1975, và cách những bài viết từ đó đến với độc giả Hoa Kỳ.",
    },
  },
];

const Index = () => {
  const { t } = useLanguage();

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

  /* The filmed voice leads, so its tile takes the large cell of the grid. */
  const tiles = [...voices].sort((a, b) => Number(isFilmed(b)) - Number(isFilmed(a)));

  /** Who this is, relative to Ẩn, and when. Only the first recording's year is
      used: Morrow part 4 carries a future date in its export (see CLAUDE.md). */
  const voiceLine = (v: Voice): Bilingual => {
    const first = v.recordings[0];
    const year = first.date.slice(0, 4);
    if (!v.withAn) {
      return {
        en: `spoke to the project about him in ${year}`,
        // TODO: verify VI
        vi: `trò chuyện với dự án về ông năm ${year}`,
      };
    }
    return first.dateDisplay
      ? {
          en: `interviewed Phạm Xuân Ẩn around ${year}`,
          // TODO: verify VI
          vi: `phỏng vấn Phạm Xuân Ẩn khoảng năm ${year}`,
        }
      : { en: `interviewed Phạm Xuân Ẩn in ${year}`, vi: `phỏng vấn Phạm Xuân Ẩn năm ${year}` };
  };

  return (
    <>
      {/* ---------- Hero ----------
          Footage of Ẩn talking, full width, with the name and the one sentence
          that makes the archive make sense. The scrim is there for contrast:
          it holds the text above 4.5:1 whatever frame is behind it. */}
      <section className="on-dark relative isolate flex min-h-[34rem] items-end overflow-hidden bg-pine-deep text-paper lg:min-h-[min(46rem,calc(100svh-68px))]">
        <video
          ref={videoRef}
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[50%_20%] grayscale"
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
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-pine-deep from-15% via-pine-deep/80 via-55% to-pine-deep/30" />

        <div className="container pb-12 pt-40 lg:pb-16">
          <h1 className="font-display text-title leading-[1.02] lg:text-masthead">
            <span className="block">Phạm Xuân Ẩn</span>
            <span className="block text-gold-bright">Hai Trung</span>
          </h1>
          <p className="mt-4 font-display text-lead tabular-nums text-paper/80">1927–2006</p>

          <p className="mt-6 max-w-[36em] font-display text-lead text-paper">
            {t({
              en: "He reported the Vietnam War for Reuters, the New York Herald Tribune, and Time, while also reporting it to Hanoi as the intelligence officer Hai Trung. His press colleagues learned this only after the war.",
              // TODO: verify VI
              vi: "Ông đưa tin về Chiến tranh Việt Nam cho Reuters, New York Herald Tribune và Time, đồng thời báo cáo về cuộc chiến ấy cho Hà Nội với tư cách sĩ quan tình báo mang bí danh Hai Trung, điều mà các đồng nghiệp trong giới báo chí chỉ biết sau khi chiến tranh kết thúc.",
            })}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link
              to="/interviews"
              className="inline-flex items-center rounded-sm bg-gold px-6 py-3 text-label font-medium text-ink transition-colors hover:bg-gold-bright"
            >
              {t({ en: "Listen to the interviews", vi: "Nghe các cuộc phỏng vấn" })}
            </Link>
            <Link
              to={HERO_SOURCE}
              className="border-b border-paper/40 pb-1 text-label text-paper transition-colors hover:border-paper"
            >
              {t({ en: "Watch this interview", vi: "Xem cuộc phỏng vấn này" })}
            </Link>

            {/* A looping video needs a way to stop it (WCAG 2.2.2). */}
            <button
              type="button"
              onClick={togglePlayback}
              className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/70 text-paper transition-colors hover:bg-paper/15"
              aria-label={
                playing
                  ? t({ en: "Pause the background video", vi: "Tạm dừng video nền" })
                  : t({ en: "Play the background video", vi: "Phát video nền" })
              }
            >
              {playing ? <Pause size={18} aria-hidden /> : <Play size={18} aria-hidden />}
            </button>
          </div>
        </div>
      </section>

      {/* ---------- Partners ---------- */}
      <section className="container py-14 lg:py-16">
        <h2 className="font-display text-lead text-ink-muted">
          {t({ en: "In collaboration with", vi: "Với sự hợp tác của" })}
        </h2>
        <div className="mt-6">
          <Partners />
        </div>
      </section>

      {/* ---------- The voices ----------
          One tile per voice rather than per recording: three people who
          interviewed Ẩn, three who knew him, and the bibliography. A grid on
          purpose — the rest of the site lists records as registers, and this is
          the one place the collection is shown as a set of faces. Every tile
          has the same three lines and is one link, to that voice's first
          recording. Ẩn's own interviews have photographs and fill the top of
          the grid; the three people who knew him follow as a row of their own. */}
      <section className="container border-t border-border py-section lg:py-section-lg">
        <h2 className="font-display text-title">Phạm Xuân Ẩn</h2>
        <p className="mt-3 font-display text-lead text-ink-soft">
          {t({
            en: "The many depictions of An's life",
            // TODO: verify VI
            vi: "Những góc nhìn về cuộc đời ông Ẩn",
          })}
        </p>

        <ul className="mt-stack grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {tiles.map((v) => {
            const filmed = isFilmed(v);
            const image = TILE_IMAGES[v.name];
            const count = v.recordings.length;

            return (
              <li
                key={v.name}
                className={cn(
                  image ? "sm:col-span-2 lg:col-span-6" : "lg:col-span-4",
                  filmed && "lg:row-span-2"
                )}
              >
                <Link
                  to={`/interviews/${v.recordings[0].slug}`}
                  className={cn(
                    "group relative isolate flex h-full flex-col overflow-hidden p-gutter transition-colors",
                    image
                      ? "on-dark min-h-[20rem] bg-pine-deep text-paper"
                      : "min-h-[13rem] bg-paper-2 hover:bg-pine-deep hover:text-paper"
                  )}
                >
                  {image && (
                    <>
                      <img
                        src={image.src}
                        alt=""
                        loading="lazy"
                        style={{ objectPosition: image.focus }}
                        className="absolute inset-0 -z-20 h-full w-full object-cover grayscale"
                      />
                      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-pine-deep from-5% via-pine-deep/60 via-45% to-pine-deep/10" />
                    </>
                  )}

                  <h3
                    className={cn(
                      "font-display leading-tight",
                      image ? "mt-auto" : "",
                      filmed ? "text-head" : "text-sub"
                    )}
                  >
                    {v.name}
                  </h3>
                  <p
                    className={cn(
                      "mt-2 text-body leading-snug",
                      image ? "text-paper/90" : "text-ink-soft group-hover:text-paper/90"
                    )}
                  >
                    {t(voiceLine(v))}
                  </p>

                  <p
                    className={cn(
                      "flex justify-between gap-4 border-t pt-3 text-label",
                      image
                        ? "mt-6 border-paper/40 text-paper/90"
                        : "mt-auto border-strong text-ink-muted group-hover:border-paper/40 group-hover:text-paper/90"
                    )}
                  >
                    <span>
                      {count === 1
                        ? t({ en: "1 recording", vi: "1 bản ghi" })
                        : t({ en: `${count} recordings`, vi: `${count} bản ghi` })}
                    </span>
                    <span className={cn(!image && "text-pine group-hover:text-paper")}>
                      {filmed ? t({ en: "Watch", vi: "Xem" }) : t({ en: "Listen", vi: "Nghe" })}
                    </span>
                  </p>
                </Link>
              </li>
            );
          })}

          <li className="sm:col-span-2 lg:col-span-12">
            <Link
              to="/bibliography"
              className="on-dark flex h-full min-h-[11rem] flex-col bg-pine-deep p-gutter text-paper"
            >
              <h3 className="font-display text-head leading-tight">
                {t({ en: "Bibliography", vi: "Thư mục" })}
              </h3>
              <p className="mt-2 max-w-[30em] text-body leading-snug text-paper/90">
                {t({
                  en: "Books, articles and films about Phạm Xuân Ẩn.",
                  vi: "Sách, bài viết và phim về Phạm Xuân Ẩn.",
                })}
              </p>
              <p className="mt-auto flex justify-between gap-4 border-t border-paper/40 pt-3 text-label text-paper/90">
                <span>{t({ en: "In preparation", vi: "Đang chuẩn bị" })}</span>
                <span>{t({ en: "Read", vi: "Đọc" })}</span>
              </p>
            </Link>
          </li>
        </ul>

        <Link
          to="/interviews"
          className="mt-10 inline-flex border-b border-gold pb-0.5 text-label text-pine"
        >
          {t({ en: "View all interviews", vi: "Xem tất cả phỏng vấn" })}
        </Link>
      </section>

      {/* ---------- What the archive is ---------- */}
      <section className="border-t border-border bg-paper-2">
        <div className="container grid gap-8 py-section lg:grid-cols-[0.62fr_1.38fr] lg:gap-16 lg:py-section-lg">
          <h2 className="max-w-[9em] font-display text-head leading-tight">
            {t({ en: "What this archive holds", vi: "Kho lưu trữ này gồm những gì" })}
          </h2>
          <div className="prose-measure space-y-4 text-ink-soft">
            <p>
              {t({
                en: "The project is recovering a set of oral history interviews recorded with Phạm Xuân Ẩn more than twenty years ago, restoring the audio, and publishing each one with a topic-by-topic index you can search and skip through. Alongside them sit new interviews with people who knew him, recorded by students and researchers at Fulbright University Vietnam and Dartmouth, together with scholarly essays and visualizations built from the same material.",
                vi: "Dự án đang khôi phục một loạt cuộc phỏng vấn lịch sử truyền miệng được ghi với Phạm Xuân Ẩn hơn hai mươi năm trước, xử lý lại phần âm thanh, và công bố mỗi bản ghi kèm một chỉ mục theo chủ đề để người xem tìm kiếm và chuyển đoạn. Bên cạnh đó là các cuộc phỏng vấn mới với những người từng quen biết ông, do sinh viên và nhà nghiên cứu tại Đại học Fulbright Việt Nam và Dartmouth thực hiện, cùng với các tiểu luận học thuật và trực quan hóa dựng từ chính nguồn tư liệu ấy.",
              })}
            </p>
            <p>
              {t({
                en: "Fifty years after the fall of Saigon, this project aims to showcase the many depictions of An's life, in front of readers in both countries, in both languages.",
                vi: "Năm mươi năm sau ngày Sài Gòn sụp đổ, mục tiêu rất thực tế: đưa các nguồn tư liệu đến với độc giả ở cả hai nước, bằng cả hai ngôn ngữ.",
              })}
            </p>
            <ul className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
              {archiveLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="inline-flex border-b border-gold pb-0.5 text-label text-pine">
                    {t(l.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Exhibits ----------
          A register: hairline-ruled rows, the whole row a link. Both entries
          are unpublished and say so. */}
      <section>
        <div className="container py-section lg:py-section-lg">
          <h2 className="font-display text-head">{t({ en: "Exhibits", vi: "Triển lãm" })}</h2>
          <p className="prose-measure mt-4 text-body text-ink-soft">
            {t({
              en: "Essays and data visualizations built from the recordings. Two are in preparation.",
              vi: "Các tiểu luận và trực quan hóa dữ liệu dựng từ những bản ghi này. Hai triển lãm đang được chuẩn bị.",
            })}
          </p>

          <ul className="mt-stack border-t border-border">
            {forthcomingExhibits.map((ex) => (
              <li key={ex.slug}>
                <Link
                  to={`/exhibits/${ex.slug}`}
                  className="group grid gap-x-8 gap-y-4 border-b border-border px-4 py-7 transition-colors hover:bg-paper-2 sm:px-5 md:grid-cols-[220px_1fr]"
                >
                  <div className="aspect-[4/3] w-full max-w-[280px] overflow-hidden border border-border bg-paper-2 md:max-w-none">
                    <img
                      src={ex.cover}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover grayscale-[.35]"
                    />
                  </div>
                  <div>
                    <div className="meta-label flex flex-wrap gap-x-4">
                      <span className="text-pine">{t(ex.kind)}</span>
                      <span>{t({ en: "In preparation", vi: "Đang chuẩn bị" })}</span>
                    </div>
                    <h3 className="mt-2 font-display text-sub leading-snug transition-colors group-hover:text-pine">
                      {t(ex.title)}
                    </h3>
                    <p className="prose-measure mt-2.5 text-ink-soft">{t(ex.blurb)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Index;
