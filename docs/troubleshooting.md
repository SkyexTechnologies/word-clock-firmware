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

Check **03. Time Zone** under [Settings](settings.html). Without Home
Assistant the clock uses Amsterdam time; choose your region there if you live
elsewhere. With Home Assistant and *Home Assistant (otherwise Amsterdam)*,
check the time zone in Home Assistant under **Settings → System → General**.

## The clock lost the time after a power cut

The clock has no battery. After a power cut it gets the time again from Home
Assistant or the internet as soon as it is back on Wi-Fi.

## Changing your layout

Does a word on your clock light the wrong squares, or does it name the wrong
hour? You can send your clock a corrected layout, from the clock's own web page
or through [Home Assistant](home-assistant.html). This changes which squares
light up; the letters on the clock stay the same.

### On the clock's web page

You don't need Home Assistant for this. For safety, the clock only accepts a
layout in the first 15 minutes after you plug it in.

1. Open your design in the [designer](design-your-own.html): in step 1, choose
   **Open it** and select the design file you sent us. Make your correction.
2. In step 5, click **Download only** to save the corrected design file.
3. Unplug the clock and plug it back in. Restarting it from its web page or
   Home Assistant doesn't count.
4. Within 15 minutes, open `http://word-clock-xxxxxx.local/layout` on a
   computer or phone on the same Wi-Fi network (or `http://<ip-address>/layout`;
   see [Getting started](getting-started.html)).
5. Choose the design file and click **Upload**. The clock restarts and shows
   the new layout. Your settings stay as they were.

If the page says uploading is closed, unplug the clock, plug it back in and
try again.

### Through Home Assistant

Your clock must be added to Home Assistant.

1. Open your design in the [designer](design-your-own.html): in step 1, choose
   **Open it** and select the design file you sent us. Make your correction.
2. In step 5, open **Already have your clock? Apply a corrected design through
   Home Assistant** and click **Copy for Home Assistant**.
3. In Home Assistant, go to **Settings → Developer tools → Actions** and switch
   to **YAML mode**. Paste the text.
4. Replace `xxxxxx` in the first line with the six characters of your clock's
   name (as in `word-clock-xxxxxx.local`). It then looks like this:

   ![The Actions screen in Home Assistant in YAML mode, with the set_word_layout action pasted]({{ '/images/ha-actions.png' | relative_url }}){: .screenshot-wide }
5. Click **Perform action**, then restart the clock with **Restart Word Clock**.

The clock's *Hardware* information then shows the new layout revision, here
layout 9:

![The Diagnostic card in Home Assistant, with Hardware showing Revision 1, layout 9]({{ '/images/ha-diagnostic.png' | relative_url }}){: .screenshot-narrow }

## An update fails

Check that the clock can reach the internet, and try again. If the clock no
longer starts, contact Skyex Technologies.
