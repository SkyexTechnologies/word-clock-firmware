---
title: Settings
nav_order: 4
---

# Settings

You find the same settings on the clock's web page and in Home Assistant. They
are saved on the clock and kept after a power cut.

| Setting | What it does |
| --- | --- |
| **01. Word Clock** | Switch the clock on or off, and set its colour and brightness. |
| **02. Transition** | How long the fade between two times takes, from 0 to 10 seconds. |
| **03. Automatic Brightness** | On: the brightness follows the light in the room. Off: the clock uses the brightness set under *01. Word Clock*. |
| **04. Minimum Brightness** / **05. Maximum Brightness** | The range used by automatic brightness. |
| **06. Time Zone** | *Home Assistant (otherwise Amsterdam)* follows the time zone of Home Assistant, and uses Amsterdam time without Home Assistant. Choose another region if you live elsewhere. Daylight saving time is applied automatically. |
| **Indication: It is** | Show or hide the opening words, such as "IT IS". |
| **Indication: Minutes** | Show or hide the four minute dots. |
| **Indication: Week Days** | Show or hide the letter for the day of the week. |
| **Restart Word Clock** | Restarts the clock. |

Indications that your clock doesn't have are not shown.

![The settings on the clock's web page: 01. Word Clock to Indication: Week Days]({{ '/images/web-controls.png' | relative_url }}){: .screenshot }

In Home Assistant the same settings appear under **Controls** on the clock's
device page:

![The clock's controls in Home Assistant]({{ '/images/ha-controls.png' | relative_url }}){: .screenshot-narrow }

## Setting up automatic brightness

With **03. Automatic Brightness** on, the clock adjusts its brightness to the
light in the room. It is dimmest in the dark and brightest in bright light,
and fades smoothly in between. You choose both ends; the clock does the rest.

Use the web page on your phone, so you can watch the clock while you adjust
it. Each change shows on the clock within a second.

1. Check that **03. Automatic Brightness** is on.
2. **In the dark.** In the evening, switch off the lights so the room is as
   dark as it usually gets, and wait 15 seconds. Lower or raise
   **04. Minimum Brightness** until the words are easy to read but don't
   light up the room.
3. **In bright light.** During the day, when the room is at its brightest
   (or with all lights on), wait 15 seconds. Set **05. Maximum Brightness**
   so the time is easy to read without being glaring.

That's it. The clock measures the light every 15 seconds and fades to the new
brightness over about 10 seconds, so a light switched on or off doesn't make
it jump.

{: .note }
> - Too bright at night? Lower **04. Minimum Brightness**. Too dim during the
>   day? Raise **05. Maximum Brightness**.
> - The maximum can't be lower than the minimum: if you set one past the
>   other, the other follows.
> - With automatic brightness on, the clock ignores the brightness of
>   **01. Word Clock**. Switch **03. Automatic Brightness** off to set a fixed
>   brightness there instead.

## Time zones

The available regions are UTC, Amsterdam, London, New York, Chicago, Denver,
Los Angeles, Seoul and Sydney. Choose the one with the same time and daylight
saving rules as where you live.

![The 06. Time Zone list on the clock's web page]({{ '/images/web-time-zone.png' | relative_url }}){: .screenshot-narrow }

## Information

| Item | What it shows |
| --- | --- |
| **Firmware Update** | The installed version and whether an update is available. See [Updating the firmware](updating.html). |
| **Hardware** | The hardware revision of your clock, the version of its layout and which indications it has. |

![Firmware Update, Hardware and Layout Provisioned on the clock's web page]({{ '/images/web-diagnostic.png' | relative_url }}){: .screenshot }
