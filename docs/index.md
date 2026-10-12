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
letter grid. Below are some examples; you can also
[design your own letter grid](design-your-own.html).

<div class="lang-tabs">
  <input type="radio" name="lang-tabs" id="tab-en" checked>
  <input type="radio" name="lang-tabs" id="tab-nl">
  <input type="radio" name="lang-tabs" id="tab-ko">
  <div class="tab-bar">
    <label for="tab-en">English</label>
    <label for="tab-nl">Nederlands</label>
    <label for="tab-ko" lang="ko">한국어</label>
  </div>

<div class="tab-panel" id="panel-en" markdown="1">

<!-- Placeholder: replace with ![An English letter grid ...]({{ '/images/example-english.png' | relative_url }}){: .grid-image } -->
<div class="grid-image image-placeholder">Image of the English letter grid follows</div>

| Time | The clock shows |
| --- | --- |
| 3:00 | **IT IS THREE O'CLOCK** |
| 6:05 | **IT IS FIVE PAST SIX** |
| 7:15 | **IT IS QUARTER PAST SEVEN** |
| 4:20 | **IT IS TWENTY PAST FOUR** |
| 4:30 | **IT IS HALF PAST FOUR** |
| 4:40 | **IT IS TWENTY TO FIVE** |
| 4:43 | **IT IS TWENTY TO FIVE** and three dots |
| 9:45 | **IT IS QUARTER TO TEN** |

</div>

<div class="tab-panel" id="panel-nl" markdown="1">

![A Dutch letter grid with the words for the time, the weekday letters and four minute dots]({{ '/images/example-dutch.png' | relative_url }}){: .grid-image }

| Time | The clock shows |
| --- | --- |
| 3:00 | **HET IS DRIE UUR** |
| 7:15 | **HET IS KWART OVER ZEVEN** |
| 4:20 | **HET IS TIEN VOOR HALF VIJF** |
| 4:23 | **HET IS TIEN VOOR HALF VIJF** and three dots |
| 5:35 | **HET IS VIJF OVER HALF ZES** |
| 9:45 | **HET IS KWART VOOR TIEN** |

The bottom row reads M D W D V Z Z, Monday to Sunday: on a Wednesday, the
**W** lights up as well.

</div>

<div class="tab-panel" id="panel-ko" markdown="1">

<!-- Placeholder: replace with ![A Korean letter grid ...]({{ '/images/example-korean.png' | relative_url }}){: .grid-image } -->
<div class="grid-image image-placeholder">Image of the Korean letter grid follows</div>

Examples follow.

</div>
</div>

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
- Automatic brightness from the built-in light sensor, or a fixed brightness.
- Smooth fade between times.
- Any colour, set from the web page or Home Assistant.
- Time from an internet time server, or from Home Assistant if you use it,
  with automatic daylight saving time.
- Works without Home Assistant or any app; Home Assistant is optional.
- Settings are kept after a power cut.
