import { useLanguage } from "@/contexts/LanguageContext";
import { Eyebrow } from "@/components/Eyebrow";
import OhmsViewer from "@/components/OhmsViewer";

/**
 * Unlisted technical preview (not in nav). Proves, end-to-end, that a hosted
 * synchronized oral-history viewer frames correctly inside this site.
 *
 * Both samples below are PUBLIC interviews belonging to other institutions —
 * they are plumbing demonstrations, NOT Phạm Xuân Ẩn content. Each real interview
 * lights up by setting its `ohmsUrl` in `src/content/interviews.ts`.
 * Delete this route before public launch.
 */

/** Path A — Aviary (the project's route: DDHI has an Aviary account). */
const AVIARY_SAMPLE =
  "https://queenslibrary.aviaryplatform.com/collections/21/collection_resources/42641?embed=true";

/** Path B — a self-hosted OHMS Viewer (viewer.php?cachefile=…). */
const OHMS_PHP_SAMPLE =
  "https://ohms-viewer.oralhistoriesatksu.org/viewer.php?cachefile=OHMS-Sample-001.xml";

const OhmsPreview = () => {
  const { t } = useLanguage();

  return (
    <article className="container max-w-4xl py-16 md:py-24">
      <Eyebrow>{t({ en: "Technical preview", vi: "Bản xem thử kỹ thuật" })}</Eyebrow>
      <h1 className="mb-5 font-display text-3xl leading-tight md:text-[40px]">
        {t({
          en: "The synchronized viewer, embedded live",
          vi: "Trình xem đồng bộ, nhúng trực tiếp",
        })}
      </h1>

      <div className="mb-12 border-l-2 border-gold bg-paper-2 px-5 py-4">
        <p className="text-[15px] leading-relaxed text-ink-soft">
          {t({
            en: "This page is a plumbing test, not real content. Both players below are public interviews belonging to other institutions — neither is a Phạm Xuân Ẩn interview. They prove that a hosted synchronized viewer (audio, transcript, and index) frames correctly inside this website. Each project interview will appear the same way once its own viewer URL is set.",
            vi: "Trang này là một bài kiểm tra kỹ thuật, không phải nội dung thật. Cả hai trình phát bên dưới đều là phỏng vấn công khai của các tổ chức khác — không phải phỏng vấn Phạm Xuân Ẩn. Chúng chứng minh rằng một trình xem đồng bộ (âm thanh, bản ghi và chỉ mục) hiển thị đúng bên trong trang web này. Mỗi cuộc phỏng vấn của dự án sẽ xuất hiện tương tự khi có URL trình xem riêng.",
          })}
        </p>
      </div>

      {/* ---- Path A: Aviary ---- */}
      <section className="mb-14">
        <div className="mono-label mb-2 text-[10.5px] text-pine">
          {t({ en: "Path A · Aviary embed", vi: "Hướng A · Nhúng Aviary" })}
        </div>
        <h2 className="mb-3 font-display text-2xl leading-snug">
          {t({
            en: "Hosted by Aviary — the route this project will use",
            vi: "Lưu trữ bởi Aviary — hướng đi mà dự án sẽ dùng",
          })}
        </h2>
        <p className="mb-5 max-w-[46em] text-[15px] leading-relaxed text-ink-soft">
          {t({
            en: "Aviary ingests OHMS XML and publishes a ready-made embed URL, so no viewer software has to be installed or maintained anywhere. Its embed pages allow framing from any origin, so they work on this site with no server configuration at all.",
            vi: "Aviary nhận tệp XML của OHMS và tạo sẵn một URL nhúng, nên không cần cài đặt hay duy trì phần mềm trình xem ở bất kỳ đâu. Các trang nhúng của Aviary cho phép hiển thị từ mọi nguồn, nên hoạt động trên trang này mà không cần cấu hình máy chủ.",
          })}
        </p>
        <OhmsViewer
          url={AVIARY_SAMPLE}
          title={t({ en: "Aviary public sample interview", vi: "Phỏng vấn mẫu công khai trên Aviary" })}
        />
        <p className="mt-3 text-xs leading-relaxed text-ink-soft/80">
          {t({
            en: "Source: Queens Public Library oral history collection, hosted on Aviary.",
            vi: "Nguồn: bộ sưu tập lịch sử truyền miệng của Queens Public Library, lưu trữ trên Aviary.",
          })}
        </p>
      </section>

      {/* ---- Path B: self-hosted OHMS Viewer ---- */}
      <section>
        <div className="mono-label mb-2 text-[10.5px] text-pine">
          {t({ en: "Path B · Self-hosted OHMS Viewer", vi: "Hướng B · Tự lưu trữ OHMS Viewer" })}
        </div>
        <h2 className="mb-3 font-display text-2xl leading-snug">
          {t({ en: "The classic viewer.php install", vi: "Bản cài đặt viewer.php cổ điển" })}
        </h2>
        <p className="mb-5 max-w-[46em] text-[15px] leading-relaxed text-ink-soft">
          {t({
            en: "The alternative: a PHP OHMS Viewer running on a server, reading one XML file per interview. Kept here as a fallback in case any interview needs to be served outside Aviary.",
            vi: "Phương án thay thế: một OHMS Viewer bằng PHP chạy trên máy chủ, đọc một tệp XML cho mỗi cuộc phỏng vấn. Giữ lại ở đây làm phương án dự phòng nếu có cuộc phỏng vấn nào cần phục vụ ngoài Aviary.",
          })}
        </p>
        <OhmsViewer
          url={OHMS_PHP_SAMPLE}
          title={t({ en: "OHMS public sample (Kansas State University)", vi: "Mẫu OHMS công khai (Đại học Bang Kansas)" })}
        />
        <p className="mt-3 text-xs leading-relaxed text-ink-soft/80">
          {t({
            en: "Source: Kansas State University oral history sample collection. Try the play controls and the Index / Transcript toggle; click any timestamped segment to seek the audio.",
            vi: "Nguồn: bộ sưu tập lịch sử truyền miệng mẫu của Đại học Bang Kansas. Hãy thử các nút phát và nút chuyển Index / Transcript; nhấp vào đoạn có mốc thời gian để tua âm thanh.",
          })}
        </p>
      </section>
    </article>
  );
};

export default OhmsPreview;
