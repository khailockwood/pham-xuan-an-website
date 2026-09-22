import { Link } from "react-router-dom";
import { useLanguage, type Bilingual } from "@/contexts/LanguageContext";
import { DuotonePortrait } from "@/components/DuotonePortrait";
import { cn } from "@/lib/utils";
import { interviews } from "@/content/interviews";
import { partners } from "@/content/project";
import heroPortrait from "@/assets/pxa-hero.webp";
import exhibitViz1 from "@/assets/exhibit-viz-1.jpg";
import exhibitViz2 from "@/assets/exhibit-viz-2.jpg";

/* ---------------------------------------------------------------------------
   The double record — the page's one structural argument.

   1953–1976 read as a single chronology with two sides: the career his
   colleagues in the Saigon press corps could see, and the one running underneath
   it. Every year belongs to one side or the other, except 1975, which is the
   only row with an entry on both — the page's pivot, and the reason the layout
   is a spine rather than two lists.

   Facts are the vetted ones from `content/bio.ts`; the split is kept local
   because that file's timeline is flat and carries no public/concealed
   distinction. TODO: have the VI strings reviewed.
--------------------------------------------------------------------------- */
type RecordYear = {
  year: string;
  /** What the press corps knew at the time. */
  seen?: Bilingual;
  /** What was happening at the same time, and was not known until later. */
  also?: Bilingual;
};

const RECORD_HEADS = {
  seen: { en: "What his colleagues saw", vi: "Điều các đồng nghiệp nhìn thấy" },
  also: { en: "What was also true", vi: "Điều cũng là sự thật" },
} satisfies Record<"seen" | "also", Bilingual>;

