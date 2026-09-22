import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { interviews } from "@/content/interviews";
import { ui } from "@/content/site";
import { Input } from "@/components/ui/input";
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
      <h1 className="mb-10 font-display text-title">
        {t({ en: "Interviews", vi: "Phỏng vấn" })}
      </h1>

      <div className="mb-10 flex flex-col gap-4 border-y border-border py-5 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t(ui.search)}
            className="border-strong bg-background pl-9"
          />
        </div>
        <div className="flex items-center gap-1">
          {(["all", "en", "vi"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLangFilter(l)}
              className={cn(
                "text-label border px-3 py-2 transition-colors",
                langFilter === l
                  ? "border-pine bg-pine text-paper"
                  : "border-strong bg-background text-ink-soft hover:border-pine hover:text-pine"
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
          {filtered.map((iv) => (
            <li key={iv.slug}>
              <Link
                to={`/interviews/${iv.slug}`}
                className="group grid gap-6 border-b border-border px-4 py-7 transition-colors hover:bg-paper-2 sm:px-5 md:grid-cols-11"
              >
                <div className="md:col-span-3">
                  <div className="aspect-[4/3] w-full overflow-hidden border border-border bg-paper-2">
                    {thumbnails[iv.slug] ? (
                      <img src={thumbnails[iv.slug]} alt="" className="h-full w-full object-cover grayscale-[.35]" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-ink-muted">
                        <ImageIcon size={26} strokeWidth={1.25} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-5">
                  <h2 className="font-display text-sub leading-snug transition-colors group-hover:text-pine">
                    {t(iv.title)}
                  </h2>
                  <p className="prose-measure mt-2.5 line-clamp-2 text-ink-soft">
                    {t(iv.summary)}
                  </p>
                </div>
                <div className="space-y-1.5 md:col-span-3 md:text-right">
                  <div className="font-display text-lead leading-tight">{iv.interviewee}</div>
                  <div className="meta-label">
                    {iv.dateDisplay ??
                      new Date(iv.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                  <div className="meta-label tabular-nums">{iv.duration}</div>
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