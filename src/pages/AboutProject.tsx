import { useLanguage } from "@/contexts/LanguageContext";
import { Eyebrow } from "@/components/Eyebrow";
import { User } from "lucide-react";
import { cite, methodology, mission, partners, team, studentResearchers } from "@/content/project";

const AboutProject = () => {
  const { t } = useLanguage();
  return (
    <article className="container py-16 md:py-24 max-w-4xl">
      <Eyebrow>{t({ en: "About", vi: "Về dự án" })}</Eyebrow>
      <h1 className="font-display text-4xl md:text-5xl leading-tight mb-10">
        {t({ en: "The Pham Xuan An Project", vi: "Về dự án" })}
      </h1>

      <Section title={{ en: "Mission", vi: "Sứ mệnh" }} body={mission} />
      <Section title={{ en: "Methodology", vi: "Phương pháp" }} body={methodology} />

      <h2 className="font-display text-2xl mt-12 mb-4">{t({ en: "Team", vi: "Nhóm thực hiện" })}</h2>
      <ul className="grid md:grid-cols-3 gap-px bg-border border border-border">
        {team.map((m) => (
          <li key={m.name} className="bg-background p-6 flex flex-col items-center text-center">
            <div className="aspect-square w-32 bg-muted border border-border flex items-center justify-center text-muted-foreground mb-4">
              <User size={40} strokeWidth={1.25} />
            </div>
            <div className="font-display text-lg">{m.name}</div>
            <div className="text-sm text-foreground/70 mt-1">{t(m.role)}</div>
          </li>
        ))}
      </ul>

      <h3 className="font-display text-xl mt-10 mb-4">{t({ en: "Student Researchers", vi: "Sinh viên nghiên cứu" })}</h3>
      <ul className="grid md:grid-cols-3 gap-px bg-border border border-border">
        {studentResearchers.map((m, i) => (
          <li key={i} className="bg-background p-6 flex flex-col items-center text-center">
            <div className="aspect-square w-32 bg-muted border border-border flex items-center justify-center text-muted-foreground mb-4">
              <User size={40} strokeWidth={1.25} />
            </div>
            <div className="font-display text-lg">{m.name}</div>
            <div className="text-sm text-foreground/70 mt-1">{t(m.role)}</div>
          </li>
        ))}
      </ul>

      <Section title={{ en: "Partners", vi: "Đối tác" }} body={partners} />
      <Section title={{ en: "How to Cite", vi: "Cách trích dẫn" }} body={cite} />
    </article>
  );
};

const Section = ({ title, body }: { title: { en: string; vi: string }; body: { en: string; vi: string } }) => {
  const { t } = useLanguage();
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl mb-3">{t(title)}</h2>
      <p className="text-foreground/80 leading-relaxed">{t(body)}</p>
    </section>
  );
};

export default AboutProject;