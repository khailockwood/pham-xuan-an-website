#!/usr/bin/env node
/*
 * Bake the real OHMS Viewer to static HTML
 * ========================================
 * The OHMS Viewer (https://github.com/uklibraries/ohms-viewer) is a PHP app:
 * `viewer.php?cachefile=<file>.xml` parses one OHMS XML export and renders the
 * full synchronized player — media, timestamped index, transcript, GPS map
 * points, hyperlinks, footnotes — as an HTML page driven by client-side jQuery.
 *
 * Our site is a static Vite/React app (no PHP at runtime). But the viewer only
 * needs PHP *once*, to turn an XML file into that HTML page; everything the user
 * then interacts with is client-side. So this script runs the genuine, current
 * viewer locally against each of our XML exports and writes the rendered pages
 * to `public/ohms-viewer/<id>.html`, alongside a copy of the viewer's own CSS/JS
 * assets. The result is the real viewer, self-contained and fully static.
 *
 * The one thing the viewer does at runtime is the keyword-search AJAX
 * (viewer.php?action=index|search). `search-shim.js` reproduces those two
 * endpoints in the browser; this script injects it into every baked page.
 *
 * Two things keep the bake honest, both below:
 *   - VIEWER_PATCHES, applied to the fresh clone before rendering, carries our
 *     fixes for upstream bugs (the clone is disposable, so they must live here).
 *   - assertBakedPage(), run on every page before it is written: it must end in
 *     </html>, clear a size floor, and render one index segment per <point> in
 *     the source XML. Any failure aborts the build.
 *
 * Run it whenever the OHMS XML in public/ohms/ changes:
 *     node scripts/ohms/build-viewer.mjs
 *
 * Requirements: PHP 8 on PATH (or Homebrew's at /opt/homebrew/opt/php/bin/php)
 * and git. The committed output in public/ohms-viewer/ is what actually ships —
 * Vercel serves it as plain static files.
 */

import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const SRC = path.join(HERE, ".viewer-src"); // cloned viewer (gitignored)
const XML_DIR = path.join(ROOT, "public", "ohms");
const OUT = path.join(ROOT, "public", "ohms-viewer");
const STAGE = `${OUT}.staging`; // built here, renamed over OUT only on full success
const CACHE = path.join(SRC, "cachefiles");

// OHMS Viewer 4.0 — the modern PHP 8 line. `viewer_4.0` is a *branch*, not a tag:
// it's the current preview the project is standardizing on, superseding v3.10.16.
// Bump deliberately when upgrading; manifest.json records exactly what was baked.
const VIEWER_REPO = "https://github.com/uklibraries/ohms-viewer.git";
const VIEWER_TAG = "viewer_4.0";

const PORT = 8199;
const ORIGIN = `http://127.0.0.1:${PORT}`;
// Optional: absolute base for shareable "Direct segment link" URLs. When unset,
// those links are rewritten to a page-relative form (still works in-page).
const PUBLIC_BASE = process.env.OHMS_PUBLIC_BASE || ""; // e.g. https://site/ohms-viewer/

// Browser-facing asset dirs in viewer_4.0. Its CSS reaches into ../imgs and
// ../fonts; lib/ and vendor/ are server-side PHP (TCPDF, Composer) and are never
// referenced by the rendered page, so they don't ship. (v3's skin/ and swf/ are
// gone in 4.0.)
const ASSET_DIRS = ["css", "js", "imgs", "fonts"];

// Sanity floor for a baked page. The two pages truncated by the upstream
// count(null) fatal were 5,804 B; the smallest healthy page (interview41609, a
// short transcript-only export) is ~76 KB and the largest ~1.7 MB. 20 KB sits
// far below every real page and far above every known failure mode.
const MIN_PAGE_BYTES = 20_000;

// PHP's built-in server logs requests and any error output to stderr. We keep it
// (rather than the previous stdio: "ignore") so a fatal has somewhere to show up.
const PHP_LOG = path.join(HERE, ".php-server.log"); // gitignored via *.log

const log = (...a) => console.log("[ohms]", ...a);
const die = (m) => {
  console.error("[ohms] ERROR:", m);
  process.exit(1);
};

function findPhp() {
  const candidates = [
    process.env.PHP_BIN,
    "/opt/homebrew/opt/php/bin/php",
    "/usr/local/opt/php/bin/php",
    "php",
  ].filter(Boolean);
  for (const c of candidates) {
    const r = spawnSync(c, ["-v"], { encoding: "utf8" });
    if (r.status === 0) return c;
  }
  return null;
}

const TAG_MARKER = path.join(SRC, ".ohms-viewer-tag");

