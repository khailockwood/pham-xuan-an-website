import { Fragment } from "react";

/** Copy with *asterisks* around titles, rendered with those spans in italics.
    The content files use it for book and periodical titles inside prose. */
export const Emphasis = ({ text }: { text: string }) => (
  <>
    {text.split(/(\*[^*]+\*)/).map((part, i) =>
      part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
        <i key={i}>{part.slice(1, -1)}</i>
      ) : (
        <Fragment key={i}>{part}</Fragment>
      )
    )}
  </>
);
