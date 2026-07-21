import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Section eyebrow: a short gold rule + mono label. The site's standard section
 * marker — use it above every page/section heading so the structural language
 * stays identical across the archive.
 */
export const Eyebrow = ({
  children,
  onDark = false,
  className,
}: {
  children: ReactNode;
  onDark?: boolean;
  className?: string;
}) => (
  <div className={cn("mb-5 flex items-center gap-3.5", className)}>
    <span className="h-px w-7 bg-gold" />
    <span className={cn("mono-label", onDark ? "text-gold-bright" : "text-pine")}>{children}</span>
  </div>
);

export default Eyebrow;
