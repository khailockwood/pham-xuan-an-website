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
const CACHE = path.join(SRC, "cachefiles");

// Pin the viewer version so rebuilds are reproducible. v3.10.16 = latest as of
// this writing (Dec 2025). Bump deliberately when upgrading the viewer.
const VIEWER_REPO = "https://github.com/uklibraries/ohms-viewer.git";
const VIEWER_TAG = "v3.10.16";

const PORT = 8199;
const ORIGIN = `http://127.0.0.1:${PORT}`;
// Optional: absolute base for shareable "Direct segment link" URLs. When unset,
// those links are rewritten to a page-relative form (still works in-page).
const PUBLIC_BASE = process.env.OHMS_PUBLIC_BASE || ""; // e.g. https://site/ohms-viewer/

const ASSET_DIRS = ["css", "js", "imgs", "fonts", "skin", "swf"];

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

async function ensureViewerSrc() {
  if (existsSync(path.join(SRC, "viewer.php"))) {
    log(`viewer source present (${SRC})`);
    return;
  }
  log(`cloning ${VIEWER_REPO} @ ${VIEWER_TAG} …`);
  const r = spawnSync(
    "git",
    ["clone", "--depth", "1", "--branch", VIEWER_TAG, VIEWER_REPO, SRC],
    { stdio: "inherit" },
  );
  if (r.status !== 0) die("git clone of the OHMS viewer failed");
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
players = other,brightcove,kaltura,youtube,soundcloud,vimeo,avalon,aviary
timezone = America/New_York
exhibit_mode = false
print_mode = false
${sections}`;
  await fs.writeFile(path.join(SRC, "config", "config.ini"), ini, "utf8");
}

/** Read the <repository> value from an OHMS XML so config sections match it. */
async function repositoryOf(xmlPath) {
  const xml = await fs.readFile(xmlPath, "utf8");
  const m = /<repository>([^<]*)<\/repository>/.exec(xml);
  return m ? m[1].trim() : "";
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

  if (html.includes("</head>")) html = html.replace("</head>", `${headInjection}\n</head>`);
  if (html.includes("</body>")) html = html.replace("</body>", `${bodyInjection}\n</body>`);
  else html += bodyInjection;
  return html;
}

async function copyAssets() {
  await fs.mkdir(OUT, { recursive: true });
  for (const dir of ASSET_DIRS) {
    const from = path.join(SRC, dir);
    // `dereference: true` copies the *contents* of any symlinks (the viewer
    // ships a few, e.g. js/viewer_flowplayer.js → viewer_other.js). Without it,
    // fs.cp writes an absolute symlink into .viewer-src/, which is gitignored
    // and absent on the deploy host — a dangling link that breaks Vite's build.
    if (existsSync(from))
      await fs.cp(from, path.join(OUT, dir), { recursive: true, dereference: true });
  }
  await fs.copyFile(path.join(HERE, "search-shim.js"), path.join(OUT, "ohms-search-shim.js"));
  await fs.copyFile(path.join(HERE, "embed.css"), path.join(OUT, "ohms-embed.css"));
}

async function main() {
  const php = findPhp();
  if (!php) die("PHP not found. Install it (`brew install php`) or set PHP_BIN.");
  log(`using php: ${php}`);

  await ensureViewerSrc();

  const xmlFiles = (await fs.readdir(XML_DIR))
    .filter((f) => /^interview\d+\.xml$/.test(f))
    .sort();
  if (xmlFiles.length === 0) die(`no interview*.xml found in ${XML_DIR}`);
  log(`found ${xmlFiles.length} interview XML exports`);

  // Stage XML into the viewer's cachefiles dir and build matching config.
  await fs.rm(CACHE, { recursive: true, force: true });
  await fs.mkdir(CACHE, { recursive: true });
  const repositories = new Set();
  for (const f of xmlFiles) {
    await fs.copyFile(path.join(XML_DIR, f), path.join(CACHE, f));
    repositories.add((await repositoryOf(path.join(XML_DIR, f))) || "Dartmouth DDHI");
  }
  await writeConfig(repositories);
  log(`config repositories: ${[...repositories].join(", ")}`);

  // Start the stock viewer under PHP's built-in server (errors silenced so no
  // deprecation notices from the bundled TCPDF leak into the rendered pages).
  const server = spawn(
    php,
    ["-d", "display_errors=0", "-d", "error_reporting=0", "-S", `127.0.0.1:${PORT}`, "-t", SRC],
    { cwd: SRC, stdio: "ignore" },
  );
  const stop = () => {
    try {
      server.kill();
    } catch {
      /* ignore */
    }
  };
  process.on("exit", stop);

  try {
    await waitForServer(`${ORIGIN}/index.php`);
    log(`php server up on ${ORIGIN}`);

    await fs.rm(OUT, { recursive: true, force: true });
    await copyAssets();
    log(`copied viewer assets → public/ohms-viewer/`);

    const manifest = [];
    for (const file of xmlFiles) {
      const id = file.replace(/\.xml$/, "");
      const res = await fetch(`${ORIGIN}/viewer.php?cachefile=${encodeURIComponent(file)}`);
      if (!res.ok) die(`viewer.php returned ${res.status} for ${file}`);
      let html = await res.text();
      if (/Fatal error|Parse error/i.test(html)) die(`PHP fatal while rendering ${file}`);
      const segments = (html.match(/id="link\d+"/g) || []).length;
      html = transform(html, id, file);
      await fs.writeFile(path.join(OUT, `${id}.html`), html, "utf8");
      manifest.push({ id, file, segments, bytes: html.length });
      log(`baked ${id}.html  (${segments} index segments)`);
    }

    await fs.writeFile(
      path.join(OUT, "manifest.json"),
      JSON.stringify(
        { viewer: VIEWER_TAG, builtAt: new Date().toISOString(), interviews: manifest },
        null,
        2,
      ),
      "utf8",
    );
    log(`done — ${manifest.length} pages in public/ohms-viewer/`);
  } finally {
    stop();
  }
}

main().catch((e) => die(e.stack || e.message));
