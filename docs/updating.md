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
2. **Firmware Update** shows whether a new version is available, for example
   *1.2.0 -> 1.3.0 available*. Click **Check for Firmware Update** to check
   right away.

   ![Firmware shows UPDATE AVAILABLE and Firmware Update shows 1.2.0 -> 1.3.0 available]({{ '/images/web-update-available.png' | relative_url }}){: .screenshot }

3. Click **Install Firmware Update**. **Firmware** shows *INSTALLING* while the
   clock downloads the new firmware, checks it and installs it; then it
   restarts. This takes about a minute; don't unplug it in the meantime.

   ![Firmware shows INSTALLING on the clock's web page]({{ '/images/web-update-installing.png' | relative_url }}){: .screenshot }

## From Home Assistant

The update appears under **Settings → Updates**, like other updates. Click
**Install**. The clock's device page also shows it, with the same buttons under
**Configuration**:

![The clock's device page in Home Assistant with Update available and 1.2.0 -> 1.3.0 available]({{ '/images/ha-update-available.png' | relative_url }}){: .screenshot-narrow }

Your settings and Wi-Fi are kept after an update, unless the release notes
say otherwise.

## Release notes

All versions and their changes are listed under
[Releases](https://github.com/SkyexTechnologies/word-clock-firmware/releases).
