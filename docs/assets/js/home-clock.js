/*
 * Live clock on the home page (index.md): the chosen language's letter grid
 * at the visitor's current time, using the shared logic in wordclock.js.
 */
(function () {
  'use strict';

  var WC = window.WordClock;
  var STORAGE_KEY = 'word-clock-home-language', COLOUR_KEY = 'word-clock-home-colour';
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var root, grid, cells = [], current = null, layouts = {};
  // Grids with fun phrases show one every other few seconds (see demo()).
  var DEMO_MS = 4000, demoOn = false, demoIndex = -1;

  function pad(n) { return String(n).padStart(2, '0'); }

  // The fun phrases with letters, a day and a window.
  function funPhrases() {
    return (current && current.fun || []).filter(function (f) {
      return f.leds.length && f.days.some(Boolean) && f.from && f.to;
    });
  }

  // "Monday to Friday", "Friday", "Saturday and Sunday".
  function dayNames(days) {
    if ([1, 2, 3, 4, 5].every(function (d) { return days[d]; }) && !days[0] && !days[6]) return 'Monday to Friday';
    var names = [1, 2, 3, 4, 5, 6, 0].filter(function (d) { return days[d]; }).map(function (d) { return DAYS[d]; });
    return names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] : names[0];
  }

  // Every DEMO_MS: the time, then the next fun phrase, then the time again.
  function demo() {
    var fun = funPhrases();
    demoOn = fun.length > 0 && !demoOn;
    if (demoOn) demoIndex = (demoIndex + 1) % fun.length;
    render();
  }

  function render() {
    if (!current) return;
    var now = new Date(), h = now.getHours(), m = now.getMinutes();
    var lit = WC.litLeds(current, h, m, now.getDay()), dots = WC.minuteDots(current);
    var fun = funPhrases(), shown = demoOn && fun.length ? fun[demoIndex % fun.length] : null, note = root.querySelector('#wcl-fun');
    if (shown) {
      lit = new Set(shown.leds);
      note.textContent = 'Fun phrase, on ' + dayNames(shown.days) + ' from ' + shown.from + ' to ' + shown.to + ': ' +
        WC.wordText(current, shown.leds);
    }
    note.hidden = !shown;
    cells.forEach(function (cell) {
      var l = cell.led, p = WC.pos(l);
      var ch = current.letters[p.row][p.col] || (dots.has(l) ? WC.DOT : '');
      WC.fillCell(cell.el, ch);
      cell.el.className = 'wcd-cell' + (ch === WC.DOT ? ' is-dot' : '') + (lit.has(l) ? ' is-lit' : '');
    });
    root.querySelector('#wcl-time').textContent = h + ':' + pad(m);
    root.querySelector('#wcl-text').textContent = WC.timeText(current, h, m, now.getDay()).replace(/\s+\+.*$/, '');
    explain(now, h, m);
  }

  // What each lit part means: the words, the weekday letter and the dots.
  function explain(now, h, m) {
    var list = root.querySelector('#wcl-explain'), items = [];
    var words = WC.timeText(current, h, m).replace(/\s+\+.*$/, '');
    var rounded = m - (m % 5), h12 = h % 12 || 12, fun = WC.funNow(current, h, m, now.getDay());
    if (fun >= 0) {
      var f = current.fun[fun];
      items.push('A fun phrase replaces the time words, from ' + f.from + ' to ' + f.to + '.');
    } else {
      items.push('The words say ' + h12 + ':' + pad(rounded) + ', in steps of five minutes.');
    }
    var day = now.getDay(), dayLeds = current.words[25 + day];
    if (dayLeds.length) {
      items.push('The letter ' + WC.wordText(current, dayLeds) + ' in the bottom row shows the day: ' + DAYS[day] + '.');
    }
    var dots = m % 5;
    if (current.words[33].length) {
      items.push(dots ? dots + (dots > 1 ? ' dots add ' : ' dot adds ') + dots + (dots > 1 ? ' minutes' : ' minute') +
        ' to that: ' + h12 + ':' + pad(m) + '.' : 'No dots are lit: it is exactly ' + h12 + ':' + pad(rounded) + '.');
    }
    list.innerHTML = '';
    items.forEach(function (text) { var li = document.createElement('li'); li.textContent = text; list.appendChild(li); });
    return words;
  }

  // Illustration only: the colour of the lit letters, dots and glow.
  function setColour(hex) {
    var n = parseInt(hex.slice(1), 16);
    var glow = 'rgba(' + (n >> 16) + ', ' + ((n >> 8) & 255) + ', ' + (n & 255) + ', 0.7)';
    root.style.setProperty('--wcl-lit', hex);
    root.style.setProperty('--wcl-glow', glow);
    root.querySelector('#wcl-colour').value = hex;
    try { localStorage.setItem(COLOUR_KEY, hex); } catch (e) { /* private mode */ }
  }

  function choose(key) {
    root.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.dataset.lang === key;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    try { localStorage.setItem(STORAGE_KEY, key); } catch (e) { /* private mode */ }
    var ready = layouts[key] ? Promise.resolve(layouts[key])
      : WC.loadLayout(root.dataset.layouts || 'layouts/', key).then(function (data) {
        layouts[key] = WC.readLayout(data);
        return layouts[key];
      });
    ready.then(function (d) { current = d; demoOn = false; demoIndex = -1; render(); }).catch(function (err) {
      root.querySelector('#wcl-text').textContent = err.message;
    });
  }

  function init() {
    root = document.getElementById('wcl');
    if (!root || !WC) return;
    grid = root.querySelector('#wcl-grid');
    for (var r = 0; r < WC.SIZE; r++) {
      for (var c = 0; c < WC.SIZE; c++) {
        var el = document.createElement('span');
        el.className = 'wcd-cell';
        grid.appendChild(el);
        cells.push({ el: el, led: WC.led(r, c) });
      }
    }
    WC.sizeLetters(grid, WC.DEFAULT_LETTER_SIZE);
    root.querySelectorAll('[data-lang]').forEach(function (b) {
      b.addEventListener('click', function () { choose(b.dataset.lang); });
    });
    var picker = root.querySelector('#wcl-colour');
    picker.addEventListener('input', function () { setColour(picker.value); });
    root.querySelector('#wcl-colour-reset').addEventListener('click', function (e) {
      e.preventDefault();
      setColour('#ffffff');
    });
    var colour = null;
    try { colour = localStorage.getItem(COLOUR_KEY); } catch (e) { /* private mode */ }
    setColour(/^#[0-9a-f]{6}$/i.test(colour || '') ? colour : '#ffffff');

    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* private mode */ }
    choose(saved && root.querySelector('[data-lang="' + saved + '"]') ? saved : 'english');
    setInterval(render, 10000);
    setInterval(demo, DEMO_MS);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
