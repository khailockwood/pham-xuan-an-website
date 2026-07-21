import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Eyebrow from "@/components/Eyebrow";
import OhmsNativePlayer from "@/components/OhmsNativePlayer";

/**
 * Unlisted technical preview (not in nav) for the NATIVE OHMS player — the
 * counterpart to `/ohms-preview`, which demonstrates the iframe path.
 *
 * The point of this page is to prove that an OHMS **XML file on its own** is
 * enough to display a synchronized interview on this static site: no PHP OHMS
 * Viewer, no external hosting, nothing to stand up on a server. The XML files
 * below are public Nunn Center / OHMS samples committed to `public/ohms/` — they
 * are NOT Phạm Xuân Ẩn interviews. Delete this route before public launch.
 */

type Fixture = {
  id: string;
  file: string;
  label: { en: string; vi: string };
  note: { en: string; vi: string };
};

const FIXTURES: Fixture[] = [
  {
    id: "005",
    file: "/ohms/sample-005.xml",
    label: {
      en: "Sample 005 — video, indexed, timecoded transcript",
      vi: "Mẫu 005 — video, có chỉ mục, bản ghi có mốc thời gian",
    },
    note: {
      en: "The complete case: a directly-hosted video file, 14 index segments, and a full transcript with an OHMS timecode map. Everything syncs both ways.",
      // TODO: verify VI
      vi: "Trường hợp đầy đủ: tệp video lưu trực tiếp, 14 đoạn chỉ mục và bản ghi đầy đủ kèm bản đồ mốc thời gian OHMS. Mọi thứ đồng bộ hai chiều.",
    },
  },
  {
    id: "003",
    file: "/ohms/sample-003.xml",
    label: {
      en: "Sample 003 — audio, indexed, timecoded transcript",
      vi: "Mẫu 003 — âm thanh, có chỉ mục, bản ghi có mốc thời gian",
    },
    note: {
      en: "The audio equivalent. Note that this sample's media host has since gone offline, so it also shows how the player behaves when a recording cannot be reached: the index and transcript still work.",
      // TODO: verify VI
      vi: "Phiên bản âm thanh tương ứng. Lưu ý rằng máy chủ lưu tệp của mẫu này đã ngừng hoạt động, nên nó cũng cho thấy cách trình phát xử lý khi không truy cập được bản ghi âm: chỉ mục và bản ghi lời vẫn hoạt động.",
    },
  },
  {
    id: "001",
    file: "/ohms/sample-001.xml",
    label: {
      en: "Sample 001 — index only, external player",
      vi: "Mẫu 001 — chỉ có chỉ mục, trình phát bên ngoài",
    },
    note: {
      en: "An index-only export whose media lives on Vimeo. It shows the degraded tier: the index still drives the external player, but a transcript that does not exist cannot be shown.",
      // TODO: verify VI
      vi: "Bản xuất chỉ có chỉ mục, với tệp phương tiện nằm trên Vimeo. Nó cho thấy mức hoạt động rút gọn: chỉ mục vẫn điều khiển trình phát bên ngoài, nhưng không thể hiển thị bản ghi lời vốn không tồn tại.",
    },
  },
];

const OhmsNative = () => {
  const { t } = useLanguage();
  const [active, setActive] = useState(FIXTURES[0]);

  return (
    <article className="container max-w-4xl py-16 md:py-24">
      <Eyebrow>{t({ en: "Technical preview", vi: "Bản xem thử kỹ thuật" })}</Eyebrow>

      <h1 className="mb-5 font-display text-3xl leading-tight md:text-[40px]">
        {t({
          en: "A synchronized interview from the XML alone",
          vi: "Phỏng vấn đồng bộ chỉ từ tệp XML",
        })}
      </h1>

      <div className="mb-10 border-l-2 border-gold bg-paper-2 px-5 py-4">
        <p className="text-[15px] leading-relaxed text-ink-soft">
          {t({
            en: "This page is a plumbing test, not real content. The recordings below are public OHMS sample interviews from the Nunn Center — they are not Phạm Xuân Ẩn interviews. Unlike the embedded viewer, nothing here is hosted elsewhere: the site reads the OHMS XML file directly and builds the player, the index, and the transcript in your browser. An XML export is therefore sufficient on its own — no separate OHMS Viewer installation is required.",
            // TODO: verify VI
            vi: "Trang này là một bài kiểm tra kỹ thuật, không phải nội dung thật. Các bản ghi bên dưới là phỏng vấn mẫu công khai của OHMS từ Nunn Center — không phải phỏng vấn Phạm Xuân Ẩn. Khác với trình xem nhúng, ở đây không có gì được lưu trữ ở nơi khác: trang web đọc trực tiếp tệp XML của OHMS và dựng trình phát, chỉ mục và bản ghi lời ngay trong trình duyệt của bạn. Do đó, chỉ cần một tệp XML là đủ — không cần cài đặt riêng một OHMS Viewer.",
          })}
        </p>
      </div>

      <div className="mb-6">
        <p className="mono-label mb-3 text-[10.5px] text-ink-soft/60">
          {t({ en: "Sample record", vi: "Hồ sơ mẫu" })}
        </p>
        <div className="flex flex-col border-t border-border">
          {FIXTURES.map((f) => {
            const isActive = f.id === active.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActive(f)}
                aria-current={isActive || undefined}
                className={`border-b border-l-2 border-border px-4 py-3.5 text-left transition-colors ${
                  isActive ? "border-l-gold bg-paper-2" : "border-l-transparent hover:bg-paper-2/50"
                }`}
              >
                <span className="block font-display text-[17px] leading-snug text-ink">
                  {t(f.label)}
                </span>
                <span className="mt-1 block max-w-[64ch] text-[13.5px] leading-relaxed text-ink-soft">
                  {t(f.note)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <OhmsNativePlayer
        key={active.id}
        src={active.file}
        title={t({ en: "OHMS public sample", vi: "Mẫu OHMS công khai" })}
      />

      <p className="mt-4 text-xs leading-relaxed text-ink-soft">
        {t({
          en: "Try it: use the Index / Transcript toggle, search a keyword, and click any timestamped segment to jump the recording to that moment. While a recording plays, the current index segment and the current transcript passage are marked and scroll into view.",
          // TODO: verify VI
          
          vi: "Hãy thử: dùng nút chuyển Chỉ mục / Bản ghi, tìm một từ khóa, và nhấp vào bất kỳ đoạn có mốc thời gian nào để đưa bản ghi đến thời điểm đó. Khi đang phát, đoạn chỉ mục và đoạn bản ghi hiện tại sẽ được đánh dấu và tự cuộn vào tầm nhìn.",
        })}
      </p>
    </article>
  );
};

export default OhmsNative;
