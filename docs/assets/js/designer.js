/*
 * Word clock grid designer (design-your-own.md).
 *
 * A design is a factory layout file (format 2, as
 * provisioning/default-layout.json in the development repository) plus the
 * letters of the grid. Word table rows:
 *   0       opening words ("IT IS")
 *   1-12    minute phrases for :00, :05, ... :55
 *   13-24   hours 12, 1, ... 11
 *   25-31   weekdays, Sunday ... Saturday
 *   32-36   extra minutes 0 to 4 (the minute dots; each row lists all LEDs
 *           lit for that many minutes)
 *   37-48   optional hour words for :00, used instead of rows 13-24
 * Each row lights at most 24 LEDs. LEDs snake through the grid: even rows run
 * left to right, odd rows right to left.
 */
(function () {
  'use strict';

  var SIZE = 11, LEDS = 121, MAX_PER_WORD = 24, ROWS = 49, STORAGE_KEY = 'word-clock-design';
  // Address the "Email your design" button writes to; empty until decided.
  var ORDER_EMAIL = '';
  // A minute dot, as in the DXF generator's grid (word-clock-dxf-generator).
  var DOT = '.';
  var APOSTROPHES = ["'", '\u2019'];

  // Example grids, copied from provisioning/default-layout.json (plus the Dutch
  // letters), english-layout.json and korean-layout.json in the development
  // repository. Keep them in sync when those files change.
  var EXAMPLES = {
    dutch: {"name":"Nederlands","next_hour":[false,false,false,false,true,true,true,true,true,true,true,true],"letters":["HETEISUVIJF","TIENAGNVOOR","OVERBUKWART","HALFYIUOVER","VOORLDIÉÉND","TWEELOKDRIE","VIERVIJFZES","ZEVENCNEGEN","ACHTTIENELF","TWAALFPMUUR","MDWDVZZ...."],"words":[[0,1,2,4,5],[99,100,101],[7,8,9,10,22,23,24,25],[18,19,20,21,22,23,24,25],[28,29,30,31,32,33,34,35,36],[11,12,13,14,18,19,20,21,40,41,42,43],[7,8,9,10,11,12,13,14,40,41,42,43],[40,41,42,43],[7,8,9,10,22,23,24,25,40,41,42,43],[18,19,20,21,22,23,24,25,40,41,42,43],[28,29,30,31,32,44,45,46,47],[11,12,13,14,18,19,20,21],[7,8,9,10,11,12,13,14],[104,105,106,107,108,109],[51,52,53],[62,63,64,65],[55,56,57,58],[66,67,68,69],[70,71,72,73],[74,75,76],[83,84,85,86,87],[88,89,90,91],[77,78,79,80,81],[92,93,94,95],[96,97,98],[116],[110],[111],[112],[113],[114],[115],[],[117],[117,118],[117,118,119],[117,118,119,120],[],[],[],[],[],[],[],[],[],[],[],[]]},
    english: {"name":"English","next_hour":[false,false,false,false,false,false,false,true,true,true,true,true],"letters":[["I","T","L","I","S","A","H","A","L","F","X"],["T","W","E","N","T","Y","E","F","I","V","E"],["Q","U","A","R","T","E","R","S","T","E","N"],["T","O","K","P","A","S","T","U","O","N","E"],["T","W","O","T","H","R","E","E","S","I","X"],["F","O","U","R","F","I","V","E","T","E","N"],["S","E","V","E","N","E","I","G","H","T","X"],["N","I","N","E","E","L","E","V","E","N","K"],["T","W","E","L","V","E","L","I","G","H","T"],["S","K","Y","E","X","O'","C","L","O","C","K"],["M","T","W","T","F","S","S",".",".",".","."]],"words":[[0,1,3,4],[99,100,101,102,103,104],[11,12,13,14,37,38,39,40],[30,31,32,37,38,39,40],[22,23,24,25,26,27,28,37,38,39,40],[16,17,18,19,20,21,37,38,39,40],[11,12,13,14,16,17,18,19,20,21,37,38,39,40],[6,7,8,9,37,38,39,40],[11,12,13,14,16,17,18,19,20,21,42,43],[16,17,18,19,20,21,42,43],[22,23,24,25,26,27,28,42,43],[30,31,32,42,43],[11,12,13,14,42,43],[88,89,90,91,92,93],[33,34,35],[44,45,46],[47,48,49,50,51],[62,63,64,65],[58,59,60,61],[52,53,54],[66,67,68,69,70],[71,72,73,74,75],[84,85,86,87],[55,56,57],[78,79,80,81,82,83],[116],[110],[111],[112],[113],[114],[115],[],[117],[117,118],[117,118,119],[117,118,119,120],[],[],[],[],[],[],[],[],[],[],[],[]]},
    korean: {"name":"한국어","next_hour":[false,false,false,false,false,false,false,false,false,false,false,false],"letters":[["지","금","은","우","리","의","소","중","한","시","간"],["열","한","두","세","네","다","섯","여","섯","일","곱"],["오","늘","도","꼭","좋","은","하","루","되","세","요"],["여","덟","아","홉","시","함","께","라","서","좋","아"],["사","랑","하","는","가","족","과","함","께","해","요"],["이","삼","사","오","십","오","분","행","복","하","게"],["스","카","이","엑","스","단","어","시","계","예","요"],["정","각","입","니","다","고","마","워","요","친","구"],["우","리","꿈","을","향","해","오","늘","도","힘","내"],["당","신","과","의","모","든","순","간","이","선","물"],["월","화","수","목","금","토","일",".",".",".","."]],"words":[[0,1,2],[83,84,85,86,87],[59,60,83,84,85],[59,61,83,84,85],[59,60,61,83,84,85],[59,61,65,83,84,85],[59,60,61,65,83,84,85],[59,61,64,83,84,85],[59,60,61,64,83,84,85],[59,61,63,83,84,85],[59,60,61,63,83,84,85],[59,61,62,83,84,85],[59,60,61,62,83,84,85],[19,21,39],[20,39],[19,39],[18,39],[17,39],[15,16,39],[13,14,39],[11,12,39],[39,42,43],[39,40,41],[21,39],[20,21,39],[116],[110],[111],[112],[113],[114],[115],[],[117],[117,118],[117,118,119],[117,118,119,120],[],[],[],[],[],[],[],[],[],[],[],[]]}
  };

  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
    c = c.replace(/\u00b7/g, DOT).replace(/\u2019/g, "'");
    var chars = Array.from(c);
    return chars.length > 1 && chars[1] === "'" ? chars[0] + "'" : (chars[0] || '');
  }

  function minuteLabel(m) { return ':' + String(m * 5).padStart(2, '0'); }
  function hourName(h) { return h === 0 ? 12 : h; }

  // Phrase list of the Words tab: {label, row, phrase (minute phrases only), optional}.
  var PHRASES = [{ label: 'Opening words (IT IS)', row: 0 }];
  for (var m = 0; m < 12; m++) {
    PHRASES.push({ label: m === 0 ? ':00 (on the hour)' : minuteLabel(m), row: 1 + m, phrase: m });
  }
  for (var h = 1; h <= 12; h++) PHRASES.push({ label: 'Hour ' + h, row: 13 + (h % 12) });
  for (h = 1; h <= 12; h++) {
    PHRASES.push({ label: 'Hour ' + h + ' at :00', row: 37 + (h % 12), optional: true });
  }
  [1, 2, 3, 4, 5, 6, 0].forEach(function (d) { PHRASES.push({ label: 'Day: ' + DAYS[d], row: 25 + d }); });
  for (var n = 1; n <= 4; n++) {
    PHRASES.push({ label: '+' + n + ' minute' + (n > 1 ? 's' : ''), row: 32 + n, minutes: true });
  }

  // Quick choices for the next-hour marks: first minute phrase that names the
  // next hour.
  var RULES = { '15': 3, '20': 4, '25': 5, '35': 7, never: 12 };

  function blankRows() { var r = []; for (var i = 0; i < ROWS; i++) r.push([]); return r; }
  function nextHourFrom(first) { var a = []; for (var i = 0; i < 12; i++) a.push(i >= first); return a; }

  function emptyDesign() {
    var letters = [];
    for (var r = 0; r < SIZE; r++) letters.push(new Array(SIZE).fill(''));
    return { name: '', nextHour: nextHourFrom(RULES['20']), letters: letters, words: blankRows() };
  }

  function exampleDesign(key) {
    var d = importDesign(JSON.parse(JSON.stringify(EXAMPLES[key])));
    d.name = '';
    return d;
  }

  /* ---------- import and export ---------- */

  // Accepts this designer's files: format 2, and format 1 from before the
  // 24-letter limit (37 rows of 12, with an optional next_hour_from minute).
  function importDesign(data) {
    if (!data || !Array.isArray(data.words) || (data.words.length !== ROWS && data.words.length !== 37)) {
      throw new Error('This is not a word clock design file.');
    }
    var d = emptyDesign();
    d.name = typeof data.name === 'string' ? data.name : '';
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

  function exportDesign() {
    var rows = design.words.map(function (w) { return w.slice().sort(function (a, b) { return a - b; }); });
    var anyDay = rows.slice(25, 32).some(function (w) { return w.length; });
    var anyMinutes = rows.slice(33, 37).some(function (w) { return w.length; });
    return {
      version: 2,
      hardware_revision: 1,
      indications: { it_is: rows[0].length > 0, minutes: anyMinutes, weekdays: anyDay },
      next_hour: design.nextHour.slice(),
      words: rows,
      name: design.name,
      // Squares lit as minute dots without a letter of their own get a ".",
      // so the DXF generator engraves a dot there.
      letters: design.letters.map(function (row, r) {
        return row.map(function (c, col) { return c || (isMinuteDot(led(r, col)) ? DOT : ''); });
      })
    };
  }

  function isMinuteDot(l) {
    return design.words.slice(33, 37).some(function (w) { return w.indexOf(l) !== -1; });
  }

  /* ---------- storage (convenience only; the download is the real copy) ---------- */
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(exportDesign())); } catch (e) { /* private mode */ }
  }
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? importDesign(JSON.parse(raw)) : null;
    } catch (e) { return null; }
  }

  var design = load() || exampleDesign('english');
  var mode = 'preview', selectedPhrase = null, selectedCell = null, currentDay = 3;
  var root, gridEl;

  /* ---------- clock logic (same rules as the firmware) ---------- */
  function rowsFor(hour, minute) {
    var phrase = Math.floor(minute / 5);
    var shown = (hour + (design.nextHour[phrase] ? 1 : 0)) % 12;
    var hourRow = phrase === 0 && design.words[37 + shown].length ? 37 + shown : 13 + shown;
    return [0, 1 + phrase, hourRow];
  }

  function litLeds(hour, minute, day) {
    var lit = new Set();
    rowsFor(hour, minute).concat([25 + day, 32 + (minute % 5)]).forEach(function (r) {
      design.words[r].forEach(function (l) { lit.add(l); });
    });
    return lit;
  }

  // For the extra-minute phrases: how many LEDs and where.
  function dotText(leds) {
    if (!leds.length) return '—';
    return leds.length + ' LED' + (leds.length > 1 ? 's' : '') + ': ' + leds.slice().sort(function (a, b) {
      var pa = pos(a), pb = pos(b);
      return pa.row - pb.row || pa.col - pb.col;
    }).map(function (l) { var p = pos(l); return 'row ' + (p.row + 1) + ' col ' + (p.col + 1); }).join(', ');
  }

  // Letters in reading order, with a space wherever they aren't next to each
  // other.
  function wordText(leds) {
    var text = '', prev = null;
    leds.slice().sort(function (a, b) {
      var pa = pos(a), pb = pos(b);
      return pa.row - pb.row || pa.col - pb.col;
    }).forEach(function (l) {
      var p = pos(l);
      if (prev && (p.row !== prev.row || p.col !== prev.col + 1)) text += ' ';
      text += design.letters[p.row][p.col] || '?';
      prev = p;
    });
    return text;
  }

  /* ---------- rendering ---------- */
  function $(sel) { return root.querySelector(sel); }

  function previewTime() {
    var t = ($('#wcd-time').value || '10:10').split(':');
    return { hour: parseInt(t[0], 10) || 0, minute: parseInt(t[1], 10) || 0 };
  }

  function render() {
    var lit = new Set(), inPhrase = new Set(), used = new Set();
    if (mode === 'preview') {
      var t = previewTime();
      lit = litLeds(t.hour, t.minute, currentDay);
    }
    if (mode === 'words') {
      design.words.forEach(function (w) { w.forEach(function (l) { used.add(l); }); });
      if (selectedPhrase !== null) design.words[selectedPhrase].forEach(function (l) { inPhrase.add(l); });
    }
    var minuteLeds = new Set();
    design.words.slice(33, 37).forEach(function (w) { w.forEach(function (l) { minuteLeds.add(l); }); });
    gridEl.querySelectorAll('button').forEach(function (cell) {
      var l = parseInt(cell.dataset.led, 10), p = pos(l);
      var ch = design.letters[p.row][p.col] || (minuteLeds.has(l) ? DOT : '');
      // A "." is drawn as a round dot centred in its square (CSS), not on
      // the text baseline.
      cell.textContent = ch === DOT ? '' : ch;
      cell.className = 'wcd-cell' + (ch === DOT ? ' is-dot' : '');
      if (lit.has(l)) cell.classList.add('is-lit');
      if (mode === 'words') {
        if (inPhrase.has(l)) cell.classList.add('is-selected');
        else if (used.has(l)) cell.classList.add('is-used');
      }
      if (mode === 'letters' && selectedCell === l) cell.classList.add('is-selected');
    });
    if (mode === 'preview') renderPreviewText();
    if (mode === 'words') renderPhraseList();
    if (mode === 'save') renderSummary();
  }

  function renderPreviewText() {
    var t = previewTime(), leds = [];
    rowsFor(t.hour, t.minute).forEach(function (r) { leds = leds.concat(design.words[r]); });
    var text = wordText(leds.filter(function (l, i) { return leds.indexOf(l) === i; }));
    var dots = t.minute % 5;
    $('#wcd-phrase').textContent = (text || '(no words lit)') + (dots ? '  + ' + dots + ' dot' + (dots > 1 ? 's' : '') : '');
  }

  function renderPhraseList() {
    var list = $('#wcd-phrases');
    list.innerHTML = '';
    PHRASES.forEach(function (ph) {
      var leds = design.words[ph.row];
      var item = document.createElement('div');
      item.className = 'wcd-phrase' + (ph.row === selectedPhrase ? ' is-active' : '') + (ph.optional ? ' is-optional' : '');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'wcd-phrase-main';
      b.innerHTML = '<span class="wcd-phrase-label"></span><span class="wcd-phrase-text"></span><span class="wcd-phrase-count"></span>';
      b.children[0].textContent = ph.label;
      b.children[1].textContent = ph.minutes ? dotText(leds) : wordText(leds) || (ph.optional ? 'optional' : '—');
      b.children[2].textContent = leds.length + '/' + MAX_PER_WORD;
      b.addEventListener('click', function () { selectedPhrase = ph.row; render(); });
      item.appendChild(b);
      if (ph.phrase !== undefined && ph.phrase > 0) {
        var label = document.createElement('label');
        label.className = 'wcd-next-hour';
        var box = document.createElement('input');
        box.type = 'checkbox';
        box.checked = design.nextHour[ph.phrase];
        box.addEventListener('change', function () {
          design.nextHour[ph.phrase] = box.checked;
          syncRule();
          save();
          render();
        });
        label.appendChild(box);
        label.appendChild(document.createTextNode(' next hour'));
        label.title = 'This phrase names the next hour, like "tien voor half vijf" at 4:20';
        item.appendChild(label);
      }
      list.appendChild(item);
    });
    var current = PHRASES.filter(function (p) { return p.row === selectedPhrase; })[0];
    $('#wcd-words-hint').textContent = current
      ? 'Click letters or dots in the grid to add them to or remove them from "' + current.label + '".'
      : 'Choose a phrase, then click its letters in the grid.';
  }

  function syncRule() {
    var match = 'custom';
    Object.keys(RULES).forEach(function (k) {
      if (nextHourFrom(RULES[k]).every(function (v, i) { return i === 0 || v === design.nextHour[i]; })) match = k;
    });
    $('#wcd-rule').value = match;
  }

  function renderSummary() {
    var problems = [];
    PHRASES.forEach(function (ph) {
      if (!ph.optional && ph.row >= 1 && ph.row <= 24 && !design.words[ph.row].length) problems.push(ph.label + ' has no letters.');
    });
    var minuteRows = design.words.slice(33, 37).filter(function (w) { return w.length; }).length;
    if (minuteRows && minuteRows < 4) problems.push('Only ' + minuteRows + ' of the 4 extra-minute phrases have dots.');
    var box = $('#wcd-check');
    box.innerHTML = '';
    if (!problems.length) {
      box.textContent = 'Your design is complete.';
      box.className = 'wcd-check is-ok';
    } else {
      box.className = 'wcd-check is-warning';
      box.appendChild(document.createTextNode('Check these before you send your design:'));
      var ul = document.createElement('ul');
      problems.forEach(function (p) { var li = document.createElement('li'); li.textContent = p; ul.appendChild(li); });
      box.appendChild(ul);
    }
  }

  /* ---------- interaction ---------- */
  function onCell(l) {
    var p = pos(l);
    if (mode === 'letters') {
      selectedCell = l;
      var input = $('#wcd-letter');
      input.value = design.letters[p.row][p.col];
      $('#wcd-letter-pos').textContent = 'Row ' + (p.row + 1) + ', column ' + (p.col + 1);
      input.focus();
      input.select();
    } else if (mode === 'words') {
      if (selectedPhrase !== null) {
        var w = design.words[selectedPhrase], i = w.indexOf(l);
        if (i !== -1) w.splice(i, 1);
        else if (w.length >= MAX_PER_WORD) { flash('A phrase can light at most ' + MAX_PER_WORD + ' letters.'); return; }
        else w.push(l);
      }
      save();
    }
    render();
  }

  function moveCell(step) {
    var p = pos(selectedCell), index = p.row * SIZE + p.col + step;
    if (index < 0 || index >= LEDS) return;
    onCell(led(Math.floor(index / SIZE), index % SIZE));
  }

  function flash(text) {
    var el = $('#wcd-flash');
    el.textContent = text;
    clearTimeout(flash.timer);
    flash.timer = setTimeout(function () { el.textContent = ''; }, 4000);
  }

  function setMode(next) {
    mode = next;
    root.querySelectorAll('.wcd-tab').forEach(function (t) { t.setAttribute('aria-selected', String(t.dataset.mode === next)); });
    root.querySelectorAll('.wcd-panel').forEach(function (p) { p.hidden = p.dataset.mode !== next; });
    gridEl.dataset.mode = next;
    render();
  }

  function fileName() {
    return (design.name ? design.name.replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'word-clock' : 'word-clock') + '-design.json';
  }

  function download() {
    var blob = new Blob([JSON.stringify(exportDesign(), null, 2) + '\n'], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName();
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  // Browsers can't attach files to an email, so download first, then open an
  // email that asks to attach it.
  function email() {
    download();
    var subject = 'Word clock design' + (design.name ? ': ' + design.name : '');
    var body = 'Hello,\n\nAttached is my word clock design (' + fileName() + ').\n\n' +
      'Please attach the file you just downloaded before sending this email.\n';
    window.location.href = 'mailto:' + encodeURIComponent(ORDER_EMAIL) + '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
    flash('Your design was downloaded as ' + fileName() + '. Attach it to the email.');
  }

  function replaceDesign(next) {
    design = next;
    save();
    $('#wcd-name').value = design.name;
    selectedPhrase = selectedCell = null;
    render();
  }

  /* ---------- setup ---------- */
  function init() {
    root = document.getElementById('wcd');
    if (!root) return;
    gridEl = $('#wcd-grid');
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.dataset.led = led(r, c);
        b.setAttribute('aria-label', 'Row ' + (r + 1) + ', column ' + (c + 1));
        b.addEventListener('click', function (e) { onCell(parseInt(e.currentTarget.dataset.led, 10)); });
        gridEl.appendChild(b);
      }
    }
    root.querySelectorAll('.wcd-tab').forEach(function (t) {
      t.addEventListener('click', function () { setMode(t.dataset.mode); });
    });

    // Preview
    $('#wcd-time').addEventListener('input', render);
    var days = $('#wcd-days');
    [1, 2, 3, 4, 5, 6, 0].forEach(function (d) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'wcd-chip' + (d === currentDay ? ' is-active' : '');
      b.textContent = DAYS[d];
      b.addEventListener('click', function () {
        currentDay = d;
        days.querySelectorAll('button').forEach(function (x) { x.classList.toggle('is-active', x === b); });
        render();
      });
      days.appendChild(b);
    });
    root.querySelectorAll('[data-time]').forEach(function (b) {
      b.addEventListener('click', function () { $('#wcd-time').value = b.dataset.time; render(); });
    });

    // Letters
    var input = $('#wcd-letter');
    input.addEventListener('input', function () {
      if (selectedCell === null) return;
      var p = pos(selectedCell);
      var value = input.value.toUpperCase();
      var chars = Array.from(value);
      var last = chars.length ? chars[chars.length - 1] : '';
      if (chars.length === 1 && APOSTROPHES.indexOf(last) !== -1) {
        // An apostrophe joins the previous square's letter: O + ' = O'.
        var index = p.row * SIZE + p.col - 1;
        var prev = index >= 0 ? design.letters[Math.floor(index / SIZE)] : null;
        if (prev && prev[index % SIZE]) {
          prev[index % SIZE] = cleanLetter(prev[index % SIZE] + "'");
          save();
        }
        input.value = design.letters[p.row][p.col];
        input.select();
        render();
        return;
      }
      design.letters[p.row][p.col] = chars.length === 2 && APOSTROPHES.indexOf(last) !== -1 ? cleanLetter(value) : cleanLetter(last);
      save();
      if (chars.length) moveCell(1); else render();
    });
    input.addEventListener('keydown', function (e) {
      if (selectedCell === null) return;
      var steps = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: SIZE, ArrowUp: -SIZE };
      if (steps[e.key]) { moveCell(steps[e.key]); e.preventDefault(); }
    });

    // Words
    $('#wcd-rule').addEventListener('change', function (e) {
      if (RULES[e.target.value] === undefined) return;
      design.nextHour = nextHourFrom(RULES[e.target.value]);
      save();
      render();
    });
    $('#wcd-clear-phrase').addEventListener('click', function () {
      if (selectedPhrase === null) return;
      design.words[selectedPhrase] = [];
      save();
      render();
    });

    // Save & send
    var name = $('#wcd-name');
    name.value = design.name;
    name.addEventListener('input', function () { design.name = name.value; save(); });
    $('#wcd-download').addEventListener('click', download);
    $('#wcd-email').addEventListener('click', email);
    $('#wcd-open').addEventListener('click', function () { $('#wcd-file').click(); });
    $('#wcd-file').addEventListener('change', function (e) {
      var file = e.target.files[0];
      if (!file) return;
      file.text().then(function (text) {
        replaceDesign(importDesign(JSON.parse(text)));
        flash('Design opened.');
      }).catch(function (err) { flash(err.message); });
      e.target.value = '';
    });
    root.querySelectorAll('[data-example]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (confirm('Start from the ' + b.textContent + ' letter grid? Your current design is replaced.')) {
          replaceDesign(exampleDesign(b.dataset.example));
          syncRule();
        }
      });
    });
    $('#wcd-start-empty').addEventListener('click', function () {
      if (confirm('Start again with an empty grid? Your current design is replaced.')) { replaceDesign(emptyDesign()); syncRule(); }
    });

    syncRule();
    setMode('preview');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
