import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ExternalLink, Search, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Lang } from "@/contexts/LanguageContext";
import {
  formatTimecode,
  parseOhmsXml,
  seekEmbed,
  type OhmsRecord,
  type OhmsSegment,
  type OhmsTranscriptDoc,
} from "@/lib/ohms";

/**
 * OhmsNativePlayer — renders a synchronized oral-history interview directly
 * from an OHMS XML export, in the browser, with no PHP OHMS Viewer and no
 * third-party hosting.
 *
 * It is the self-hosted counterpart to `OhmsViewer` (which iframes a hosted
 * viewer). Given only an XML file it produces the same three-part experience:
 *
 *   media player  +  timestamped index  +  transcript
 *
 * ...with an Index/Transcript toggle, keyword search, click-a-segment-to-seek,
 * and — when the export carries a <sync> map and a direct media file — a
 * transcript that follows playback and scrolls itself.
 *
 * Sync fidelity depends on what the export contains, so the component degrades
 * in documented tiers:
 *   • direct media file + <sync>  → full: seek both ways, live highlight.
 *   • direct media file, no <sync> → index seeks; transcript is static text.
 *   • YouTube/Vimeo/SoundCloud    → iframe; index click seeks via postMessage
 *                                    (YouTube/Vimeo), no live highlight, since
 *                                    playback position cannot be read back.
 *   • no media                    → index + transcript only, clearly labelled.
 *
 * OHMS's own translation layer (`*_alt` fields, `transcript_alt`) is wired to
 * the site's EN/VI toggle: when the language is Vietnamese and the export has
 * alternate-language text, that text is shown instead.
 */

type OhmsNativePlayerProps = {
  /** URL of an OHMS XML export (e.g. "/ohms/sample-005.xml"). */
  src?: string;
  /** Raw OHMS XML, as an alternative to `src` (useful for tests/fixtures). */
  xml?: string;
  /** Fallback accessible name, used when the XML has no <title>. */
  title?: string;
  /** Height of the index/transcript panel. */
  panelHeightClass?: string;
};

type Tab = "index" | "transcript";

/* -------------------------------------------------------------------------- */
/* small helpers                                                               */
/* -------------------------------------------------------------------------- */

/** Prefer the OHMS `_alt` (translated) field when reading in Vietnamese. */
const pick = (primary: string, alt: string, lang: Lang) =>
  lang !== "en" && alt.trim() ? alt : primary;

const pickList = (primary: string[], alt: string[], lang: Lang) =>
  lang !== "en" && alt.length > 0 ? alt : primary;

const norm = (s: string) => s.toLowerCase();

/** Split text on a search term so matches can be marked, without regex escapes. */
const splitOnTerm = (text: string, term: string): { text: string; hit: boolean }[] => {
  if (!term) return [{ text, hit: false }];
  const out: { text: string; hit: boolean }[] = [];
  const hay = norm(text);
  const needle = norm(term);
  let at = 0;
  for (;;) {
    const i = hay.indexOf(needle, at);
    if (i === -1) break;
    if (i > at) out.push({ text: text.slice(at, i), hit: false });
    out.push({ text: text.slice(i, i + needle.length), hit: true });
    at = i + needle.length;
  }
  if (at < text.length) out.push({ text: text.slice(at), hit: false });
  return out.length > 0 ? out : [{ text, hit: false }];
};

/**
 * The outer chrome. Defined at module scope (NOT inside the player) so that
 * React keeps the same element instances across renders — a nested definition
 * would remount the <audio>/<video> on every state change and stop playback.
 */
const Frame = ({
  headerLabel,
  repository,
  children,
}: {
  headerLabel: string;
  repository?: string;
  children: ReactNode;
}) => (
  <figure className="border border-border bg-card">
    <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
      <span className="flex items-center gap-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
        <span className="mono-label text-[10.5px] text-pine">{headerLabel} · OHMS</span>
      </span>
      {repository && (
        <span className="mono-label max-w-[42ch] truncate text-[10.5px] text-ink-soft/60">
          {repository}
        </span>
      )}
    </figcaption>
    {children}
  </figure>
);

const Marked = ({ text, term }: { text: string; term: string }) => (
  <>
    {splitOnTerm(text, term).map((part, i) =>
      part.hit ? (
        <mark key={i} className="bg-gold/25 text-ink">
          {part.text}
        </mark>
      ) : (
        <span key={i}>{part.text}</span>
      ),
    )}
  </>
);

/* -------------------------------------------------------------------------- */
/* component                                                                   */
/* -------------------------------------------------------------------------- */

