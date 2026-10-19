---
title: Home
layout: home
nav_order: 1
---

# Word Clock

The Skyex Technologies Word Clock tells the time in words, in the language of
its letter grid. Behind the letter grid, 121 LEDs light up the
words for the current time, the letter for the day of the week and up to four
minute dots.

The clock works completely on its own: it gets the time from the internet,
and you change its settings on its built-in web page. If you use
[Home Assistant](https://www.home-assistant.io), you can optionally connect
the clock to it for automations. It runs [ESPHome](https://esphome.io)
firmware, and you install new firmware with one click.

## How it reads the time

The clock lights the words for the time in steps of five minutes. The four
dots in the corner add the minutes in between, one dot per minute, and a row
of letters shows the day of the week. The words depend on the language of the
letter grid.

Choose a language to see what the clock shows right now. These are example
grids: you can also [design your own letter grid](design-your-own.html),
starting from any of them or from an empty grid, so your clock can speak any
language. To try other times, use step 4 of the designer. The colour picker
only changes this picture; on your clock you set the colour on its web page
or in Home Assistant.

<div id="wcl" class="wcd wcl" data-layouts="{{ '/layouts/' | relative_url }}">
  <div class="wcd-chips wcl-langs" role="group" aria-label="Language of the letter grid">
    <button type="button" class="wcd-chip" data-lang="english" lang="en">English</button>
    <button type="button" class="wcd-chip" data-lang="english-fun" lang="en">English (fun)</button>
    <button type="button" class="wcd-chip" data-lang="german" lang="de">Deutsch</button>
    <button type="button" class="wcd-chip" data-lang="french" lang="fr">Français</button>
    <button type="button" class="wcd-chip" data-lang="spanish" lang="es">Español</button>
    <button type="button" class="wcd-chip" data-lang="portuguese" lang="pt">Português</button>
    <button type="button" class="wcd-chip" data-lang="italian" lang="it">Italiano</button>
    <button type="button" class="wcd-chip" data-lang="dutch" lang="nl">Nederlands</button>
    <button type="button" class="wcd-chip" data-lang="frisian" lang="fy">Frysk</button>
    <button type="button" class="wcd-chip" data-lang="limburgish" lang="li">Limburgs</button>
    <button type="button" class="wcd-chip" data-lang="drents" lang="drt">Drents</button>
    <button type="button" class="wcd-chip" data-lang="zeeuws" lang="zea">Zeeuws</button>
    <button type="button" class="wcd-chip" data-lang="swedish" lang="sv">Svenska</button>
    <button type="button" class="wcd-chip" data-lang="norwegian" lang="nb">Norsk</button>
    <button type="button" class="wcd-chip" data-lang="danish" lang="da">Dansk</button>
    <button type="button" class="wcd-chip" data-lang="turkish" lang="tr">Türkçe</button>
    <button type="button" class="wcd-chip" data-lang="korean" lang="ko">한국어</button>
    <button type="button" class="wcd-chip" data-lang="japanese" lang="ja">日本語</button>
    <button type="button" class="wcd-chip" data-lang="chinese" lang="zh">中文</button>
  </div>
  <div class="wcl-colour">
    <label for="wcl-colour">Colour</label>
    <input type="color" id="wcl-colour" value="#ffffff">
    <button type="button" class="wcl-link" id="wcl-colour-reset">White</button>
  </div>
  <div class="wcd-grid wcl-grid" id="wcl-grid" role="img" aria-label="The word clock at the current time"></div>
  <p class="wcl-says">Right now (<span id="wcl-time"></span>) it says: <strong id="wcl-text"></strong></p>
  <p class="wcl-fun" id="wcl-fun" role="status" hidden></p>
  <ul class="wcl-explain" id="wcl-explain"></ul>
</div>

<script src="{{ '/assets/js/wordclock.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
<script src="{{ '/assets/js/home-clock.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>

## Where to start

| I want to… | Read |
| --- | --- |
| Set up a new clock | [Getting started](getting-started.html) |
| Connect it to Home Assistant (optional) | [Home Assistant](home-assistant.html) |
| Change the colour, brightness or time zone | [Settings](settings.html) |
| Install a firmware update | [Updating the firmware](updating.html) |
| Solve a problem | [Troubleshooting](troubleshooting.html) |

## Features

- Time in words to the nearest five minutes, with four minute dots for the
  minutes in between.
- Letter for the day of the week.
- Special words: a hidden name or message that lights up on its own dates,
  such as a birthday.
- Fun phrases instead of the time at moments you choose, like IT IS BEER
  O'CLOCK on Friday afternoon.
- Automatic brightness from the built-in light sensor (if your clock has
  one), or a fixed brightness.
- Smooth transitions between times: fade, crossfade, typewriter or sweep.
- Any colour, set from the web page or Home Assistant.
- Time from an internet time server, or from Home Assistant if you use it,
  with automatic daylight saving time.
- Works without Home Assistant or any app; Home Assistant is optional.
- Settings are kept after a power cut.
