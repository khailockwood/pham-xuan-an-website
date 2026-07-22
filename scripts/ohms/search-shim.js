/*
 * OHMS Viewer — static search shim
 * ================================
 * The OHMS Viewer normally answers its keyword search box with two AJAX calls
 * back to the PHP backend:
 *
 *   viewer.php?action=index&kw=…    (searches the index segments)
 *   viewer.php?action=search&kw=…   (searches the transcript)
 *
 * Our pages are baked to static HTML (see scripts/ohms/build-viewer.mjs), so
 * there is no PHP at runtime. This shim reproduces exactly those two endpoints
 * *in the browser*, by reading the index/transcript that the viewer already
 * rendered into the page, and returns the same JSON shape the stock
 * `toggleSwitch.js` expects. Nothing else about the viewer changes.
 *
 * It works by wrapping jQuery's $.getJSON — the only thing toggleSwitch.js uses
 * to reach those endpoints — and short-circuiting the two search URLs while
 * passing every other request through untouched.
 */
(function () {
  "use strict";
  if (typeof window.jQuery === "undefined") return;
  var $ = window.jQuery;

  /* Accent- and case-insensitive folding. Mirrors the viewer's fixAccents()
     (Latin diacritics) and additionally folds Vietnamese đ/Đ, which OHMS also
     folds, so a search for "Dinh" matches "Đình", etc. */
  function fold(s) {
    return String(s == null ? "" : s)
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "") // strip combining diacritics
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  }

  function getParam(url, name) {
    var m = new RegExp("[?&]" + name + "=([^&]*)").exec(url);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "";
  }

  function pad2(n) {
    return (n < 10 ? "0" : "") + n;
  }

  // "M:SS" timecode, matching the viewer's indexSearch() shortline format.
  function shortTime(t) {
    return Math.floor(t / 60) + ":" + pad2(t % 60);
  }

  // The viewer's quoteChange(): encode quotes for safe insertion into markup.
  function quoteChange(s) {
    return String(s).replace(/'/g, "&#39;").replace(/"/g, "&quot;").trim();
  }

  /* action=index — search over the rendered index segments.
     DOM shape (from tmpl/viewer.tmpl.php):
       #accordionHolder > span > a#link<seconds>  ("HH:MM:SS - Title")
       #accordionHolder > div.point               (synopsis / keywords / etc.) */
  function indexSearch(kw) {
    var out = { keyword: kw, matches: [] };
    var needle = fold(kw);
    if (!needle) return out;
    var anchors = document.querySelectorAll('#accordionHolder a[id^="link"]');
    for (var i = 0; i < anchors.length; i++) {
      var a = anchors[i];
      var time = parseInt(a.id.slice(4), 10);
      if (isNaN(time)) continue;
      var span = a.closest("span");
      var point = span ? span.nextElementSibling : null;
      var title = a.textContent.replace(/^\s*[0-9:]+\s*-\s*/, "").trim();
      var hay = a.textContent + " " + (point ? point.textContent : "");
      if (fold(hay).indexOf(needle) !== -1) {
        out.matches.push({
          time: String(time),
          shortline: shortTime(time) + " - " + quoteChange(title),
        });
      }
    }
    return out;
  }

  /* action=search — search over the rendered transcript lines.
     Index-only exports have no transcript, so this returns no matches, exactly
     as the PHP endpoint would. If transcripts are added later and re-baked, the
     lines carry id="line_<n>" and this begins returning results automatically. */
  function transcriptSearch(kw) {
    var out = { keyword: kw, matches: [] };
    var needle = fold(kw);
    if (!needle) return out;
    var lines = document.querySelectorAll('[id^="line_"]');
    for (var i = 0; i < lines.length; i++) {
      var el = lines[i];
      var n = parseInt(el.id.slice(5), 10);
      if (isNaN(n)) continue;
      var text = el.textContent || "";
      if (fold(text).indexOf(needle) !== -1) {
        var t = text.trim().replace(/\s+/g, " ");
        var at = fold(t).indexOf(needle);
        var start = Math.max(0, at - 8);
        var shortline = (start > 0 ? "…" : "") + t.slice(start, at + kw.length + 30);
        out.matches.push({
          shortline: quoteChange(shortline).replace(
            new RegExp("(" + kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi"),
            "<span class='highlight'>$1</span>"
          ),
          linenum: n,
        });
      }
    }
    return out;
  }

  function computeFromUrl(url) {
    if (/action=index/.test(url)) return indexSearch(getParam(url, "kw"));
    return transcriptSearch(getParam(url, "kw"));
  }

  var origGetJSON = $.getJSON;
  $.getJSON = function (url, data, success) {
    if (typeof data === "function") {
      success = data;
      data = undefined;
    }
    if (typeof url === "string" && /action=(index|search)/.test(url)) {
      var result = computeFromUrl(url);
      var d = $.Deferred();
      // Defer to the next tick so callers see the same async behaviour as a
      // real network request (some code binds handlers after calling).
      setTimeout(function () {
        if (typeof success === "function") success(result, "success");
        d.resolve(result, "success");
      }, 0);
      return d.promise();
    }
    return origGetJSON.apply(this, arguments);
  };
})();
