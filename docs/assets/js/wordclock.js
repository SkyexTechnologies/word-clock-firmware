/*
 * Word clock logic shared by the home page clock and the grid designer:
 * reading a layout file (site/layouts/*-layout.json, format 2) and the same
 * rules the firmware uses to light the time.
 *
 * Word table rows:
 *   0       opening words ("IT IS")
 *   1-12    minute phrases for :00, :05, ... :55
 *   13-24   hours 12, 1, ... 11
 *   25-31   weekdays, Sunday ... Saturday
 *   32-36   extra minutes 0 to 4 (the minute dots)
 *   37-48   optional hour words for :00, used instead of rows 13-24
 * LEDs snake through the 11 x 11 grid: even rows run left to right, odd rows
 * right to left.
 */
(function () {
  'use strict';

  var SIZE = 11, LEDS = 121, MAX_PER_WORD = 24, ROWS = 49;
  // A minute dot, as in the DXF generator's grid (word-clock-dxf-generator).
  var DOT = '.';

  function led(row, col) { return row % 2 === 0 ? row * SIZE + col : row * SIZE + (SIZE - 1 - col); }

  function pos(index) {
    var row = Math.floor(index / SIZE), c = index % SIZE;
    return { row: row, col: row % 2 === 0 ? c : SIZE - 1 - c };
  }

  // One square holds one character, or a letter with an apostrophe ("O'"
  // in O'CLOCK), like the DXF generator's tokens. Older designs used a
  // middle dot for the minute dots.
  function cleanLetter(c) {
    if (typeof c !== 'string') return '';
    c = c.replace(/·/g, DOT).replace(/’/g, "'");
    var chars = Array.from(c);
    return chars.length > 1 && chars[1] === "'" ? chars[0] + "'" : (chars[0] || '');
  }

  function blankRows() { var r = []; for (var i = 0; i < ROWS; i++) r.push([]); return r; }
  function nextHourFrom(first) { var a = []; for (var i = 0; i < 12; i++) a.push(i >= first); return a; }

  function blankLetters() {
    var letters = [];
    for (var r = 0; r < SIZE; r++) letters.push(new Array(SIZE).fill(''));
    return letters;
  }

  // The grid of a layout file: {name, nextHour, letters, words}. Accepts
  // format 2, and format 1 from before the 24-letter limit (37 rows of 12,
  // with an optional next_hour_from minute).
  function readLayout(data) {
    if (!data || !Array.isArray(data.words) || (data.words.length !== ROWS && data.words.length !== 37)) {
      throw new Error('This is not a word clock design file.');
    }
    var d = { name: typeof data.name === 'string' ? data.name : '', letters: blankLetters(), words: blankRows() };
    if (Array.isArray(data.next_hour) && data.next_hour.length === 12) {
      d.nextHour = data.next_hour.map(Boolean);
    } else {
      var from = data.next_hour_from === undefined ? 20 : data.next_hour_from;
      d.nextHour = nextHourFrom(from === null ? 12 : Math.ceil(from / 5));
    }
    if (Array.isArray(data.letters) && data.letters.length === SIZE) {
      d.letters = data.letters.map(function (row) {
        var a = (typeof row === 'string' ? Array.from(row) : row).map(cleanLetter);
        while (a.length < SIZE) a.push('');
        return a.slice(0, SIZE);
      });
    }
    data.words.forEach(function (w, r) {
      if (r < ROWS) d.words[r] = w.filter(function (l) { return l >= 0 && l < LEDS; }).slice(0, MAX_PER_WORD);
    });
    return d;
  }

  // Fetches site/layouts/<key>-layout.json; `base` is that folder's URL.
  function loadLayout(base, key) {
    return fetch(base + key + '-layout.json').then(function (r) {
      if (!r.ok) throw new Error('The ' + key + ' grid could not be loaded.');
      return r.json();
    });
  }

  /* ---------- the firmware's rules ---------- */

  // Word table rows lit for a time: opening words, minute phrase, hour.
  function rowsFor(d, hour, minute) {
    var phrase = Math.floor(minute / 5);
    var shown = (hour + (d.nextHour[phrase] ? 1 : 0)) % 12;
    var hourRow = phrase === 0 && d.words[37 + shown].length ? 37 + shown : 13 + shown;
    return [0, 1 + phrase, hourRow];
  }

  // All LEDs lit at a time and day (0 = Sunday), with weekday and dots.
  function litLeds(d, hour, minute, day) {
    var lit = new Set();
    rowsFor(d, hour, minute).concat([25 + day, 32 + (minute % 5)]).forEach(function (r) {
      d.words[r].forEach(function (l) { lit.add(l); });
    });
    return lit;
  }

  function sortedByPosition(leds) {
    return leds.slice().sort(function (a, b) {
      var pa = pos(a), pb = pos(b);
      return pa.row - pb.row || pa.col - pb.col;
    });
  }

  // Letters in reading order, with a space wherever they aren't next to each
  // other.
  function wordText(d, leds) {
    var text = '', prev = null;
    sortedByPosition(leds).forEach(function (l) {
      var p = pos(l);
      if (prev && (p.row !== prev.row || p.col !== prev.col + 1)) text += ' ';
      text += d.letters[p.row][p.col] || '?';
      prev = p;
    });
    return text;
  }

  // What the clock says, e.g. "IT IS TWENTY PAST TWO  + 3 dots".
  function timeText(d, hour, minute) {
    var leds = [];
    rowsFor(d, hour, minute).forEach(function (r) { leds = leds.concat(d.words[r]); });
    var text = wordText(d, leds.filter(function (l, i) { return leds.indexOf(l) === i; }));
    var dots = minute % 5;
    return (text || '(no words lit)') + (dots ? '  + ' + dots + ' dot' + (dots > 1 ? 's' : '') : '');
  }

  // The squares that show a minute dot when they have no letter of their own.
  function minuteDots(d) {
    var dots = new Set();
    d.words.slice(33, 37).forEach(function (w) { w.forEach(function (l) { dots.add(l); }); });
    return dots;
  }

  window.WordClock = {
    SIZE: SIZE, LEDS: LEDS, MAX_PER_WORD: MAX_PER_WORD, ROWS: ROWS, DOT: DOT,
    led: led, pos: pos, cleanLetter: cleanLetter, blankRows: blankRows, blankLetters: blankLetters,
    nextHourFrom: nextHourFrom, readLayout: readLayout, loadLayout: loadLayout,
    rowsFor: rowsFor, litLeds: litLeds, wordText: wordText, timeText: timeText, minuteDots: minuteDots
  };
})();
