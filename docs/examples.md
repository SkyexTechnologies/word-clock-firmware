---
title: Examples
nav_order: 7
---

# Examples

A word clock can be much more than the time in English. A few ideas, each
shown as the clock would look. You can make all of them yourself in the
[designer](design-your-own.html).

<div class="wcx-gallery" data-layouts="{{ '/layouts/' | relative_url }}">

  <figure class="wcx">
    <div class="wcd wcl wcx-clock" data-layout="english-fun" data-time="17:20" data-day="5" data-colour="#ffb000">
      <div class="wcd-grid" role="img" aria-label="IT IS BEER O'CLOCK"></div>
    </div>
    <figcaption><strong>It's beer o'clock</strong>
    A fun phrase instead of the time, on Friday from 17:00 to 18:00. This grid
    also says COFFEE O'CLOCK and WINE O'CLOCK.</figcaption>
  </figure>

  <figure class="wcx">
    <div class="wcd wcl wcx-clock" data-layout="english" data-time="9:41" data-special="SKYEX">
      <div class="wcd-grid" role="img" aria-label="The time, with a name lit up"></div>
    </div>
    <figcaption><strong>A name on a birthday</strong>
    A special word hidden among the letters lights up all day on its dates,
    with a slow pulse.</figcaption>
  </figure>

  <figure class="wcx">
    <div class="wcd wcl wcx-clock" data-layout="english" data-time="20:30" data-symbol="0,10,❤" data-colour="#ff4d6d">
      <div class="wcd-grid" role="img" aria-label="IT IS HALF PAST EIGHT, with a heart"></div>
    </div>
    <figcaption><strong>A heart for someone</strong>
    Symbols such as <span class="wcx-symbols">❤︎ ★︎ ☻︎ ♪︎ ✈︎ ✿︎</span> fit in a square, as
    a special word or just hidden among the letters.</figcaption>
  </figure>

  <figure class="wcx">
    <div class="wcd wcl wcx-clock" data-layout="dutch" data-time="16:20">
      <div class="wcd-grid" role="img" aria-label="HET IS TIEN VOOR HALF VIJF"></div>
    </div>
    <figcaption><strong>Your own language</strong>
    Dutch says "tien voor half vijf" at 4:20. The clock follows the way your
    language tells the time.</figcaption>
  </figure>

  <figure class="wcx">
    <div class="wcd wcl wcx-clock" data-layout="limburgish" data-time="16:20" data-colour="#ffd166">
      <div class="wcd-grid" role="img" aria-label="HET IS TIEN VEUR HALF VIEF"></div>
    </div>
    <figcaption><strong>Or your dialect</strong>
    Limburgish, Drents, Zeeuws, Frisian: the time the way you say it at
    home.</figcaption>
  </figure>

  <figure class="wcx">
    <div class="wcd wcl wcx-clock" data-layout="japanese" data-time="7:15">
      <div class="wcd-grid" role="img" aria-label="Japanese: quarter past seven"></div>
    </div>
    <figcaption><strong>Other scripts</strong>
    Japanese, Korean and Chinese characters work just as well as
    letters.</figcaption>
  </figure>

  <figure class="wcx">
    <div class="wcd wcl wcx-clock" data-layout="english" data-time="15:00" data-size="10">
      <div class="wcd-grid" role="img" aria-label="IT IS THREE O'CLOCK in extra small letters"></div>
    </div>
    <figcaption><strong>Extra small letters</strong>
    10 mm high: calm and refined.</figcaption>
  </figure>

  <figure class="wcx">
    <div class="wcd wcl wcx-clock" data-layout="english" data-time="15:00" data-size="16">
      <div class="wcd-grid" role="img" aria-label="IT IS THREE O'CLOCK in large letters"></div>
    </div>
    <figcaption><strong>Large letters</strong>
    16 mm high: easy to read from across the room.</figcaption>
  </figure>

  <figure class="wcx">
    <div class="wcd wcl wcx-clock" data-layout="korean" data-time="10:30" data-colour="#4fc3f7">
      <div class="wcd-grid" role="img" aria-label="Korean: half past ten, in light blue"></div>
    </div>
    <figcaption><strong>Any colour</strong>
    Choose the colour on the clock's web page or in Home Assistant, and change
    it whenever you like.</figcaption>
  </figure>

</div>

Ready to make your own? Start in the [designer](design-your-own.html) from
any of the example grids, or from an empty one.

<script src="{{ '/assets/js/wordclock.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
<script src="{{ '/assets/js/examples.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
