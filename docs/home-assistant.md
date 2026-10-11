---
title: Home Assistant
nav_order: 3
---

# Home Assistant

The clock uses the [ESPHome integration](https://www.home-assistant.io/integrations/esphome/),
which is built into Home Assistant.

## Adding the clock

{: .important }
> Add the clock within 15 minutes after plugging it in. Unplug it and plug it
> in again if that time has passed.

1. Make sure the clock is [connected to your Wi-Fi](getting-started.html).
2. Home Assistant usually finds the clock by itself. Go to **Settings →
   Devices & services**; the Word Clock appears under *Discovered*. Click
   **Add**.
3. If it doesn't appear, click **Add integration**, choose **ESPHome** and
   enter the clock's IP address.

When it adds the clock, Home Assistant gives it its own encryption key. From
then on only your Home Assistant can control the clock over the network. The
web page keeps working.

## Time and time zone

Home Assistant sends the clock the time and its time zone. Home Assistant
2026.3 or newer is needed for the time zone. With an older version, choose the
time zone on the clock under **06. Time Zone**.

## Removing the clock or giving it away

Remove the clock from Home Assistant within 15 minutes after plugging it in,
or do a [factory reset](troubleshooting.html#factory-reset). A factory reset
also removes the encryption key, so do one before you give the clock to
someone else.
