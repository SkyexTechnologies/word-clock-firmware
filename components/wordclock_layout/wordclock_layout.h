#pragma once

#include "esphome/components/web_server_base/web_server_base.h"
#include "esphome/core/application.h"
#include "esphome/core/component.h"
#include "esphome/core/hal.h"
#include "esphome/core/log.h"
#include <EEPROM.h>
#include <Esp.h>
#include <cstddef>
#include <cstring>
#include <memory>
#include <vector>

namespace esphome {
namespace wordclock_layout {

// Word table rows:
//   0      opening words ("HET IS", "IT IS")
//   1-12   minute phrases for :00, :05, ... :55
//   13-24  hours 12, 1, ... 11
//   25-31  weekdays, Sunday ... Saturday
//   32-36  0 to 4 minute dots
//   37-48  optional hour words used at :00 instead of rows 13-24, for 12, 1,
//          ... 11 (German "EIN UHR" vs "FÜNF NACH EINS"); empty = use 13-24
static const uint8_t NUM_WORDS = 49;
static const uint8_t MAX_LEDS_PER_WORD = 24;
static const uint8_t NUM_LEDS = 121;
static const uint8_t ROW_MINUTES = 1;
static const uint8_t ROW_HOURS = 13;
static const uint8_t ROW_HOURS_ON_THE_HOUR = 37;

// Special words: hidden words lit on their dates (a name on a birthday).
static const uint8_t MAX_SPECIAL_WORDS = 4;
static const uint8_t MAX_SPECIAL_DATES = 4;
// Fun phrases: shown instead of the time words on some days of the week in a
// time window ("IT IS BEER O'CLOCK" on Friday 17:00-18:00).
static const uint8_t MAX_FUN_PHRASES = 4;
static const uint16_t MINUTES_PER_DAY = 24 * 60;

static const uint32_t CONFIG_MAGIC = 0x574C4B31;  // "WLK1"
// Version 3 (firmware 1.9.0) adds the special words, version 4 (1.10.0) the
// fun phrases. Older layouts are still read: the same bytes up to where they
// end, then their CRC.
static const uint8_t CONFIG_VERSION = 4;
// Sector 1018 (0x405FA000) is reserved by the custom 4 MB linker script.
// ESPHome preferences remain in sector 1019 (0x405FB000).
static const uint32_t LAYOUT_FLASH_SECTOR = 1018;

// Indications fitted on this clock (LayoutBlob::features bits).
static const uint8_t FEATURE_IT_IS = 1 << 0;     // "HET IS"
static const uint8_t FEATURE_MINUTES = 1 << 1;   // four minute dots
static const uint8_t FEATURE_WEEKDAYS = 1 << 2;  // weekday letters
static const uint8_t FEATURE_ALL = FEATURE_IT_IS | FEATURE_MINUTES | FEATURE_WEEKDAYS;

// Hardware options of this clock (LayoutBlob::options bits). 0 is the
// standard clock, so layouts written before firmware 1.7.0 keep everything.
static const uint8_t OPTION_NO_LIGHT_SENSOR = 1 << 0;  // no light sensor fitted
static const uint8_t OPTIONS_ALL = OPTION_NO_LIGHT_SENSOR;

// Minute phrases (bits 0-11 of LayoutBlob::next_hour_mask).
static const uint16_t NEXT_HOUR_ALL = 0x0FFF;

// Per-device factory data. Keep identical to scripts/provision_layout_usb.py.
struct LayoutBlob {
  uint32_t magic;
  uint8_t version;
  uint8_t hardware_revision;  // 1-255
  uint8_t features;           // FEATURE_* bits
  // OPTION_* bits. Written over USB only (scripts/provision_layout_usb.py);
  // the API and the web upload keep the stored value. Was reserved (always
  // 0) before firmware 1.7.0.
  uint8_t options;
  // Bit n set: the minute phrase for :(5n) names the next hour, e.g. Dutch
  // "tien voor half vijf" at 4:20 (bits 4-11), English "twenty-five to five"
  // at 4:35 (bits 7-11), Korean never (0).
  uint16_t next_hour_mask;
  // Version of this clock's design (1, 2, ... as its owner corrects it);
  // 0 = not set. Was reserved (always 0) before firmware 1.2.0.
  uint16_t layout_revision;
  int8_t words[NUM_WORDS][MAX_LEDS_PER_WORD];
  // Version 3: LEDs of each special word (-1 = unused) and its dates as
  // {month 1-12, day 1-31}, {0, 0} = unused.
  int8_t special_leds[MAX_SPECIAL_WORDS][MAX_LEDS_PER_WORD];
  uint8_t special_dates[MAX_SPECIAL_WORDS][MAX_SPECIAL_DATES][2];
  // Version 4: LEDs of each fun phrase (-1 = unused), its days of the week
  // (bit 0 Sunday ... bit 6 Saturday), and its window: start in minutes after
  // midnight and length in minutes (0 = unused; may run past midnight).
  int8_t fun_leds[MAX_FUN_PHRASES][MAX_LEDS_PER_WORD];
  uint8_t fun_days[MAX_FUN_PHRASES];
  uint16_t fun_start[MAX_FUN_PHRASES];
  uint16_t fun_length[MAX_FUN_PHRASES];
  uint32_t crc;  // CRC-32 (zlib) over all bytes above
};
static_assert(sizeof(LayoutBlob) == 1436, "LayoutBlob layout must match provision_layout_usb.py");
// Where the CRC of an older layout is: version 2 ends after the words (1192
// bytes), version 3 after the special words (1320 bytes).
static const size_t V2_CRC_OFFSET = offsetof(LayoutBlob, special_leds);
static const size_t V3_CRC_OFFSET = offsetof(LayoutBlob, fun_leds);
// The EEPROM library's buffer, only allocated while reading or writing.
static const uint16_t EEPROM_SIZE = sizeof(LayoutBlob);

// The upload page at /layout, around the status lines (upload_page.cpp).
extern const char UPLOAD_PAGE_HEAD[] PROGMEM;
extern const char UPLOAD_PAGE_TAIL[] PROGMEM;

// Also serves /layout on the clock's web page: a user without Home Assistant
// uploads a design file there. Allowed only during the upload window, the
// first minutes after the clock was plugged in (or reset with the RST pin),
// so changing the layout needs physical access. A restart from the web page
// or Home Assistant doesn't open the window.
class WordClockLayout : public AsyncWebHandler, public Component {
 public:
  explicit WordClockLayout(web_server_base::WebServerBase *base) : base_(base) {}
  void set_upload_window(uint32_t ms) { upload_window_ms_ = ms; }