async function ensureViewerSrc() {
  // Reuse an existing checkout only if it's the tag/branch we want; otherwise the
  // stale source (e.g. a previous v3.10.16 clone) is removed and re-cloned, so an
  // upgrade never silently bakes the wrong viewer.
  if (existsSync(path.join(SRC, "viewer.php"))) {
    const have = existsSync(TAG_MARKER)
      ? (await fs.readFile(TAG_MARKER, "utf8")).trim()
      : "";
    if (have === VIEWER_TAG) {
      log(`viewer source present (${VIEWER_TAG}) at ${SRC}`);
      return;
    }
    log(`viewer source is '${have || "unknown"}', want '${VIEWER_TAG}' — re-cloning`);
    await fs.rm(SRC, { recursive: true, force: true });
  }
  log(`cloning ${VIEWER_REPO} @ ${VIEWER_TAG} …`);
  const r = spawnSync(
    "git",
    ["clone", "--depth", "1", "--branch", VIEWER_TAG, VIEWER_REPO, SRC],
    { stdio: "inherit" },
  );
  if (r.status !== 0) die("git clone of the OHMS viewer failed");
  await fs.writeFile(TAG_MARKER, VIEWER_TAG, "utf8");
}

/*
 * Upstream bug workarounds
 * ------------------------
 * `.viewer-src/` is a throwaway clone: ensureViewerSrc() deletes and re-clones it
 * whenever the tag marker doesn't match, so a hand-edit there does not survive.
 * Every fix we need on top of the stock viewer has to live here, in the build.
 *
 * Each entry is applied after the clone and before the PHP server starts. If
 * `find` is missing AND `replace` is not already present, we abort rather than
 * bake silently — a missing anchor means upstream moved and the patch needs a
 * human to re-check whether the bug is still there.
 */
const VIEWER_PATCHES = [
  {
    file: "tmpl/player_other.tmpl.php",
    find: "<?php if (count($interview->captions) > 0): ?>",
    replace: "<?php if (count($interview->captions ?? []) > 0): ?>",
    // app/Ohms/Interview/Version3.php only assigns $interview->captions when
    // clipsource == 'aviary'; for every other source it stays null. On PHP 8
    // count(null) is a hard TypeError ("Argument #1 must be of type
    // Countable|array, null given"), not a warning, so rendering dies mid-
    // <video> and the page is written truncated — no </html>, no index, ~5.8 KB.
    // Only <fmt>video</fmt> interviews reach this template, which is why the
    // audio ones baked fine and this shipped unnoticed.
    // Upstream: uklibraries/ohms-viewer @ viewer_4.0, tmpl/player_other.tmpl.php:41.
    why: "count(null) TypeError on non-Aviary video interviews (PHP 8)",
  },
];

async function applyViewerPatches() {
  for (const patch of VIEWER_PATCHES) {
    const target = path.join(SRC, patch.file);
    if (!existsSync(target)) die(`patch target missing: ${patch.file} (upstream layout changed?)`);
    const before = await fs.readFile(target, "utf8");
    if (before.includes(patch.replace)) {
      log(`patch already applied: ${patch.file} — ${patch.why}`);
      continue;
    }
    if (!before.includes(patch.find)) {
      die(
        `patch anchor not found in ${patch.file}.\n` +
          `  expected to find: ${patch.find}\n` +
          `  reason for patch: ${patch.why}\n` +
          `  The viewer source has changed. Re-check whether the upstream bug is\n` +
          `  fixed; if so delete this entry from VIEWER_PATCHES, otherwise re-anchor it.`,
      );
    }
    await fs.writeFile(target, before.split(patch.find).join(patch.replace), "utf8");
    log(`patched ${patch.file} — ${patch.why}`);
  }
}

async function writeConfig(repositories) {
  const sections = [...repositories]
    .map(
      (name) => `
[${name}]
css = custom_default.css
footerimg =
footerimgalt =
contactemail =
contactlink =
copyrightholder = <span>Dartmouth Digital History Initiative</span>
open_graph_description = Pham Xuan An Oral History Collection
open_graph_image =
ga_tracking_id =
ga_host =
`,
    )
    .join("\n");
  const ini = `tmpDir = ${CACHE}
players = other,kaltura,youtube,soundcloud,vimeo,avalon,aviary
timezone = America/New_York
exhibit_mode = false
print_mode = false
${sections}`;
  await fs.writeFile(path.join(SRC, "config", "config.ini"), ini, "utf8");
}

/**
 * Read the facts we need out of one OHMS XML:
 *  - `repository` so the generated config.ini has a matching section, and
 *  - `points`, the number of <point> elements in the index. That is the ground
 *    truth we check each baked page against; a page that renders fewer index
 *    segments than the source has is a silently truncated page.
 * Interviews with no <index> at all (transcript-only exports) legitimately have
 * points === 0.
 */
async function inspectXml(xmlPath) {
  const xml = await fs.readFile(xmlPath, "utf8");
  const m = /<repository>([^<]*)<\/repository>/.exec(xml);
  return {
    repository: m ? m[1].trim() : "",
    points: (xml.match(/<point>/g) || []).length,
  };
}

