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

The five grids below are just examples. Letter grids are also available in
Español, Português, Italiano, Frysk, Svenska, Norsk, Dansk, 日本語 and 中文,
and you can [design your own letter grid](design-your-own.html), starting
from any of them or from an empty grid, so your clock can speak any language.

<div class="lang-tabs">
  <input type="radio" name="lang-tabs" id="tab-en" checked>
  <input type="radio" name="lang-tabs" id="tab-de">
  <input type="radio" name="lang-tabs" id="tab-fr">
  <input type="radio" name="lang-tabs" id="tab-nl">
  <input type="radio" name="lang-tabs" id="tab-ko">
  <div class="tab-bar">
    <label for="tab-en">English</label>
    <label for="tab-de" lang="de">Deutsch</label>
    <label for="tab-fr" lang="fr">Français</label>
    <label for="tab-nl" lang="nl">Nederlands</label>
    <label for="tab-ko" lang="ko">한국어</label>
  </div>

<div class="tab-panel" id="panel-en" markdown="1">

![An English letter grid showing IT IS QUARTER TO TEN, two minute dots and the W for Wednesday]({{ '/images/example-english.jpg' | relative_url }}){: .grid-image }
*9:47 on a Wednesday: IT IS QUARTER TO TEN, two dots for the two extra minutes, and the W.*

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

<div class="tab-panel" id="panel-de" markdown="1">

![A German letter grid showing ES IST VIERTEL VOR ZEHN, two minute dots and the M for Wednesday]({{ '/images/example-german.jpg' | relative_url }}){: .grid-image }
*9:47 on a Wednesday: ES IST VIERTEL VOR ZEHN, two dots for the two extra minutes, and the M (Mittwoch).*

| Time | The clock shows |
| --- | --- |
| 1:00 | **ES IST EIN UHR** |
| 3:00 | **ES IST DREI UHR** |
| 7:15 | **ES IST VIERTEL NACH SIEBEN** |
| 4:20 | **ES IST ZWANZIG NACH VIER** |
| 4:25 | **ES IST FÜNF VOR HALB FÜNF** |
| 4:30 | **ES IST HALB FÜNF** |
| 4:43 | **ES IST ZWANZIG VOR FÜNF** and three dots |
| 9:45 | **ES IST VIERTEL VOR ZEHN** |

</div>

<div class="tab-panel" id="panel-fr" markdown="1">

![A French letter grid showing IL EST DIX HEURES MOINS LE QUART, two minute dots and the M for Wednesday]({{ '/images/example-french.jpg' | relative_url }}){: .grid-image }
*9:47 on a Wednesday: IL EST DIX HEURES MOINS LE QUART, two dots for the two extra minutes, and the M (mercredi).*

| Time | The clock shows |
| --- | --- |
| 1:00 | **IL EST UNE HEURE** |
| 3:00 | **IL EST TROIS HEURES** |
| 7:15 | **IL EST SEPT HEURES ET QUART** |
| 4:20 | **IL EST QUATRE HEURES VINGT** |
| 4:30 | **IL EST QUATRE HEURES ET DEMIE** |
| 4:35 | **IL EST CINQ HEURES MOINS VINGT-CINQ** |
| 4:43 | **IL EST CINQ HEURES MOINS VINGT** and three dots |
| 9:45 | **IL EST DIX HEURES MOINS LE QUART** |

</div>

<div class="tab-panel" id="panel-nl" markdown="1">

![A Dutch letter grid showing HET IS KWART VOOR TIEN, two minute dots and the W for Wednesday]({{ '/images/example-dutch.jpg' | relative_url }}){: .grid-image }
*9:47 on a Wednesday: HET IS KWART VOOR TIEN, two dots for the two extra minutes, and the W.*

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

![A Korean letter grid showing 지금은 아홉 시 사십오 분입니다, two minute dots and 수 for Wednesday]({{ '/images/example-korean.jpg' | relative_url }}){: .grid-image }
*9:47 on a Wednesday: 지금은 아홉 시 사십오 분입니다, two dots for the two extra minutes, and 수.*

| Time | The clock shows |
| --- | --- |
| 3:00 | **지금은 세 시 정각입니다** |
| 7:15 | **지금은 일곱 시 십오 분입니다** |
| 4:20 | **지금은 네 시 이십 분입니다** |
| 4:40 | **지금은 네 시 사십 분입니다** |
| 4:43 | **지금은 네 시 사십 분입니다** and three dots |
| 12:55 | **지금은 열두 시 오십오 분입니다** |

The bottom row reads 월 화 수 목 금 토 일, Monday to Sunday.

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
