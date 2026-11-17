import { useEffect } from "react";
import { useLanguage, type Bilingual } from "@/contexts/LanguageContext";
import { siteName } from "@/content/site";

/* The browser tab title for the current page, in the current language:
   "<page> | The Pham Xuan An Project". The homepage passes nothing and gets
   the site name with what the site is. */
const siteTitle: Bilingual = {
  en: "The Pham Xuan An Project: oral history archive",
  vi: "Dự án Phạm Xuân Ẩn: kho lưu trữ lịch sử truyền miệng",
};

export const notFoundTitle: Bilingual = { en: "Page not found", vi: "Không tìm thấy trang" };

export const usePageTitle = (title?: Bilingual | string) => {
  const { lang, t } = useLanguage();
  const page = typeof title === "string" ? title : title ? t(title) : undefined;
  useEffect(() => {
    document.title = page ? `${page} | ${t(siteName)}` : t(siteTitle);
    // `t` changes identity every render; `lang` is what it depends on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, lang]);
};
