/**
 * segment-link-shim.js — make the viewer's own `#segment<seconds>` links work.
 *
 * The OHMS Viewer prints a "Direct segment link" under every index segment, of
 * the form `<page>.html#segment590`, and offers a copy button for it. Nothing in
 * the shipped client-side code ever reads that hash back: upstream, the jump is
 * resolved by viewer.php before the page is rendered. These pages are baked
 * once and served as static files, so there is no PHP left to do it, and the
 * links the viewer advertises land on the page without seeking.
 *
 * This restores them, using the viewer's own machinery rather than a second
 * implementation: it clicks the segment's `a.indexJumpLink`, which is what a
 * person clicking "Play segment" triggers. Same code path, same result.
 *
 * It also lets the site deep-link inward: `segmentHref()` in
 * `src/lib/ohms-highlights.ts` builds `/interviews/<slug>#segment<sec>`, and the
 * interview page passes the hash down to the framed viewer.
 *
 * Deliberately does NOT start playback. The seek is unambiguous; autoplaying
 * audio into a page someone has just opened is not, and in a cross-document
 * iframe the play() would often be blocked anyway.
 *
 * Injected into every baked page by build-viewer.mjs, alongside the search shim.
 */
(function () {
  "use strict";

  var POLL_MS = 150;
  var TIMEOUT_MS = 20000;

  function parseHash(hash) {
    var m = /^#segment(\d+)$/.exec(hash || "");
    return m ? parseInt(m[1], 10) : null;
  }

  /** Run `fn` once `test()` passes, or give up quietly after TIMEOUT_MS. */
  function when(test, fn) {
    var waited = 0;
    (function tick() {
      var ready = false;
      try {
        ready = !!test();
      } catch (e) {
        ready = false;
      }
      if (ready) return fn();
      waited += POLL_MS;
      if (waited < TIMEOUT_MS) window.setTimeout(tick, POLL_MS);
    })();
  }

  /**
   * Open the segment's accordion panel and bring it into view, so the page shows
   * where it landed rather than silently moving the playhead. Best-effort: the
   * seek below is the part that matters.
   */
  function reveal(seconds) {
    if (!window.jQuery) return;
    var $ = window.jQuery;
    try {
      var header = $("#link" + seconds);
      if (!header.length) return;
      // The index sits in a jQuery UI accordion; clicking the header is how the
      // viewer itself opens a panel.
      if (!header.parent().next(".point").is(":visible")) header.trigger("click");
      var node = header.get(0);
      if (node && node.scrollIntoView) node.scrollIntoView({ block: "center" });
    } catch (e) {
      /* the index panel is optional — an export with no segments has none */
    }
  }

  function seek(seconds) {
    if (!window.jQuery) return;
    var $ = window.jQuery;
    var link = $("a.indexJumpLink[data-timestamp='" + seconds + "']");
    if (!link.length) return; // no such segment in this export

    // viewer_other.js delegates on body and reads e.target, so the click has to
    // land on the anchor itself.
    link.get(0).click();
  }

  function go(seconds) {
    if (seconds === null) return;
    when(
      function () {
        return window.jQuery && window.player && typeof window.player.currentTime === "function";
      },
      function () {
        // videojs may still be initialising its tech; ready() fires immediately
        // if it is already done.
        try {
          window.player.ready(function () {
            reveal(seconds);
            seek(seconds);
          });
        } catch (e) {
          reveal(seconds);
          seek(seconds);
        }
      }
    );
  }

  go(parseHash(window.location.hash));

  // The site can point the same framed page at a different segment without
  // reloading it, which fires hashchange rather than a fresh page load.
  window.addEventListener("hashchange", function () {
    go(parseHash(window.location.hash));
  });
})();