  void setup() override {
    this->layout_eeprom_.begin(EEPROM_SIZE);
    this->layout_eeprom_.get(0, blob_);
    // blob_ holds the copy we use; free the EEPROM library's 512-byte RAM
    // buffer. Nothing was changed, so end() does not write to flash.
    this->layout_eeprom_.end();

    bool intact = false;
    if (blob_.magic == CONFIG_MAGIC && blob_.version == CONFIG_VERSION) {
      intact = blob_.crc == crc_(blob_);
    } else if (blob_.magic == CONFIG_MAGIC && (blob_.version == 2 || blob_.version == 3)) {
      // Written before firmware 1.10.0: its CRC follows its last part, where
      // newer versions continue; the parts it doesn't have are empty.
      const size_t end = blob_.version == 2 ? V2_CRC_OFFSET : V3_CRC_OFFSET;
      uint32_t crc;
      memcpy(&crc, reinterpret_cast<const uint8_t *>(&blob_) + end, sizeof(crc));
      intact = crc == crc_bytes_(&blob_, end);
      if (blob_.version == 2)
        clear_special_(blob_);
      clear_fun_(blob_);
    }
    loaded_ = intact && values_valid_(blob_);

    if (!loaded_) {
      ESP_LOGE(TAG, "No valid word layout in flash - running LED self-test until provisioned");
      memset(blob_.words, -1, sizeof(blob_.words));
      clear_special_(blob_);
      clear_fun_(blob_);
      blob_.hardware_revision = 0;
      blob_.features = 0;
      blob_.options = 0;
      blob_.next_hour_mask = 0;
      blob_.layout_revision = 0;
    } else {
      ESP_LOGI(TAG,
               "Loaded word layout from flash (version %u, hardware revision %u, layout revision %u, "
               "indications 0x%02X, options 0x%02X, next hour 0x%03X, %u special words, %u fun phrases)",
               blob_.version, blob_.hardware_revision, blob_.layout_revision, blob_.features, blob_.options,
               blob_.next_hour_mask, this->special_count(), this->fun_count());
    }

    uint32_t reason = ESP.getResetInfoPtr()->reason;
    upload_open_ = reason == REASON_DEFAULT_RST || reason == REASON_EXT_SYS_RST;
    ESP_LOGI(TAG, "Layout upload at /layout %s", upload_open_ ? "open after power-on" : "closed (not a power-on)");
    this->base_->add_handler(this);
  }