const doubleRecord: RecordYear[] = [
  {
    year: "1953",
    also: {
      en: "Joins the Việt Minh, and is later recruited into strategic intelligence.",
      vi: "Gia nhập Việt Minh, sau đó được tuyển vào ngành tình báo chiến lược.",
    },
  },
  {
    year: "1957",
    seen: {
      en: "Sails to California to study journalism at Orange Coast College.",
      vi: "Sang California học báo chí tại Orange Coast College.",
    },
  },
  {
    year: "1959",
    seen: {
      en: "Returns to Saigon and begins filing for Reuters.",
      vi: "Trở về Sài Gòn và bắt đầu viết bài cho Reuters.",
    },
  },
  {
    year: "1960s",
    also: {
      en: "Begins sending intelligence north to Hanoi under the name Hai Trung.",
      vi: "Bắt đầu gửi tin tình báo ra Hà Nội dưới bí danh Hai Trung.",
    },
  },
  {
    year: "1965",
    seen: {
      en: "Hired by Time, the magazine's only Vietnamese staff correspondent.",
      vi: "Được Time tuyển dụng, phóng viên chính thức người Việt duy nhất của tạp chí.",
    },
  },
  {
    year: "1975",
    seen: {
      en: "Covers the fall of Saigon for Time.",
      vi: "Đưa tin về sự kiện 30 tháng 4 cho Time.",
    },
    also: {
      en: "Stays behind when the American correspondents fly out.",
      vi: "Ở lại khi các phóng viên Mỹ rời đi.",
    },
  },
  {
    year: "1976",
    also: {
      en: "Publicly named a colonel in the People's Army of Vietnam.",
      vi: "Được công khai phong hàm Đại tá Quân đội Nhân dân Việt Nam.",
    },
  },
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
  const { t, lang } = useLanguage();

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  /* One record per voice in the archive, in catalogue order — An himself, then
     the three people interviewed about him. The homepage shows the shape of the
     collection rather than its first four rows, which are all the same subject. */
  const featured = interviews
    .filter((iv, i) => interviews.findIndex((o) => o.interviewee === iv.interviewee) === i)
    .slice(0, 4);

  const withAn = interviews.filter((iv) => iv.interviewee === "Pham Xuan An").length;
  const aboutAn = interviews.length - withAn;

  /** The chronology, stacked as two plain lists. Visible on small screens; kept
      in the accessibility tree at every size, because the spine below is a
      visual arrangement that does not read in a sensible order. */
  const RecordList = ({ side }: { side: "seen" | "also" }) => (
    <div>
      <h3 className="mb-4 border-b border-strong pb-2 font-display text-lead">
        {t(RECORD_HEADS[side])}
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
      {/* ---------- Hero ----------
          The name as it is filed in two places, the three sentences that make the
          archive make sense, and the way in. No page-load motion: the material
          is doing the work. */}
      <section className="border-b-2 border-gold bg-pine-deep text-paper">
        <div className="container grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
          <div>
            <h1 className="font-display text-title leading-[1.02] lg:text-masthead">
              <span className="block text-paper">Phạm Xuân Ẩn</span>
              <span className="block text-gold-bright">Hai Trung</span>
            </h1>
            <p className="mt-4 font-display text-lead tabular-nums text-paper/70">1927–2006</p>

            <p className="prose-measure mt-7 font-display text-lead text-paper/90">
              {t({
                en: "He reported the Vietnam War from Saigon for Reuters, the New York Herald Tribune, and Time. He also reported it to Hanoi, as an intelligence officer named Hai Trung. Most of his colleagues in the press corps learned this only after the war had ended.",
                vi: "Ông đưa tin về Chiến tranh Việt Nam từ Sài Gòn cho Reuters, New York Herald Tribune và Time. Ông cũng đưa tin về cuộc chiến ấy cho Hà Nội, với tư cách một sĩ quan tình báo mang bí danh Hai Trung. Phần lớn đồng nghiệp trong giới báo chí chỉ biết điều này sau khi chiến tranh kết thúc.",
              })}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                to="/interviews"
                className="inline-flex items-center rounded-sm bg-gold px-6 py-3 text-label font-medium text-ink transition-colors hover:bg-gold-bright"
              >
                {t({ en: "Listen to the interviews", vi: "Nghe các cuộc phỏng vấn" })}
              </Link>
              <Link
                to="/about-pxa"
                className="border-b border-paper/30 pb-1 text-label text-paper/80 transition-colors hover:border-paper hover:text-paper"
              >
                {t({ en: "Who was Phạm Xuân Ẩn?", vi: "Phạm Xuân Ẩn là ai?" })}
              </Link>
            </div>
          </div>

          <DuotonePortrait
            src={heroPortrait}
            alt="Phạm Xuân Ẩn"
            caption={t({ en: "Phạm Xuân Ẩn, Saigon", vi: "Phạm Xuân Ẩn, Sài Gòn" })}
            credit={t({ en: "Project collection", vi: "Tư liệu dự án" })}
            className="mx-auto w-full max-w-[320px] sm:max-w-[360px] lg:ml-auto lg:mr-0 lg:max-w-[380px]"
          />
        </div>
      </section>

      {/* ---------- The double record ---------- */}
      <section className="container py-section lg:py-section-lg">
        <h2 className="max-w-[14em] font-display text-head">
          {t({ en: "Two careers, the same years.", vi: "Hai sự nghiệp, cùng một quãng thời gian." })}
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
              {t(RECORD_HEADS.seen)}
            </h3>
            <span />
            <h3 className="font-display text-lead text-ink-muted">{t(RECORD_HEADS.also)}</h3>
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

        <Link
          to="/about-pxa"
          className="mt-10 inline-flex border-b border-gold pb-0.5 text-label text-pine"
        >
          {t({ en: "Read the full biography", vi: "Đọc tiểu sử đầy đủ" })}
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
                en: "Fifty years after the fall of Saigon, the aim is practical: put the sources in front of readers in both countries, in both languages.",
                vi: "Năm mươi năm sau ngày Sài Gòn sụp đổ, mục tiêu rất thực tế: đưa các nguồn tư liệu đến với độc giả ở cả hai nước, bằng cả hai ngôn ngữ.",
              })}
            </p>
            <Link
              to="/about-project"
              className="inline-flex border-b border-gold pb-0.5 text-label text-pine"
            >
              {t({ en: "About the project", vi: "Về dự án" })}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- The recordings (finding aid) ---------- */}
      <section className="container py-section lg:py-section-lg">
        <h2 className="font-display text-head">{t({ en: "Interviews", vi: "Phỏng vấn" })}</h2>
        <p className="prose-measure mt-4 text-body text-ink-soft">
          {t({
            en: `${interviews.length} recordings. ${withAn} are conversations with Phạm Xuân Ẩn himself, taped in 2005, the year before he died. The other ${aboutAn} are with colleagues and friends, recorded by the project since 2025.`,
            vi: `${interviews.length} bản ghi. ${withAn} bản là các cuộc trò chuyện với chính Phạm Xuân Ẩn, ghi năm 2005, một năm trước khi ông qua đời. ${aboutAn} bản còn lại là với đồng nghiệp và bạn bè, do dự án thực hiện từ năm 2025.`,
          })}
        </p>

        <ul className="mt-stack border-t border-border">
          {featured.map((iv) => (
            <li key={iv.slug}>
              <Link
                to={`/interviews/${iv.slug}`}
                className="group grid gap-x-8 gap-y-4 border-b border-border px-4 py-7 transition-colors hover:bg-paper-2 sm:px-5 md:grid-cols-[220px_1fr]"
              >
                <div>
                  <div className="font-display text-lead leading-tight">{iv.interviewee}</div>
                  {/* Each fact is its own element: a screen reader reads these as
                      separate utterances rather than one run-on line. */}
                  <dl className="meta-label mt-2 space-y-0.5">
                    <div className="flex gap-1.5">
                      <dt className="sr-only">{t({ en: "Interviewer", vi: "Người phỏng vấn" })}</dt>
                      <dd>
                        {t({ en: "Interviewed by", vi: "Phỏng vấn bởi" })} {iv.interviewer}
                      </dd>
                    </div>
                    <dd>{iv.dateDisplay ?? fmtDate(iv.date)}</dd>
                    {iv.duration !== "—" && <dd className="tabular-nums">{iv.duration}</dd>}
                  </dl>
                </div>
                <div>
                  <h3 className="font-display text-sub leading-snug transition-colors group-hover:text-pine">
                    {t(iv.title)}
                  </h3>
                  <p className="prose-measure mt-2.5 text-ink-soft">{t(iv.summary)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to="/interviews"
          className="mt-10 inline-flex border-b border-gold pb-0.5 text-label text-pine"
        >
          {t({ en: "View all interviews", vi: "Xem tất cả phỏng vấn" })}
        </Link>
      </section>

      {/* ---------- Exhibits ----------
          Same register structure as the interviews above, so the page has one
          way of listing things rather than two. Both entries are unpublished and
          say so. */}
      <section className="border-t border-border bg-paper-2">
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
                  className="group grid gap-x-8 gap-y-4 border-b border-border px-4 py-7 transition-colors hover:bg-paper sm:px-5 md:grid-cols-[220px_1fr]"
                >
                  <div className="aspect-[4/3] w-full max-w-[280px] overflow-hidden border border-border bg-[#cfc6b2] md:max-w-none">
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

      {/* ---------- Partners ---------- */}
      <section className="container py-section lg:py-section-lg">
        <h2 className="max-w-[15em] font-display text-head">
          {t({
            en: "A multi-institution, international collaboration.",
            vi: "Sự cộng tác quốc tế giữa nhiều tổ chức.",
          })}
        </h2>
        <div className="mt-stack grid border border-border sm:grid-cols-3">
          {partners.map((p, i) => (
            <a
              key={p.go}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group flex min-w-0 flex-col px-8 py-9 transition-colors hover:bg-paper-2",
                i < partners.length - 1 && "border-b border-border sm:border-b-0 sm:border-r"
              )}
            >
              <div className="flex h-20 w-full items-center">
                <img
                  src={p.logo}
                  alt={p.logoAlt}
                  loading="lazy"
                  className="max-h-full w-auto max-w-full object-contain object-left"
                />
              </div>
              <div className="mt-7 font-display text-lead leading-snug">{t(p.name)}</div>
              <div className="mt-1 text-label text-ink-muted">{t(p.sub)}</div>
              <span className="mt-5 text-label text-pine transition-colors group-hover:text-pine-deep">
                {p.go}
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
};

export default Index;
