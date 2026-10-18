---
title: Design your own
nav_order: 7
---

# Design your own letter grid

The letter grids on the [home page](index.html#how-it-reads-the-time) are
examples. You can also design your own: in your language, with your own
words, or with a name or message hidden among the letters. The designer
below takes you through it in five steps. Your work is kept in this browser
while you design.

<div id="wcd" class="wcd" data-layouts="{{ '/layouts/' | relative_url }}">
  <ol class="wcd-steps">
    <li><button type="button" class="wcd-step" data-step="start"><span>1</span> Start</button></li>
    <li><button type="button" class="wcd-step" data-step="letters"><span>2</span> Letters</button></li>
    <li><button type="button" class="wcd-step" data-step="words"><span>3</span> Words</button></li>
    <li><button type="button" class="wcd-step" data-step="check"><span>4</span> Check</button></li>
    <li><button type="button" class="wcd-step" data-step="send"><span>5</span> Send</button></li>
  </ol>

  <div class="wcd-body">
    <div class="wcd-grid" id="wcd-grid"></div>

    <div class="wcd-side">
      <div class="wcd-panel" data-step="start">
        <h3 class="wcd-title">1. Choose a grid to start from</h3>
        <p>Pick the grid closest to what you want. You can change every letter
        and word in the next steps.</p>
        <div class="wcd-cards">
          <button type="button" class="wcd-card" data-example="english" lang="en"><strong>English</strong><span>IT IS TWENTY PAST FOUR</span></button>
          <button type="button" class="wcd-card" data-example="german" lang="de"><strong>Deutsch</strong><span>ES IST ZWANZIG NACH VIER</span></button>
          <button type="button" class="wcd-card" data-example="french" lang="fr"><strong>Français</strong><span>IL EST QUATRE HEURES VINGT</span></button>
          <button type="button" class="wcd-card" data-example="spanish" lang="es"><strong>Español</strong><span>SON LAS CUATRO Y VEINTE</span></button>
          <button type="button" class="wcd-card" data-example="portuguese" lang="pt"><strong>Português</strong><span>SÃO QUATRO E VINTE</span></button>
          <button type="button" class="wcd-card" data-example="italian" lang="it"><strong>Italiano</strong><span>SONO LE QUATTRO E VENTI</span></button>
          <button type="button" class="wcd-card" data-example="dutch" lang="nl"><strong>Nederlands</strong><span>HET IS TIEN VOOR HALF VIJF</span></button>
          <button type="button" class="wcd-card" data-example="frisian" lang="fy"><strong>Frysk</strong><span>IT IS TSIEN FOAR HEALWEI FIIF</span></button>
          <button type="button" class="wcd-card" data-example="swedish" lang="sv"><strong>Svenska</strong><span>KLOCKAN ÄR TJUGO ÖVER FYRA</span></button>
          <button type="button" class="wcd-card" data-example="norwegian" lang="nb"><strong>Norsk</strong><span>KLOKKEN ER TI PÅ HALV FEM</span></button>
          <button type="button" class="wcd-card" data-example="danish" lang="da"><strong>Dansk</strong><span>KLOKKEN ER TYVE OVER FIRE</span></button>
          <button type="button" class="wcd-card" data-example="turkish" lang="tr"><strong>Türkçe</strong><span>SAAT DÖRT YİRMİ</span></button>
          <button type="button" class="wcd-card" data-example="korean" lang="ko"><strong>한국어</strong><span>지금은 네 시 이십 분입니다</span></button>
          <button type="button" class="wcd-card" data-example="japanese" lang="ja"><strong>日本語</strong><span>今は四時二十分です</span></button>
          <button type="button" class="wcd-card" data-example="chinese" lang="zh"><strong>中文</strong><span>现在是四点二十分</span></button>
          <button type="button" class="wcd-card wcd-card-empty" data-example="empty"><strong>Empty grid</strong><span>Start from scratch</span></button>
        </div>
        <p class="wcd-muted">Right now (<span id="wcd-start-time"></span>) this grid shows: <strong id="wcd-start-shows"></strong></p>
        <p class="wcd-muted">Saved a design before? <button type="button" class="wcd-link" id="wcd-open">Open it</button>.
        <input type="file" id="wcd-file" accept=".json,application/json" hidden></p>
        <div class="wcd-nav"><span></span><button type="button" class="btn btn-primary" data-go="next">Next: letters</button></div>
      </div>

      <div class="wcd-panel" data-step="letters" hidden>
        <h3 class="wcd-title">2. Type the letters</h3>
        <p>Click a square in the grid and type its letter. The cursor moves on to
        the next square by itself; the arrow keys move it too.</p>
        <ul class="wcd-tips">
          <li>Type <kbd>.</kbd> for a minute dot.</li>
          <li>Type an apostrophe right after a letter to put both in one square,
          like the O' in O'CLOCK.</li>
          <li>Squares you don't need for the time can hold anything: a name, a
          message, random letters or a symbol from the row below.</li>
        </ul>
        <span class="wcd-label">Letter size on your clock</span>
        <div class="wcd-chips" role="group" aria-label="Letter size on your clock">
          <button type="button" class="wcd-chip" data-letter-size="10">Extra small (10 mm)</button>
          <button type="button" class="wcd-chip" data-letter-size="12">Small (12 mm)</button>
          <button type="button" class="wcd-chip" data-letter-size="14">Medium (14 mm)</button>
          <button type="button" class="wcd-chip" data-letter-size="16">Large (16 mm)</button>
        </div>
        <p class="wcd-muted">The grid shows the letters at this size, in the font of the front plate.</p>
        <p class="wcd-attach" id="wcd-size-warning" role="status" hidden></p>
        <label class="wcd-label" for="wcd-letter">Letter</label>
        <input type="text" id="wcd-letter" class="wcd-input wcd-letter" autocomplete="off" autocapitalize="characters">
        <p class="wcd-muted" id="wcd-letter-pos">Choose a square in the grid.</p>
        <span class="wcd-label">Symbols</span>
        <div class="wcd-chips wcd-symbols" id="wcd-symbols" role="group" aria-label="Symbols"></div>
        <p class="wcd-muted">Other symbols and emoji can't be engraved; these can.</p>
        <div class="wcd-nav"><button type="button" class="btn" data-go="back">Back</button><button type="button" class="btn btn-primary" data-go="next">Next: words</button></div>
      </div>

      <div class="wcd-panel" data-step="words" hidden>
        <h3 class="wcd-title">3. Choose the words</h3>
        <p>For each phrase in the list, click the letters the clock lights. Only
        the <strong>minutes</strong> and <strong>hours</strong> are needed. The
        opening words, the days and the minute dots are optional: leave them
        empty if your grid doesn't have them.</p>
        <label class="wcd-label" for="wcd-rule">When does your language say the next hour?</label>
        <select id="wcd-rule" class="wcd-input">
          <option value="35">From x:35: English, French, Spanish, Portuguese, Italian (4:35 = twenty-five to five)</option>
          <option value="25">From x:25: German, Swedish, Danish (4:25 = fünf vor halb fünf)</option>
          <option value="20">From x:20: Dutch, Frisian, Norwegian (4:20 = tien voor half vijf)</option>
          <option value="15">From x:15: East German (4:15 = viertel fünf)</option>
          <option value="never">Never: Korean, Japanese, Chinese, Turkish (4:40 = 네 시 사십 분, saat dört kırk)</option>
          <option value="custom" disabled>Your own choice (ticked per phrase below)</option>
        </select>
        <p class="wcd-muted" id="wcd-words-hint"></p>
        <div class="wcd-phrases" id="wcd-phrases"></div>
        <button type="button" class="btn" id="wcd-clear-phrase">Clear this phrase</button>
        <div class="wcd-nav"><button type="button" class="btn" data-go="back">Back</button><button type="button" class="btn btn-primary" data-go="next">Next: check</button></div>
      </div>

      <div class="wcd-panel" data-step="check" hidden>
        <h3 class="wcd-title">4. Check your clock</h3>
        <p>Try a few times and days and read what the clock says. You can also
        save a picture of the clock at that time.</p>
        <label class="wcd-label" for="wcd-time">Time</label>
        <input type="time" id="wcd-time" class="wcd-input" value="09:47">
        <div class="wcd-chips">
          <button type="button" class="wcd-chip" data-time="03:00">3:00</button>
          <button type="button" class="wcd-chip" data-time="07:15">7:15</button>
          <button type="button" class="wcd-chip" data-time="04:20">4:20</button>
          <button type="button" class="wcd-chip" data-time="04:35">4:35</button>
          <button type="button" class="wcd-chip" data-time="09:47">9:47</button>
          <button type="button" class="wcd-chip" data-time="12:55">12:55</button>
        </div>
        <span class="wcd-label">Day</span>
        <div class="wcd-chips" id="wcd-days"></div>
        <span class="wcd-label">The clock shows</span>
        <p class="wcd-output" id="wcd-phrase"></p>
        <div class="wcd-check" id="wcd-check"></div>
        <button type="button" class="btn" id="wcd-picture">Download picture (JPEG)</button>
        <div class="wcd-nav"><button type="button" class="btn" data-go="back">Back</button><button type="button" class="btn btn-primary" data-go="next">Next: send</button></div>
      </div>

      <div class="wcd-panel" data-step="send" hidden>
        <h3 class="wcd-title">5. Send your design</h3>
        <p>This is your front plate: 30 × 30 cm, with the letters at the size you
        chose. The black border of about 2.5 cm around the letters is part of the
        design.</p>
        <div class="wcd-attach" role="note">
          <strong>Use the details from your order.</strong> Fill in the same name
          and email address you used when ordering your clock, and its order
          number. If the order number doesn't match an order, your clock won't go
          into production. All three fields are required. See our
          <a href="privacy.html">privacy statement</a> for what we do with them.
        </div>
        <label class="wcd-label" for="wcd-customer">Your name</label>
        <input type="text" id="wcd-customer" class="wcd-input" autocomplete="name" required aria-required="true">
        <label class="wcd-label" for="wcd-email-address">Your email address</label>
        <input type="email" id="wcd-email-address" class="wcd-input" autocomplete="email" required aria-required="true">
        <label class="wcd-label" for="wcd-order">Order number</label>
        <input type="text" id="wcd-order" class="wcd-input" required aria-required="true" placeholder="From your order confirmation">
        <div class="wcd-check" id="wcd-send-check"></div>
        <p class="wcd-muted">Layout revision <strong id="wcd-revision"></strong>. It goes up by
        one when you open a design you sent before and change it.</p>
        <label class="wcd-confirm">
          <input type="checkbox" id="wcd-confirm">
          I have checked my design in step 4. I understand that it can't be changed
          after I send it.
        </label>
        <div class="wcd-attach" role="note">
          <strong>Attach your design to the email.</strong> Your design is not added
          to the email automatically. "Email your design" first saves it as a file
          (in your Downloads folder) and then opens an email to
          <a href="mailto:skyex.technologies@gmail.com">skyex.technologies@gmail.com</a>:
          attach that file before you send it, otherwise we can't make your clock.
          If no email opens, send the file to that address yourself and mention
          your name and order number in the email.
        </div>
        <div class="wcd-buttons">
          <button type="button" class="btn btn-primary" id="wcd-email" disabled>Email your design</button>
          <button type="button" class="btn" id="wcd-download" disabled>Download only</button>
        </div>
        <div class="wcd-attach is-strong" id="wcd-attach-now" role="alert" hidden></div>
        <details class="wcd-ha">
          <summary>Already have your clock? Apply a corrected design through Home Assistant</summary>
          <p>This changes which squares light up for each word. The letters on your
          clock stay the same, so use it only to fix a word that lights the wrong
          squares, a missing letter or the hour rule. Your clock must be added to
          Home Assistant. Without Home Assistant, click <strong>Download only</strong> and upload
          the file on the clock's own web page; see <a href="troubleshooting.html#changing-your-layout">Changing your layout</a>.</p>
          <button type="button" class="btn" id="wcd-ha-copy">Copy for Home Assistant</button>
          <textarea id="wcd-ha-text" class="wcd-input wcd-ha-text" rows="6" readonly hidden></textarea>
        </details>
        <div class="wcd-nav"><button type="button" class="btn" data-go="back">Back</button><span></span></div>
      </div>

      <p class="wcd-flash" id="wcd-flash" role="status"></p>
    </div>
  </div>
</div>

<script src="{{ '/assets/js/wordclock.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
<script src="{{ '/assets/js/designer.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>

## Help

### Why does a phrase say the next hour?

At 4:35 English says "twenty-five to **five**": the phrase is about the
*coming* hour. Languages switch at different moments: Dutch, Frisian and Norwegian already
at 4:20 ("tien voor half **vijf**"), German, Swedish and Danish at 4:25,
English and the Romance languages at 4:35, and Korean, Japanese, Chinese and
Turkish (which the Türkçe grid reads digitally: "saat dört kırk") never. In step 3, choose your language from the list and this is set
for you. For a different way of saying the time, tick **next hour** for each
minute phrase that names the coming hour.

### The words before the hour change with the hour

In Spanish, one o'clock is "ES LA UNA" but two o'clock is "SON LAS DOS". Leave
the **opening words** empty and put "ES LA" or "SON LAS" into each hour
instead, as the Español grid does. Português ("É UMA", "SÃO DUAS"), Italiano
("È L'UNA", "SONO LE DUE") and Français ("UNE HEURE", "DEUX HEURES") work the
same way.

### One hour is written differently on the full hour

German says "EIN UHR" at 1:00 but "FÜNF NACH EINS" at 1:05. For cases like
this, fill in the hour under **Hours on the full hour**. Leave those empty
when the hour is written the same way all the time.

### What do I have to fill in?

Only the minutes (from x:05) and the twelve hours. Everything else is
optional:

- **Opening words** such as IT IS: some grids show only the time.
- **Days**: leave all seven empty for a grid without a row of weekdays.
- **Minute dots**: leave all four empty for a clock that shows only the
  five-minute steps.
- **x:00 on the hour** (O'CLOCK) and **hours on the full hour**.

A clock without opening words, days or minute dots simply doesn't show them,
and its settings don't offer them either.

### How many letters can a phrase have?

Up to 24. The longest phrases in common languages, like English "TWENTY
FIVE PAST" (14) or Spanish "MENOS VEINTICINCO" (16), fit easily.