  void loop() override {
    // Latched, so the window doesn't reopen when millis() wraps after 49 days.
    if (upload_open_ && millis() > upload_window_ms_) {
      upload_open_ = false;
      ESP_LOGI(TAG, "Layout upload window closed");
    }
    if (upload_ready_) {
      upload_ready_ = false;
      LayoutBlob candidate = *upload_;
      upload_.reset();
      if (this->store_(candidate)) {
        upload_open_ = false;
        // Restart so the indication settings follow the new layout; the
        // delay lets the web page receive its answer first.
        this->set_timeout(1000, []() { App.safe_reboot(); });
      }
    }
  }

  // AsyncWebHandler: GET shows the upload page, POST takes a LayoutBlob
  // (hardware_revision and options 0: the clock keeps its own; CRC over the
  // bytes as sent).
  bool canHandle(AsyncWebServerRequest *request) const override {
    return request->url() == "/layout" && (request->method() == HTTP_GET || request->method() == HTTP_POST);
  }
  bool isRequestHandlerTrivial() const override { return false; }

  void handleBody(AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) override {
    if (index == 0) {
      upload_received_ = 0;
      upload_.reset();
      if (upload_open_ && !upload_ready_ && total == sizeof(LayoutBlob))
        upload_.reset(new LayoutBlob());
    }
    if (!upload_ || index != upload_received_ || index + len > sizeof(LayoutBlob))
      return;
    memcpy(reinterpret_cast<uint8_t *>(upload_.get()) + index, data, len);
    upload_received_ += len;
  }

  void handleRequest(AsyncWebServerRequest *request) override {
    if (request->method() == HTTP_GET) {
      this->send_page_(request);
      return;
    }
    const char *error = this->check_upload_();
    if (error != nullptr) {
      upload_.reset();
      ESP_LOGW(TAG, "Layout upload refused: %s", error);
      request->send(error == UPLOAD_CLOSED ? 403 : 400, "text/plain", error);
      return;
    }
    upload_ready_ = true;  // written to flash from loop()
    request->send(200, "text/plain", "Saved. The clock restarts and shows the new layout.");
  }

  // Drop-in replacement for words[word][slot]; -1 means "no more LEDs".
  int8_t led_for(uint8_t word, uint8_t slot) const {
    if (!loaded_ || word >= NUM_WORDS || slot >= MAX_LEDS_PER_WORD)
      return -1;
    return blob_.words[word][slot];
  }

  // phrase: 0-11 for :00, :05, ... :55.
  bool refers_to_next_hour(uint8_t phrase) const { return phrase < 12 && (blob_.next_hour_mask >> phrase) & 1; }

  // Word table row for the hour (0-23) shown with minute phrase 0-11: the
  // optional :00 hour words when the layout has them, otherwise the normal
  // hour words.
  uint8_t hour_row(int hour, uint8_t phrase) const {
    uint8_t h = hour % 12;
    if (phrase == 0 && this->led_for(ROW_HOURS_ON_THE_HOUR + h, 0) >= 0)
      return ROW_HOURS_ON_THE_HOUR + h;
    return ROW_HOURS + h;
  }

