---
title: Updating the firmware
nav_order: 5
---

# Updating the firmware

The clock checks for new firmware every 6 hours. It never installs an update
by itself: you decide when.

## From the clock's web page

1. Open the clock's web page (`http://word-clock-xxxxxx.local`, see
   [Getting started](getting-started.html#3-open-the-clocks-web-page)).
2. **Firmware Update** shows whether a new version is available. Click
   **Check for Firmware Update** to check right away.
3. Click **Install Firmware Update**. The clock downloads the new firmware,
   checks it, installs it and restarts. This takes about a minute; don't
   unplug it in the meantime.

![Check for Firmware Update, Firmware status and Install Firmware Update on the clock's web page]({{ '/images/web-configuration.png' | relative_url }}){: .screenshot }

## From Home Assistant

The update appears under **Settings → Updates**, like other updates. Click
**Install**. The clock's device page also has the update status and the same
buttons under **Configuration**:

![The clock's Configuration card in Home Assistant with the firmware status and buttons]({{ '/images/ha-configuration.png' | relative_url }}){: .screenshot-narrow }

Your settings and Wi-Fi are kept after an update, unless the release notes
say otherwise.

## Release notes

All versions and their changes are listed under
[Releases](https://github.com/SkyexTechnologies/word-clock-firmware/releases).
