import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { exhibits } from "@/content/exhibits";
import { interviews } from "@/content/interviews";
import NotFound from "./NotFound";

const ExhibitDetail = () => {
  const { slug } = useParams();
  const { t } = useLanguage();
  const exhibit = exhibits.find((e) => e.slug === slug);
  if (!exhibit) return <NotFound />;

  const related = (exhibit.relatedInterviews ?? [])
    .map((s) => interviews.find((i) => i.slug === s))
    .filter(Boolean);

  return (
    <article className="container py-section prose-measure">
      <Link to="/exhibits" className="inline-flex items-center gap-2 text-sm text-pine hover:underline mb-8">
        <ArrowLeft size={14} /> {t({ en: "Back to exhibits", vi: "Quay lại triển lãm" })}
      </Link>

      <h1 className="font-display text-title mb-4">{t(exhibit.title)}</h1>
      <p className="text-lead text-ink-soft mb-10">{t(exhibit.dek)}</p>

      <div className="aspect-[16/9] bg-muted border border-border mb-10 overflow-hidden">
        <img src={exhibit.cover} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="space-y-6 text-foreground/85 leading-relaxed">
        {t(exhibit.body).split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>


      {related.length > 0 && (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="font-display text-sub mb-6">
            {t({ en: "Related interviews", vi: "Phỏng vấn liên quan" })}
          </h2>
          <ul className="space-y-3">
            {related.map((iv) => iv && (
              <li key={iv.slug}>
                <Link to={`/interviews/${iv.slug}`} className="text-pine hover:underline">
                  {t(iv.title)}
                </Link>
                <span className="meta-label ml-2">{iv.interviewee}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
};

export default ExhibitDetail;