import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ohmsIndex, ohmsSegmentTotal } from "@/content/ohms-index";
import {
  highlightsOf,
  isAdministrativeSegment,
  parseSegmentHash,
  pickHighlights,
  segmentCountOf,
  segmentHref,
  segmentsOf,
} from "./ohms-highlights";

/** The Miller interview with An — ten segments, none administrative. */
const MILLER = "/ohms/interview36980.xml";
/** Cloud — opens "Introduction", closes "Outro and Goodbyes", "Technical Difficulties" midway. */
const CLOUD = "/ohms/interview42707.xml";
/** Berman 1a — published without an index. */
const BERMAN = "/ohms/interview41608.xml";

describe("the generated index", () => {
  it("covers every export, and the totals agree", () => {
    const entries = Object.values(ohmsIndex);
    expect(entries).toHaveLength(11);
    expect(entries.reduce((n, e) => n + e.segmentCount, 0)).toBe(ohmsSegmentTotal);
    for (const e of entries) expect(e.segments).toHaveLength(e.segmentCount);
  });

  it("keeps segments in time order", () => {
    for (const e of Object.values(ohmsIndex)) {
      const times = e.segments.map((s) => s.time);
      expect(times).toEqual([...times].sort((a, b) => a - b));
    }
  });
});

describe("isAdministrativeSegment", () => {
  it("catches the mechanics of the recording", () => {
    expect(isAdministrativeSegment("Introduction")).toBe(true);
    expect(isAdministrativeSegment("Technical Difficulties")).toBe(true);
    expect(isAdministrativeSegment("Outro and Goodbyes")).toBe(true);
    expect(isAdministrativeSegment("Greetings and Light Conversations")).toBe(true);
    expect(isAdministrativeSegment("Pause in Interview, Visuals of books")).toBe(true);
    expect(isAdministrativeSegment("  ")).toBe(true);
  });

  it("leaves substantive titles that merely start the same way", () => {
    expect(isAdministrativeSegment("Introduction and Early Life")).toBe(false);
    expect(isAdministrativeSegment("The Summer of Sophomore Year and Introduction to Chinese")).toBe(
      false
    );
    expect(isAdministrativeSegment("Bến Cát Intelligence Operation")).toBe(false);
  });
});

describe("pickHighlights", () => {
  it("returns the first N topics in recording order", () => {
    const picked = pickHighlights(ohmsIndex[MILLER].segments, 3);
    expect(picked.map((s) => s.title)).toEqual([
      "The Rivalry Between Ngô Đình Nhu and Ngô Đình Cẩn",
      "Labor Unions",
      "Dr. Trần Kim Tuyến's Role in 1950s South Vietnamese Politics",
    ]);
  });

  it("skips the administrative segments rather than counting them", () => {
    const picked = pickHighlights(ohmsIndex[CLOUD].segments, 4);
    expect(picked.map((s) => s.title)).toEqual([
      "Early Life and Military Service",
      "Early Journalism and Tenure at Time San Francisco",
      "Tenure in Moscow and Transition to Bangkok / Opinions of the Vietnam War",
      "Role of Bureau Chief in Bangkok",
    ]);
  });

  it("returns nothing for an export with no index", () => {
    expect(pickHighlights(ohmsIndex[BERMAN].segments, 5)).toEqual([]);
    expect(pickHighlights([], 5)).toEqual([]);
    expect(pickHighlights(ohmsIndex[MILLER].segments, 0)).toEqual([]);
  });
});

describe("reading an interview record", () => {
  it("resolves segments through the record's ohmsXml path", () => {
    expect(segmentsOf({ ohmsXml: MILLER })).toHaveLength(10);
    expect(segmentCountOf({ ohmsXml: MILLER })).toBe(10);
    expect(highlightsOf({ ohmsXml: MILLER }, 2)).toHaveLength(2);
  });

  it("is empty for a record with no export, or one this build doesn't know", () => {
    expect(segmentsOf({})).toEqual([]);
    expect(segmentCountOf({})).toBe(0);
    expect(segmentsOf({ ohmsXml: "/ohms/interview00000.xml" })).toEqual([]);
    expect(highlightsOf({ ohmsXml: BERMAN }, 3)).toEqual([]);
  });
});

describe("segment links", () => {
  it("round-trips through the hash the baked viewer reads", () => {
    expect(segmentHref("miller-pham-xuan-an", 590)).toBe("/interviews/miller-pham-xuan-an#segment590");
    expect(parseSegmentHash("#segment590")).toBe(590);
    expect(parseSegmentHash("#segment0")).toBe(0);
  });

  it("ignores anything that isn't a segment hash", () => {
    expect(parseSegmentHash("")).toBeUndefined();
    expect(parseSegmentHash("#top")).toBeUndefined();
    expect(parseSegmentHash("#segment")).toBeUndefined();
    expect(parseSegmentHash("#segment12x")).toBeUndefined();
  });
});

/**
 * `segmentHref` promises that a `#segment<seconds>` hash lands on a real moment
 * in the baked viewer page. Nothing else checks that promise: the seek runs
 * inside an iframe, driven by scripts/ohms/segment-link-shim.js against markup
 * the OHMS Viewer generates. If a re-bake changes the viewer's index markup, or
 * the shim stops being injected, the deep links fail silently in the browser.
 * These assertions fail loudly here instead.
 */
describe("the baked viewer honours the segment hash", () => {
  const page = (id: string) =>
    readFileSync(resolve(__dirname, "../../public/ohms-viewer", `${id}.html`), "utf8");

  it("loads the shim on every baked page", () => {
    for (const entry of Object.values(ohmsIndex))
      expect(page(entry.id)).toContain('<script src="ohms-segment-link-shim.js"></script>');
  });

  it("has the elements the shim drives, for every indexed segment", () => {
    for (const entry of Object.values(ohmsIndex)) {
      const html = page(entry.id);
      for (const s of entry.segments) {
        // what the shim clicks to seek
        expect(html).toContain(`<a class="indexJumpLink" href="#" data-timestamp="${s.time}">`);
        // the accordion header it opens and scrolls to
        expect(html).toContain(`id="link${s.time}"`);
      }
    }
  });
});