const OhmsNativePlayer = ({
  src,
  xml,
  title,
  panelHeightClass = "h-[clamp(360px,52vh,620px)]",
}: OhmsNativePlayerProps) => {
  const { t, lang } = useLanguage();

  const [record, setRecord] = useState<OhmsRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("index");
  const [query, setQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  /** The XML parsed fine but the recording it points at will not load. */
  const [mediaError, setMediaError] = useState(false);

  const mediaRef = useRef<HTMLMediaElement | null>(null);
  /** Callback ref so one field can hold either the <audio> or the <video>. */
  const setMediaRef = useCallback((node: HTMLMediaElement | null) => {
    mediaRef.current = node;
  }, []);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  /** Suppress auto-scroll right after a user click, so the view doesn't fight them. */
  const autoScrollPaused = useRef(0);

  /* ---- load + parse ---------------------------------------------------- */
  useEffect(() => {
    let cancelled = false;
    setRecord(null);
    setError(null);
    setMediaError(false);
    setCurrentTime(0);
    setLoading(true);

    const run = async () => {
      try {
        let raw = xml;
        if (!raw) {
          if (!src) throw new Error("no-source");
          const res = await fetch(src);
          if (!res.ok) throw new Error(`http-${res.status}`);
          raw = await res.text();
        }
        const parsed = parseOhmsXml(raw);
        if (!cancelled) {
          setRecord(parsed);
          // Index-first, like the PHP viewer — unless this export has none.
          setTab(parsed.segments.length > 0 ? "index" : "transcript");
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "unknown");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [src, xml]);

  /* ---- derived --------------------------------------------------------- */
  const transcriptDoc: OhmsTranscriptDoc | null = useMemo(() => {
    if (!record) return null;
    const alt = record.transcriptAlt;
    if (lang !== "en" && alt.blocks.length > 0) return alt;
    return record.transcript.blocks.length > 0 ? record.transcript : alt;
  }, [record, lang]);

  const canSyncLive = record?.mediaMode === "file";

  const segments = record?.segments ?? [];

  const activeSegment = useMemo(() => {
    if (!canSyncLive || segments.length === 0) return -1;
    let idx = -1;
    for (let i = 0; i < segments.length; i += 1) {
      if (segments[i].time <= currentTime + 0.25) idx = i;
      else break;
    }
    return idx;
  }, [segments, currentTime, canSyncLive]);

  const activeBlock = useMemo(() => {
    const blocks = transcriptDoc?.blocks ?? [];
    if (!canSyncLive || !transcriptDoc?.synced || blocks.length === 0) return -1;
    let idx = -1;
    for (let i = 0; i < blocks.length; i += 1) {
      if (blocks[i].time <= currentTime + 0.25) idx = i;
      else break;
    }
    return idx;
  }, [transcriptDoc, currentTime, canSyncLive]);

  const term = query.trim();

  const visibleSegments = useMemo(() => {
    if (!term) return segments.map((s, i) => ({ segment: s, index: i }));
    const q = norm(term);
    return segments
      .map((s, i) => ({ segment: s, index: i }))
      .filter(({ segment: s }) =>
        [
          pick(s.title, s.titleAlt, lang),
          pick(s.synopsis, s.synopsisAlt, lang),
          pick(s.partialTranscript, s.partialTranscriptAlt, lang),
          ...pickList(s.keywords, s.keywordsAlt, lang),
          ...pickList(s.subjects, s.subjectsAlt, lang),
        ]
          .join("   ")
          .toLowerCase()
          .includes(q),
      );
  }, [segments, term, lang]);

  const visibleBlocks = useMemo(() => {
    const blocks = transcriptDoc?.blocks ?? [];
    const all = blocks.map((b, i) => ({ block: b, index: i }));
    if (!term) return all;
    const q = norm(term);
    return all.filter(({ block }) => norm(block.text).includes(q));
  }, [transcriptDoc, term]);

  /* ---- seeking --------------------------------------------------------- */
  const seek = useCallback(
    (seconds: number) => {
      autoScrollPaused.current = Date.now() + 1200;
      const media = mediaRef.current;
      if (media) {
        media.currentTime = seconds;
        setCurrentTime(seconds);
        void media.play().catch(() => {
          /* autoplay may be blocked; the seek still happened */
        });
        return;
      }
      seekEmbed(frameRef.current, record?.host ?? "", seconds);
    },
    [record],
  );

  /* ---- follow playback ------------------------------------------------- */
  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;
    const onTime = () => setCurrentTime(media.currentTime);
    media.addEventListener("timeupdate", onTime);
    media.addEventListener("seeked", onTime);
    return () => {
      media.removeEventListener("timeupdate", onTime);
      media.removeEventListener("seeked", onTime);
    };
  }, [record]);

  /* ---- auto-scroll the active row into view ---------------------------- */
  useEffect(() => {
    if (Date.now() < autoScrollPaused.current) return;
    const panel = panelRef.current;
    if (!panel) return;
    const key = tab === "index" ? activeSegment : activeBlock;
    if (key < 0) return;
    const row = panel.querySelector<HTMLElement>(`[data-row="${key}"]`);
    if (!row) return;
    const top = row.offsetTop - panel.clientHeight / 3;
    panel.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [activeSegment, activeBlock, tab]);

  /* ---- chrome ---------------------------------------------------------- */
  const headerLabel = t({
    en: "Synchronized audio & transcript",
    vi: "Âm thanh & bản ghi đồng bộ",
  });

  /* ---- loading / error states ------------------------------------------ */
  if (loading) {
    return (
      <Frame headerLabel={headerLabel}>
        <div className="px-6 py-16 text-center">
          <p className="mono-label text-[10.5px] text-ink-soft/60">
            {t({ en: "Loading the record…", vi: "Đang tải hồ sơ…" })}
          </p>
        </div>
      </Frame>
    );
  }

  if (error || !record) {
    return (
      <Frame headerLabel={headerLabel}>
        <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
          <p className="font-display text-lg text-foreground">
            {t({
              en: "This interview record could not be loaded",
              vi: "Không thể tải hồ sơ phỏng vấn này",
            })}
          </p>
          <p className="max-w-[42ch] text-sm leading-relaxed text-ink-soft">
            {t({
              en: "The OHMS file for this interview is missing or unreadable. Please try again later, or use the audio and transcript below.",
              // TODO: verify VI
              vi: "Tệp OHMS của cuộc phỏng vấn này bị thiếu hoặc không đọc được. Vui lòng thử lại sau, hoặc dùng phần âm thanh và bản ghi bên dưới.",
            })}
          </p>
          {src && (
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="mono-label mt-1 inline-flex items-center gap-1.5 text-[10.5px] text-ink-soft transition-colors hover:text-gold"
            >
              {t({ en: "Open the source file", vi: "Mở tệp nguồn" })}
              <ExternalLink size={12} aria-hidden />
            </a>
          )}
        </div>
      </Frame>
    );
  }

  const displayTitle = record.title || title || "";
  const hasIndex = segments.length > 0;
  const hasTranscript = (transcriptDoc?.blocks.length ?? 0) > 0;

  return (
    <Frame headerLabel={headerLabel} repository={record.repository}>
      {/* ---------------- media ---------------- */}
      <div className="border-b border-border bg-paper px-5 py-5">
        {record.mediaMode === "file" && (
          record.mediaKind === "video" ? (
            <video
              ref={setMediaRef}
              src={record.mediaUrl}
              controls
              preload="metadata"
              playsInline
              onError={() => setMediaError(true)}
              className="max-h-[46vh] w-full bg-ink"
              aria-label={displayTitle}
            />
          ) : (
            <audio
              ref={setMediaRef}
              src={record.mediaUrl}
              controls
              preload="metadata"
              onError={() => setMediaError(true)}
              className="w-full"
              aria-label={displayTitle}
            />
          )
        )}

        {record.mediaMode === "file" && mediaError && (
          <p className="mt-3 text-xs leading-relaxed text-ink-soft/75">
            {t({
              en: "The recording this record points to could not be loaded — the file may have moved. The index and transcript below are unaffected.",
              // TODO: verify VI
              vi: "Không tải được bản ghi mà hồ sơ này trỏ tới — có thể tệp đã bị di chuyển. Chỉ mục và bản ghi lời bên dưới không bị ảnh hưởng.",
            })}
          </p>
        )}

        {record.mediaMode === "embed" && (
          <>
            <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
              <iframe
                ref={frameRef}
                src={record.embedUrl}
                title={displayTitle}
                className="absolute inset-0 h-full w-full border-0"
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-soft/70">
              {t({
                en: "This recording is hosted on an external player. Clicking a segment jumps the player to that moment, but the transcript cannot follow playback automatically.",
                // TODO: verify VI
                vi: "Bản ghi này được lưu trên trình phát bên ngoài. Nhấp vào một đoạn sẽ đưa trình phát đến thời điểm đó, nhưng bản ghi không thể tự động chạy theo.",
              })}
            </p>
          </>
        )}

        {record.mediaMode === "none" && (
          <p className="text-sm leading-relaxed text-ink-soft">
            {t({
              en: "No playable recording is attached to this record. The index and transcript below are still complete.",
              // TODO: verify VI
              vi: "Hồ sơ này chưa có bản ghi âm/hình để phát. Phần chỉ mục và bản ghi bên dưới vẫn đầy đủ.",
            })}
          </p>
        )}

        {/* record meta line — mono dateline idiom used across the site */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {record.interviewee && (
            <span className="mono-label text-[10.5px] text-ink-soft/60">
              {t({ en: "Interviewee", vi: "Người được phỏng vấn" })}: {record.interviewee}
            </span>
          )}
          {record.interviewer && (
            <span className="mono-label text-[10.5px] text-ink-soft/60">
              {t({ en: "Interviewer", vi: "Người phỏng vấn" })}: {record.interviewer}
            </span>
          )}
          {record.duration > 0 && (
            <span className="mono-label text-[10.5px] tabular-nums text-ink-soft/60">
              {formatTimecode(record.duration)}
            </span>
          )}
          {record.mediaUrl && (
            <a
              href={record.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mono-label inline-flex items-center gap-1.5 text-[10.5px] text-ink-soft/60 transition-colors hover:text-gold"
            >
              {t({ en: "Open media", vi: "Mở tệp phương tiện" })}
              <ExternalLink size={11} aria-hidden />
            </a>
          )}
        </div>
      </div>

      {/* ---------------- toolbar: tabs + search ---------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-2.5">
        <div className="flex items-center" role="tablist" aria-label={t({ en: "View", vi: "Chế độ xem" })}>
          {(
            [
              ["index", t({ en: "Index", vi: "Chỉ mục" }), hasIndex, segments.length],
              ["transcript", t({ en: "Transcript", vi: "Bản ghi" }), hasTranscript, 0],
            ] as [Tab, string, boolean, number][]
          ).map(([id, label, enabled, count]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              disabled={!enabled}
              onClick={() => setTab(id)}
              className={`mono-label border-b-2 px-3.5 py-1.5 text-[10.5px] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                tab === id
                  ? "border-gold text-pine"
                  : "border-transparent text-ink-soft/60 hover:text-ink"
              }`}
            >
              {label}
              {count > 0 && <span className="ml-2 tabular-nums opacity-60">{count}</span>}
            </button>
          ))}
        </div>

        <div className="relative flex min-w-[180px] flex-1 items-center justify-end sm:max-w-[280px]">
          <Search size={13} className="pointer-events-none absolute left-2.5 text-ink-soft/45" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t({ en: "Search this interview", vi: "Tìm trong phỏng vấn này" })}
            aria-label={t({ en: "Search this interview", vi: "Tìm trong phỏng vấn này" })}
            className="w-full border border-border bg-paper py-1.5 pl-8 pr-7 text-[13px] text-ink placeholder:text-ink-soft/45 focus:border-gold focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={t({ en: "Clear search", vi: "Xóa tìm kiếm" })}
              className="absolute right-2 text-ink-soft/50 transition-colors hover:text-ink"
            >
              <X size={13} aria-hidden />
            </button>
          )}
        </div>
      </div>

      {/* ---------------- panel ---------------- */}
      {/* `relative` makes this div the offsetParent, so the auto-scroll maths
          below can use each row's offsetTop directly. */}
      <div ref={panelRef} className={`relative overflow-y-auto ${panelHeightClass}`}>
        {tab === "index" && (
          <IndexPanel
            rows={visibleSegments}
            active={activeSegment}
            term={term}
            lang={lang}
            onSeek={seek}
            emptyLabel={
              hasIndex
                ? t({ en: "No segment matches that search.", vi: "Không có đoạn nào khớp với tìm kiếm." })
                : t({
                    en: "This record has no index segments.",
                    // TODO: verify VI
                    vi: "Hồ sơ này không có đoạn chỉ mục nào.",
                  })
            }
          />
        )}

        {tab === "transcript" && (
          <TranscriptPanel
            rows={visibleBlocks}
            active={activeBlock}
            synced={Boolean(transcriptDoc?.synced)}
            term={term}
            onSeek={seek}
            seekable={Boolean(transcriptDoc?.synced)}
            emptyLabel={
              hasTranscript
                ? t({ en: "No passage matches that search.", vi: "Không có đoạn văn nào khớp với tìm kiếm." })
                : t({
                    en: "This record has no transcript.",
                    // TODO: verify VI
                    vi: "Hồ sơ này không có bản ghi lời.",
                  })
            }
            unsyncedNote={t({
              en: "This transcript has no timecodes, so it cannot follow playback. Use the Index to move through the recording.",
              // TODO: verify VI
              vi: "Bản ghi này không có mốc thời gian nên không thể chạy theo âm thanh. Hãy dùng Chỉ mục để di chuyển trong bản ghi âm.",
            })}
          />
        )}
      </div>
    </Frame>
  );
};

/* -------------------------------------------------------------------------- */
/* panels                                                                      */
/* -------------------------------------------------------------------------- */

const IndexPanel = ({
  rows,
  active,
  term,
  lang,
  onSeek,
  emptyLabel,
}: {
  rows: { segment: OhmsSegment; index: number }[];
  active: number;
  term: string;
  lang: Lang;
  onSeek: (s: number) => void;
  emptyLabel: string;
}) => {
  if (rows.length === 0) {
    return <p className="px-5 py-10 text-center text-sm text-ink-soft/70">{emptyLabel}</p>;
  }

  return (
    <ul>
      {rows.map(({ segment: s, index }) => {
        const isActive = index === active;
        const keywords = pickList(s.keywords, s.keywordsAlt, lang);
        return (
          <li key={index} data-row={index}>
            <button
              type="button"
              onClick={() => onSeek(s.time)}
              aria-current={isActive || undefined}
              className={`grid w-full grid-cols-[62px_1fr] gap-4 border-b border-l-2 border-border px-5 py-4 text-left transition-colors ${
                isActive ? "border-l-gold bg-paper-2" : "border-l-transparent hover:bg-paper-2/50"
              }`}
            >
              <span
                className={`mono-label pt-1 text-[10.5px] tabular-nums ${
                  isActive ? "text-gold" : "text-pine"
                }`}
              >
                {formatTimecode(s.time)}
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[17px] leading-snug text-ink">
                  <Marked text={pick(s.title, s.titleAlt, lang)} term={term} />
                </span>
                {pick(s.synopsis, s.synopsisAlt, lang) && (
                  <span className="mt-1.5 block max-w-[62ch] text-[13.5px] leading-relaxed text-ink-soft">
                    <Marked text={pick(s.synopsis, s.synopsisAlt, lang)} term={term} />
                  </span>
                )}
                {keywords.length > 0 && (
                  <span className="mono-label mt-2 block text-[9.5px] leading-relaxed text-ink-soft/50">
                    <Marked text={keywords.join(" · ")} term={term} />
                  </span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

const TranscriptPanel = ({
  rows,
  active,
  synced,
  seekable,
  term,
  onSeek,
  emptyLabel,
  unsyncedNote,
}: {
  rows: { block: { time: number; text: string }; index: number }[];
  active: number;
  synced: boolean;
  seekable: boolean;
  term: string;
  onSeek: (s: number) => void;
  emptyLabel: string;
  unsyncedNote: string;
}) => {
  if (rows.length === 0) {
    return <p className="px-5 py-10 text-center text-sm text-ink-soft/70">{emptyLabel}</p>;
  }

  return (
    <div>
      {!synced && (
        <p className="border-b border-border bg-paper-2 px-5 py-3 text-xs leading-relaxed text-ink-soft/75">
          {unsyncedNote}
        </p>
      )}
      {rows.map(({ block, index }) => {
        const isActive = index === active;
        const body = (
          <>
            {synced && (
              <span
                className={`mono-label pt-1 text-[10.5px] tabular-nums ${
                  isActive ? "text-gold" : "text-pine"
                }`}
              >
                {formatTimecode(block.time)}
              </span>
            )}
            <span className="max-w-[62ch] whitespace-pre-wrap text-[14.5px] leading-relaxed text-ink-soft">
              <Marked text={block.text} term={term} />
            </span>
          </>
        );

        const cls = `grid w-full ${
          synced ? "grid-cols-[62px_1fr]" : "grid-cols-1"
        } gap-4 border-b border-l-2 border-border px-5 py-4 text-left transition-colors ${
          isActive ? "border-l-gold bg-paper-2" : "border-l-transparent"
        }`;

        return seekable ? (
          <button
            key={index}
            type="button"
            data-row={index}
            onClick={() => onSeek(block.time)}
            aria-current={isActive || undefined}
            className={`${cls} hover:bg-paper-2/50`}
          >
            {body}
          </button>
        ) : (
          <div key={index} data-row={index} className={cls}>
            {body}
          </div>
        );
      })}
    </div>
  );
};

export default OhmsNativePlayer;
