---
title: Updating the firmware
nav_order: 5
---

# Updating the firmware

The clock checks for new firmware every 6 hours. It never installs an update
by itself: you decide when.

## From the clock's web page

1. Open the clock's web page (`http://<ip-address>`).
2. **Firmware Update** shows whether a new version is available. Click
   **Check for Firmware Update** to check right away.
3. Click **Install Firmware Update**. The clock downloads the new firmware,
   checks it, installs it and restarts. This takes about a minute; don't
   unplug it in the meantime.

## From Home Assistant

The update appears under **Settings → Updates**, like other updates. Click
**Install**.

Your settings and Wi-Fi are kept after an update, unless the release notes
say otherwise.

## Over USB (recovery)

If the clock no longer starts, install the firmware from this page over USB.
You need a computer with Chrome or Edge, and a USB-to-serial adapter.

<div class="install-box" markdown="1">
<esp-web-install-button manifest="{{ '/firmware/word-clock.manifest.json' | relative_url }}">
  <button slot="activate" class="btn btn-primary">Install over USB</button>
  <span slot="unsupported">Your browser can't install firmware. Use Chrome or Edge on a computer.</span>
  <span slot="not-allowed">Open this page over HTTPS to install firmware.</span>
</esp-web-install-button>
</div>

<script type="module" src="https://unpkg.com/esp-web-tools@10.4.0/dist/web/install-button.js?module"></script>

{: .warning }
> If the installer asks whether to erase the device, choose **not** to erase.
> Erasing removes the clock's factory data, and it can then no longer show the
> time.

## Release notes

All versions and their changes are listed under
[Releases](https://github.com/SkyexTechnologies/word-clock-firmware/releases).
