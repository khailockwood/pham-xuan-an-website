import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export const LanguageToggle = ({ className }: { className?: string }) => {
  const { lang, setLang } = useLanguage();
  return (
    <div
      className={cn(
        "inline-flex items-center overflow-hidden rounded-sm border border-border font-mono text-[11px] tracking-[0.1em]",
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
            "px-2.5 py-1.5 uppercase transition-colors",
            lang === l
              ? "bg-ink text-paper"
              : "bg-transparent text-ink-soft hover:text-ink"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
};