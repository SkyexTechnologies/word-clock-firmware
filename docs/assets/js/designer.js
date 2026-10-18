/*
 * Word clock grid designer (design-your-own.md), in five steps: start grid,
 * letters, words, check, send.
 *
 * A design is a factory layout file (format 2, as site/layouts/*-layout.json in the
 * development repository) plus the letters of the grid. Word table rows:
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

  // Grid, layout files and the firmware's rules: assets/js/wordclock.js.
  var WC = window.WordClock;
  var SIZE = WC.SIZE, LEDS = WC.LEDS, MAX_PER_WORD = WC.MAX_PER_WORD, DOT = WC.DOT;
  var STORAGE_KEY = 'word-clock-design';
  // Address the "Email your design" button writes to (also shown in step 5).
  var ORDER_EMAIL = 'skyex.technologies@gmail.com';
  var APOSTROPHES = ["'", '’'];
  var STEPS = ['start', 'letters', 'words', 'check', 'send'];

  // The example grids are the layout files in site/layouts/ (the same files
  // the provisioning scripts use), loaded when chosen.
  var layoutsUrl = 'layouts/';

  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MINUTE_NAMES = ['on the hour', '5 past', '10 past', 'quarter past', '20 past', '25 past',
    'half past', '25 to', '20 to', 'quarter to', '10 to', '5 to'];

  var led = WC.led, pos = WC.pos, cleanLetter = WC.cleanLetter;
  function clock(h, m) { return h + ':' + String(m).padStart(2, '0'); }

  // Words step: phrases in groups. {group, label, hint, row, phrase (minute
  // phrases), optional, dots}
  var PHRASES = [{ group: 'Opening words (optional)', label: 'Opening words', hint: 'e.g. IT IS', row: 0, optional: true }];
  for (var m = 0; m < 12; m++) {
    PHRASES.push({ group: 'Minutes', label: 'x:' + String(m * 5).padStart(2, '0'), hint: MINUTE_NAMES[m],
      row: 1 + m, phrase: m, optional: m === 0 });
    if (m === 0) PHRASES[PHRASES.length - 1].hint = "on the hour, e.g. O'CLOCK (may stay empty)";
  }
  for (var h = 1; h <= 12; h++) {
    PHRASES.push({ group: 'Hours', label: h + " o'clock", row: 13 + (h % 12) });
  }
  for (h = 1; h <= 12; h++) {
    PHRASES.push({ group: 'Hours on the full hour (optional)', label: h + " o'clock at " + clock(h, 0),
      hint: 'only if different, like German EIN UHR', row: 37 + (h % 12), optional: true });
  }
  [1, 2, 3, 4, 5, 6, 0].forEach(function (d) { PHRASES.push({ group: 'Days (optional)', label: DAYS[d], row: 25 + d, optional: true }); });
  for (var n = 1; n <= 4; n++) {
    PHRASES.push({ group: 'Minute dots (optional)', label: n + ' extra minute' + (n > 1 ? 's' : ''),
      hint: 'e.g. ' + clock(4, 20 + n), row: 32 + n, dots: true, optional: true });
  }

  // Quick choices for the next-hour marks: first minute phrase that names the
  // next hour.
  var RULES = { '15': 3, '20': 4, '25': 5, '35': 7, never: 12 };

  var nextHourFrom = WC.nextHourFrom;

  function emptyDesign() {
    return { name: '', customer: '', email: '', order: '', layoutRevision: 1, nextHour: nextHourFrom(RULES['35']),
      letters: WC.blankLetters(), words: WC.blankRows() };
  }

  function loadExample(key) {
    return WC.loadLayout(layoutsUrl, key).then(function (data) {
      var d = importDesign(data);
      d.name = '';
      return d;
    });
  }

  /* ---------- import and export ---------- */

  // A design file: the grid (see WordClock.readLayout) plus the user's
  // details and the layout revision.
  function importDesign(data) {
    var d = WC.readLayout(data);
    d.customer = typeof data.customer_name === 'string' ? data.customer_name : '';
    d.order = typeof data.order_number === 'string' ? data.order_number : '';
    d.email = typeof data.customer_email === 'string' ? data.customer_email : '';
    d.layoutRevision = typeof data.layout_revision === 'number' && data.layout_revision > 0 ? data.layout_revision : 1;
    return d;
  }

  function exportDesign() {
    var rows = design.words.map(function (w) { return w.slice().sort(function (a, b) { return a - b; }); });
    var anyDay = rows.slice(25, 32).some(function (w) { return w.length; });
    var anyMinutes = rows.slice(33, 37).some(function (w) { return w.length; });
    return {
      version: 2,
      hardware_revision: 1,
      layout_revision: design.layoutRevision,
      indications: { it_is: rows[0].length > 0, minutes: anyMinutes, weekdays: anyDay },
      next_hour: design.nextHour.slice(),
      words: rows,
      name: design.name,
      customer_name: design.customer,
      customer_email: design.email,
      order_number: design.order,
      // Squares lit as minute dots without a letter of their own get a ".",
      // so the DXF generator engraves a dot there.
      letters: design.letters.map(function (row, r) {
        return row.map(function (c, col) { return c || (isMinuteDot(led(r, col)) ? DOT : ''); });
      })
    };
  }

  // The download in the layout of site/layouts/*-layout.json: one line per
  // setting, word row and letter row.
  function formatDesign(d) {
    function list(a) { return '[' + a.map(function (v) { return JSON.stringify(v); }).join(', ') + ']'; }
    function rows(a) { return '[\n' + a.map(function (r) { return '    ' + list(r); }).join(',\n') + '\n  ]'; }
    var i = d.indications;
    return '{\n' + [
      '"version": ' + d.version,
      '"hardware_revision": ' + d.hardware_revision,
      '"layout_revision": ' + d.layout_revision,
      '"indications": {"it_is": ' + i.it_is + ', "minutes": ' + i.minutes + ', "weekdays": ' + i.weekdays + '}',
      '"next_hour": ' + list(d.next_hour),
      '"words": ' + rows(d.words),
      '"name": ' + JSON.stringify(d.name)
    ].concat(d.customer_name ? ['"customer_name": ' + JSON.stringify(d.customer_name)] : [],
      d.customer_email ? ['"customer_email": ' + JSON.stringify(d.customer_email)] : [],
      d.order_number ? ['"order_number": ' + JSON.stringify(d.order_number)] : [], [
      '"letters": ' + rows(d.letters)
    ]).map(function (line) { return '  ' + line; }).join(',\n') + '\n}\n';
  }

  function isMinuteDot(l) {
    return design.words.slice(33, 37).some(function (w) { return w.indexOf(l) !== -1; });
  }

  /* ---------- layout revision ---------- */
  // A design opened from a file is a correction of something already sent:
  // its first change raises the layout revision by one. New designs stay at 1.
  var openedRevision = null;

  function changed() {
    if (openedRevision !== null && design.layoutRevision <= openedRevision) {
      design.layoutRevision = openedRevision + 1;
      flash('Layout revision ' + design.layoutRevision + ': this is a new version of your design.');
    }
    save();
  }

  /* ---------- storage (convenience only; the download is the real copy) ---------- */
  function save() {
    edited = true;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(exportDesign())); } catch (e) { /* private mode */ }
  }
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? importDesign(JSON.parse(raw)) : null;
    } catch (e) { return null; }
  }

  var lastExample = '';
  var stored = load();
  var design = stored || emptyDesign();
  var edited = !!stored;
  var step = 'start', selectedPhrase = null, selectedCell = null, currentDay = 3;
  var root, gridEl;

  /* ---------- clock logic (same rules as the firmware) ---------- */
  function rowsFor(hour, minute) { return WC.rowsFor(design, hour, minute); }
  function litLeds(hour, minute, day) { return WC.litLeds(design, hour, minute, day); }
  function wordText(leds) { return WC.wordText(design, leds); }
  function timeText(hour, minute) { return WC.timeText(design, hour, minute); }

  /* ---------- rendering ---------- */
  function $(sel) { return root.querySelector(sel); }

  function previewTime() {
    var t = ($('#wcd-time').value || '09:47').split(':');
    return { hour: parseInt(t[0], 10) || 0, minute: parseInt(t[1], 10) || 0 };
  }

  function render() {
    var lit = new Set(), inPhrase = new Set(), used = new Set();
    var now = new Date();
    if (step === 'start') lit = litLeds(now.getHours(), now.getMinutes(), now.getDay());
    if (step === 'check') {
      var t = previewTime();
      lit = litLeds(t.hour, t.minute, currentDay);
    }
    if (step === 'words') {
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
      if (step === 'words') {
        if (inPhrase.has(l)) cell.classList.add('is-selected');
        else if (used.has(l)) cell.classList.add('is-used');
      }
      if (step === 'letters' && selectedCell === l) cell.classList.add('is-selected');
    });
    if (step === 'start') {
      $('#wcd-start-time').textContent = clock(now.getHours(), now.getMinutes());
      $('#wcd-start-shows').textContent = timeText(now.getHours(), now.getMinutes());
    }
    if (step === 'words') renderPhraseList();
    if (step === 'check') { $('#wcd-phrase').textContent = timeText(previewTime().hour, previewTime().minute); renderCheck('#wcd-check'); }
    if (step === 'send') {
      renderCheck('#wcd-send-check');
      $('#wcd-revision').textContent = design.layoutRevision;
    }
  }

  function renderPhraseList() {
    var list = $('#wcd-phrases');
    list.innerHTML = '';
    var group = null;
    PHRASES.forEach(function (ph) {
      if (ph.group !== group) {
        group = ph.group;
        var heading = document.createElement('div');
        heading.className = 'wcd-group';
        heading.textContent = group;
        list.appendChild(heading);
      }
      var leds = design.words[ph.row];
      var item = document.createElement('div');
      item.className = 'wcd-phrase' + (ph.row === selectedPhrase ? ' is-active' : '') + (ph.optional ? ' is-optional' : '');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'wcd-phrase-main';
      b.innerHTML = '<span class="wcd-phrase-label"></span><span class="wcd-phrase-count"></span><span class="wcd-phrase-text"></span>';
      b.children[0].textContent = ph.label + (ph.hint ? ' · ' + ph.hint : '');
      b.children[1].textContent = leds.length + '/' + MAX_PER_WORD;
      b.children[2].textContent = ph.dots ? (leds.length ? leds.length + ' lit' : '—')
        : wordText(leds) || (ph.optional ? 'empty' : '—');
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
          changed();
          render();
        });
        label.appendChild(box);
        label.appendChild(document.createTextNode(' next hour'));
        label.title = 'Tick when this phrase names the coming hour, like "twenty-five to FIVE" at 4:35';
        item.appendChild(label);
      }
      list.appendChild(item);
    });
    var current = PHRASES.filter(function (p) { return p.row === selectedPhrase; })[0];
    $('#wcd-words-hint').textContent = current
      ? 'Now click the letters for "' + current.label + '" in the grid. Click a letter again to remove it.'
      : 'Choose a phrase from the list, then click its letters in the grid.';
  }

  function syncRule() {
    var match = 'custom';
    Object.keys(RULES).forEach(function (k) {
      if (nextHourFrom(RULES[k]).every(function (v, i) { return i === 0 || v === design.nextHour[i]; })) match = k;
    });
    $('#wcd-rule').value = match;
  }

  function problems() {
    var list = [];
    PHRASES.forEach(function (ph) {
      if (!ph.optional && ph.row >= 1 && ph.row <= 24 && !design.words[ph.row].length) list.push(ph.label + ' has no letters yet.');
    });
    var dotRows = design.words.slice(33, 37).filter(function (w) { return w.length; }).length;
    if (dotRows && dotRows < 4) list.push('Only ' + dotRows + ' of the 4 minute-dot phrases have dots (fill in all 4, or none).');
    var dayRows = design.words.slice(25, 32).filter(function (w) { return w.length; }).length;
    if (dayRows && dayRows < 7) list.push('Only ' + dayRows + ' of the 7 days have letters (fill in all 7, or none).');
    return list;
  }

  // Languages switch to the next hour once and keep it until the full hour.
  // Ticks that aren't one block up to x:55 are allowed but probably a mistake.
  function hourRuleWarning() {
    var ticked = [];
    for (var i = 1; i < 12; i++) if (design.nextHour[i]) ticked.push(i);
    if (!ticked.length) return null;
    var block = true;
    for (i = ticked[0]; i < 12; i++) if (!design.nextHour[i]) block = false;
    if (block) return null;
    var names = ticked.map(function (i) { return 'x:' + String(i * 5).padStart(2, '0'); });
    var list = names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] : names[0];
    return 'Next hour is ticked for ' + list + ', but not for every phrase after it. Languages usually ' +
      'switch to the next hour once and keep saying it until the full hour. Check in step 4 that the ' +
      'clock says the right hour.';
  }

  function renderCheck(sel) {
    var found = problems(), warning = hourRuleWarning(), box = $(sel);
    box.innerHTML = '';
    if (!found.length) {
      var extras = [['opening words', design.words[0].length], ['weekdays', design.words.slice(25, 32).some(function (w) { return w.length; })],
        ['minute dots', design.words.slice(33, 37).some(function (w) { return w.length; })]];
      var without = extras.filter(function (e) { return !e[1]; }).map(function (e) { return e[0]; });
      box.textContent = 'Your design is complete.' + (without.length ? ' It has no ' + without.join(' and ') + ' (optional).' : '');
      box.className = 'wcd-check ' + (warning ? 'is-warning' : 'is-ok');
    } else {
      box.className = 'wcd-check is-warning';
      box.appendChild(document.createTextNode('Still to do (step 3, Words):'));
      var ul = document.createElement('ul');
      found.forEach(function (p) { var li = document.createElement('li'); li.textContent = p; ul.appendChild(li); });
      box.appendChild(ul);
    }
    if (warning) {
      var note = document.createElement('p');
      note.className = 'wcd-check-note';
      note.textContent = warning;
      box.appendChild(note);
    }
  }


  /* ---------- interaction ---------- */
  function onCell(l) {
    var p = pos(l);
    if (step === 'letters') {
      selectedCell = l;
      var input = $('#wcd-letter');
      input.value = design.letters[p.row][p.col];
      $('#wcd-letter-pos').textContent = 'Row ' + (p.row + 1) + ', column ' + (p.col + 1);
      input.focus();
      input.select();
    } else if (step === 'words') {
      if (selectedPhrase === null) { flash('First choose a phrase from the list.'); return; }
      var w = design.words[selectedPhrase], i = w.indexOf(l);
      if (i !== -1) w.splice(i, 1);
      else if (w.length >= MAX_PER_WORD) { flash('A phrase can light at most ' + MAX_PER_WORD + ' letters.'); return; }
      else w.push(l);
      changed();
    }
    render();
  }

  function moveCell(delta) {
    var p = pos(selectedCell), index = p.row * SIZE + p.col + delta;
    if (index < 0 || index >= LEDS) return;
    onCell(led(Math.floor(index / SIZE), index % SIZE));
  }

  function flash(text) {
    var el = $('#wcd-flash');
    el.textContent = text;
    clearTimeout(flash.timer);
    flash.timer = setTimeout(function () { el.textContent = ''; }, 4000);
  }

  function setStep(next) {
    step = next;
    var index = STEPS.indexOf(next);
    root.querySelectorAll('.wcd-step').forEach(function (s) {
      var i = STEPS.indexOf(s.dataset.step);
      s.setAttribute('aria-current', i === index ? 'step' : 'false');
      s.classList.toggle('is-done', i < index);
    });
    root.querySelectorAll('.wcd-panel').forEach(function (p) { p.hidden = p.dataset.step !== next; });
    gridEl.dataset.mode = next;
    if (next === 'send') { $('#wcd-confirm').checked = false; $('#wcd-attach-now').hidden = true; updateSendButtons(); }
    render();
  }

  function slug(text) { return text.replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase(); }

  function fileName() {
    return (design.order ? 'order-' + slug(design.order) + '-' : '') + 'word-clock-design-r' + design.layoutRevision + '.json';
  }

  // Download and email only with the user's details, and once the
  // user confirms the design is final.
  function validEmail(text) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text); }

  function missingDetail() {
    if (!design.customer) return ['#wcd-customer', 'Fill in your name first.'];
    if (!validEmail(design.email)) return ['#wcd-email-address', 'Fill in a valid email address first.'];
    if (!design.order) return ['#wcd-order', 'Fill in your order number first.'];
    return null;
  }

  function confirmed() {
    var missing = missingDetail();
    if (missing) { flash(missing[1]); $(missing[0]).focus(); return false; }
    if ($('#wcd-confirm').checked) return true;
    flash('First tick the box to confirm your design is final.');
    return false;
  }

  function updateSendButtons() {
    var ok = !missingDetail() && $('#wcd-confirm').checked;
    $('#wcd-email').disabled = !ok;
    $('#wcd-download').disabled = !ok;
  }

  function download() {
    var blob = new Blob([formatDesign(exportDesign())], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName();
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Keep the file available long enough for slow downloads.
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 60000);
  }

  // Open the email through a link of its own, after the download has started:
  // navigating the page to a mailto: link right away cancels the download in
  // some browsers (Safari).
  function openEmail(href) {
    var a = document.createElement('a');
    a.href = href;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // Browsers can't attach files to an email, so download first, then open an
  // email that asks to attach it.
  function email() {
    if (!confirmed()) return;
    download();
    var subject = 'Word clock design' + (design.order ? ', order ' + design.order : '') +
      (design.customer ? ', ' + design.customer : '');
    var body = 'Hello,\n\nAttached is my word clock design.\n\n' +
      (design.customer ? 'Name: ' + design.customer + '\n' : '') +
      (design.email ? 'Email: ' + design.email + '\n' : '') +
      (design.order ? 'Order number: ' + design.order + '\n' : '') +
      'Layout revision: ' + design.layoutRevision + '\n' +
      'File: ' + fileName() + '\n\n' +
      'I have checked the design and understand it can\'t be changed after sending.\n\n' +
      '(Please attach the file you just downloaded before sending this email.)\n';
    var href = 'mailto:' + encodeURIComponent(ORDER_EMAIL) + '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
    setTimeout(function () { openEmail(href); }, 1000);
    var note = $('#wcd-attach-now');
    note.textContent = '';
    var strong = document.createElement('strong');
    strong.textContent = 'Now attach ' + fileName() + ' to the email.';
    note.appendChild(strong);
    note.appendChild(document.createTextNode(' It was just saved to your Downloads folder. ' +
      'Without it we can\'t make your clock. '));
    var again = document.createElement('a');
    again.href = href;
    again.textContent = 'Open the email again';
    note.appendChild(again);
    note.hidden = false;
  }

  // The set_word_layout action for Home Assistant (Developer tools > Actions,
  // YAML mode). hardware_revision 0 keeps the clock's own board revision.
  function homeAssistantAction() {
    var d = exportDesign(), flat = [];
    d.words.forEach(function (w) {
      for (var i = 0; i < MAX_PER_WORD; i++) flat.push(i < w.length ? w[i] : -1);
    });
    var mask = d.next_hour.reduce(function (m, v, i) { return v ? m | (1 << i) : m; }, 0);
    return 'action: esphome.word_clock_xxxxxx_set_word_layout\n' +
      'data:\n' +
      '  flat_layout: [' + flat.join(', ') + ']\n' +
      '  hardware_revision: 0\n' +
      '  has_it_is: ' + d.indications.it_is + '\n' +
      '  has_minutes: ' + d.indications.minutes + '\n' +
      '  has_weekdays: ' + d.indications.weekdays + '\n' +
      '  next_hour_mask: ' + mask + '\n' +
      '  layout_revision: ' + d.layout_revision + '\n';
  }

  function copyHomeAssistant() {
    var text = homeAssistantAction(), box = $('#wcd-ha-text');
    box.value = text;
    box.hidden = false;
    var done = function () { flash('Copied. Paste it in Home Assistant and replace xxxxxx with your clock\'s code.'); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { box.select(); flash('Select the text below and copy it.'); });
    } else {
      box.select();
      flash('Select the text below and copy it.');
    }
  }

  // Picture of the clock face at the time and day chosen in step 4.
  function downloadPicture() {
    var SIZE_PX = 880, PAD = 20, GAP = 4;
    var cell = (SIZE_PX - 2 * PAD - (SIZE - 1) * GAP) / SIZE;
    var t = previewTime(), lit = litLeds(t.hour, t.minute, currentDay);
    var minuteLeds = new Set();
    design.words.slice(33, 37).forEach(function (w) { w.forEach(function (l) { minuteLeds.add(l); }); });
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = SIZE_PX;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0b0b0d';
    ctx.fillRect(0, 0, SIZE_PX, SIZE_PX);
    var fontSize = Math.round(cell * 0.42);
    ctx.font = '600 ' + fontSize + 'px Inter, system-ui, -apple-system, "Hiragino Sans", "Apple SD Gothic Neo", "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        var l = led(r, c), on = lit.has(l);
        var ch = design.letters[r][c] || (minuteLeds.has(l) ? DOT : '');
        var x = PAD + c * (cell + GAP) + cell / 2, y = PAD + r * (cell + GAP) + cell / 2;
        ctx.fillStyle = on ? '#ffffff' : '#3a3b40';
        ctx.shadowColor = on ? 'rgba(255, 255, 255, 0.7)' : 'transparent';
        ctx.shadowBlur = on ? 16 : 0;
        if (ch === DOT) {
          ctx.beginPath();
          ctx.arc(x, y, fontSize * 0.15, 0, 2 * Math.PI);
          ctx.fill();
        } else if (ch) {
          ctx.fillText(ch, x, y);
        }
      }
    }
    var a = document.createElement('a');
    a.href = canvas.toDataURL('image/jpeg', 0.92);
    a.download = 'example-' + (lastExample || 'design') + '-' + String(t.hour).padStart(2, '0') + String(t.minute).padStart(2, '0') + '.jpg';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function replaceDesign(next) {
    // Keep the user's name and order number when switching grids.
    next.customer = next.customer || design.customer;
    next.order = next.order || design.order;
    next.email = next.email || design.email;
    design = next;
    save();
    edited = false;
    selectedPhrase = selectedCell = null;
    syncRule();
    render();
  }

  /* ---------- setup ---------- */
  function init() {
    root = document.getElementById('wcd');
    if (!root) return;
    if (root.dataset.layouts) layoutsUrl = root.dataset.layouts;
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
    root.querySelectorAll('.wcd-step').forEach(function (s) {
      s.addEventListener('click', function () { setStep(s.dataset.step); });
    });
    root.querySelectorAll('[data-go]').forEach(function (b) {
      b.addEventListener('click', function () {
        setStep(STEPS[STEPS.indexOf(step) + (b.dataset.go === 'next' ? 1 : -1)]);
        root.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Step 1: start grid
    root.querySelectorAll('[data-example]').forEach(function (b) {
      b.addEventListener('click', function () {
        var key = b.dataset.example;
        if (edited && !confirm('Start from this grid? Your current design is replaced.')) return;
        (key === 'empty' ? Promise.resolve(emptyDesign()) : loadExample(key)).then(function (next) {
          replaceDesign(next);
          lastExample = key;
          openedRevision = null;
          flash(key === 'empty' ? 'Empty grid loaded. Continue with step 2.' : 'Grid loaded. Continue with step 2, or change it as you like.');
        }).catch(function (err) { flash(err.message); });
      });
    });
    $('#wcd-open').addEventListener('click', function () { $('#wcd-file').click(); });
    $('#wcd-file').addEventListener('change', function (e) {
      var file = e.target.files[0];
      if (!file) return;
      file.text().then(function (text) {
        replaceDesign(importDesign(JSON.parse(text)));
        edited = true;
        openedRevision = design.layoutRevision;
        flash('Design opened.');
      }).catch(function (err) { flash(err.message); });
      e.target.value = '';
    });

    // Step 2: letters
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
          changed();
        }
        input.value = design.letters[p.row][p.col];
        input.select();
        render();
        return;
      }
      design.letters[p.row][p.col] = chars.length === 2 && APOSTROPHES.indexOf(last) !== -1 ? cleanLetter(value) : cleanLetter(last);
      changed();
      if (chars.length) moveCell(1); else render();
    });
    input.addEventListener('keydown', function (e) {
      if (selectedCell === null) return;
      var moves = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: SIZE, ArrowUp: -SIZE };
      if (moves[e.key]) { moveCell(moves[e.key]); e.preventDefault(); }
    });

    // Step 3: words
    $('#wcd-rule').addEventListener('change', function (e) {
      if (RULES[e.target.value] === undefined) return;
      design.nextHour = nextHourFrom(RULES[e.target.value]);
      changed();
      render();
    });
    $('#wcd-clear-phrase').addEventListener('click', function () {
      if (selectedPhrase === null) return;
      design.words[selectedPhrase] = [];
      changed();
      render();
    });

    // Step 4: check
    $('#wcd-time').addEventListener('input', render);
    $('#wcd-picture').addEventListener('click', function () {
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(downloadPicture);
    });
    var days = $('#wcd-days');
    [1, 2, 3, 4, 5, 6, 0].forEach(function (d) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'wcd-chip' + (d === currentDay ? ' is-active' : '');
      b.textContent = DAYS[d].slice(0, 3);
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

    // Step 5: send
    var customer = $('#wcd-customer'), emailAddress = $('#wcd-email-address'), order = $('#wcd-order');
    customer.value = design.customer;
    emailAddress.value = design.email;
    order.value = design.order;
    customer.addEventListener('input', function () { design.customer = customer.value.trim(); save(); updateSendButtons(); });
    emailAddress.addEventListener('input', function () { design.email = emailAddress.value.trim(); save(); updateSendButtons(); });
    order.addEventListener('input', function () { design.order = order.value.trim(); save(); updateSendButtons(); });
    $('#wcd-confirm').addEventListener('change', updateSendButtons);
    $('#wcd-download').addEventListener('click', function () { if (confirmed()) download(); });
    $('#wcd-ha-copy').addEventListener('click', copyHomeAssistant);
    $('#wcd-email').addEventListener('click', email);

    syncRule();
    setStep('start');
    // Step 1 shows the current time; follow the clock while it's open.
    setInterval(function () { if (step === 'start') render(); }, 10000);
    // First visit: start with the English example grid.
    if (!stored) {
      loadExample('english').then(function (next) {
        replaceDesign(next);
        lastExample = 'english';
      }).catch(function (err) { flash(err.message); });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