  // Special word i (0-3), like led_for(); -1 means "no more LEDs".
  int8_t special_led_for(uint8_t i, uint8_t slot) const {
    if (!loaded_ || i >= MAX_SPECIAL_WORDS || slot >= MAX_LEDS_PER_WORD)
      return -1;
    return blob_.special_leds[i][slot];
  }

  // Whether special word i is lit on this date (month 1-12, day 1-31).
  bool special_on(uint8_t i, int month, int day) const {
    if (this->special_led_for(i, 0) < 0)
      return false;
    for (uint8_t d = 0; d < MAX_SPECIAL_DATES; d++)
      if (blob_.special_dates[i][d][0] == month && blob_.special_dates[i][d][1] == day)
        return true;
    return false;
  }

  // Special words with letters (0-4).
  uint8_t special_count() const {
    uint8_t n = 0;
    for (uint8_t i = 0; i < MAX_SPECIAL_WORDS; i++)
      if (this->special_led_for(i, 0) >= 0)
        n++;
    return n;
  }

  // Fun phrase i, like led_for(); -1 means "no more LEDs".
  int8_t fun_led_for(uint8_t i, uint8_t slot) const {
    if (!loaded_ || i >= MAX_FUN_PHRASES || slot >= MAX_LEDS_PER_WORD)
      return -1;
    return blob_.fun_leds[i][slot];
  }

  // The fun phrase shown now (weekday 0 = Sunday, minutes after midnight),
  // or -1. The first one whose day and window match wins.
  int8_t fun_now(int weekday, int minute_of_day) const {
    for (uint8_t i = 0; i < MAX_FUN_PHRASES; i++) {
      if (this->fun_led_for(i, 0) < 0 || !blob_.fun_length[i] || !((blob_.fun_days[i] >> weekday) & 1))
        continue;
      int since = (minute_of_day - blob_.fun_start[i] + MINUTES_PER_DAY) % MINUTES_PER_DAY;
      if (since < blob_.fun_length[i])
        return i;
    }
    return -1;
  }

  // Fun phrases with letters (0-4).
  uint8_t fun_count() const {
    uint8_t n = 0;
    for (uint8_t i = 0; i < MAX_FUN_PHRASES; i++)
      if (this->fun_led_for(i, 0) >= 0)
        n++;
    return n;
  }

  bool is_provisioned() const { return loaded_; }
  // 0 while unprovisioned.
  uint8_t hardware_revision() const { return blob_.hardware_revision; }
  // 0 while unprovisioned or not set.
  uint16_t layout_revision() const { return blob_.layout_revision; }
  // An unprovisioned clock reports every indication, so nothing is hidden.
  bool has_feature(uint8_t feature) const { return !loaded_ || (blob_.features & feature) != 0; }
  // False only when the layout says no sensor is fitted.
  bool has_light_sensor() const { return !loaded_ || (blob_.options & OPTION_NO_LIGHT_SENSOR) == 0; }

