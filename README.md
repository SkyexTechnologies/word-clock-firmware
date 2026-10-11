# Word Clock firmware

Firmware and documentation for the Skyex Technologies Word Clock, a Dutch
word clock built on [ESPHome](https://esphome.io).

**Documentation:** <https://skyextechnologies.github.io/word-clock-firmware/>

Clocks install new firmware themselves from the clock's web page or from
Home Assistant; see [Updating the firmware](https://skyextechnologies.github.io/word-clock-firmware/updating.html).
All versions are listed under [Releases](https://github.com/SkyexTechnologies/word-clock-firmware/releases).

## Contents

| Path | What it is |
| --- | --- |
| `word-clock.yaml` | The ESPHome configuration of the released firmware |
| `components/` | The `wordclock_layout` ESPHome component |
| `docs/` | The documentation website |

Each release commit holds the exact source of that firmware version. This
repository is published from Skyex Technologies' development repository;
pull requests aren't merged here.

## Building it yourself

```bash
pip install esphome
esphome compile word-clock.yaml
```

A self-built firmware works like the released one, but the clock keeps
offering the official updates.

## License

The firmware is licensed under the [GNU General Public License v3.0](LICENSE).
