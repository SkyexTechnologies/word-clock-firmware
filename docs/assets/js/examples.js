/*
 * Example clocks on the examples page (examples.md): each .wcx-clock shows a
 * grid from site/layouts/ at a fixed time and day, using wordclock.js.
 *
 *   data-layout   layout file key, e.g. "english-fun"
 *   data-time     "HH:MM"; data-day: 0 (Sunday) ... 6 (Saturday)
 *   data-size     letter size in mm (default 12)
 *   data-colour   colour of the lit letters (default white)
 *   data-special  letters in one row of the grid, lit as a pulsing special
 *                 word, e.g. "SKYEX"
 *   data-symbol   "row,column,symbol": puts a symbol in that square (from 0)
 *                 and lights it as a special word
 *   data-transition  "fade", "crossfade", "typewriter" or "sweep": changes
 *                 back and forth between data-time and data-next ("HH:MM")
 *                 with that transition, as the clock's 02. Transition Effect
 */
(function () {
  'use strict';

  var WC = window.WordClock;
  var HOLD_MS = 2500, TRANSITION_MS = 2000;

  // The LEDs of `text` written left to right in one row of the grid.
  function findWord(d, text) {
    var chars = Array.from(text);
    for (var r = 0; r < WC.SIZE; r++) {
      for (var c = 0; c + chars.length <= WC.SIZE; c++) {
        if (chars.every(function (ch, i) { return d.letters[r][c + i] === ch; })) {
          return chars.map(function (ch, i) { return WC.led(r, c + i); });
        }
      }
    }
    return [];
  }

  function show(el, d) {
    var data = el.dataset, time = (data.time || '9:41').split(':');
    var hour = +time[0], minute = +time[1], day = data.day !== undefined ? +data.day : 3;
    var special = data.special ? findWord(d, data.special) : [];
    if (data.symbol) {
      var s = data.symbol.split(','), r = +s[0], c = +s[1];
      d.letters[r][c] = s[2];
      special.push(WC.led(r, c));
    }
    var lit = WC.litLeds(d, hour, minute, day), dots = WC.minuteDots(d);
    special.forEach(function (l) { lit.add(l); });
    var grid = el.querySelector('.wcd-grid'), cells = [];
    for (var row = 0; row < WC.SIZE; row++) {
      for (var col = 0; col < WC.SIZE; col++) {
        var l = WC.led(row, col), cell = document.createElement('span');
        var ch = d.letters[row][col] || (dots.has(l) ? WC.DOT : '');
        WC.fillCell(cell, ch);
        cell.className = 'wcd-cell' + (ch === WC.DOT ? ' is-dot' : '') + (lit.has(l) ? ' is-lit' : '') +
          (special.indexOf(l) !== -1 ? ' is-special' : '');
        grid.appendChild(cell);
        cells.push({ el: cell, led: l, row: row, col: col });
      }
    }
    if (data.colour) {
      el.style.setProperty('--wcl-lit', data.colour);
      var n = parseInt(data.colour.slice(1), 16);
      el.style.setProperty('--wcl-glow', 'rgba(' + (n >> 16) + ', ' + ((n >> 8) & 255) + ', ' + (n & 255) + ', 0.7)');
    }
    WC.sizeLetters(grid, +data.size || WC.DEFAULT_LETTER_SIZE);
    if (data.transition && data.next) {
      var next = data.next.split(':');
      animate(cells, data.transition, lit, WC.litLeds(d, +next[0], +next[1], day));
    }
  }

  // How lit each LED is (0 to 1) at p (0 to 1) of a transition from the LEDs
  // in `from` to those in `to`; the same rules as the Clock effect in
  // word-clock.yaml.
  function levels(cells, effect, from, to, p) {
    var out = {};
    if (effect === 'typewriter') {
      // The old letters go from the end, then the new ones come in reading
      // order (cells are in reading order).
      var source = p < 0.5 ? from : to, total = 0, rank = 0;
      cells.forEach(function (c) { if (source.has(c.led)) total++; });
      var count = p < 0.5 ? Math.ceil(total * (1 - 2 * p) - 0.001) : Math.floor(total * (2 * p - 1));
      cells.forEach(function (c) { out[c.led] = source.has(c.led) && rank++ < count ? 1 : 0; });
      return out;
    }
    cells.forEach(function (c) {
      var a = from.has(c.led) ? 1 : 0, b = to.has(c.led) ? 1 : 0, t = p;
      if (effect === 'fade') {
        out[c.led] = p < 0.5 ? a * (1 - 2 * p) : b * (2 * p - 1);
        return;
      }
      if (effect === 'sweep') {
        // A soft edge two columns wide, from before column 0 to past column 10.
        t = Math.min(1, Math.max(0, (p * 13 - 1 - c.col + 1) / 2));
      }
      out[c.led] = a + (b - a) * t;
    });
    return out;
  }

  function paint(cells, level) {
    cells.forEach(function (c) {
      var v = level[c.led];
      c.el.classList.toggle('is-lit', v >= 1);
      c.el.classList.toggle('is-fading', v > 0 && v < 1);
      c.el.style.setProperty('--wcx-level', v > 0 && v < 1 ? v.toFixed(3) : '');
    });
  }

  // Back and forth between the two times: each shown for HOLD_MS, then the
  // transition over TRANSITION_MS. Only while the clock is on screen, and
  // not for visitors who ask for less motion.
  function animate(cells, effect, first, second) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var from = first, to = second, start = null, visible = true, running = false;
    function frame(now) {
      if (!visible) { running = false; start = null; return; }
      if (start === null) start = now;
      if (now - start >= HOLD_MS + TRANSITION_MS) {
        var swap = from; from = to; to = swap;
        start = now;
      }
      paint(cells, levels(cells, effect, from, to, Math.max(0, now - start - HOLD_MS) / TRANSITION_MS));
      requestAnimationFrame(frame);
    }
    function run() {
      if (running) return;
      running = true;
      requestAnimationFrame(frame);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) run();
      }).observe(cells[0].el.parentNode);
    } else {
      run();
    }
  }

  function init() {
    var page = document.querySelector('.wcx-gallery');
    if (!page || !WC) return;
    var base = page.dataset.layouts || 'layouts/';
    page.querySelectorAll('.wcx-clock').forEach(function (el) {
      WC.loadLayout(base, el.dataset.layout).then(function (data) { show(el, WC.readLayout(data)); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