  // The whole design in one go, from the set_word_layout API action (factory
  // script, or the owner through Home Assistant), never by the update flow.
  // `flat`: NUM_WORDS * MAX_LEDS_PER_WORD entries, row-major. hardware_revision
  // 0 keeps the clock's stored revision, so an owner can't change it by
  // accident. Special words: MAX_SPECIAL_WORDS * MAX_LEDS_PER_WORD LEDs and
  // MAX_SPECIAL_WORDS * MAX_SPECIAL_DATES dates (month * 100 + day, 0 =
  // unused). Fun phrases: MAX_FUN_PHRASES * MAX_LEDS_PER_WORD LEDs, and per
  // phrase its days (bit 0 Sunday ... bit 6 Saturday), start (minutes after
  // midnight) and length in minutes (0 = unused).
  bool write_layout(const std::vector<int32_t> &flat, int32_t hardware_revision, bool has_it_is, bool has_minutes,
                    bool has_weekdays, int32_t next_hour_mask, int32_t layout_revision,
                    const std::vector<int32_t> &special_leds, const std::vector<int32_t> &special_dates,
                    const std::vector<int32_t> &fun_leds, const std::vector<int32_t> &fun_days,
                    const std::vector<int32_t> &fun_start, const std::vector<int32_t> &fun_length) {
    if (flat.size() != (size_t) NUM_WORDS * MAX_LEDS_PER_WORD) {
      ESP_LOGE(TAG, "Layout has %u entries, expected %u", (unsigned) flat.size(),
               (unsigned) (NUM_WORDS * MAX_LEDS_PER_WORD));
      return false;
    }
    if (hardware_revision == 0) {
      if (!loaded_) {
        ESP_LOGE(TAG, "Hardware revision 0 (keep) needs a stored layout; send the revision (1..255)");
        return false;
      }
      hardware_revision = blob_.hardware_revision;
    }
    if (hardware_revision < 1 || hardware_revision > 255) {
      ESP_LOGE(TAG, "Hardware revision %ld is outside 1..255", (long) hardware_revision);
      return false;
    }
    if (layout_revision < 0 || layout_revision > 65535) {
      ESP_LOGE(TAG, "Layout revision %ld is outside 0..65535", (long) layout_revision);
      return false;
    }
    if (next_hour_mask < 0 || next_hour_mask > NEXT_HOUR_ALL) {
      ESP_LOGE(TAG, "Next-hour mask 0x%lX has bits outside the 12 minute phrases", (long) next_hour_mask);
      return false;
    }

    LayoutBlob candidate{};
    if (!fill_leds_(&candidate.words[0][0], flat, NUM_WORDS, "Layout") ||
        !fill_special_(candidate, special_leds, special_dates) ||
        !fill_fun_(candidate, fun_leds, fun_days, fun_start, fun_length))
      return false;
    candidate.hardware_revision = (uint8_t) hardware_revision;
    candidate.options = loaded_ ? blob_.options : 0;  // USB only, see LayoutBlob
    candidate.features = (has_it_is ? FEATURE_IT_IS : 0) | (has_minutes ? FEATURE_MINUTES : 0) |
                         (has_weekdays ? FEATURE_WEEKDAYS : 0);
    candidate.next_hour_mask = (uint16_t) next_hour_mask;
    candidate.layout_revision = (uint16_t) layout_revision;
    return this->store_(candidate);
  }

 protected:
  static constexpr const char *TAG = "wordclock_layout";
  static constexpr const char *UPLOAD_CLOSED =
      "Uploading is closed. Unplug the clock, plug it back in and upload within 15 minutes.";
  web_server_base::WebServerBase *base_;
  EEPROMClass layout_eeprom_{LAYOUT_FLASH_SECTOR};
  LayoutBlob blob_{};
  bool loaded_{false};
  uint32_t upload_window_ms_{0};
  bool upload_open_{false};
  // Set by the web server, handled in loop().
  volatile bool upload_ready_{false};
  std::unique_ptr<LayoutBlob> upload_;
  size_t upload_received_{0};

  // Fills in the header and CRC, then saves to flash. hardware_revision is
  // already resolved (1-255).
  bool store_(LayoutBlob candidate) {
    candidate.magic = CONFIG_MAGIC;
    candidate.version = CONFIG_VERSION;
    if (!values_valid_(candidate)) {
      ESP_LOGE(TAG, "Layout values are invalid; not saved");
      return false;
    }
    candidate.crc = crc_(candidate);
    blob_ = candidate;

    // The buffer is only allocated while writing (see setup()).
    this->layout_eeprom_.begin(EEPROM_SIZE);
    this->layout_eeprom_.put(0, blob_);
    loaded_ = this->layout_eeprom_.commit();
    this->layout_eeprom_.end();
    if (loaded_) {
      ESP_LOGI(TAG, "Saved word layout to EEPROM (hardware revision %u, layout revision %u, indications 0x%02X, "
                    "%u special words, %u fun phrases); restart to apply indication visibility",
               blob_.hardware_revision, blob_.layout_revision, blob_.features, this->special_count(),
               this->fun_count());
    } else {
      ESP_LOGE(TAG, "EEPROM commit failed; word layout is unavailable until reboot or reprovisioning");
    }
    return loaded_;
  }

