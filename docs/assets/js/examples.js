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
 */
(function () {
  'use strict';

  var WC = window.WordClock;

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
    var grid = el.querySelector('.wcd-grid');
    for (var row = 0; row < WC.SIZE; row++) {
      for (var col = 0; col < WC.SIZE; col++) {
        var l = WC.led(row, col), cell = document.createElement('span');
        var ch = d.letters[row][col] || (dots.has(l) ? WC.DOT : '');
        WC.fillCell(cell, ch);
        cell.className = 'wcd-cell' + (ch === WC.DOT ? ' is-dot' : '') + (lit.has(l) ? ' is-lit' : '') +
          (special.indexOf(l) !== -1 ? ' is-special' : '');
        grid.appendChild(cell);
      }
    }
    if (data.colour) {
      el.style.setProperty('--wcl-lit', data.colour);
      var n = parseInt(data.colour.slice(1), 16);
      el.style.setProperty('--wcl-glow', 'rgba(' + (n >> 16) + ', ' + ((n >> 8) & 255) + ', ' + (n & 255) + ', 0.7)');
    }
    WC.sizeLetters(grid, +data.size || WC.DEFAULT_LETTER_SIZE);
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
