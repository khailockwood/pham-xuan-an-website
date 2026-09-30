/**
 * Reading the OHMS index outside the OHMS viewer.
 *
 * `src/content/ohms-index.ts` is generated from the exports and holds every
 * indexed segment verbatim. Pages that show a handful of segments as "what this
 * recording covers" need two things that generated data can't decide for them:
 *
 *   1. Which segments are topics. An OHMS index is a navigation aid for the
 *      whole recording, so it timestamps the administrative moments too —
 *      "Introduction", "Technical Difficulties", "Outro and Goodbyes". Those are
 *      honest index entries and wrong as a description of the interview.
 *   2. Where a segment links to. The baked viewer pages take a `#segment<sec>`
 *      hash (see scripts/ohms/segment-link-shim.js), and the site reaches them
 *      through the interview route rather than the viewer path.
 *
 * Segment titles are English-only: `title_alt`, OHMS's translation field, is
 * empty in every current export. Render them with `lang="en"` and keep the
 * surrounding labels bilingual — a machine-translated archival index term would
 * be worse than an untranslated one.
 */
import { ohmsIndex, type OhmsIndexSegment } from "@/content/ohms-index";
import type { Interview } from "@/content/interviews";
import { formatTimecode } from "@/lib/ohms";

export type { OhmsIndexSegment };
export { formatTimecode };

/**
 * Segment titles that mark the mechanics of the recording rather than its
 * subject. Each pattern is written against titles actually present in the
 * current exports, listed alongside it; they are deliberately narrow, because
 * over-filtering silently drops real content. "Introduction and Early Life" and
 * "Start of discussion, literature and general reflections on the war" are
 * substantive and must survive.
 */
const ADMINISTRATIVE = [
  /^introduction$/, // Morrow 1, Cloud
  /^greetings\b/, // "Greetings and Light Conversations" — McMorris 1
  /^technical difficulties$/, // Cloud
  /^pause in interview\b/, // "Pause in Interview, Visuals of books" — McMorris 2
  /^outro\b/, // "Outro and Goodbyes" — Cloud
  /^break$/,
];

const normalize = (title: string) => title.toLowerCase().replace(/\s+/g, " ").trim();

/** True when a segment title describes the recording's mechanics, not its subject. */
export const isAdministrativeSegment = (title: string) => {
  const t = normalize(title);
  return t.length === 0 || ADMINISTRATIVE.some((re) => re.test(t));
};

/**
 * The first `count` segments worth presenting as topics, in recording order.
 *
 * Takes segments rather than an interview so callers can aggregate first — the
 * project page pools every recording by one interviewee and picks across the
 * lot. Returns fewer than `count`, or nothing at all, when the index is short
 * or absent; callers must handle an empty result (Berman 1a/1b publish no
 * index).
 */
export const pickHighlights = (
  segments: readonly OhmsIndexSegment[],
  count: number
): OhmsIndexSegment[] =>
  segments.filter((s) => !isAdministrativeSegment(s.title)).slice(0, Math.max(0, count));

/** Every indexed segment of one interview, or an empty list when it has no index. */
export const segmentsOf = (iv: Pick<Interview, "ohmsXml">): OhmsIndexSegment[] =>
  (iv.ohmsXml && ohmsIndex[iv.ohmsXml]?.segments) || [];

/** How many segments the interview's OHMS export publishes, administrative ones included. */
export const segmentCountOf = (iv: Pick<Interview, "ohmsXml">): number =>
  (iv.ohmsXml && ohmsIndex[iv.ohmsXml]?.segmentCount) || 0;

/** Shorthand for the common case: this interview's first `count` topics. */
export const highlightsOf = (iv: Pick<Interview, "ohmsXml">, count: number) =>
  pickHighlights(segmentsOf(iv), count);

/**
 * Link to one segment: the interview page, with the hash the baked viewer's
 * segment-link shim reads to seek. Matches the "Direct segment link" the OHMS
 * viewer generates for itself, so the two stay interchangeable.
 */
export const segmentHref = (slug: string, time: number) =>
  `/interviews/${slug}#segment${time}`;

/** The seconds in a `#segment<sec>` hash, or undefined when it isn't one. */
export const parseSegmentHash = (hash: string): number | undefined => {
  const m = /^#segment(\d+)$/.exec(hash);
  return m ? Number(m[1]) : undefined;
};
