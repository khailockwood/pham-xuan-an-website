/**
 * OHMS XML parser — client-side, zero dependencies (uses the browser's DOMParser).
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 * ---------------------------------------------------------------------------
 * OHMS (Oral History Metadata Synchronizer) exports one XML file per interview.
 * Historically that XML is only useful when fed to the PHP "OHMS Viewer", which
 * renders the synchronized player. This module + `OhmsNativePlayer` reimplement
 * the viewer's read path in the browser, so **an OHMS XML file alone is enough**
 * to display a synchronized interview on a static site — no PHP, no extra host.
 *
 * ---------------------------------------------------------------------------
 * THE SCHEMA (namespace https://www.avpreserve.com/nunncenter/ohms)
 * ---------------------------------------------------------------------------
 * <ROOT><record id dt>
 *   <version>                 OHMS export version (5 in current exports)
 *   <date value="YYYY-MM-DD" format="yyyy-mm-dd"/>   NB: value is an ATTRIBUTE
 *   <title> <accession> <duration>   duration is "H:MM:SS" (sometimes "0:0:0")
 *   <collection_name> <series_name> <repository> <repository_url> <funding>
 *   <interviewee> <interviewer> <description> <type> <language>
 *   <media_url>       direct URL to the media file, OR the page URL for a host
 *   <mediafile>       <host> <host_account_id> <host_player_id> <host_clip_id>
 *                     <clip_format>audio|video</clip_format>
 *   <fmt>             audio | video
 *   <kembed>          HTML-escaped <iframe> markup when host is YouTube/Vimeo/…
 *   <sync> <sync_alt> the transcript timecode map (see decodeSync below)
 *   <transcript> <transcript_alt> <transcript_alt_lang> <translate>
 *   <index>
 *     <point>*        one per index segment, in time order
 *       <time>        START OF SEGMENT, IN SECONDS (integer)
 *       <title> <partial_transcript> <synopsis>
 *       <keywords> <subjects>            ';'-separated lists
 *       <gps> <gps_zoom> <gps_text> <hyperlink> <hyperlink_text>
 *       …and an `_alt` twin of every text field, for the translated index
 *   <rights> <usage> <userestrict> <xmlfilename> <collection_link> <series_link>
 * </record></ROOT>
 *
 * The `_alt` fields + `transcript_alt` are OHMS's built-in translation layer,
 * which maps exactly onto this site's EN/VI split: if the PXA exports carry
 * Vietnamese in the `_alt` fields, the player shows them automatically when the
 * site language is VI.
 *
 * ---------------------------------------------------------------------------
 * THE <sync> STRING — the only non-obvious part of the format
 * ---------------------------------------------------------------------------
 *   "1:|26(1)|34(1)|53(2)|64(6)|…"
 *    ^  ^^^^^
 *    |  each entry is  line(word)  — 1-BASED line number in <transcript>,
 *    |                              and the word offset within that line
 *    interval, IN MINUTES, between entries
 *
 * So with interval 1: entry #1 is where minute 1:00 falls, entry #2 minute 2:00,
 * and so on. The transcript is plain text split on newlines; the viewer walks
 * these markers to know which block of lines is "current". We do the same, and
 * highlight/scroll at block granularity (one block ≈ one interval ≈ 1 minute).
 * The word offset is parsed and kept but not used for highlighting — sub-line
 * word highlighting is unreliable across exports.
 *
 * Verified against the public Nunn Center / KSU samples in `public/ohms/`.
 */

export type OhmsMediaKind = "audio" | "video";

/** How the media can be played back, which determines how much sync we get. */
export type OhmsMediaMode =
  /** Direct file URL → real <audio>/<video>, full two-way sync. */
  | "file"
  /** Third-party player (YouTube/Vimeo/…) → iframe; seek-only, no highlight. */
  | "embed"
  /** No usable media reference in the XML at all. */
  | "none";

