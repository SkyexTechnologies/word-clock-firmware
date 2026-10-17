---
title: Troubleshooting
nav_order: 6
---

# Troubleshooting

## What the LEDs show

| What you see | What it means |
| --- | --- |
| The time in words | Everything is fine. |
| One LED walking along all the LEDs | The clock doesn't know the time yet. Check its Wi-Fi connection, and that Home Assistant or the internet is reachable. |
| All LEDs cycling red, green and blue | The clock is missing its factory data. Contact Skyex Technologies. |
| Nothing | The clock is switched off under *01. Word Clock*, or the brightness is very low. Check the web page. |

## The button

| Hold the button for | What happens |
| --- | --- |
| 2 – 5 seconds | The clock restarts. |
| 10 – 20 seconds | Factory reset. |

### Factory reset

A factory reset clears the Wi-Fi settings, all settings and the Home Assistant
encryption key. The clock then starts its setup hotspot again; see
[Getting started](getting-started.html).

## The setup hotspot is gone

The hotspot and Home Assistant setup are only possible for 15 minutes after
the clock is plugged in. Unplug the clock and plug it in again.

## Home Assistant asks for an encryption key

Normally you never need to enter a key: when you add the clock, Home Assistant
gives it a key of its own. Home Assistant only asks for one when it can't do
that. Try these steps in order:

1. **Unplug the clock and plug it in again**, then add it in Home Assistant
   within 15 minutes. A clock only accepts a new key during the first 15
   minutes after it is plugged in, so after that Home Assistant can't set one.
2. **If it still asks**, the clock still has a key that Home Assistant no
   longer knows. This happens when the clock was added to another Home
   Assistant (a previous owner's, or yours before a reinstall), or when it was
   removed from Home Assistant more than 15 minutes after it was plugged in:
   the clock then keeps its key. A restart doesn't clear it. Do a
   [factory reset](#factory-reset): hold the button for 10 to 20 seconds. This
   removes the key, but also the Wi-Fi settings and your settings (not the
   words of your clock). Connect the clock to Wi-Fi again (see
   [Getting started](getting-started.html)), and add it in Home Assistant
   within 15 minutes after plugging it in.

To remove a clock from Home Assistant and keep it ready to add again, unplug
and replug the clock first, then remove it within 15 minutes: that clears its
key too.

We can't give you a clock's key: only the Home Assistant that set it knows it.

## The time is off by one or more hours

Check **06. Time Zone** under [Settings](settings.html). Without Home
Assistant the clock uses Amsterdam time; choose your region there if you live
elsewhere. With Home Assistant and *Home Assistant (otherwise Amsterdam)*,
check the time zone in Home Assistant under **Settings → System → General**.

## The clock lost the time after a power cut

The clock has no battery. After a power cut it gets the time again from Home
Assistant or the internet as soon as it is back on Wi-Fi.

## An update fails

Check that the clock can reach the internet, and try again. If the clock no
longer starts, contact Skyex Technologies.