function waitForServer(url, tries = 40) {
  return new Promise((resolve, reject) => {
    const attempt = (n) => {
      fetch(url)
        .then(() => resolve())
        .catch(() => {
          if (n <= 0) return reject(new Error("php server did not start"));
          setTimeout(() => attempt(n - 1), 150);
        });
    };
    attempt(tries);
  });
}

/** Rewrite the local PHP origin baked into the page, and inject our assets. */
function transform(html, id, file) {
  const target = `${PUBLIC_BASE}${id}.html`;
  // Direct segment links: http://127.0.0.1:PORT/viewer.php?cachefile=<file> → page
  html = html.split(`${ORIGIN}/viewer.php?cachefile=${file}`).join(target);
  // Any other absolute references to the local origin → page-relative.
  html = html.split(`${ORIGIN}/`).join(PUBLIC_BASE || "");

  const headInjection = `<link rel="stylesheet" href="ohms-embed.css">`;
  const bodyInjection = `<script src="ohms-search-shim.js"></script>`;

  // No silent fallback: if the page has no </head> or </body> the render was
  // truncated (the usual cause is a PHP fatal mid-template), and appending our
  // script tag to the wreckage would only disguise it. Fail the build instead.
  if (!html.includes("</head>"))
    throw new Error(`${id}: rendered page has no </head> — truncated or unexpected output`);
  if (!html.includes("</body>"))
    throw new Error(`${id}: rendered page has no </body> — truncated or unexpected output`);
  html = html.replace("</head>", `${headInjection}\n</head>`);
  html = html.replace("</body>", `${bodyInjection}\n</body>`);
  return html;
}

/**
 * Verify one rendered page before it is written. Every check here exists because
 * the build previously shipped two pages that were fatally truncated mid-render:
 * PHP errors were suppressed, nothing looked at the output, and the broken pages
 * sat in the repo for months. A bake that cannot be verified must fail, loudly.
 *
 * @param {{id: string, html: string, points: number}} page
 * @returns {{bytes: number, segments: number}}
 */
function assertBakedPage({ id, html, points }) {
  const bytes = Buffer.byteLength(html, "utf8");

  // 1. PHP error text leaking into the body. display_errors is off, so a fatal
  //    now truncates silently rather than printing — this is the belt-and-braces
  //    check for the day someone turns display_errors back on.
  const err = /(?:Fatal error|Parse error|Uncaught \w*Error):[^\n<]{0,200}/i.exec(html);
  if (err) throw new Error(`${id}: PHP error in rendered output — ${err[0].trim()}`);

  // 2. Structural: a complete render ends with </html>.
  if (!/<\/html>\s*$/i.test(html))
    throw new Error(`${id}: page does not end with </html> (${bytes} B) — render was truncated`);

  // 3. Size sanity.
  if (bytes < MIN_PAGE_BYTES)
    throw new Error(
      `${id}: page is only ${bytes} B, below the ${MIN_PAGE_BYTES} B floor — almost certainly truncated`,
    );

  // 4. Content: every <point> in the source XML must have become an index
  //    segment. The viewer emits each segment's anchor id more than once per
  //    page (index panel + transcript sync), so compare distinct ids.
  const segments = new Set(html.match(/id="link\d+"/g) || []).size;
  if (segments !== points)
    throw new Error(
      `${id}: ${segments} index segments rendered but the source XML has ${points} <point> elements`,
    );

  return { bytes, segments };
}

async function copyAssets(dest) {
  await fs.mkdir(dest, { recursive: true });
  for (const dir of ASSET_DIRS) {
    const from = path.join(SRC, dir);
    // `dereference: true` copies the *contents* of any symlinks (the viewer
    // ships a few, e.g. js/viewer_flowplayer.js → viewer_other.js). Without it,
    // fs.cp writes an absolute symlink into .viewer-src/, which is gitignored
    // and absent on the deploy host — a dangling link that breaks Vite's build.
    if (existsSync(from))
      await fs.cp(from, path.join(dest, dir), { recursive: true, dereference: true });
  }
  await fs.copyFile(path.join(HERE, "search-shim.js"), path.join(dest, "ohms-search-shim.js"));
  await fs.copyFile(path.join(HERE, "embed.css"), path.join(dest, "ohms-embed.css"));
}

