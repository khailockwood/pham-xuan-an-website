import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage, type Bilingual } from "@/contexts/LanguageContext";
import { DuotonePortrait } from "@/components/DuotonePortrait";
import { cn } from "@/lib/utils";
import { mission } from "@/content/project";
import { interviews } from "@/content/interviews";
import heroPortrait from "@/assets/hero-portrait.jpg";
import exhibitViz1 from "@/assets/exhibit-viz-1.jpg";
import exhibitViz2 from "@/assets/exhibit-viz-2.jpg";

/** Section eyebrow: a short gold rule + mono label. */
const Eyebrow = ({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) => (
  <div className="mb-5 flex items-center gap-3.5">
    <span className="h-px w-7 bg-gold" />
    <span className={cn("mono-label", onDark ? "text-gold-bright" : "text-pine")}>{children}</span>
  </div>
);

/** Original-language label for an interview record (marked in gold elsewhere). */
const ORIGINAL_LANGUAGE: Record<string, Bilingual> = {
  en: { en: "English", vi: "Tiếng Anh" },
  vi: { en: "Tiếng Việt", vi: "Tiếng Việt" },
  fr: { en: "French", vi: "Tiếng Pháp" },
};

/* Homepage exhibit showcase. exhibits.ts currently holds placeholder copy
   ("Coming soon"), so the homepage features the curated mockup copy here.
   TODO: replace with final bilingual content once exhibits.ts is filled in,
   and have the VI strings below reviewed. */
const featuredExhibits: {
  slug: string;
  cover: string;
  tag: Bilingual;
  title: Bilingual;
  blurb: Bilingual;
}[] = [
  {
    slug: "the-double-life",
    cover: exhibitViz1,
    tag: { en: "Data Visualization", vi: "Trực quan hóa dữ liệu" },
    title: { en: "Mapping a divided career", vi: "Bản đồ một sự nghiệp bị chia đôi" },
    blurb: {
      en: "Tracing the bylines, datelines, and movements of a correspondent whose reporting served two governments at once.",
      vi: "Lần theo các bài ký tên, dòng tin và hành trình của một phóng viên mà công việc đưa tin phục vụ cùng lúc hai chính phủ.",
    },
  },
  {
    slug: "time-magazine-years",
    cover: exhibitViz2,
    tag: { en: "Essay", vi: "Tiểu luận" },
    title: { en: "The man the press corps trusted", vi: "Người mà giới báo chí tin tưởng" },
    blurb: {
      en: "How a generation of American journalists came to rely on the one colleague who knew more than any of them — and why.",
      vi: "Vì sao cả một thế hệ nhà báo Mỹ đặt niềm tin vào người đồng nghiệp biết nhiều hơn tất cả họ — và lý do đằng sau điều đó.",
    },
  },
];

/* Partner institutions (proper nouns; subtitles + outbound links). */
const partners: { name: Bilingual; sub: Bilingual; href: string; go: string }[] = [
  {
    name: { en: "Dartmouth Digital History Initiative", vi: "Sáng kiến Lịch sử Số Dartmouth" },
    sub: { en: "Dartmouth College", vi: "Đại học Dartmouth" },
    href: "https://ddhi.dartmouth.edu/",
    go: "ddhi.dartmouth.edu",
  },
  {
    name: { en: "Vietnam Studies Center", vi: "Trung tâm Nghiên cứu Việt Nam" },
    sub: { en: "Fulbright University Vietnam", vi: "Đại học Fulbright Việt Nam" },
    href: "https://fulbright.edu.vn/vietnam-studies-center/",
    go: "fulbright.edu.vn",
  },
  {
    name: { en: "Vietnam Center & Sam Johnson Archive", vi: "Vietnam Center & Sam Johnson Archive" },
    sub: { en: "Texas Tech University", vi: "Đại học Texas Tech" },
    href: "https://www.vietnam.ttu.edu/",
    go: "vietnam.ttu.edu",
  },
];

const Index = () => {
  const { t, lang } = useLanguage();

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-pine-deep text-paper">
        {/* atmospheric radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 78% 18%, hsl(var(--pine) / 0.34), transparent 60%)",
          }}
        />
        <div className="container relative z-[2]">
          <div className="flex flex-col gap-2 border-b border-paper/[0.18] py-3.5 text-paper/60 sm:flex-row sm:items-center sm:justify-between">
            <span className="mono-label text-[11px]">
              {t({
                en: "Dartmouth Digital History Initiative · Fulbright University Vietnam",
                vi: "Sáng kiến Lịch sử Số Dartmouth · Đại học Fulbright Việt Nam",
              })}
            </span>
            <span className="mono-label text-[11px]">
              {t({ en: "Oral History Archive", vi: "Kho lưu trữ lịch sử truyền miệng" })}
            </span>
          </div>

          <div className="grid items-center gap-12 py-14 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16 lg:py-[70px]">
            {/* hero text */}
            <div>
              <p className="mono-label mb-6 text-[12px] text-gold-bright">
                {t({
                  en: "An oral history of the man who lived two lives",
                  vi: "Lịch sử truyền miệng về người đàn ông sống hai cuộc đời",
                })}
              </p>
              <h1 className="font-display text-5xl leading-[0.98] tracking-[-0.015em] sm:text-6xl lg:text-[84px]">
                Phạm Xuân Ẩn
              </h1>
              <p className="mb-8 mt-2 font-display text-xl italic text-paper/60 lg:text-[22px]">
                1927 — 2006
              </p>

              {/* two-identity reveal */}
              <div className="mb-8 border-t border-paper/[0.18]">
                <div className="grid items-baseline gap-2 border-b border-paper/[0.18] py-4 sm:grid-cols-[200px_1fr] sm:gap-5">
                  <div className="mono-label text-[11px] text-paper/55">
                    {t({ en: "The correspondent", vi: "Phóng viên" })}
                  </div>
                  <div className="font-display text-lg leading-tight lg:text-xl">
                    Reuters · New York Herald Tribune · <span className="text-gold-bright">Time</span>
                  </div>
                </div>
                <div className="grid items-baseline gap-2 border-b border-paper/[0.18] py-4 sm:grid-cols-[200px_1fr] sm:gap-5">
                  <div className="mono-label text-[11px] text-gold-bright">
                    {t({ en: "The intelligence officer", vi: "Sĩ quan tình báo" })}
                  </div>
                  <div className="font-display text-lg leading-tight text-white lg:text-xl">
                    <em className="italic text-gold-bright">"Hai Trung"</em>
                    {" — "}
                    {t({
                      en: "Colonel, People's Army of Vietnam",
                      vi: "Đại tá, Quân đội Nhân dân Việt Nam",
                    })}
                  </div>
                </div>
              </div>

              <p className="mb-9 max-w-[33em] font-display text-lg italic leading-relaxed text-paper/90 lg:text-[20.5px]">
                {t({
                  en: "For a decade he filed dispatches for Time magazine while sending intelligence to Hanoi. His closest colleagues in the Saigon press corps learned the truth only after the war.",
                  vi: "Suốt một thập kỷ, ông gửi bản tin cho tạp chí Time trong khi vẫn chuyển tin tình báo về Hà Nội. Những đồng nghiệp thân thiết nhất trong giới báo chí Sài Gòn chỉ biết sự thật sau khi chiến tranh kết thúc.",
                })}
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <Link
                  to="/interviews"
                  className="inline-flex items-center gap-2.5 rounded-sm bg-gold px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-gold-bright"
                >
                  {t({ en: "Enter the archive", vi: "Vào kho lưu trữ" })}
                  <span className="font-mono">→</span>
                </Link>
                <Link
                  to="/about-pxa"
                  className="border-b border-paper/35 pb-0.5 text-sm text-paper/80 transition-colors hover:text-paper"
                >
                  {t({ en: "Who was Pham Xuan An?", vi: "Phạm Xuân Ẩn là ai?" })}
                </Link>
              </div>
            </div>

            {/* duotone portrait */}
            <DuotonePortrait
              src={heroPortrait}
              alt="Phạm Xuân Ẩn"
              caption={t({ en: "Phạm Xuân Ẩn · Saigon", vi: "Phạm Xuân Ẩn · Sài Gòn" })}
              credit={t({ en: "Project collection", vi: "Tư liệu dự án" })}
              className="mx-auto w-full max-w-sm lg:max-w-none"
            />
          </div>
        </div>
      </section>

      {/* ---------- Intro ---------- */}
      <section className="container py-20 lg:py-[84px]">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>{t({ en: "The Project", vi: "Dự án" })}</Eyebrow>
            <p className="font-display text-2xl leading-snug lg:text-[25px]">
              {t({
                en: "Fifty years after the fall of Saigon, a bilingual archive that asks what the sources we trust can still tell us about the Vietnam War.",
                vi: "Năm mươi năm sau ngày Sài Gòn sụp đổ, một kho lưu trữ song ngữ đặt câu hỏi: những nguồn tư liệu ta tin tưởng còn có thể cho ta biết điều gì về Chiến tranh Việt Nam.",
              })}
            </p>
          </div>
          <div className="space-y-4 leading-relaxed text-ink-soft">
            <p>{t(mission)}</p>
            <p>
              {t({
                en: "Together they invite audiences in the United States, Vietnam, and beyond to reconsider the stories we tell about the war, and the double life of the journalist at its center.",
                vi: "Cùng nhau, họ mời gọi công chúng tại Hoa Kỳ, Việt Nam và nhiều nơi khác cùng nhìn lại những câu chuyện ta kể về cuộc chiến, và cuộc đời hai mặt của nhà báo ở trung tâm câu chuyện ấy.",
              })}
            </p>
            <Link
              to="/about-project"
              className="mono-label inline-flex items-center gap-1.5 border-b border-gold pb-0.5 text-[11.5px] text-pine"
            >
              {t({ en: "About this project", vi: "Về dự án" })} <span className="font-mono">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Interview register ---------- */}
      <section className="bg-ink text-paper">
        <div className="container py-20 lg:py-[84px]">
          <Eyebrow onDark>{t({ en: "The Interviews", vi: "Phỏng vấn" })}</Eyebrow>
          <h2 className="max-w-[16em] font-display text-3xl leading-tight text-paper lg:text-[40px]">
            {t({
              en: "Voices from both of his worlds.",
              vi: "Những tiếng nói từ cả hai thế giới của ông.",
            })}
          </h2>

          <div className="mt-11 border-t border-paper/[0.18]">
            {interviews.map((iv, i) => (
              <div
                key={iv.slug}
                className="grid gap-5 border-b border-paper/[0.18] py-7 transition-colors hover:bg-paper/[0.04] md:grid-cols-[52px_1fr_220px] md:gap-7"
              >
                <div className="mono-label pt-1.5 text-[12px] text-gold-bright">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="mb-2.5 font-display text-2xl leading-snug">{t(iv.title)}</h3>
                  <div className="mono-label mb-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-paper/55">
                    <span>{fmtDate(iv.date)}</span>
                    <span>{iv.duration}</span>
                    <span className="text-gold-bright">{t(ORIGINAL_LANGUAGE[iv.originalLanguage])}</span>
                    <span>
                      {t({ en: "Interviewer", vi: "Người phỏng vấn" })} — {iv.interviewer}
                    </span>
                  </div>
                  <p className="max-w-[42em] text-[15.5px] leading-relaxed text-paper/[0.78]">
                    {t(iv.summary)}
                  </p>
                </div>
                <div className="md:pt-1.5 md:text-right">
                  <Link
                    to={`/interviews/${iv.slug}`}
                    className="inline-flex items-center gap-2 rounded-sm border border-paper/30 px-4 py-2.5 text-[13.5px] text-paper transition-colors hover:border-gold hover:bg-gold hover:text-ink"
                  >
                    ▸ {t({ en: "Listen & read", vi: "Nghe & đọc" })}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-9">
            <Link
              to="/interviews"
              className="mono-label border-b border-gold-bright/40 pb-0.5 text-[12px] text-gold-bright"
            >
              {t({ en: "View all interviews →", vi: "Xem tất cả phỏng vấn →" })}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Exhibits & Research ---------- */}
      <section className="container py-20 lg:py-[84px]">
        <Eyebrow>{t({ en: "Exhibits & Research", vi: "Triển lãm & Nghiên cứu" })}</Eyebrow>
        <h2 className="max-w-[16em] font-display text-3xl leading-tight lg:text-[40px]">
          {t({ en: "Reading the archive against itself.", vi: "Đọc kho lưu trữ ngược lại chính nó." })}
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {featuredExhibits.map((ex) => (
            <Link
              key={ex.slug}
              to={`/exhibits/${ex.slug}`}
              className="group flex flex-col border border-border bg-paper-2 transition-colors hover:border-gold"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[#cfc6b2]">
                <img
                  src={ex.cover}
                  alt=""
                  className="h-full w-full object-cover grayscale-[.35] transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="px-7 pb-8 pt-6">
                <div className="mono-label mb-3 text-[10.5px] text-pine">{t(ex.tag)}</div>
                <h3 className="mb-2.5 font-display text-2xl leading-snug">{t(ex.title)}</h3>
                <p className="text-[15px] leading-relaxed text-ink-soft">{t(ex.blurb)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Partners ---------- */}
      <section className="border-t border-border bg-paper-2">
        <div className="container py-20 lg:py-[84px]">
          <Eyebrow>{t({ en: "Partners", vi: "Đối tác" })}</Eyebrow>
          <h2 className="font-display text-3xl leading-tight lg:text-[40px]">
            {t({ en: "An international collaboration.", vi: "Một sự cộng tác quốc tế." })}
          </h2>
          <div className="mt-10 grid border border-border sm:grid-cols-3">
            {partners.map((p, i) => (
              <a
                key={p.go}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group px-7 py-9 transition-colors hover:bg-paper",
                  i < partners.length - 1 && "border-b border-border sm:border-b-0 sm:border-r"
                )}
              >
                <div className="mb-1.5 font-display text-xl leading-tight">{t(p.name)}</div>
                <div className="text-sm text-ink-soft">{t(p.sub)}</div>
                <span className="mono-label mt-4 inline-block text-[10.5px] text-pine group-hover:text-gold">
                  {p.go} →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
