import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { interviews } from "@/content/interviews";
import { ui } from "@/content/site";
import { Input } from "@/components/ui/input";
import { Eyebrow } from "@/components/Eyebrow";
import { cn } from "@/lib/utils";
import interviewPxaImg from "@/assets/interview-pxa.jpg";

/* Portrait of Phạm Xuân Ẩn, used for the interviews he himself sat for.
   Interviews with other subjects have no portrait on file yet and fall back to
   the placeholder mark. */
const thumbnails: Record<string, string> = {
  "miller-pham-xuan-an": interviewPxaImg,
  "mcmorris-pham-xuan-an-1": interviewPxaImg,
  "mcmorris-pham-xuan-an-2": interviewPxaImg,
  "berman-pham-xuan-an-1a": interviewPxaImg,
  "berman-pham-xuan-an-1b": interviewPxaImg,
};

const Interviews = () => {
  const { t } = useLanguage();
  const [q, setQ] = useState("");
  const [langFilter, setLangFilter] = useState<"all" | "en" | "vi">("all");

  const filtered = useMemo(() => {
    return interviews.filter((iv) => {
      const matchesLang = langFilter === "all" || iv.originalLanguage === langFilter;
      const text = `${iv.interviewee} ${t(iv.title)} ${t(iv.summary)}`.toLowerCase();
      const matchesQ = !q || text.includes(q.toLowerCase());
      return matchesLang && matchesQ;
    });
  }, [q, langFilter, t]);

  return (
    <div className="container py-16 md:py-24">
      <Eyebrow>{t({ en: "Archive", vi: "Kho lưu trữ" })}</Eyebrow>
      <h1 className="mb-10 font-display text-4xl leading-tight md:text-5xl">
        {t({ en: "Interviews", vi: "Phỏng vấn" })}
      </h1>

      <div className="mb-10 flex flex-col gap-4 border-y border-border py-5 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/50" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t(ui.search)}
            className="border-border bg-background pl-9"
          />
        </div>
        <div className="flex items-center gap-1">
          {(["all", "en", "vi"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLangFilter(l)}
              className={cn(
                "mono-label border px-3 py-2 text-[10.5px] transition-colors",
                langFilter === l
                  ? "border-pine bg-pine text-paper"
                  : "border-border bg-background text-ink-soft hover:border-pine hover:text-pine"
              )}
            >
              {l === "all" ? t({ en: "All", vi: "Tất cả" }) : l}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-ink-soft">{t(ui.noResults)}</p>
      ) : (
        <ul className="border-t border-border">
          {filtered.map((iv, i) => (
            <li key={iv.slug}>
              <Link
                to={`/interviews/${iv.slug}`}
                className="group grid gap-6 border-b border-border py-7 transition-colors hover:bg-paper-2 md:grid-cols-12"
              >
                <div className="mono-label hidden pt-1 text-[12px] text-ink-soft/45 md:col-span-1 md:block">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="md:col-span-3">
                  <div className="aspect-[4/3] w-full overflow-hidden border border-border bg-paper-2">
                    {thumbnails[iv.slug] ? (
                      <img src={thumbnails[iv.slug]} alt="" className="h-full w-full object-cover grayscale-[.35]" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-ink-soft/40">
                        <ImageIcon size={26} strokeWidth={1.25} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-5">
                  <h2 className="font-display text-2xl leading-snug transition-colors group-hover:text-pine">
                    {t(iv.title)}
                  </h2>
                  <p className="mt-2.5 line-clamp-2 text-[15px] leading-relaxed text-ink-soft">
                    {t(iv.summary)}
                  </p>
                </div>
                <div className="space-y-1.5 md:col-span-3 md:text-right">
                  <div className="font-display text-lg leading-tight">{iv.interviewee}</div>
                  <div className="mono-label text-[10.5px] text-ink-soft/65">
                    {iv.dateDisplay ??
                      new Date(iv.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                  <div className="mono-label text-[10.5px] text-pine">
                    {iv.duration} · {iv.originalLanguage.toUpperCase()}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Interviews;