export type OhmsSegment = {
  /** Segment start, in seconds. */
  time: number;
  title: string;
  titleAlt: string;
  synopsis: string;
  synopsisAlt: string;
  partialTranscript: string;
  partialTranscriptAlt: string;
  keywords: string[];
  keywordsAlt: string[];
  subjects: string[];
  subjectsAlt: string[];
  hyperlink: string;
  hyperlinkText: string;
};

/** One block of transcript lines that shares a start time (see decodeSync). */
export type OhmsTranscriptBlock = {
  /** Block start, in seconds. */
  time: number;
  /** 0-based index of the first transcript line in this block. */
  firstLine: number;
  /** The raw lines, joined for display. */
  text: string;
};

export type OhmsTranscriptDoc = {
  /** Time-aligned blocks. Always at least one block when text exists. */
  blocks: OhmsTranscriptBlock[];
  /** True when a usable <sync> map was present (i.e. blocks carry real times). */
  synced: boolean;
};

export type OhmsRecord = {
  title: string;
  /** ISO date from <date value="…">, or "". */
  date: string;
  interviewee: string;
  interviewer: string;
  description: string;
  repository: string;
  repositoryUrl: string;
  collectionName: string;
  seriesName: string;
  accession: string;
  /** Total length in seconds; 0 when the export omits it (some do). */
  duration: number;
  mediaUrl: string;
  mediaKind: OhmsMediaKind;
  mediaMode: OhmsMediaMode;
  /** For mediaMode "embed": the third-party player URL to put in an iframe. */
  embedUrl: string;
  /** Normalised host name from <mediafile><host>, lowercased ("youtube", …). */
  host: string;
  segments: OhmsSegment[];
  transcript: OhmsTranscriptDoc;
  transcriptAlt: OhmsTranscriptDoc;
  /** Language label for the alternate transcript, e.g. "Vietnamese". */
  transcriptAltLang: string;
  rights: string;
  usage: string;
};

export class OhmsParseError extends Error {}

/* -------------------------------------------------------------------------- */
/* helpers                                                                     */
/* -------------------------------------------------------------------------- */

/** Namespace-agnostic first-child-by-tag lookup (exports vary on prefixes). */
const el = (scope: Element | Document | null, tag: string): Element | null => {
  if (!scope) return null;
  // getElementsByTagName is namespace-agnostic in the HTML/XML DOM, unlike
  // querySelector, which would need the OHMS namespace declared.
  const found = scope.getElementsByTagName(tag);
  return found.length > 0 ? found[0] : null;
};

const text = (scope: Element | Document | null, tag: string): string =>
  (el(scope, tag)?.textContent ?? "").trim();

/**
 * Collapse runs of whitespace. Applied only to short metadata fields — real
 * exports contain artefacts like "Fred  Noe". Never applied to the transcript,
 * where newlines are load-bearing (see decodeSync).
 */
const collapse = (s: string) => s.replace(/\s+/g, " ").trim();

const list = (scope: Element | Document | null, tag: string): string[] =>
  text(scope, tag)
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

/**
 * OHMS writes durations as "H:MM:SS" (and sometimes the useless "0:0:0").
 * A few exports write plain seconds. Returns 0 when nothing usable is present.
 */
export const parseOhmsDuration = (raw: string): number => {
  const v = raw.trim();
  if (!v) return 0;
  if (/^\d+$/.test(v)) return Number(v);
  const parts = v.split(":").map((p) => Number(p.trim()));
  if (parts.some((n) => !Number.isFinite(n))) return 0;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
};

