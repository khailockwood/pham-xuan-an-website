import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Eyebrow } from "@/components/Eyebrow";
import { exhibits } from "@/content/exhibits";

const Exhibits = () => {
  const { t } = useLanguage();
  return (
    <div className="container py-16 md:py-24">
      <Eyebrow>{t({ en: "Research", vi: "Nghiên cứu" })}</Eyebrow>
      <h1 className="font-display text-4xl md:text-5xl leading-tight mb-12">
        {t({ en: "Exhibits", vi: "Triển lãm" })}
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {exhibits.map((ex) => (
          <Link
            key={ex.slug}
            to={`/exhibits/${ex.slug}`}
            className="group block border border-border bg-card hover:border-pine transition-colors"
          >
            <div className="aspect-[16/10] bg-muted overflow-hidden">
              <img src={ex.cover} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-6">
              <h2 className="font-display text-2xl leading-tight mb-2 group-hover:text-pine transition-colors">
                {t(ex.title)}
              </h2>
              <p className="text-sm text-foreground/70 leading-relaxed">{t(ex.dek)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Exhibits;