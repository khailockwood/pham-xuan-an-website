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
  className?: string;
};

/**
 * Archival duotone treatment used in the hero and reusable on other pages:
 * a grayscale image under a pine-deep color overlay + gold→pine multiply
 * gradient (see the `.duotone` utility in index.css), framed with thin gold
 * corner marks and a mono caption. Designed to sit on a dark surface.
 */
export const DuotonePortrait = ({
  src,
  alt,
  caption,
  credit,
  focus = "50% 22%",
  className,
}: DuotonePortraitProps) => (
  <figure className={cn("relative", className)}>
    <div className="duotone relative aspect-[4/5] overflow-hidden border border-paper/20">
      {/* top-left corner mark */}
      <span className="absolute -left-px -top-px z-10 h-4 w-4 border-l-2 border-t-2 border-gold/80" />
      <img src={src} alt={alt} style={{ objectPosition: focus }} className="h-full w-full object-cover" />
    </div>
    {/* bottom-right corner mark, sitting just above the caption row */}
    <span className="absolute -right-px bottom-9 h-4 w-4 border-b-2 border-r-2 border-gold/80" />
    {(caption || credit) && (
      <figcaption className="mono-label mt-3 flex justify-between text-[10.5px] tracking-[0.14em] text-paper/50">
        {caption && <span>{caption}</span>}
        {credit && <span>{credit}</span>}
      </figcaption>
    )}
  </figure>
);
