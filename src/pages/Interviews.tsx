import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { interviews } from "@/content/interviews";
import { ui } from "@/content/site";
import { Input } from "@/components/ui/input";
import interviewPxaImg from "@/assets/interview-pxa.jpg";
import interviewNguyenImg from "@/assets/interview-nguyen.jpg";

const thumbnails: Record<string, string> = {
  "robert-shaplen-recollection": interviewPxaImg,
  "nguyen-thi-thu-an": interviewNguyenImg,
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
      <div className="uppercase tracking-[0.25em] text-accent mb-3 text-sm font-bold">
        {t({ en: "Archive", vi: "Kho lưu trữ" })}
      </div>
      <h1 className="font-display text-4xl md:text-5xl leading-tight mb-10">
        {t({ en: "Interviews", vi: "Phỏng vấn" })}
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t(ui.search)}
            className="pl-9 bg-background"
          />
        </div>
        <div className="flex items-center gap-1 text-xs">
          {(["all", "en", "vi"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLangFilter(l)}
              className={`px-3 py-2 border uppercase tracking-wide transition-colors ${
                langFilter === l
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:border-accent"
              }`}
            >
              {l === "all" ? t({ en: "All", vi: "Tất cả" }) : l}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-foreground/60">{t(ui.noResults)}</p>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {filtered.map((iv) => (
            <li key={iv.slug}>
              <Link
                to={`/interviews/${iv.slug}`}
                className="grid md:grid-cols-12 gap-6 py-6 hover:bg-card transition-colors px-2 -mx-2"
              >
                <div className="md:col-span-3">
                  <div className="aspect-[4/3] w-full bg-muted flex items-center justify-center text-muted-foreground overflow-hidden">
                    {thumbnails[iv.slug] ? (
                      <img src={thumbnails[iv.slug]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={28} strokeWidth={1.25} />
                    )}
                  </div>
                </div>
                <div className="md:col-span-6">
                  <h2 className="font-display text-2xl leading-tight group-hover:text-accent">
                    {t(iv.title)}
                  </h2>
                  <p className="text-sm text-foreground/70 mt-2 leading-relaxed line-clamp-2">
                    {t(iv.summary)}
                  </p>
                </div>
                <div className="md:col-span-3 md:text-right text-sm text-foreground/70 space-y-1">
                  <div className="font-medium text-foreground">{iv.interviewee}</div>
                  <div>{new Date(iv.date).toLocaleDateString()}</div>
                  <div className="text-xs uppercase tracking-wider text-accent">
                    {iv.duration} · {iv.originalLanguage}
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