  // nullptr when the received upload can be saved, otherwise the reason.
  // Keeps the clock's hardware revision.
  const char *check_upload_() {
    if (!upload_open_)
      return UPLOAD_CLOSED;
    if (upload_ready_)
      return "An upload is already being saved.";
    if (!upload_ || upload_received_ != sizeof(LayoutBlob))
      return "The upload was incomplete or not a word clock layout.";
    if (upload_->magic != CONFIG_MAGIC || upload_->version != CONFIG_VERSION || upload_->crc != crc_(*upload_))
      return "This is not a word clock layout, or it was damaged on the way.";
    if (!loaded_)
      return "This clock has no layout yet. Contact Skyex Technologies.";
    upload_->hardware_revision = blob_.hardware_revision;
    upload_->options = blob_.options;
    if (!values_valid_(*upload_))
      return "The layout contains invalid values.";
    return nullptr;
  }

  void send_page_(AsyncWebServerRequest *request) {
    AsyncResponseStream *stream = request->beginResponseStream("text/html");
    stream->print(FPSTR(UPLOAD_PAGE_HEAD));
    if (!upload_open_) {
      stream->print(F("<p class=\"closed\">Uploading is closed. Unplug the clock, plug it back in and reload this "
                      "page within 15 minutes.</p>"));
    } else {
      stream->printf("<p>Uploading is open for %u more minutes.</p>",
                     (unsigned) ((upload_window_ms_ - millis()) / 60000 + 1));
    }
    stream->printf("<p>Current layout revision: %u.</p>", (unsigned) blob_.layout_revision);
    stream->print(FPSTR(UPLOAD_PAGE_TAIL));
    request->send(stream);
  }

  static bool values_valid_(const LayoutBlob &blob) {
    if (blob.hardware_revision == 0 || (blob.features & ~FEATURE_ALL) != 0 || (blob.options & ~OPTIONS_ALL) != 0 ||
        (blob.next_hour_mask & ~NEXT_HOUR_ALL) != 0)
      return false;
    for (uint8_t w = 0; w < NUM_WORDS; w++)
      for (uint8_t s = 0; s < MAX_LEDS_PER_WORD; s++)
        if (blob.words[w][s] < -1 || blob.words[w][s] >= NUM_LEDS)
          return false;
    for (uint8_t i = 0; i < MAX_SPECIAL_WORDS; i++) {
      for (uint8_t s = 0; s < MAX_LEDS_PER_WORD; s++)
        if (blob.special_leds[i][s] < -1 || blob.special_leds[i][s] >= NUM_LEDS)
          return false;
      for (uint8_t d = 0; d < MAX_SPECIAL_DATES; d++) {
        uint8_t month = blob.special_dates[i][d][0], day = blob.special_dates[i][d][1];
        if ((month || day) && (month < 1 || month > 12 || day < 1 || day > 31))
          return false;
      }
    }
    for (uint8_t i = 0; i < MAX_FUN_PHRASES; i++) {
      for (uint8_t s = 0; s < MAX_LEDS_PER_WORD; s++)
        if (blob.fun_leds[i][s] < -1 || blob.fun_leds[i][s] >= NUM_LEDS)
          return false;
      if (blob.fun_days[i] > 0x7F || blob.fun_start[i] >= MINUTES_PER_DAY || blob.fun_length[i] > MINUTES_PER_DAY)
        return false;
    }
    return true;
  }

  static void clear_fun_(LayoutBlob &blob) {
    memset(blob.fun_leds, -1, sizeof(blob.fun_leds));
    memset(blob.fun_days, 0, sizeof(blob.fun_days));
    memset(blob.fun_start, 0, sizeof(blob.fun_start));
    memset(blob.fun_length, 0, sizeof(blob.fun_length));
  }

