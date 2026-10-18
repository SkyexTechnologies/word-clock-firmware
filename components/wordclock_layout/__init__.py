from pathlib import Path

import esphome.codegen as cg
from esphome.components import web_server_base
from esphome.components.web_server_base import CONF_WEB_SERVER_BASE_ID
import esphome.config_validation as cv
from esphome.const import CONF_ID

wordclock_layout_ns = cg.esphome_ns.namespace("wordclock_layout")
WordClockLayout = wordclock_layout_ns.class_("WordClockLayout", cg.Component)

DEPENDENCIES = ["esp8266"]
AUTO_LOAD = ["web_server_base"]

CONF_UPLOAD_WINDOW = "upload_window"

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
    linker_script = Path(__file__).with_name("eagle.flash.4m.wordclock.ld")
    cg.add_platformio_option("board_build.ldscript", str(linker_script))

    base = await cg.get_variable(config[CONF_WEB_SERVER_BASE_ID])
    var = cg.new_Pvariable(config[CONF_ID], base)
    await cg.register_component(var, config)
    cg.add(var.set_upload_window(config[CONF_UPLOAD_WINDOW]))
    cg.add_library("EEPROM", None)
