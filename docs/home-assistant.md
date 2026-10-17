---
title: Home Assistant
nav_order: 3
---

# Home Assistant

{: .note }
> Home Assistant is **optional**. The clock works fully without it: it gets
> the time from the internet, and you change all settings and install updates
> on its own web page. Connect it only if you want to use the clock in Home
> Assistant, for example in automations.

The clock uses the [ESPHome integration](https://www.home-assistant.io/integrations/esphome/),
which is built into Home Assistant.

## Adding the clock

{: .important }
> Add the clock within 15 minutes after plugging it in. Unplug it and plug it
> in again if that time has passed.

1. Make sure the clock is [connected to your Wi-Fi](getting-started.html).
2. Home Assistant usually finds the clock by itself. Go to **Settings →
   Devices & services**; the Word Clock appears under *Discovered* as
   `word-clock-xxxxxx`. Click **Add**.

   ![A discovered word clock with an Add button in Home Assistant]({{ '/images/ha-discovered.png' | relative_url }}){: .screenshot }
3. If it doesn't appear, click **Add integration**, choose **ESPHome** and
   enter `word-clock-xxxxxx.local` (see [Getting started](getting-started.html#3-open-the-clocks-web-page))
   or the clock's IP address.

When it adds the clock, Home Assistant gives it its own encryption key. From
then on only your Home Assistant can control the clock over the network. The
web page keeps working. Does Home Assistant ask *you* for an encryption key? See
[Troubleshooting](troubleshooting.html#home-assistant-asks-for-an-encryption-key).

The clock then has its own device page with all its settings (see
[Settings](settings.html)):

![The clock's controls in Home Assistant]({{ '/images/ha-controls.png' | relative_url }}){: .screenshot-narrow }

## Time and time zone

Home Assistant sends the clock the time and its time zone. Home Assistant
2026.3 or newer is needed for the time zone. With an older version, choose the
time zone on the clock under **06. Time Zone**.

## Changing your layout

Did a word on your clock light the wrong squares, or does it name the wrong
hour? You can send a corrected layout to your clock through Home Assistant.
This changes which squares light up; the letters on the clock stay the same.

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

## Removing the clock or giving it away

Remove the clock from Home Assistant within 15 minutes after plugging it in,
or do a [factory reset](troubleshooting.html#factory-reset). A factory reset
also removes the encryption key, so do one before you give the clock to
someone else.
