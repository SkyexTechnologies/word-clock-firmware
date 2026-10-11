---
title: Home
layout: home
nav_order: 1
---

# Word Clock

The Skyex Technologies Word Clock tells the time in Dutch words, such as
**HET IS VIJF OVER HALF ZES**. Behind the letter grid, 121 LEDs light up the
words for the current time, the letter for the day of the week and up to four
minute dots.

The clock works on its own through a built-in web page, and connects to
[Home Assistant](https://www.home-assistant.io) for automations. It runs
[ESPHome](https://esphome.io) firmware, and you install new firmware with one
click.

## Where to start

| I want to… | Read |
| --- | --- |
| Set up a new clock | [Getting started](getting-started.html) |
| Connect it to Home Assistant | [Home Assistant](home-assistant.html) |
| Change the colour, brightness or time zone | [Settings](settings.html) |
| Install a firmware update | [Updating the firmware](updating.html) |
| Solve a problem | [Troubleshooting](troubleshooting.html) |

## Features

- Time in words to the nearest five minutes, with four minute dots for the
  minutes in between.
- Letter for the day of the week (Z M D W D V Z).
- Automatic brightness from the built-in light sensor, or a fixed brightness.
- Smooth fade between times.
- Any colour, set from the web page or Home Assistant.
- Time from Home Assistant or an internet time server, with automatic
  daylight saving time.
- Settings are kept after a power cut.
