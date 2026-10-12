---
title: Design your own
nav_order: 7
---

# Design your own letter grid

The letter grids on the [home page](index.html#how-it-reads-the-time) are
examples. You can also design your own: in your language, with your own
words, or with a name or message hidden among the letters.

1. **Letters:** type the letters of your grid, 11 rows of 11.
2. **Words:** for every phrase, click the letters the clock lights: the
   opening words, the minutes in steps of five, the twelve hours and the days
   of the week. Choose what lights for 1 to 4 extra minutes too: any dots or
   letters you like. A phrase can use up to 24 letters, and you mark which
   minute phrases name the next hour (see below).
3. **Preview:** choose a time and day and check what the clock shows.
4. **Save & send:** download your design and email the file to
   Skyex Technologies with your order.

The designer starts with the English example grid. To start from another
example (Nederlands or 한국어) or an empty grid, go to **Save & send** and
choose it under *Start from an example*. Your design is
kept in this browser while you work on it. Download it to keep
a copy or to continue on another device.

### Which hour does a phrase name?

Languages differ in when they start naming the next hour. In Dutch, 4:20 is
"tien voor half **vijf**" (five), in English 4:20 is "twenty past **four**"
but 4:35 is "twenty-five to **five**", and Korean always names the current
hour. In the Words tab, choose your language's rule, or tick **next hour** for
each minute phrase yourself.

| Rule | Languages |
| --- | --- |
| From :15 | East German ("viertel fünf" at 4:15) |
| From :20 | Dutch, German |
| From :25 | Swedish, Norwegian, Danish ("fem i halv fem" at 4:25) |
| From :35 | English, French, Spanish, Italian |
| Never | Korean, Japanese, Chinese |

**Tips:**

- If the opening words change with the hour (Spanish "ES LA UNA" but "SON
  LAS DOS"), leave the opening words empty and include them in each hour.
- If an hour is written differently on the full hour (German "EIN UHR" but
  "FÜNF NACH EINS"), fill in the optional **Hour … at :00** phrases. Leave
  them empty to use the normal hour words.

<div id="wcd" class="wcd">
  <div class="wcd-tabs" role="tablist">
    <button type="button" class="wcd-tab" role="tab" data-mode="preview">Preview</button>
    <button type="button" class="wcd-tab" role="tab" data-mode="letters">Letters</button>
    <button type="button" class="wcd-tab" role="tab" data-mode="words">Words</button>
    <button type="button" class="wcd-tab" role="tab" data-mode="save">Save &amp; send</button>
  </div>

  <div class="wcd-body">
    <div class="wcd-grid" id="wcd-grid"></div>

    <div class="wcd-side">
      <div class="wcd-panel" data-mode="preview">
        <label class="wcd-label" for="wcd-time">Time</label>
        <input type="time" id="wcd-time" class="wcd-input" value="10:10">
        <div class="wcd-chips">
          <button type="button" class="wcd-chip" data-time="03:00">3:00</button>
          <button type="button" class="wcd-chip" data-time="07:15">7:15</button>
          <button type="button" class="wcd-chip" data-time="04:20">4:20</button>
          <button type="button" class="wcd-chip" data-time="05:35">5:35</button>
          <button type="button" class="wcd-chip" data-time="09:47">9:47</button>
        </div>
        <span class="wcd-label">Day</span>
        <div class="wcd-chips" id="wcd-days"></div>
        <span class="wcd-label">The clock shows</span>
        <p class="wcd-output" id="wcd-phrase"></p>
      </div>

      <div class="wcd-panel" data-mode="letters" hidden>
        <p>Click a square in the grid and type its letter. The cursor moves on to
        the next square; use the arrow keys to move around. Type <kbd>.</kbd> for
        a minute dot, and an apostrophe right after a letter to put both in one
        square, like the O' in O'CLOCK.</p>
        <label class="wcd-label" for="wcd-letter">Letter</label>
        <input type="text" id="wcd-letter" class="wcd-input wcd-letter" autocomplete="off" autocapitalize="characters">
        <p class="wcd-muted" id="wcd-letter-pos">Choose a square in the grid.</p>
      </div>

      <div class="wcd-panel" data-mode="words" hidden>
        <label class="wcd-label" for="wcd-rule">Next hour is named</label>
        <select id="wcd-rule" class="wcd-input">
          <option value="15">From :15 (East German)</option>
          <option value="20">From :20 (Dutch, German)</option>
          <option value="25">From :25 (Swedish, Norwegian, Danish)</option>
          <option value="35">From :35 (English, French, Spanish, Italian)</option>
          <option value="never">Never (Korean, Japanese, Chinese)</option>
          <option value="custom" disabled>Custom (ticked per phrase)</option>
        </select>
        <p class="wcd-muted" id="wcd-words-hint"></p>
        <div class="wcd-phrases" id="wcd-phrases"></div>
        <button type="button" class="btn" id="wcd-clear-phrase">Clear this phrase</button>
      </div>

      <div class="wcd-panel" data-mode="save" hidden>
        <label class="wcd-label" for="wcd-name">Name of your design</label>
        <input type="text" id="wcd-name" class="wcd-input" placeholder="For example: Kitchen clock">
        <div class="wcd-check" id="wcd-check"></div>
        <div class="wcd-buttons">
          <button type="button" class="btn btn-primary" id="wcd-email">Email your design</button>
          <button type="button" class="btn" id="wcd-download">Download design</button>
          <button type="button" class="btn" id="wcd-open">Open a design</button>
          <input type="file" id="wcd-file" accept=".json,application/json" hidden>
        </div>
        <p class="wcd-muted">"Email your design" downloads the file and opens an
        email; attach the downloaded file before you send it.</p>
        <span class="wcd-label">Start from an example</span>
        <div class="wcd-buttons">
          <button type="button" class="btn" data-example="english">English</button>
          <button type="button" class="btn" data-example="dutch">Nederlands</button>
          <button type="button" class="btn" data-example="korean" lang="ko">한국어</button>
          <button type="button" class="btn" id="wcd-start-empty">Empty grid</button>
        </div>
      </div>

      <p class="wcd-flash" id="wcd-flash" role="status"></p>
    </div>
  </div>
</div>

<script src="{{ '/assets/js/designer.js' | relative_url }}" defer></script>
