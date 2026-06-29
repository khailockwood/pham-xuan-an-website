import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "en" | "vi";
export type Bilingual = { en: string; vi: string };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (b: Bilingual) => string;
};

const LanguageContext = createContext<Ctx | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("pxa-lang") as Lang | null;
    if (stored === "en" || stored === "vi") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("pxa-lang", l);
    document.documentElement.lang = l;
  };

  const t = (b: Bilingual) => b[lang] ?? b.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};