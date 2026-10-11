---
title: Getting started
nav_order: 2
---

# Getting started

## 1. Connect to Wi-Fi

1. Plug in the clock. Without Wi-Fi settings it starts its own Wi-Fi hotspot,
   named after the clock (it starts with `word-clock`).
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

Every clock has its own web page for all its settings, no app needed. Find
the clock's IP address in your router's list of devices, and open
`http://<ip-address>` in a browser on the same network.

Not using Home Assistant? Choose your region under **06. Time Zone**. See
[Settings](settings.html) for what each setting does.

## 4. Optional: Home Assistant

To control the clock from Home Assistant, see [Home Assistant](home-assistant.html).