  // `rows` rows of MAX_LEDS_PER_WORD LED indices (-1 = unused) into `out`.
  static bool fill_leds_(int8_t *out, const std::vector<int32_t> &leds, size_t rows, const char *what) {
    if (leds.size() != rows * MAX_LEDS_PER_WORD) {
      ESP_LOGE(TAG, "%s has %u LED entries, expected %u", what, (unsigned) leds.size(),
               (unsigned) (rows * MAX_LEDS_PER_WORD));
      return false;
    }
    for (size_t i = 0; i < leds.size(); i++) {
      if (leds[i] < -1 || leds[i] >= NUM_LEDS) {
        ESP_LOGE(TAG, "%s LED index %ld is outside -1..%u", what, (long) leds[i], NUM_LEDS - 1);
        return false;
      }
      out[i] = (int8_t) leds[i];
    }
    return true;
  }

  static bool fill_special_(LayoutBlob &blob, const std::vector<int32_t> &leds, const std::vector<int32_t> &dates) {
    if (!fill_leds_(&blob.special_leds[0][0], leds, MAX_SPECIAL_WORDS, "Special words"))
      return false;
    if (dates.size() != (size_t) MAX_SPECIAL_WORDS * MAX_SPECIAL_DATES) {
      ESP_LOGE(TAG, "Special words need %u dates", (unsigned) (MAX_SPECIAL_WORDS * MAX_SPECIAL_DATES));
      return false;
    }
    for (size_t i = 0; i < dates.size(); i++) {
      if (dates[i] < 0 || dates[i] > 1231) {
        ESP_LOGE(TAG, "Special word date %ld is not month * 100 + day", (long) dates[i]);
        return false;
      }
      blob.special_dates[i / MAX_SPECIAL_DATES][i % MAX_SPECIAL_DATES][0] = (uint8_t) (dates[i] / 100);
      blob.special_dates[i / MAX_SPECIAL_DATES][i % MAX_SPECIAL_DATES][1] = (uint8_t) (dates[i] % 100);
    }
    return true;
  }

  static bool fill_fun_(LayoutBlob &blob, const std::vector<int32_t> &leds, const std::vector<int32_t> &days,
                        const std::vector<int32_t> &start, const std::vector<int32_t> &length) {
    if (!fill_leds_(&blob.fun_leds[0][0], leds, MAX_FUN_PHRASES, "Fun phrases"))
      return false;
    if (days.size() != MAX_FUN_PHRASES || start.size() != MAX_FUN_PHRASES || length.size() != MAX_FUN_PHRASES) {
      ESP_LOGE(TAG, "Fun phrases need %u days, starts and lengths", (unsigned) MAX_FUN_PHRASES);
      return false;
    }
    for (uint8_t i = 0; i < MAX_FUN_PHRASES; i++) {
      if (days[i] < 0 || days[i] > 0x7F || start[i] < 0 || start[i] >= MINUTES_PER_DAY || length[i] < 0 ||
          length[i] > MINUTES_PER_DAY) {
        ESP_LOGE(TAG, "Fun phrase %u has invalid days, start or length", i + 1);
        return false;
      }
      blob.fun_days[i] = (uint8_t) days[i];
      blob.fun_start[i] = (uint16_t) start[i];
      blob.fun_length[i] = (uint16_t) length[i];
    }
    return true;
  }

  static void clear_special_(LayoutBlob &blob) {
    memset(blob.special_leds, -1, sizeof(blob.special_leds));
    memset(blob.special_dates, 0, sizeof(blob.special_dates));
  }

  static uint32_t crc_(const LayoutBlob &blob) { return crc_bytes_(&blob, offsetof(LayoutBlob, crc)); }

  // CRC-32 as computed by zlib.crc32() (reflected, polynomial 0xEDB88320).
  static uint32_t crc_bytes_(const void *data, size_t length) {
    uint32_t crc = 0xFFFFFFFF;
    const uint8_t *p = static_cast<const uint8_t *>(data);
    for (size_t i = 0; i < length; i++) {
      crc ^= p[i];
      for (uint8_t bit = 0; bit < 8; bit++)
        crc = (crc >> 1) ^ (0xEDB88320 & (0u - (crc & 1)));
    }
    return ~crc;
  }
};

}  // namespace wordclock_layout
}  // namespace esphome
