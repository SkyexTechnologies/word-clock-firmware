from pathlib import Path

import esphome.codegen as cg
from esphome.components import web_server_base
from esphome.components.web_server_base import CONF_WEB_SERVER_BASE_ID
import esphome.config_validation as cv
from esphome.const import CONF_ID
from esphome.core import CORE
from esphome.cpp_helpers import set_setup_priority

wordclock_layout_ns = cg.esphome_ns.namespace("wordclock_layout")
WordClockLayout = wordclock_layout_ns.class_("WordClockLayout", cg.Component)

DEPENDENCIES = ["esp8266"]
AUTO_LOAD = ["web_server_base"]

CONF_UPLOAD_WINDOW = "upload_window"

# ESP8266 preferences are stored by position, in setup order. Wi-Fi, then the
# API, are set up before everything else that restores state (the light 799,
# settings 800), so the Wi-Fi credentials and the API key keep the first slots
# and adding, removing or resizing a setting never moves them. Set here because
# wifi: has no setup_priority option. Changing these moves the slots once.
FIRST_SETUP_PRIORITIES = {"wifi": 900.0, "api": 850.0}

CONFIG_SCHEMA = cv.Schema(
    {
        cv.GenerateID(): cv.declare_id(WordClockLayout),
        cv.GenerateID(CONF_WEB_SERVER_BASE_ID): cv.use_id(web_server_base.WebServerBase),
        # How long after power-on /layout accepts an upload.
        cv.Optional(CONF_UPLOAD_WINDOW, default="15min"): cv.positive_time_period_milliseconds,
    }
).extend(cv.COMPONENT_SCHEMA)


async def to_code(config):
    # Reserve the 4 KB sector below the ESPHome preferences for the per-device
    # layout, outside OTA staging. This project targets 4 MB ESP-12S modules
    # (board esp12e); the linker script replaces ESPHome's 4 MB flash map.
    # A bare name, found through -L (ESPHome 2026.10's own ESP8266 build
    # requires that; PlatformIO resolves it the same way).
    linker_script = Path(__file__).with_name("eagle.flash.4m.wordclock.ld")
    cg.add_platformio_option("board_build.ldscript", linker_script.name)
    cg.add_build_flag(f"-L{linker_script.parent}")

    base = await cg.get_variable(config[CONF_WEB_SERVER_BASE_ID])
    var = cg.new_Pvariable(config[CONF_ID], base)
    await cg.register_component(var, config)
    cg.add(var.set_upload_window(config[CONF_UPLOAD_WINDOW]))
    cg.add_library("EEPROM", None)

    for domain, priority in FIRST_SETUP_PRIORITIES.items():
        if domain in CORE.config:
            set_setup_priority(await cg.get_variable(CORE.config[domain][CONF_ID]), priority)
