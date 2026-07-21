import { cn } from "@/lib/utils";

type DuotonePortraitProps = {
  src: string;
  alt: string;
  /** Left-aligned caption under the frame (e.g. subject · place). */
  caption?: string;
  /** Right-aligned credit under the frame (e.g. "Project collection"). */
  credit?: string;
  /** object-position for the image (defaults to a flattering top-biased crop). */
  focus?: string;
  /** Set when the frame sits on a light (paper) surface — flips the border/caption ink. */
  onLight?: boolean;
  className?: string;
};

/**
 * Archival duotone treatment used in the hero and reusable on other pages:
 * a clean B&W photograph with a whisper of pine in the shadows (see the
 * `.duotone` utility in index.css), framed with thin gold corner marks and a
 * mono caption. Works on dark or light (paper) surfaces via `onLight`.
 */
export const DuotonePortrait = ({
  src,
  alt,
  caption,
  credit,
  focus = "50% 20%",
  onLight = false,
  className,
}: DuotonePortraitProps) => (
  <figure className={cn("relative", className)}>
    <div className={cn("duotone relative aspect-[4/5] overflow-hidden border", onLight ? "border-ink/15" : "border-paper/20")}>
      {/* top-left corner mark */}
      <span className="absolute -left-px -top-px z-10 h-4 w-4 border-l-2 border-t-2 border-gold" />
      <img src={src} alt={alt} style={{ objectPosition: focus }} className="h-full w-full object-cover" />
    </div>
    {/* bottom-right corner mark, sitting just above the caption row */}
    <span className="absolute -right-px bottom-9 h-4 w-4 border-b-2 border-r-2 border-gold" />
    {(caption || credit) && (
      <figcaption
        className={cn(
          "mono-label mt-3 flex justify-between text-[10.5px] tracking-[0.14em]",
          onLight ? "text-ink-soft/70" : "text-paper/50"
        )}
      >
        {caption && <span>{caption}</span>}
        {credit && <span>{credit}</span>}
      </figcaption>
    )}
  </figure>
);
