import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export const LanguageToggle = ({ className }: { className?: string }) => {
  const { lang, setLang } = useLanguage();
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0 border border-border rounded-sm overflow-hidden text-xs font-medium tracking-wide",
        className
      )}
      role="group"
      aria-label="Language"
    >
      {(["en", "vi"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            "px-2.5 py-1 uppercase transition-colors",
            lang === l
              ? "bg-primary text-primary-foreground"
              : "bg-transparent text-foreground/70 hover:text-foreground"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
};