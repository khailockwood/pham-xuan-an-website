import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

/* Each button names its language in that language, and the group names itself
   in both, so a reader who cannot read the current interface can still find
   the switch with a screen reader. */
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "vi", name: "Tiếng Việt" },
] as const;

export const LanguageToggle = ({
  className,
  onDark = false,
}: {
  className?: string;
  /** Light-on-dark treatment for use over the pine masthead / hero. */
  onDark?: boolean;
}) => {
  const { lang, setLang } = useLanguage();
  return (
    <div
      className={cn(
        "inline-flex items-center overflow-hidden rounded-sm border font-mono text-micro tracking-[0.06em]",
        // A control boundary, so it needs 3:1 (WCAG 1.4.11): paper at 50% on
        // pine-deep clears it; on light grounds that is the control rule.
        onDark ? "border-paper/50" : "border-strong",
        className
      )}
      role="group"
      aria-label="Language / Ngôn ngữ"
    >
      {LANGUAGES.map(({ code, name }) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-label={name}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={cn(
            "px-2.5 py-1.5 uppercase transition-colors",
            lang === code
              ? onDark
                ? "bg-gold text-ink"
                : "bg-ink text-paper"
              : onDark
                ? "bg-transparent text-paper/70 hover:text-paper"
                : "bg-transparent text-ink-soft hover:text-ink"
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
};
