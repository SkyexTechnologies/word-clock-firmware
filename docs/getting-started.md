---
title: Getting started
nav_order: 2
---

# Getting started

## 1. Connect to Wi-Fi

1. Plug in the clock. Without Wi-Fi settings it starts its own Wi-Fi hotspot,
   named `word-clock-xxxxxx`. The last six characters are unique to your
   clock; note them, you need them in step 3.
2. Connect to that hotspot with your phone or laptop. A setup page opens
   automatically. If it doesn't, open `http://192.168.4.1` in a browser.
3. Pick your Wi-Fi network, enter the password and save. The clock connects
   to your network and the hotspot disappears.

{: .important }
> Setup is possible for 15 minutes after the clock is plugged in. After that
> the hotspot closes. Unplug the clock, plug it in again and you have another
> 15 minutes.

The clock only supports 2.4 GHz Wi-Fi.

## 2. Wait for the time

Once it is on your network, the clock gets the time from Home Assistant or
from an internet time server. Until it knows the time, a single LED walks
along all the LEDs. As soon as the time is known, the clock shows it in words.

## 3. Open the clock's web page

Every clock has its own web page for all its settings, no app needed. On a
phone or computer on the same network, open:

```
http://word-clock-xxxxxx.local
```

with `xxxxxx` replaced by the six characters from the hotspot name in step 1,
for example `http://word-clock-a1b2c3.local`.

If that address doesn't open (some older phones and computers don't support
`.local` addresses), look up the clock's IP address in your router's list of
devices, where it appears as `word-clock-xxxxxx`, and open `http://<ip-address>`
instead. Add a bookmark, so you can find it again later.

The clock uses Amsterdam time unless Home Assistant sets another time zone.
Live elsewhere? Choose your region under **06. Time Zone**. See
[Settings](settings.html) for what each setting does.

## 4. Optional: Home Assistant

That's all: the clock is ready to use. Home Assistant is not needed. If you
use it and want to control the clock from it, see
[Home Assistant](home-assistant.html).
