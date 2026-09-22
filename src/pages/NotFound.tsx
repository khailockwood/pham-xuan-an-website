import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

/* An empty screen is an invitation to act, not an apology. No "Oops" — say what
   happened and give the reader the two places worth going. */
const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="container py-section lg:py-section-lg">
      <h1 className="font-display text-title">
        {t({ en: "This page isn't here", vi: "Không có trang này" })}
      </h1>
      <p className="prose-measure mt-5 text-ink-soft">
        {t({
          en: "The address may be mistyped, or the page may have moved since it was linked.",
          vi: "Địa chỉ có thể bị gõ sai, hoặc trang đã được chuyển đi kể từ khi liên kết được tạo.",
        })}
      </p>
      <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
        <Link
          to="/interviews"
          className="inline-flex items-center rounded-sm bg-pine px-6 py-3 text-label font-medium text-paper transition-colors hover:bg-pine-deep"
        >
          {t({ en: "Go to the interviews", vi: "Đến phần phỏng vấn" })}
        </Link>
        <Link to="/" className="border-b border-gold pb-0.5 text-label text-pine">
          {t({ en: "Back to the home page", vi: "Về trang chủ" })}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
