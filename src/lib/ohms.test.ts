import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { formatTimecode, parseOhmsDuration, parseOhmsXml } from "./ohms";

/**
 * Parses the real OHMS exports committed to `public/ohms/` (public Nunn Center
 * samples). They cover the three shapes that matter: a directly-hosted video
 * with a timecoded transcript, the audio equivalent, and an index-only export
 * whose media lives on a third-party host.
 */
const fixture = (name: string) =>
  readFileSync(resolve(__dirname, "../../public/ohms", name), "utf8");

describe("parseOhmsDuration", () => {
  it("reads OHMS H:MM:SS durations", () => {
    expect(parseOhmsDuration("1:06:38")).toBe(3998);
    expect(parseOhmsDuration("0:47:12")).toBe(2832);
    expect(parseOhmsDuration("0:0:0")).toBe(0);
    expect(parseOhmsDuration("")).toBe(0);
    expect(parseOhmsDuration("125")).toBe(125);
  });
});

describe("formatTimecode", () => {
  it("drops the hour when there isn't one", () => {
    expect(formatTimecode(0)).toBe("0:00");
    expect(formatTimecode(343)).toBe("5:43");
    expect(formatTimecode(3998)).toBe("1:06:38");
  });
});

describe("parseOhmsXml", () => {
  it("rejects things that are not OHMS records", () => {
    expect(() => parseOhmsXml("<html><body>nope</body></html>")).toThrow();
    expect(() => parseOhmsXml("not xml at all <<<")).toThrow();
  });

  it("reads a direct-video export with a timecoded transcript", () => {
    const r = parseOhmsXml(fixture("sample-005.xml"));

    expect(r.title).toContain("Fred");
    expect(r.date).toBe("2013-11-14"); // <date value="…"> is an attribute
    // Real exports carry whitespace artefacts ("Fred  Noe") — metadata is collapsed.
    expect(r.interviewee).toBe("Fred Noe");
    expect(r.duration).toBe(3998);

    // Direct file → real <video>, full two-way sync.
    expect(r.mediaKind).toBe("video");
    expect(r.mediaMode).toBe("file");
    expect(r.mediaUrl).toMatch(/^https:\/\/.+\.m4v$/);

    expect(r.segments).toHaveLength(14);
    // Note: the first segment does NOT necessarily start at 0 (this one is at
    // 4s), so "no segment active yet" is a legitimate state at the very start.
    expect(r.segments[0].time).toBe(4);
    // Segments must be in ascending time order for the active-segment scan.
    for (let i = 1; i < r.segments.length; i += 1) {
      expect(r.segments[i].time).toBeGreaterThanOrEqual(r.segments[i - 1].time);
    }
    expect(r.segments.some((s) => s.keywords.length > 0)).toBe(true);

    // <sync> decoding: "1:|24(6)|39(3)|…" → one block per minute, plus a
    // leading block for everything before the first marker.
    expect(r.transcript.synced).toBe(true);
    expect(r.transcript.blocks.length).toBeGreaterThan(50);
    expect(r.transcript.blocks[0].time).toBe(0);
    expect(r.transcript.blocks[1].time).toBe(60);
    expect(r.transcript.blocks[2].time).toBe(120);
    // Block times must be strictly increasing, or the highlight scan misbehaves.
    for (let i = 1; i < r.transcript.blocks.length; i += 1) {
      expect(r.transcript.blocks[i].time).toBeGreaterThan(r.transcript.blocks[i - 1].time);
    }
    // The last block should land near the stated duration (66 minutes ≈ 3998s).
    const last = r.transcript.blocks[r.transcript.blocks.length - 1];
    expect(last.time).toBeGreaterThan(r.duration - 180);
    expect(last.time).toBeLessThanOrEqual(r.duration + 60);
  });

  it("reads a direct-audio export", () => {
    const r = parseOhmsXml(fixture("sample-003.xml"));
    expect(r.mediaKind).toBe("audio");
    expect(r.mediaMode).toBe("file");
    expect(r.mediaUrl).toMatch(/\.mp3$/);
    expect(r.duration).toBe(2832);
    expect(r.segments).toHaveLength(11);
    expect(r.transcript.synced).toBe(true);
    expect(r.transcript.blocks[1].time).toBe(60);
  });

  it("handles an index-only export on a third-party host", () => {
    const r = parseOhmsXml(fixture("sample-001.xml"));
    expect(r.host).toBe("vimeo");
    expect(r.mediaMode).toBe("embed");
    expect(r.embedUrl).toMatch(/^https:\/\/player\.vimeo\.com\/video\/\d+/);
    expect(r.segments).toHaveLength(33);
    // No transcript at all — the player must fall back to index-only.
    expect(r.transcript.blocks).toHaveLength(0);
    expect(r.transcript.synced).toBe(false);
  });
});
