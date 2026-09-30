/**
 * build-index.mjs — bake the OHMS index into a typed module.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 * ---------------------------------------------------------------------------
 * The OHMS exports in `public/ohms/` carry, per interview, a list of <point>
 * elements: the indexed segments a researcher navigates by. That index is the
 * most substantive thing the collection can say about itself, and pages outside
 * the OHMS viewer want it — the homepage lists a few segments per recording and
 * deep-links into the baked viewer at the right second.
 *
 * Those pages must not fetch and parse XML at render time. `src/lib/ohms.ts`
 * parses OHMS in the browser with DOMParser, which is right for the interview
 * page (one file, already the point of the page) and wrong for a homepage that
 * would pull eleven XML files over the network to draw a list.
 *
 * So the index is extracted here, at build time, into `src/content/ohms-index.ts`
 * — generated and committed, the same arrangement as the baked viewer pages.
 * Re-run `npm run ohms:index` whenever the XML changes. `npm run ohms:build`
 * runs it too, so a re-bake never leaves the two out of step.
 *
 * ---------------------------------------------------------------------------
 * PARSING
 * ---------------------------------------------------------------------------
 * Regex over the raw XML, matching build-viewer.mjs, which counts <point>
 * elements the same way. Node has no built-in DOM parser and this file reads
 * three fixed fields out of a flat, machine-generated element — a dependency
 * would buy nothing. The schema gotchas that bite elsewhere (the <date>
 * attribute, the <sync> line map) are not in this file's path; the one that is:
 * <time> is INTEGER SECONDS and the first segment is not necessarily 0.
 */
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const XML_DIR = path.join(ROOT, "public", "ohms");
const OUT = path.join(ROOT, "src", "content", "ohms-index.ts");

/** Only the project's own exports. `sample-*.xml` are upstream test fixtures. */
const XML_NAME = /^interview\d+\.xml$/;

const log = (m) => process.stdout.write(`[ohms:index] ${m}\n`);
const die = (m) => {
  process.stderr.write(`[ohms:index] ${m}\n`);
  process.exit(1);
};

/** The five named entities XML predefines, plus numeric character references. */
function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

/** Text of the first <tag> inside `block`, decoded and whitespace-collapsed. */
function field(block, tag) {
  const m = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`).exec(block);
  if (!m) return "";
  return decodeEntities(m[1]).replace(/\s+/g, " ").trim();
}

function parseSegments(xml, id) {
  const blocks = xml.match(/<point>[\s\S]*?<\/point>/g) || [];
  return blocks.map((block, i) => {
    const raw = field(block, "time");
    if (!/^\d+$/.test(raw))
      die(`${id}: <point> ${i + 1} has a non-integer <time> (${JSON.stringify(raw)})`);
    return {
      time: Number(raw),
      title: field(block, "title"),
      // OHMS's built-in translation layer. Empty in every current PXA export,
      // so segment titles render in English; when the exports carry Vietnamese
      // here, consumers pick it up with no further change.
      titleAlt: field(block, "title_alt"),
    };
  });
}

const ts = (v) => JSON.stringify(v);

async function main() {
  if (!existsSync(XML_DIR)) die(`no XML directory at ${XML_DIR}`);

  const files = (await fs.readdir(XML_DIR)).filter((f) => XML_NAME.test(f)).sort();
  if (files.length === 0) die(`no interview*.xml found in ${XML_DIR}`);

  const entries = [];
  let total = 0;

  for (const file of files) {
    const id = file.replace(/\.xml$/, "");
    const xml = await fs.readFile(path.join(XML_DIR, file), "utf8");
    const segments = parseSegments(xml, id);

    // Segments must be in time order for "the first N" to mean anything, and
    // the viewer's own index panel assumes it. The exports are ordered; this
    // fails loudly rather than quietly reordering, because an out-of-order
    // export is a sign something upstream is wrong.
    for (let i = 1; i < segments.length; i++)
      if (segments[i].time < segments[i - 1].time)
        die(`${id}: index segments are not in time order at segment ${i + 1}`);

    const untitled = segments.filter((s) => !s.title).length;
    if (untitled) log(`warning: ${id} has ${untitled} segment(s) with an empty <title>`);

    total += segments.length;
    entries.push({ key: `/ohms/${file}`, id, segments });
    log(`${id}: ${segments.length} segment${segments.length === 1 ? "" : "s"}`);
  }

  const body = entries
    .map(
      (e) => `  ${ts(e.key)}: {
    id: ${ts(e.id)},
    segmentCount: ${e.segments.length},
    segments: [
${e.segments
  .map((s) => `      { time: ${s.time}, title: ${ts(s.title)}, titleAlt: ${ts(s.titleAlt)} },`)
  .join("\n")}
    ],
  },`
    )
    .join("\n");

  const out = `/* GENERATED by scripts/ohms/build-index.mjs — do not edit by hand.
 * Re-run \`npm run ohms:index\` after changing anything in public/ohms/.
 *
 * The indexed segments of every OHMS export, keyed by the \`ohmsXml\` path as it
 * appears on each record in \`interviews.ts\`. \`time\` is integer seconds from the
 * start of the recording.
 *
 * Two exports (Berman 1a/1b) publish no index yet and carry an empty list —
 * consumers must handle a recording with no segments.
 *
 * Read this through \`src/lib/ohms-highlights.ts\` rather than directly: segment
 * titles include administrative markers ("Introduction", "Technical
 * Difficulties") that should not be presented as topics.
 */

export type OhmsIndexSegment = {
  /** Segment start, in integer seconds. Not necessarily 0 for the first one. */
  time: number;
  title: string;
  /** OHMS's translated title. Empty in every current export. */
  titleAlt: string;
};

export type OhmsIndexEntry = {
  /** The export's OHMS record id, e.g. "interview36980". */
  id: string;
  segmentCount: number;
  segments: OhmsIndexSegment[];
};

export const ohmsIndex: Record<string, OhmsIndexEntry> = {
${body}
};

/** Indexed segments across the whole collection. */
export const ohmsSegmentTotal = ${total};
`;

  await fs.writeFile(OUT, out, "utf8");
  log(`wrote ${path.relative(ROOT, OUT)} — ${entries.length} exports, ${total} segments`);
}

main().catch((e) => die(e?.stack || String(e)));
