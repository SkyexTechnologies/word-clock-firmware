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
| **Indication: It is** | Show or hide "HET IS". |
| **Indication: Minutes** | Show or hide the four minute dots. |
| **Indication: Week Days** | Show or hide the letter for the day of the week. |
| **Restart Word Clock** | Restarts the clock. |

Indications that your clock doesn't have are not shown.

## Time zones

The available regions are UTC, Amsterdam, London, New York, Chicago, Denver,
Los Angeles, Seoul and Sydney. Choose the one with the same time and daylight
saving rules as where you live.

## Information

| Item | What it shows |
| --- | --- |
| **Firmware Update** | The installed version and whether an update is available. See [Updating the firmware](updating.html). |
| **Hardware** | The hardware revision of your clock and which indications it has. |