/** Seconds → "M:SS" or "H:MM:SS". Used for every timecode in the UI. */
export const formatTimecode = (seconds: number): string => {
  const s = Math.max(0, Math.floor(seconds || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
};

/**
 * Decode an OHMS <sync> string into transcript blocks.
 * See the <sync> notes at the top of this file for the format.
 *
 * Falls back to a single untimed block when the sync string is absent or
 * malformed — the transcript still displays, it just cannot follow playback.
 */
const decodeSync = (syncRaw: string, transcriptRaw: string): OhmsTranscriptDoc => {
  // Normalise line endings and strip a leading BOM — real exports have both.
  const body = transcriptRaw.replace(/\r\n?/g, "\n").replace(/^\uFEFF/, "");
  if (!body.trim()) return { blocks: [], synced: false };

  const lines = body.split("\n");
  const unsynced: OhmsTranscriptDoc = {
    blocks: [{ time: 0, firstLine: 0, text: body.trim() }],
    synced: false,
  };

  const sync = syncRaw.trim();
  const head = sync.match(/^(\d+):/);
  if (!head) return unsynced;

  const intervalSeconds = Number(head[1]) * 60;
  if (!intervalSeconds) return unsynced;

  // Entries look like "26(1)". Index i (0-based) marks minute (i+1)*interval.
  const marks: { line: number; time: number }[] = [];
  const entries = sync.slice(head[0].length).split("|");
  let n = 0;
  for (const entry of entries) {
    const m = entry.trim().match(/^(\d+)\((\d+)\)$/);
    if (!m) continue;
    n += 1;
    const lineIndex = Number(m[1]) - 1; // <sync> line numbers are 1-based
    if (lineIndex < 0 || lineIndex >= lines.length) continue;
    marks.push({ line: lineIndex, time: n * intervalSeconds });
  }
  if (marks.length === 0) return unsynced;

  const blocks: OhmsTranscriptBlock[] = [];
  const push = (time: number, from: number, to: number) => {
    const chunk = lines.slice(from, to).join("\n").trim();
    if (chunk) blocks.push({ time, firstLine: from, text: chunk });
  };

  // Everything before the first mark belongs to time 0.
  push(0, 0, marks[0].line);
  for (let i = 0; i < marks.length; i += 1) {
    const to = i + 1 < marks.length ? marks[i + 1].line : lines.length;
    push(marks[i].time, marks[i].line, to);
  }

  return blocks.length > 0 ? { blocks, synced: true } : unsynced;
};

/** Pull the `src` out of the HTML-escaped <kembed> iframe markup. */
const embedSrcFromKembed = (kembed: string): string => {
  if (!kembed.trim()) return "";
  try {
    const doc = new DOMParser().parseFromString(kembed, "text/html");
    const src = doc.getElementsByTagName("iframe")[0]?.getAttribute("src") ?? "";
    return src.startsWith("//") ? `https:${src}` : src;
  } catch {
    return "";
  }
};

/** Derive a player URL for the well-known hosts when <kembed> is empty. */
const embedSrcFromMediaUrl = (host: string, mediaUrl: string): string => {
  if (!mediaUrl) return "";
  if (host === "youtube") {
    const id =
      mediaUrl.match(/[?&]v=([\w-]{6,})/)?.[1] ??
      mediaUrl.match(/youtu\.be\/([\w-]{6,})/)?.[1] ??
      mediaUrl.match(/embed\/([\w-]{6,})/)?.[1];
    // enablejsapi lets us seek via postMessage without loading Google's script.
    return id ? `https://www.youtube.com/embed/${id}?enablejsapi=1&rel=0` : "";
  }
  if (host === "vimeo") {
    const id = mediaUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : "";
  }
  if (host === "soundcloud") {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(mediaUrl)}`;
  }
  return "";
};

const DIRECT_MEDIA = /\.(mp3|m4a|wav|ogg|oga|aac|flac|mp4|m4v|webm|ogv|mov)(\?.*)?$/i;

/* -------------------------------------------------------------------------- */
/* the parser                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Parse an OHMS XML export into a plain object.
 * Throws `OhmsParseError` when the document is not XML or is not an OHMS record.
 */
export const parseOhmsXml = (xml: string): OhmsRecord => {
  const doc = new DOMParser().parseFromString(xml, "application/xml");

  // DOMParser reports XML syntax errors as a <parsererror> element rather than
  // throwing, so it has to be checked explicitly.
  if (doc.getElementsByTagName("parsererror").length > 0) {
    throw new OhmsParseError("The file is not valid XML.");
  }

  const record = el(doc, "record");
  if (!record) {
    throw new OhmsParseError("No <record> element — this is not an OHMS export.");
  }

  const host = text(record, "host").toLowerCase().trim();
  const mediaUrl = text(record, "media_url");
  const clipFormat = text(record, "clip_format").toLowerCase();
  const fmt = text(record, "fmt").toLowerCase();
  const mediaKind: OhmsMediaKind =
    clipFormat === "video" || fmt === "video" || /\.(mp4|m4v|webm|ogv|mov)(\?|$)/i.test(mediaUrl)
      ? "video"
      : "audio";

  const isDirect = Boolean(mediaUrl) && (host === "" || host === "other") && DIRECT_MEDIA.test(mediaUrl);
  const embedUrl = isDirect
    ? ""
    : embedSrcFromKembed(text(record, "kembed")) || embedSrcFromMediaUrl(host, mediaUrl);

  const mediaMode: OhmsMediaMode = isDirect ? "file" : embedUrl ? "embed" : "none";

  const index = el(record, "index");
  const points = index ? Array.from(index.getElementsByTagName("point")) : [];
  const segments: OhmsSegment[] = points
    .map((p) => ({
      time: Number(text(p, "time")) || 0,
      title: text(p, "title"),
      titleAlt: text(p, "title_alt"),
      synopsis: text(p, "synopsis"),
      synopsisAlt: text(p, "synopsis_alt"),
      partialTranscript: text(p, "partial_transcript"),
      partialTranscriptAlt: text(p, "partial_transcript_alt"),
      keywords: list(p, "keywords"),
      keywordsAlt: list(p, "keywords_alt"),
      subjects: list(p, "subjects"),
      subjectsAlt: list(p, "subjects_alt"),
      hyperlink: text(p, "hyperlink"),
      hyperlinkText: text(p, "hyperlink_text"),
    }))
    .sort((a, b) => a.time - b.time);

  return {
    title: collapse(text(record, "title")),
    date: el(record, "date")?.getAttribute("value")?.trim() ?? "",
    interviewee: collapse(text(record, "interviewee")),
    interviewer: collapse(text(record, "interviewer")),
    description: text(record, "description"),
    repository: text(record, "repository"),
    repositoryUrl: text(record, "repository_url"),
    collectionName: text(record, "collection_name"),
    seriesName: text(record, "series_name"),
    accession: text(record, "accession"),
    duration: parseOhmsDuration(text(record, "duration")),
    mediaUrl,
    mediaKind,
    mediaMode,
    embedUrl,
    host,
    segments,
    transcript: decodeSync(text(record, "sync"), text(record, "transcript")),
    transcriptAlt: decodeSync(text(record, "sync_alt"), text(record, "transcript_alt")),
    transcriptAltLang: text(record, "transcript_alt_lang"),
    rights: text(record, "rights"),
    usage: text(record, "usage"),
  };
};

/**
 * Seek a third-party embed. Both YouTube and Vimeo accept a postMessage
 * command, so segment-clicking still works for hosted media even though we
 * cannot read playback position back out of the frame.
 */
export const seekEmbed = (frame: HTMLIFrameElement | null, host: string, seconds: number) => {
  const win = frame?.contentWindow;
  if (!win) return;
  if (host === "youtube") {
    win.postMessage(
      JSON.stringify({ event: "command", func: "seekTo", args: [seconds, true] }),
      "https://www.youtube.com",
    );
  } else if (host === "vimeo") {
    win.postMessage(
      JSON.stringify({ method: "setCurrentTime", value: seconds }),
      "https://player.vimeo.com",
    );
  }
};