async function main() {
  const php = findPhp();
  if (!php) die("PHP not found. Install it (`brew install php`) or set PHP_BIN.");
  log(`using php: ${php}`);

  await ensureViewerSrc();
  await applyViewerPatches();

  const xmlFiles = (await fs.readdir(XML_DIR))
    .filter((f) => /^interview\d+\.xml$/.test(f))
    .sort();
  if (xmlFiles.length === 0) die(`no interview*.xml found in ${XML_DIR}`);
  log(`found ${xmlFiles.length} interview XML exports`);

  // Stage XML into the viewer's cachefiles dir and build matching config.
  await fs.rm(CACHE, { recursive: true, force: true });
  await fs.mkdir(CACHE, { recursive: true });
  const repositories = new Set();
  const facts = new Map(); // file -> { repository, points }
  for (const f of xmlFiles) {
    await fs.copyFile(path.join(XML_DIR, f), path.join(CACHE, f));
    const info = await inspectXml(path.join(XML_DIR, f));
    facts.set(f, info);
    repositories.add(info.repository || "Dartmouth DDHI");
  }
  await writeConfig(repositories);
  log(`config repositories: ${[...repositories].join(", ")}`);

  // Start the stock viewer under PHP's built-in server.
  //   display_errors=0 keeps PHP's error text out of the rendered HTML (the
  //     bundled TCPDF emits deprecation notices on every request).
  //   log_errors=1 + piped stderr sends that same text somewhere we can read.
  // The previous settings also had error_reporting=0, which suppressed errors
  // everywhere — including the fatal that truncated two pages for months. Errors
  // are now reported to the log; only their *display* is off.
  // 24575 = E_ALL & ~E_DEPRECATED (numeric so it can't be mis-parsed via -d).
  const server = spawn(
    php,
    [
      "-d", "display_errors=0",
      "-d", "log_errors=1",
      "-d", "error_reporting=24575",
      "-S", `127.0.0.1:${PORT}`,
      "-t", SRC,
    ],
    { cwd: SRC, stdio: ["ignore", "ignore", "pipe"] },
  );
  const serverErr = [];
  server.stderr.setEncoding("utf8");
  server.stderr.on("data", (d) => serverErr.push(d));
  const stop = () => {
    try {
      server.kill();
    } catch {
      /* ignore */
    }
  };
  process.on("exit", stop);

  /** Write the captured PHP stderr to disk and return its last few lines. */
  const flushServerLog = async () => {
    const text = serverErr.join("");
    try {
      await fs.writeFile(PHP_LOG, text, "utf8");
    } catch {
      /* best effort */
    }
    return text.split("\n").filter(Boolean).slice(-40).join("\n");
  };

  try {
    await waitForServer(`${ORIGIN}/index.php`);
    log(`php server up on ${ORIGIN}`);

    /* Bake into a scratch directory and swap it over `OUT` only once all 11
       pages have passed assertBakedPage(). Writing into `OUT` directly meant a
       failure partway through left public/ohms-viewer/ half-populated — and the
       assertions added above make failing *more* likely, not less, so the old
       "rm then rebuild in place" was the wrong shape for a build that can now
       legitimately abort. Recoverable via git, but a build step should not put
       the shipped output in a state that needs recovering. */
    await fs.rm(STAGE, { recursive: true, force: true });
    await copyAssets(STAGE);
    log(`copied viewer assets → staging`);

    const manifest = [];
    for (const file of xmlFiles) {
      const id = file.replace(/\.xml$/, "");
      const { points } = facts.get(file);
      const res = await fetch(`${ORIGIN}/viewer.php?cachefile=${encodeURIComponent(file)}`);
      if (!res.ok) throw new Error(`viewer.php returned ${res.status} for ${file}`);
      const html = transform(await res.text(), id, file);
      // Verify before writing, so a bad render never reaches public/ohms-viewer/.
      const { bytes, segments } = assertBakedPage({ id, html, points });
      await fs.writeFile(path.join(STAGE, `${id}.html`), html, "utf8");
      manifest.push({ id, file, points, segments, bytes });
      log(`baked ${id}.html  (${segments}/${points} index segments, ${bytes} B)`);
    }

    await fs.writeFile(
      path.join(STAGE, "manifest.json"),
      JSON.stringify(
        { viewer: VIEWER_TAG, builtAt: new Date().toISOString(), interviews: manifest },
        null,
        2,
      ),
      "utf8",
    );
    // All pages passed. Swap staging over the live directory.
    await fs.rm(OUT, { recursive: true, force: true });
    await fs.rename(STAGE, OUT);
    log(`done — ${manifest.length} pages in public/ohms-viewer/`);
  } catch (e) {
    const tail = await flushServerLog();
    if (tail)
      console.error(
        `[ohms] --- php server stderr (last lines) ---\n${tail}\n` +
          `[ohms] --- full log: ${PHP_LOG} ---`,
      );
    throw e;
  } finally {
    await flushServerLog();
    stop();
    // Staging only survives a successful run long enough to be renamed over OUT;
    // if we got here with it still on disk the bake aborted, so don't leave it.
    await fs.rm(STAGE, { recursive: true, force: true });
  }
}

main().catch((e) => die(e.stack || e.message));
