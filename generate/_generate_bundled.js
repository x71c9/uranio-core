var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// node_modules/caller/index.js
var require_caller = __commonJS({
  "node_modules/caller/index.js"(exports, module2) {
    "use strict";
    module2.exports = function(depth) {
      var pst, stack, file, frame;
      pst = Error.prepareStackTrace;
      Error.prepareStackTrace = function(_, stack2) {
        Error.prepareStackTrace = pst;
        return stack2;
      };
      stack = new Error().stack;
      depth = !depth || isNaN(depth) ? 1 : depth > stack.length - 2 ? stack.length - 2 : depth;
      stack = stack.slice(depth + 1);
      do {
        frame = stack.shift();
        file = frame && frame.getFileName();
      } while (stack.length && file === "module.js");
      return file;
    };
  }
});

// node_modules/urn-lib/dist/log/types.js
var require_types = __commonJS({
  "node_modules/urn-lib/dist/log/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LogContext = exports.LogLevel = void 0;
    var LogLevel;
    (function(LogLevel2) {
      LogLevel2[LogLevel2["NONE"] = 0] = "NONE";
      LogLevel2[LogLevel2["ERROR"] = 1] = "ERROR";
      LogLevel2[LogLevel2["WARNING"] = 2] = "WARNING";
      LogLevel2[LogLevel2["DEBUG"] = 3] = "DEBUG";
      LogLevel2[LogLevel2["FUNCTION_DEBUG"] = 4] = "FUNCTION_DEBUG";
    })(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
    var LogContext;
    (function(LogContext2) {
      LogContext2["TERMINAL"] = "TERMINAL";
      LogContext2["BROWSER"] = "BROWSER";
    })(LogContext = exports.LogContext || (exports.LogContext = {}));
  }
});

// node_modules/urn-lib/dist/log/log.defaults.js
var require_log_defaults = __commonJS({
  "node_modules/urn-lib/dist/log/log.defaults.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var types_1 = require_types();
    var log_defaults = {
      log_level: types_1.LogLevel.ERROR,
      time_format: "yyyy-mm-dd'T'HH:MM:ss:l",
      max_str_length: 174,
      context: types_1.LogContext.TERMINAL,
      prefix: "",
      injectors: [],
      prefix_type: false
    };
    exports.default = log_defaults;
  }
});

// node_modules/dateformat/lib/dateformat.js
var require_dateformat = __commonJS({
  "node_modules/dateformat/lib/dateformat.js"(exports, module2) {
    (function(global) {
      "use strict";
      var dateFormat = function() {
        var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|"[^"]*"|'[^']*'/g;
        var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
        var timezoneClip = /[^-+\dA-Z]/g;
        return function(date, mask, utc, gmt) {
          if (arguments.length === 1 && kindOf(date) === "string" && !/\d/.test(date)) {
            mask = date;
            date = void 0;
          }
          date = date || new Date();
          if (!(date instanceof Date)) {
            date = new Date(date);
          }
          if (isNaN(date)) {
            throw TypeError("Invalid date");
          }
          mask = String(dateFormat.masks[mask] || mask || dateFormat.masks["default"]);
          var maskSlice = mask.slice(0, 4);
          if (maskSlice === "UTC:" || maskSlice === "GMT:") {
            mask = mask.slice(4);
            utc = true;
            if (maskSlice === "GMT:") {
              gmt = true;
            }
          }
          var _ = utc ? "getUTC" : "get";
          var d = date[_ + "Date"]();
          var D = date[_ + "Day"]();
          var m = date[_ + "Month"]();
          var y = date[_ + "FullYear"]();
          var H = date[_ + "Hours"]();
          var M = date[_ + "Minutes"]();
          var s = date[_ + "Seconds"]();
          var L = date[_ + "Milliseconds"]();
          var o = utc ? 0 : date.getTimezoneOffset();
          var W = getWeek(date);
          var N = getDayOfWeek(date);
          var flags = {
            d,
            dd: pad(d),
            ddd: dateFormat.i18n.dayNames[D],
            dddd: dateFormat.i18n.dayNames[D + 7],
            m: m + 1,
            mm: pad(m + 1),
            mmm: dateFormat.i18n.monthNames[m],
            mmmm: dateFormat.i18n.monthNames[m + 12],
            yy: String(y).slice(2),
            yyyy: y,
            h: H % 12 || 12,
            hh: pad(H % 12 || 12),
            H,
            HH: pad(H),
            M,
            MM: pad(M),
            s,
            ss: pad(s),
            l: pad(L, 3),
            L: pad(Math.round(L / 10)),
            t: H < 12 ? dateFormat.i18n.timeNames[0] : dateFormat.i18n.timeNames[1],
            tt: H < 12 ? dateFormat.i18n.timeNames[2] : dateFormat.i18n.timeNames[3],
            T: H < 12 ? dateFormat.i18n.timeNames[4] : dateFormat.i18n.timeNames[5],
            TT: H < 12 ? dateFormat.i18n.timeNames[6] : dateFormat.i18n.timeNames[7],
            Z: gmt ? "GMT" : utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
            o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
            S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10],
            W,
            N
          };
          return mask.replace(token, function(match) {
            if (match in flags) {
              return flags[match];
            }
            return match.slice(1, match.length - 1);
          });
        };
      }();
      dateFormat.masks = {
        "default": "ddd mmm dd yyyy HH:MM:ss",
        "shortDate": "m/d/yy",
        "mediumDate": "mmm d, yyyy",
        "longDate": "mmmm d, yyyy",
        "fullDate": "dddd, mmmm d, yyyy",
        "shortTime": "h:MM TT",
        "mediumTime": "h:MM:ss TT",
        "longTime": "h:MM:ss TT Z",
        "isoDate": "yyyy-mm-dd",
        "isoTime": "HH:MM:ss",
        "isoDateTime": "yyyy-mm-dd'T'HH:MM:sso",
        "isoUtcDateTime": "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
        "expiresHeaderFormat": "ddd, dd mmm yyyy HH:MM:ss Z"
      };
      dateFormat.i18n = {
        dayNames: [
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        monthNames: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ],
        timeNames: [
          "a",
          "p",
          "am",
          "pm",
          "A",
          "P",
          "AM",
          "PM"
        ]
      };
      function pad(val, len) {
        val = String(val);
        len = len || 2;
        while (val.length < len) {
          val = "0" + val;
        }
        return val;
      }
      function getWeek(date) {
        var targetThursday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        targetThursday.setDate(targetThursday.getDate() - (targetThursday.getDay() + 6) % 7 + 3);
        var firstThursday = new Date(targetThursday.getFullYear(), 0, 4);
        firstThursday.setDate(firstThursday.getDate() - (firstThursday.getDay() + 6) % 7 + 3);
        var ds = targetThursday.getTimezoneOffset() - firstThursday.getTimezoneOffset();
        targetThursday.setHours(targetThursday.getHours() - ds);
        var weekDiff = (targetThursday - firstThursday) / (864e5 * 7);
        return 1 + Math.floor(weekDiff);
      }
      function getDayOfWeek(date) {
        var dow = date.getDay();
        if (dow === 0) {
          dow = 7;
        }
        return dow;
      }
      function kindOf(val) {
        if (val === null) {
          return "null";
        }
        if (val === void 0) {
          return "undefined";
        }
        if (typeof val !== "object") {
          return typeof val;
        }
        if (Array.isArray(val)) {
          return "array";
        }
        return {}.toString.call(val).slice(8, -1).toLowerCase();
      }
      ;
      if (typeof define === "function" && define.amd) {
        define(function() {
          return dateFormat;
        });
      } else if (typeof exports === "object") {
        module2.exports = dateFormat;
      } else {
        global.dateFormat = dateFormat;
      }
    })(exports);
  }
});

// node_modules/urn-lib/dist/util/json.js
var require_json = __commonJS({
  "node_modules/urn-lib/dist/util/json.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.safe_stringify_oneline = exports.safe_stringify = exports.clean_parse = void 0;
    function clean_parse(json) {
      const no_comments_json = json.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/|\#.*)/g, (m, g) => g ? "" : m);
      return JSON.parse(no_comments_json);
    }
    exports.clean_parse = clean_parse;
    function safe_stringify(obj) {
      try {
        return JSON.stringify(obj);
      } catch (ex) {
        return `{error: ${ex.getMessage}}`;
      }
    }
    exports.safe_stringify = safe_stringify;
    function safe_stringify_oneline(obj, white_space = " ") {
      if (obj === null || typeof obj !== "object") {
        return "";
      }
      try {
        return JSON.stringify(obj, (k, v) => {
          if (v instanceof Set) {
            let set_string = `Set(${v.size})`;
            set_string += ` { `;
            const array_set = Array.from(v);
            const set_elements = array_set.map((el) => `'${el}'`).join(", ");
            set_string += set_elements + ` }`;
            v = set_string;
          }
          v = v instanceof Set ? Array.from(v).toString() : v;
          return v === void 0 || k === void 0 ? "undefined" : v;
        }, white_space);
      } catch (e) {
        return "[ERROR] " + e.message;
      }
    }
    exports.safe_stringify_oneline = safe_stringify_oneline;
  }
});

// node_modules/urn-lib/dist/log/console_injectors.js
var require_console_injectors = __commonJS({
  "node_modules/urn-lib/dist/log/console_injectors.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.console_injectors = void 0;
    var dateformat_1 = __importDefault(require_dateformat());
    var types_1 = require_types();
    var json_1 = require_json();
    var log_defaults_1 = __importDefault(require_log_defaults());
    var console_injectors;
    (function(console_injectors2) {
      console_injectors2.terminal = {
        error_inject: (...p) => {
          _cecho("error", _terminal_styles.fgRed, 6, -1, ...p);
        },
        warn_inject: (...p) => {
          _cecho("warn", _terminal_styles.fgYellow, 6, 3, ...p);
        },
        debug_inject: (...p) => {
          _cecho("debug", _terminal_styles.fgBlue, 6, 1, ...p);
        },
        fn_debug_inject: (...p) => {
          _cecho("fn_debug", _terminal_styles.fgCyan, 6, 1, ...p);
        }
      };
      console_injectors2.browser = {
        error_inject: (...p) => {
          _cecho("error", error_console_style, 0, 0, ...p);
        },
        warn_inject: (...p) => {
          _cecho("warn", warn_console_style, 0, 0, ...p);
        },
        debug_inject: (...p) => {
          _cecho("debug", debug_console_style, 0, 0, ...p);
        },
        fn_debug_inject: (...p) => {
          _cecho("fn_debug", fn_debug_console_style, 0, 0, ...p);
        }
      };
    })(console_injectors = exports.console_injectors || (exports.console_injectors = {}));
    function _cecho(type, style, start, depth, ...params) {
      const styles = Array.isArray(style) ? style.join(" ") : style;
      const stylelog = styles + "%s" + _terminal_styles.reset;
      _log_stack(type, stylelog, start, depth, type === "error");
      for (const p of params) {
        if (typeof p === "object") {
          _log_param(p, stylelog, type);
        } else {
          let processed_param = p;
          if (typeof log_defaults_1.default.prefix === "string" && log_defaults_1.default.prefix !== "") {
            processed_param = `${log_defaults_1.default.prefix} ${p}`;
          }
          _log_param(processed_param, stylelog, type);
        }
      }
      if (log_defaults_1.default.context !== types_1.LogContext.BROWSER) {
        console.log(stylelog, " ");
      }
    }
    function _log_stack(type, stylelog, start = 0, depth = -1, is_error = false) {
      const stack = new Error().stack;
      Error.stackTraceLimit = 32;
      if (stack == void 0) {
        console.error("CANNOT LOG STACK");
        return;
      }
      const now = (0, dateformat_1.default)(new Date(), log_defaults_1.default.time_format);
      const head_string = now + " <" + type + "> ";
      const splitted_stack = stack.split("\n");
      const till = depth === -1 ? splitted_stack.length - start : depth;
      let j = start;
      let string = "return.ts";
      while (j < splitted_stack.length && typeof string === "string" && (string.includes("return.ts") || string.includes("log.ts") || string.includes("error.ts"))) {
        const psc = splitted_stack[j];
        const call_info = /\(([^)]+)\)/.exec(psc);
        string = call_info != null ? call_info[1] : psc.split("at ")[1];
        j++;
      }
      for (let i = j - 1; i < j - 1 + till && i < splitted_stack.length; i++) {
        const psc = splitted_stack[i];
        const call_info = /\(([^)]+)\)/.exec(psc);
        let string2 = "";
        string2 += head_string;
        string2 += call_info != null ? call_info[1] : psc.split("at ")[1];
        if (log_defaults_1.default.prefix_type === true) {
          string2 = `[--${type}--]${string2}`;
        }
        if (log_defaults_1.default.context === types_1.LogContext.BROWSER) {
          if (is_error) {
            console.error("%c%s", stylelog, string2);
          } else {
            console.log("%c%s", stylelog, string2);
          }
        } else {
          if (is_error) {
            console.error(stylelog, string2);
          } else {
            console.log(stylelog, string2);
          }
        }
      }
    }
    function _log_param(p, stylelog, type) {
      let processed_param = [];
      if (p instanceof Error && p.stack !== void 0) {
        if (log_defaults_1.default.context === types_1.LogContext.TERMINAL) {
          processed_param = p.stack.split("\n");
        } else {
          processed_param = [p];
        }
      } else if (typeof p === "object") {
        if (log_defaults_1.default.context === types_1.LogContext.TERMINAL) {
          processed_param = (0, json_1.safe_stringify_oneline)(p).split("\n");
        } else {
          processed_param = [p];
        }
      } else if (typeof p === "string") {
        if (log_defaults_1.default.context === types_1.LogContext.TERMINAL) {
          processed_param = p.split("\n");
        } else {
          processed_param = [p];
        }
      } else if (typeof p === "number") {
        processed_param = [p.toString()];
      } else if (p === false) {
        processed_param = ["false"];
      } else if (p === 0) {
        processed_param = ["0"];
      } else if (p === void 0) {
        processed_param = ["undefined"];
      } else if (p === null) {
        processed_param = ["null"];
      }
      for (let pp of processed_param) {
        if (log_defaults_1.default.context === types_1.LogContext.BROWSER) {
          switch (type) {
            case "error": {
              if (pp instanceof Error) {
                console.error("%c%s", stylelog, `${log_defaults_1.default.prefix} ERROR`, pp);
              } else if (typeof pp === "object") {
                console.error("%c%s", stylelog, `${log_defaults_1.default.prefix} ERROR`, pp);
              } else {
                console.error("%c%s", stylelog, pp);
              }
              break;
            }
            case "warn": {
              if (typeof pp === "object") {
                console.warn("%c%s", stylelog, `${log_defaults_1.default.prefix} WARNING`, pp);
              } else {
                console.warn("%c%s", stylelog, pp);
              }
              break;
            }
            default: {
              if (typeof pp === "object") {
                console.log(`%c${log_defaults_1.default.prefix}`, stylelog, pp);
              } else {
                console.log("%c%s", stylelog, pp);
              }
            }
          }
        } else {
          if (log_defaults_1.default.prefix_type === true) {
            pp = `[--${type}--]${pp}`;
          }
          if (type === "error") {
            console.error(stylelog, pp);
          } else {
            console.log(stylelog, pp);
          }
        }
      }
    }
    var _terminal_styles = {
      "reset": "\x1B[0m",
      "bright": "\x1B[1m",
      "dim": "\x1B[2m",
      "underscore": "\x1B[4m",
      "blink": "\x1B[5m",
      "reverse": "\x1B[7m",
      "hidden": "\x1B[8m",
      "fgBlack": "\x1B[30m",
      "fgRed": "\x1B[31m",
      "fgGreen": "\x1B[32m",
      "fgYellow": "\x1B[33m",
      "fgBlue": "\x1B[34m",
      "fgMagenta": "\x1B[35m",
      "fgCyan": "\x1B[36m",
      "fgWhite": "\x1B[37m",
      "fgDefault": "\x1B[39m",
      "fgLightGrey": "\x1B[90m",
      "fgLightRed": "\x1B[91m",
      "fgLightGreen": "\x1B[92m",
      "fglightYellow": "\x1B[93m",
      "fgLightBlue": "\x1B[94m",
      "fgLoghtMagenta": "\x1B[95m",
      "fgLightCyan": "\x1B[96m",
      "fgLightWhite": "\x1B[97m",
      "bgBlack": "\x1B[40m",
      "bgRed": "\x1B[41m",
      "bgGreen": "\x1B[42m",
      "bgYellow": "\x1B[43m",
      "bgBlue": "\x1B[44m",
      "bgMagenta": "\x1B[45m",
      "bgCyan": "\x1B[46m",
      "bgWhite": "\x1B[47m",
      "bgDefault": "\x1B[49m",
      "Light Gray": "\x1B[100m",
      "Light Red": "\x1B[101m",
      "Light Green": "\x1B[102m",
      "Light Yellow": "\x1B[103m",
      "Light Blue": "\x1B[104m",
      "Light Magenta": "\x1B[105m",
      "Light Cyan": "\x1B[106m",
      "Light White": "\x1B[107m"
    };
    var _console_styles = {
      underline: "text-decoration: underline;",
      fg_black: "color: black;",
      fg_red: "color: red;",
      fg_green: "color: green;",
      fg_yellow: "color: yellow;",
      fg_orange: "color: #e69500;",
      fg_blue: "color: blue;",
      fg_magenta: "color: magenta;",
      fg_cyan: "color: cyan;",
      fg_white: "color: white;",
      fg_grey: "color: grey;",
      fg_fndebug: "color: #848484;",
      fg_debug: "color: #4880ae;",
      fg_log: "color: #006ec8;",
      fg_warn: "color: #cf8d00;",
      fg_error: "color: #e20000;",
      bg_black: "background-color: black;",
      bg_red: "background-color: red;",
      bg_green: "background-color: green;",
      bg_yellow: "background-color: yellow;",
      bg_blue: "background-color: blue;",
      bg_magenta: "background-color: magenta;",
      bg_cyan: "background-color: cyan;",
      bg_white: "background-color: white;",
      padding: "padding: 4px;",
      fg_urn_blue: "color: #0029FF;",
      bg_urn_blue: "background-color: #ECF4FF;",
      fg_urn_purple: "color: #4200FF;",
      bg_urn_purple: "background-color: #F4ECFF;"
    };
    var fn_debug_console_style = [
      _console_styles.fg_urn_blue,
      _console_styles.bg_urn_blue
    ];
    var debug_console_style = [
      _console_styles.fg_urn_purple,
      _console_styles.bg_urn_purple
    ];
    var warn_console_style = [
      _console_styles.fg_black
    ];
    var error_console_style = [
      _console_styles.fg_black
    ];
  }
});

// node_modules/urn-lib/dist/log/log.js
var require_log = __commonJS({
  "node_modules/urn-lib/dist/log/log.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.error = exports.warn = exports.debug = exports.fn_debug = exports.init = exports.defaults = void 0;
    var types_1 = require_types();
    var log_defaults_1 = __importDefault(require_log_defaults());
    exports.defaults = log_defaults_1.default;
    var console_injectors_1 = require_console_injectors();
    function init(level, context, prefix, prefix_type, injectors) {
      if (level) {
        log_defaults_1.default.log_level = level;
      }
      if (context) {
        log_defaults_1.default.context = context;
      }
      if (prefix) {
        log_defaults_1.default.prefix = prefix;
      }
      if (prefix_type === true) {
        log_defaults_1.default.prefix_type = true;
      }
      if (Array.isArray(injectors) && injectors.length > 0) {
        log_defaults_1.default.injectors = injectors;
      } else {
        const log_injector = log_defaults_1.default.context === types_1.LogContext.BROWSER ? console_injectors_1.console_injectors.browser : console_injectors_1.console_injectors.terminal;
        log_defaults_1.default.injectors = [log_injector];
      }
      for (const cmd of process.argv) {
        const splitted = cmd.split("=");
        if (splitted[0] === "urn_log_prefix_type") {
          log_defaults_1.default.prefix_type = !!splitted[1];
        }
      }
    }
    exports.init = init;
    function _run_injector(type, ...params) {
      if (!Array.isArray(log_defaults_1.default.injectors) || log_defaults_1.default.injectors.length == 0)
        return;
      for (const injector of log_defaults_1.default.injectors) {
        if (typeof injector !== "object")
          return;
        switch (type) {
          case "error":
            if (typeof injector.error_inject === "function")
              injector.error_inject(...params);
            break;
          case "warn":
            if (typeof injector.warn_inject === "function")
              injector.warn_inject(...params);
            break;
          case "debug":
            if (typeof injector.debug_inject === "function")
              injector.debug_inject(...params);
            break;
          case "fn_debug":
            if (typeof injector.fn_debug_inject === "function")
              injector.fn_debug_inject(...params);
            break;
        }
      }
    }
    function fn_debug(...params) {
      if (log_defaults_1.default.log_level > 3) {
        _run_injector("fn_debug", ...params);
      }
    }
    exports.fn_debug = fn_debug;
    function debug(...params) {
      if (log_defaults_1.default.log_level > 2) {
        _run_injector("debug", ...params);
      }
    }
    exports.debug = debug;
    function warn(...params) {
      if (log_defaults_1.default.log_level > 1) {
        _run_injector("warn", ...params);
      }
    }
    exports.warn = warn;
    function error(...params) {
      if (log_defaults_1.default.log_level > 0) {
        _run_injector("error", ...params);
      }
    }
    exports.error = error;
  }
});

// node_modules/urn-lib/dist/log/util.js
var require_util = __commonJS({
  "node_modules/urn-lib/dist/log/util.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decorators = exports.return_injector = exports.console_injectors = void 0;
    var dateformat_1 = __importDefault(require_dateformat());
    var json_1 = require_json();
    var console_injectors_1 = require_console_injectors();
    Object.defineProperty(exports, "console_injectors", { enumerable: true, get: function() {
      return console_injectors_1.console_injectors;
    } });
    var types_1 = require_types();
    var log_1 = require_log();
    var log_defaults_1 = __importDefault(require_log_defaults());
    exports.return_injector = {
      success_handler: (p) => {
        (0, log_1.debug)(p);
        return p;
      },
      fail_handler: (p) => {
        (0, log_1.error)(p);
        return p;
      }
    };
    var decorators;
    (function(decorators2) {
      function debug_constructor(constr_func) {
        const ExtClass = class extends constr_func {
          constructor(...args) {
            fn_debug_constructor(random_id(), constr_func.name, format_args(args, log_defaults_1.default.max_str_length));
            super(...args);
          }
        };
        for (const property_name of Object.getOwnPropertyNames(constr_func)) {
          const descriptor = Object.getOwnPropertyDescriptor(constr_func, property_name);
          if (property_name != "prototype")
            Object.defineProperty(ExtClass, property_name, descriptor);
        }
        return ExtClass;
      }
      decorators2.debug_constructor = debug_constructor;
      function debug_methods(target) {
        for (const property_name of Object.getOwnPropertyNames(target.prototype)) {
          const descriptor = Object.getOwnPropertyDescriptor(target.prototype, property_name);
          if (!(descriptor.value instanceof Function) || property_name == "constructor")
            continue;
          if (typeof descriptor.no_debug === void 0)
            replace_method_with_logs(target, descriptor, property_name);
          Object.defineProperty(target.prototype, property_name, descriptor);
        }
        for (const property_name of Object.getOwnPropertyNames(target)) {
          const descriptor = Object.getOwnPropertyDescriptor(target, property_name);
          if (!(descriptor.value instanceof Function) || property_name == "constructor")
            continue;
          replace_method_with_logs(target, descriptor, property_name, "[static]");
          Object.defineProperty(target, property_name, descriptor);
        }
      }
      decorators2.debug_methods = debug_methods;
      function no_debug(_1, _2, descriptor) {
        descriptor.no_debug = true;
      }
      decorators2.no_debug = no_debug;
    })(decorators = exports.decorators || (exports.decorators = {}));
    function random_id() {
      const milliseconds = (0, dateformat_1.default)(new Date(), "l");
      return (Math.floor(Math.random() * 100) + "" + milliseconds).padStart(5, "0");
    }
    function fn_debug_constructor(rand_id, constructor_name, str_args) {
      (0, log_1.fn_debug)(`[${rand_id}] new ${constructor_name}(${str_args})`);
    }
    function fn_debug_method_with_args(rand_id, target_name, method, str_args) {
      (0, log_1.fn_debug)(`[${rand_id}] ${target_name}.${method}(${str_args})`);
    }
    function fn_debug_method_response(rand_id, target_name, method, str_result, is_promise = false) {
      const promise_str = is_promise ? " [Promise]" : "";
      (0, log_1.fn_debug)(`[${rand_id}] [R]${promise_str} ${target_name}.${method}:`, `${str_result}`);
    }
    function fn_debug_method_response_error(rand_id, target_name, method, err) {
      (0, log_1.fn_debug)(`[${rand_id}] [R] ${target_name}.${method}: ERROR`);
      (0, log_1.error)(err);
    }
    function format_args(args, max_str_length) {
      let str_args = args.length > 0 ? `${args}` : "";
      try {
        str_args = args.length > 0 ? (0, json_1.safe_stringify_oneline)(args, _white_spaces[log_defaults_1.default.context]) : "";
        str_args = str_args.substring(1, str_args.length - 1);
      } catch (e) {
        str_args = `[CANNOT FORMAT ARGUMENTS][${e.message}]`;
      }
      if (typeof str_args == "string" && str_args.length > max_str_length)
        str_args = str_args.substring(0, max_str_length) + "...";
      return str_args;
    }
    function format_result(result, max_str_length) {
      let str_result = `${result}`;
      try {
        str_result = `${result}`;
        str_result = (0, json_1.safe_stringify_oneline)(result, _white_spaces[log_defaults_1.default.context]);
      } catch (e) {
        str_result = `[CANNOT FORMAT RESULT][${e.message}]`;
      }
      if (typeof str_result == "string" && str_result.length > max_str_length)
        str_result = str_result.substring(0, max_str_length) + "...";
      return str_result;
    }
    function replace_method_with_logs(target, descriptor, property_name, appendix = "") {
      const original_method = descriptor.value;
      descriptor.value = function(...args) {
        const rand_id = random_id();
        const target_name = appendix != "" ? appendix + " " + target.name : target.name;
        fn_debug_method_with_args(rand_id, target_name, property_name, format_args(args, log_defaults_1.default.max_str_length));
        try {
          const result = original_method.apply(this, args);
          fn_debug_method_response(rand_id, target_name, property_name, format_result(result, log_defaults_1.default.max_str_length));
          if (result instanceof Promise) {
            result.then((data) => {
              fn_debug_method_response(rand_id, target_name, property_name, format_result(data, log_defaults_1.default.max_str_length), true);
            }).catch((err) => {
              fn_debug_method_response_error(rand_id, target_name, property_name, err);
            });
          }
          return result;
        } catch (err) {
          fn_debug_method_response_error(rand_id, target_name, property_name, err);
          throw err;
        }
      };
    }
    var _white_spaces = {
      [types_1.LogContext.BROWSER]: "",
      [types_1.LogContext.TERMINAL]: " "
    };
  }
});

// node_modules/urn-lib/dist/log/index.js
var require_log2 = __commonJS({
  "node_modules/urn-lib/dist/log/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.util = void 0;
    __exportStar(require_types(), exports);
    __exportStar(require_log(), exports);
    var util = __importStar(require_util());
    exports.util = util;
  }
});

// node_modules/urn-lib/dist/response/types.js
var require_types2 = __commonJS({
  "node_modules/urn-lib/dist/response/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/urn-lib/dist/response/response.js
var require_response = __commonJS({
  "node_modules/urn-lib/dist/response/response.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.is_false = exports.is_true = exports.is_fail = exports.is_success = exports.is_response = void 0;
    function is_response(response) {
      if (typeof response !== "object" || response === null)
        return false;
      return "success" in response && "status" in response;
    }
    exports.is_response = is_response;
    function is_success(response) {
      return response.success;
    }
    exports.is_success = is_success;
    function is_fail(response) {
      return !response.success;
    }
    exports.is_fail = is_fail;
    function is_true(response) {
      return response.success;
    }
    exports.is_true = is_true;
    function is_false(response) {
      return !response.success;
    }
    exports.is_false = is_false;
  }
});

// node_modules/urn-lib/dist/response/index.js
var require_response2 = __commonJS({
  "node_modules/urn-lib/dist/response/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_types2(), exports);
    __exportStar(require_response(), exports);
  }
});

// node_modules/urn-lib/dist/return/types.js
var require_types3 = __commonJS({
  "node_modules/urn-lib/dist/return/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/urn-lib/dist/return/return.js
var require_return = __commonJS({
  "node_modules/urn-lib/dist/return/return.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var index_1 = require_response2();
    var urn_log3 = __importStar(require_log2());
    var URNReturn = class {
      constructor(inject_objects) {
        this.inject_objects = [];
        if (inject_objects)
          this.push_injects(inject_objects);
      }
      _add_inject(inject_object) {
        if (typeof inject_object.fail_handler === "function" && typeof inject_object.success_handler === "function") {
          this.inject_objects.push(inject_object);
        }
      }
      push_injects(inject_objects) {
        if (Array.isArray(inject_objects)) {
          for (const inj of inject_objects)
            this._add_inject(inj);
        } else {
          this._add_inject(inject_objects);
        }
      }
      _run_success_handlers(response) {
        if (this.inject_objects.length > 0) {
          for (const inj_obj of this.inject_objects) {
            if (inj_obj.success_handler)
              response = inj_obj.success_handler(response);
          }
        }
        return response;
      }
      _run_fail_handlers(response) {
        if (this.inject_objects.length > 0) {
          for (const inj_obj of this.inject_objects) {
            if (inj_obj.fail_handler)
              response = inj_obj.fail_handler(response);
          }
        }
        return response;
      }
      async_res(handler, name) {
        return (param_object) => __awaiter(this, void 0, void 0, function* () {
          try {
            const response = {
              status: 200,
              success: true,
              payload: yield handler(param_object)
            };
            return this._run_success_handlers(response);
          } catch (ex) {
            return this.return_error(500, "URANIO ERROR [" + name + "] - " + ex.message, ex.code, ex.msg, null, ex);
          }
        });
      }
      res(handler, name) {
        return (param_object) => {
          try {
            const response = {
              status: 200,
              success: true,
              payload: handler(param_object)
            };
            return this._run_success_handlers(response);
          } catch (ex) {
            return this.return_error(500, "URANIO ERROR [" + name + "] - " + ex.message, ex.code, ex.msg, null, ex);
          }
        };
      }
      inherit_res(result, name) {
        const return_result = {
          status: 200,
          message: "",
          success: false,
          err_code: "",
          err_msg: "",
          payload: null
        };
        if ((0, index_1.is_fail)(result)) {
          return_result.status = result.status;
          return_result.message = name ? name + " - " + result.message : result.message;
          return_result.ex = result.ex;
          return return_result;
        }
        if (!(0, index_1.is_fail)(result.payload) && !(0, index_1.is_success)(result.payload)) {
          return_result.message = name ? name + " - " + result.message : result.message;
          return return_result;
        }
        if ((0, index_1.is_fail)(result.payload)) {
          return_result.status = result.payload.status;
          return_result.message = name ? name + " - " + result.payload.message : result.payload.message;
          return_result.ex = result.payload.ex;
          return return_result;
        }
        return_result.message = name ? name + " - " + result.payload.message : result.payload.message;
        return_result.payload = result.payload.payload;
        return return_result;
      }
      return_error(status, message, err_code, err_msg, payload, ex) {
        if (arguments.length > 4) {
          const urn_response = {
            status,
            message,
            err_code,
            err_msg,
            ex: ex ? ex : null,
            payload,
            success: false
          };
          return this._run_fail_handlers(urn_response);
        } else {
          const urn_response = {
            status,
            message,
            err_code,
            err_msg,
            ex: null,
            payload: null,
            success: false
          };
          return this._run_fail_handlers(urn_response);
        }
      }
      return_success(message, payload) {
        if (arguments.length > 1) {
          const urn_response = {
            status: 200,
            success: true,
            message,
            payload
          };
          return this._run_success_handlers(urn_response);
        } else {
          const urn_response = {
            status: 200,
            success: true,
            message,
            payload: null
          };
          return this._run_success_handlers(urn_response);
        }
      }
      return_true(message) {
        const urn_boolean = {
          success: true
        };
        if (arguments.length > 0)
          urn_boolean.message = message;
        return urn_boolean;
      }
      return_false(message) {
        const urn_boolean = {
          success: false
        };
        if (arguments.length > 0)
          urn_boolean.message = message;
        return urn_boolean;
      }
    };
    function create_instance(inject) {
      urn_log3.fn_debug("create for URNReturn");
      return new URNReturn(inject);
    }
    exports.default = create_instance;
  }
});

// node_modules/urn-lib/dist/return/index.js
var require_return2 = __commonJS({
  "node_modules/urn-lib/dist/return/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.create = void 0;
    __exportStar(require_types3(), exports);
    var return_1 = __importDefault(require_return());
    exports.create = return_1.default;
  }
});

// node_modules/urn-lib/dist/util/object.js
var require_object = __commonJS({
  "node_modules/urn-lib/dist/util/object.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.serialize = exports.has_key = void 0;
    function has_key(obj, key) {
      return key in obj;
    }
    exports.has_key = has_key;
    function serialize(obj, prefix = "") {
      const str = [];
      if (typeof obj !== "object") {
        return "";
      }
      for (const p in obj) {
        if (has_key(obj, p)) {
          const k = prefix ? prefix + "[" + p + "]" : p;
          const v = obj[p];
          str.push(v !== null && typeof v === "object" ? serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
      }
      return str.join("&");
    }
    exports.serialize = serialize;
  }
});

// node_modules/urn-lib/dist/util/validate.js
var require_validate = __commonJS({
  "node_modules/urn-lib/dist/util/validate.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.email = exports.date = void 0;
    function date(v) {
      return Object.prototype.toString.call(v) === "[object Date]";
    }
    exports.date = date;
    function email(v) {
      return /\S+@\S+\.\S+/.test(v);
    }
    exports.email = email;
  }
});

// node_modules/urn-lib/dist/util/number.js
var require_number = __commonJS({
  "node_modules/urn-lib/dist/util/number.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.format = void 0;
    function format(num, digits) {
      const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
      ];
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      const item = lookup.slice().reverse().find(function(item2) {
        return num >= item2.value;
      });
      return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    }
    exports.format = format;
  }
});

// node_modules/urn-lib/dist/util/string.js
var require_string = __commonJS({
  "node_modules/urn-lib/dist/util/string.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ucfirst = void 0;
    function ucfirst(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    exports.ucfirst = ucfirst;
  }
});

// node_modules/urn-lib/dist/util/index.js
var require_util2 = __commonJS({
  "node_modules/urn-lib/dist/util/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.string = exports.number = exports.json = exports.is = exports.object = void 0;
    var object = __importStar(require_object());
    exports.object = object;
    var is = __importStar(require_validate());
    exports.is = is;
    var json = __importStar(require_json());
    exports.json = json;
    var number = __importStar(require_number());
    exports.number = number;
    var string = __importStar(require_string());
    exports.string = string;
  }
});

// node_modules/urn-lib/dist/exception/types.js
var require_types4 = __commonJS({
  "node_modules/urn-lib/dist/exception/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ExceptionType = void 0;
    var ExceptionType;
    (function(ExceptionType2) {
      ExceptionType2["GENERAL"] = "GENERAL";
      ExceptionType2["NOT_FOUND"] = "NOTFOUND";
      ExceptionType2["AUTH_NOT_FOUND"] = "AUTH_NOTFOUND";
      ExceptionType2["INVALID_ATOM"] = "INVALID_ATOM";
      ExceptionType2["UNAUTHORIZED"] = "UNAUTHORIZED";
      ExceptionType2["INVALID_REQUEST"] = "INVALID_REQUEST";
      ExceptionType2["AUTH_INVALID_PASSWORD"] = "AUTH_INVALID_PASSWORD";
      ExceptionType2["NOT_INITIALIZED"] = "NOT_INITIALIZED";
      ExceptionType2["INVALID_BOOK"] = "INVALID_BOOK";
    })(ExceptionType = exports.ExceptionType || (exports.ExceptionType = {}));
  }
});

// node_modules/urn-lib/dist/exception/exception.js
var require_exception = __commonJS({
  "node_modules/urn-lib/dist/exception/exception.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.init = void 0;
    var types_1 = require_types4();
    var URNException = class extends Error {
      constructor(module_code, module_name, error_code, msg, nested) {
        super();
        this.module_code = module_code;
        this.module_name = module_name;
        this.error_code = error_code;
        this.msg = msg;
        this.nested = nested;
        this.name = "URANIOException";
        this.type = types_1.ExceptionType.GENERAL;
        this.message = `[${module_code}_${error_code}]`;
        this.message += ` ${module_name}. ${msg}`;
        if (nested && nested.message)
          this.message += ` ${nested.message}`;
        const actual_prototype = new.target.prototype;
        Object.setPrototypeOf(this, actual_prototype);
        this.date = new Date();
      }
    };
    var URNNotFoundException = class extends URNException {
      constructor() {
        super(...arguments);
        this.name = "URANIONotFoundException";
        this.type = types_1.ExceptionType.NOT_FOUND;
      }
    };
    var URNAuthNotFoundException = class extends URNNotFoundException {
      constructor() {
        super(...arguments);
        this.name = "URANIOAuthNotFoundException";
        this.type = types_1.ExceptionType.AUTH_NOT_FOUND;
      }
    };
    var URNInvalidAtomException = class extends URNException {
      constructor(module_code, module_name, error_code, msg, object, keys, nested) {
        super(module_code, module_name, error_code, msg, nested);
        this.object = object;
        this.keys = keys;
        this.name = "URANIOInvalidAtomException";
        this.type = types_1.ExceptionType.INVALID_ATOM;
      }
    };
    var URNUnauthorizedException = class extends URNException {
      constructor() {
        super(...arguments);
        this.name = "URANIOUnauthorizedException";
        this.type = types_1.ExceptionType.UNAUTHORIZED;
      }
    };
    var URNInvalidRequestException = class extends URNException {
      constructor() {
        super(...arguments);
        this.name = "URANIOInvalidRequestException";
        this.type = types_1.ExceptionType.INVALID_REQUEST;
      }
    };
    var URNAuthInvalidPasswordException = class extends URNInvalidRequestException {
      constructor() {
        super(...arguments);
        this.name = "URANIOAuthInvalidPasswordException";
        this.type = types_1.ExceptionType.AUTH_INVALID_PASSWORD;
      }
    };
    var URNNotInitializedException = class extends URNException {
      constructor() {
        super(...arguments);
        this.name = "URANIONotInitializedException";
        this.type = types_1.ExceptionType.NOT_INITIALIZED;
      }
    };
    var URNInvalidBookException = class extends URNException {
      constructor() {
        super(...arguments);
        this.name = "URANIOInvalidBookException";
        this.type = types_1.ExceptionType.INVALID_BOOK;
      }
    };
    function init(module_code, module_name) {
      return {
        create: function(err_code, msg, nested) {
          return new URNException(module_code, module_name, err_code, msg, nested);
        },
        create_not_found: function(err_code, msg, nested) {
          return new URNNotFoundException(module_code, module_name, err_code, msg, nested);
        },
        create_auth_not_found: function(err_code, msg, nested) {
          return new URNAuthNotFoundException(module_code, module_name, err_code, msg, nested);
        },
        create_invalid_atom: function(err_code, msg, object, keys, nested) {
          return new URNInvalidAtomException(module_code, module_name, err_code, msg, object, keys, nested);
        },
        create_unauthorized: function(err_code, msg, nested) {
          return new URNUnauthorizedException(module_code, module_name, err_code, msg, nested);
        },
        create_invalid_request: function(err_code, msg, nested) {
          return new URNInvalidRequestException(module_code, module_name, err_code, msg, nested);
        },
        create_auth_invalid_password: function(err_code, msg, nested) {
          return new URNAuthInvalidPasswordException(module_code, module_name, err_code, msg, nested);
        },
        create_not_initialized: function(err_code, msg, nested) {
          return new URNNotInitializedException(module_code, module_name, err_code, msg, nested);
        },
        create_invalid_book: function(err_code, msg, nested) {
          return new URNInvalidBookException(module_code, module_name, err_code, msg, nested);
        }
      };
    }
    exports.init = init;
  }
});

// node_modules/urn-lib/dist/exception/index.js
var require_exception2 = __commonJS({
  "node_modules/urn-lib/dist/exception/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_exception(), exports);
    __exportStar(require_types4(), exports);
  }
});

// node_modules/urn-lib/dist/main.js
var require_main = __commonJS({
  "node_modules/urn-lib/dist/main.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.urn_lib = exports.urn_exception = exports.urn_util = exports.urn_return = exports.urn_response = exports.urn_log = void 0;
    var urn_log3 = __importStar(require_log2());
    exports.urn_log = urn_log3;
    var urn_response = __importStar(require_response2());
    exports.urn_response = urn_response;
    var urn_return = __importStar(require_return2());
    exports.urn_return = urn_return;
    var urn_util3 = __importStar(require_util2());
    exports.urn_util = urn_util3;
    var urn_exception3 = __importStar(require_exception2());
    exports.urn_exception = urn_exception3;
    var urn_lib;
    (function(urn_lib2) {
      urn_lib2.log = urn_log3;
      urn_lib2.response = urn_response;
      urn_lib2.ureturn = urn_return;
      urn_lib2.util = urn_util3;
      urn_lib2.exception = urn_exception3;
    })(urn_lib = exports.urn_lib || (exports.urn_lib = {}));
  }
});

// node_modules/urn-lib/dist/index.js
var require_dist = __commonJS({
  "node_modules/urn-lib/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.urn_exception = exports.urn_util = exports.urn_return = exports.urn_response = exports.urn_log = void 0;
    var main_1 = require_main();
    Object.defineProperty(exports, "urn_log", { enumerable: true, get: function() {
      return main_1.urn_log;
    } });
    Object.defineProperty(exports, "urn_response", { enumerable: true, get: function() {
      return main_1.urn_response;
    } });
    Object.defineProperty(exports, "urn_return", { enumerable: true, get: function() {
      return main_1.urn_return;
    } });
    Object.defineProperty(exports, "urn_util", { enumerable: true, get: function() {
      return main_1.urn_util;
    } });
    Object.defineProperty(exports, "urn_exception", { enumerable: true, get: function() {
      return main_1.urn_exception;
    } });
    exports.default = main_1.urn_lib;
  }
});

// src/generate.ts
var generate_exports2 = {};

// src/reg/register.ts
var import_path = __toESM(require("path"));
var import_caller = __toESM(require_caller());
var import_urn_lib2 = __toESM(require_dist());

// src/atoms.ts
var atom_book = {
  superuser: {
    authenticate: true,
    plural: "superusers",
    security: {
      type: "UNIFORM" /* UNIFORM */,
      _r: "NOBODY" /* NOBODY */
    },
    properties: {
      email: {
        type: "EMAIL" /* EMAIL */,
        label: "Email",
        unique: true,
        on_error: () => {
          return "email@email.com";
        }
      },
      password: {
        type: "ENCRYPTED" /* ENCRYPTED */,
        label: "Password",
        hidden: true
      },
      groups: {
        type: "ATOM_ARRAY" /* ATOM_ARRAY */,
        atom: "group",
        label: "Groups",
        optional: true
      }
    },
    dock: {
      url: "/superusers",
      auth_url: "/superauth"
    }
  },
  user: {
    authenticate: true,
    plural: "users",
    security: {
      type: "GRANULAR" /* GRANULAR */
    },
    properties: {
      email: {
        type: "EMAIL" /* EMAIL */,
        label: "Email",
        unique: true
      },
      password: {
        type: "ENCRYPTED" /* ENCRYPTED */,
        label: "Password",
        hidden: true
      },
      groups: {
        type: "ATOM_ARRAY" /* ATOM_ARRAY */,
        atom: "group",
        label: "Groups",
        optional: true
      }
    },
    dock: {
      url: "/users",
      auth_url: "/auth"
    }
  },
  group: {
    plural: "groups",
    properties: {
      name: {
        type: "TEXT" /* TEXT */,
        unique: true,
        label: "Name"
      }
    },
    dock: {
      url: "/groups"
    }
  },
  media: {
    plural: "media",
    properties: {
      src: {
        type: "TEXT" /* TEXT */,
        label: "SRC"
      },
      filename: {
        primary: true,
        type: "TEXT" /* TEXT */,
        label: "Filename"
      },
      type: {
        type: "TEXT" /* TEXT */,
        label: "Filetype"
      },
      size: {
        type: "INTEGER" /* INTEGER */,
        label: "Size (byte)",
        validation: {
          min: 0
        }
      },
      width: {
        optional: true,
        type: "INTEGER" /* INTEGER */,
        label: "Width",
        validation: {
          min: 0
        }
      },
      height: {
        optional: true,
        type: "INTEGER" /* INTEGER */,
        label: "Height",
        validation: {
          min: 0
        }
      }
    },
    dock: {
      url: "/media"
    }
  }
};

// src/book/client.ts
var import_urn_lib = __toESM(require_dist());

// src/stc/static.ts
var atom_hard_properties = {
  _id: {
    type: "ID" /* ID */,
    label: "_id"
  },
  _date: {
    type: "TIME" /* TIME */,
    label: "_date",
    default: "NOW",
    on_error: () => {
      return new Date();
    }
  }
};
var atom_common_properties = {
  _r: {
    type: "ID" /* ID */,
    label: "_r",
    optional: true
  },
  _w: {
    type: "ID" /* ID */,
    label: "_w",
    optional: true
  },
  _deleted_from: {
    type: "ID" /* ID */,
    label: "Deleted from",
    optional: true
  }
};
var real_book_property_type = {
  ID: "string",
  TEXT: "string",
  LONG_TEXT: "string",
  EMAIL: "string",
  INTEGER: "number",
  FLOAT: "number",
  BINARY: "boolean",
  ENCRYPTED: "string",
  DAY: "datetime",
  TIME: "datetime",
  ENUM_STRING: "string",
  ENUM_NUMBER: "number",
  SET_STRING: "string[]",
  SET_NUMBER: "number[]",
  ATOM: "object",
  ATOM_ARRAY: "object[]"
};

// src/book/client.ts
var urn_exc = import_urn_lib.urn_exception.init("BOOK_METHODS_MODULE", `Book methods module`);

// src/book/server.ts
function add_definition(atom_name, atom_definition) {
  const atom_book_def = {};
  atom_book_def[atom_name] = atom_definition;
  Object.assign(atom_book, { ...atom_book_def, ...atom_book });
  return atom_book;
}
function get_all_definitions() {
  return atom_book;
}

// src/reg/register.ts
function register(atom_definition, atom_name) {
  let final_atom_name = `undefined_atom`;
  if (atom_name) {
    final_atom_name = atom_name;
  } else {
    const caller_path = (0, import_caller.default)();
    const dirname = import_path.default.dirname(caller_path);
    final_atom_name = dirname.split("/").slice(-1)[0].replace(".", "_").replace("-", "_");
  }
  import_urn_lib2.urn_log.debug(`Registering atom [${final_atom_name}]...`);
  add_definition(final_atom_name, atom_definition);
  import_urn_lib2.urn_log.debug(`Atom [${final_atom_name}] registered.`);
  return final_atom_name;
}

// src/register.ts
for (const [atom_name, atom_def] of Object.entries(atom_book)) {
  register(atom_def, atom_name);
}

// src/util/generate.ts
var generate_exports = {};
__export(generate_exports, {
  process_params: () => process_params,
  save_schema: () => save_schema,
  schema: () => schema,
  schema_and_save: () => schema_and_save
});
var import_fs = __toESM(require("fs"));
var import_urn_lib3 = __toESM(require_dist());
var urn_exc2 = import_urn_lib3.urn_exception.init(`REGISTER_MODULE`, `Register module.`);
var process_params = {
  urn_command: `schema`,
  urn_base_schema: `./types/schema.d.ts`,
  urn_output_dir: `.`
};
function schema() {
  import_urn_lib3.urn_log.debug("Started generating uranio core schema...");
  _init_generate();
  const text = _generate_uranio_schema_text();
  import_urn_lib3.urn_log.debug(`Core schema generated.`);
  return text;
}
function schema_and_save() {
  const text = schema();
  save_schema(text);
  import_urn_lib3.urn_log.debug(`Schema generated and saved.`);
}
function save_schema(text) {
  import_fs.default.writeFileSync(`${process_params.urn_output_dir}/schema.d.ts`, text);
}
function _init_generate() {
  process_params.urn_command = process.argv[0];
  for (const argv of process.argv) {
    const splitted = argv.split("=");
    if (splitted[0] === "urn_base_schema" && typeof splitted[1] === "string" && splitted[1] !== "") {
      process_params.urn_base_schema = splitted[1];
    } else if (splitted[0] === "urn_output_dir" && typeof splitted[1] === "string" && splitted[1] !== "") {
      process_params.urn_output_dir = splitted[1];
    }
  }
}
function _generate_uranio_schema_text() {
  const txt = _generate_schema_text();
  const data = import_fs.default.readFileSync(process_params.urn_base_schema, { encoding: "utf8" });
  const data_start = data.split("/** --uranio-generate-start */");
  const data_end = data_start[1].split("/** --uranio-generate-end */");
  let new_data = "";
  new_data += data_start[0];
  new_data += `/** --uranio-generate-start */

`;
  new_data += txt;
  +"\n\n";
  new_data += `/** --uranio-generate-end */`;
  new_data += data_end[1];
  return new_data;
}
function _generate_schema_text() {
  const atom_book2 = get_all_definitions();
  const atom_names = [];
  const auth_names = [];
  const log_names = [];
  for (const [atom_name, atom_def] of Object.entries(atom_book2)) {
    atom_names.push(atom_name);
    if (atom_def.authenticate === true) {
      auth_names.push(atom_name);
    }
    if (atom_def.connection === "log") {
      log_names.push(atom_name);
    }
  }
  let txt = "";
  txt += _generate_union_names(`AtomName`, atom_names);
  txt += _generate_union_names(`AuthName`, auth_names);
  txt += _generate_union_names(`LogName`, log_names);
  txt += _generate_atom_shapes(atom_book2);
  txt += _generate_bond_properties(atom_book2);
  txt += _generate_bond_shape_depth(0, atom_book2);
  txt += _generate_bond_shape_depth(1, atom_book2);
  txt += _generate_bond_shape_depth(2, atom_book2);
  txt += _generate_bond_shape_depth(3, atom_book2);
  txt += _generate_atom_types(atom_names);
  txt += _generate_atom_shape_type(atom_names);
  txt += _generate_atom_type(atom_names);
  txt += _generate_last_export();
  return txt;
}
function _generate_last_export() {
  return "\n	export {};";
}
function _generate_atom_type(atom_names) {
  let text = "";
  text += `	export type Atom<A extends AtomName> =
`;
  for (const atom_name of atom_names) {
    text += `		A extends '${atom_name}' ? ${_atom_type_name(atom_name)} :
`;
  }
  text += `		never

`;
  return text;
}
function _generate_atom_shape_type(atom_names) {
  let text = "";
  text += `	export type AtomShape<A extends AtomName> =
`;
  for (const atom_name of atom_names) {
    text += `		A extends '${atom_name}' ? ${_atom_shape_type_name(atom_name)} :
`;
  }
  text += `		never

`;
  return text;
}
function _atom_type_name(atom_name) {
  return `${import_urn_lib3.urn_util.string.ucfirst(atom_name)}`;
}
function _atom_shape_type_name(atom_name) {
  return `${_atom_type_name(atom_name)}Shape`;
}
function _generate_atom_types(atom_names) {
  let text = "";
  for (const atom_name of atom_names) {
    text += `	type ${_atom_type_name(atom_name)} =`;
    text += ` AtomHardProperties & ${_atom_shape_type_name(atom_name)}

`;
  }
  return text;
}
function _generate_bond_shape_depth(depth, atom_book2) {
  let label = "1";
  let atom_molecule = "Atom";
  let molecule_depth = "";
  switch (depth) {
    case 0: {
      label = "1";
      atom_molecule = "Atom";
      molecule_depth = "";
      break;
    }
    case 1: {
      label = "2";
      atom_molecule = "Molecule";
      molecule_depth = ", 1";
      break;
    }
    case 2: {
      label = "3";
      atom_molecule = "Molecule";
      molecule_depth = ", 2";
      break;
    }
    case 3: {
      label = "4";
      atom_molecule = "Molecule";
      molecule_depth = ", 3";
      break;
    }
  }
  let text = "";
  text += `	type BondShapeDepth${label}<A extends AtomName> =
`;
  for (const [atom_name, atom_def] of Object.entries(atom_book2)) {
    const bonds = [];
    for (const [key, prop_def] of Object.entries(atom_def.properties)) {
      const optional = prop_def.optional === true ? "?" : "";
      if (prop_def.type === "ATOM" /* ATOM */) {
        if (typeof prop_def.atom !== "string" || prop_def.atom === "") {
          urn_exc2.create_invalid_book(`INVALID_PROP_ATOM_NAME`, `Invalid property atom name form property \`key\`.`);
        }
        bonds.push(`${key}${optional}: ${atom_molecule}<'${prop_def.atom}'${molecule_depth}>`);
      } else if (prop_def.type === "ATOM_ARRAY" /* ATOM_ARRAY */) {
        if (typeof prop_def.atom !== "string" || prop_def.atom === "") {
          urn_exc2.create_invalid_book(`INVALID_PROP_ATOM_ARRAY__NAME`, `Invalid property atom name form property \`key\`.`);
        }
        bonds.push(`${key}${optional}: ${atom_molecule}<'${prop_def.atom}'${molecule_depth}>[]`);
      }
    }
    const bond_obj = bonds.length > 0 ? `{${bonds.join(", ")}}` : "never";
    text += `		A extends '${atom_name}' ? ${bond_obj} :
`;
  }
  text += `		never

`;
  return text;
}
function _generate_bond_properties(atom_book2) {
  let text = "";
  text += `	type BondProperties<A extends AtomName> =
`;
  for (const [atom_name, atom_def] of Object.entries(atom_book2)) {
    const bond_props = [];
    for (const [key, prop_def] of Object.entries(atom_def.properties)) {
      if (prop_def.type === "ATOM" /* ATOM */ || prop_def.type === "ATOM_ARRAY" /* ATOM_ARRAY */) {
        bond_props.push(key);
      }
    }
    const bond_prop_union = bond_props.length > 0 ? bond_props.map((n) => `'${n}'`).join(" | ") : "never";
    text += `		A extends '${atom_name}' ? ${bond_prop_union} :
`;
  }
  text += `		never

`;
  return text;
}
function _generate_atom_shapes(atom_book2) {
  let text = "";
  for (const [atom_name, atom_def] of Object.entries(atom_book2)) {
    text += `	type ${_atom_shape_type_name(atom_name)} = AtomCommonProperties & {
`;
    for (const [key, prop_def] of Object.entries(atom_def.properties)) {
      const optional = prop_def.optional === true ? "?" : "";
      switch (prop_def.type) {
        case "ATOM" /* ATOM */: {
          text += `		${key}${optional}: string
`;
          break;
        }
        case "ATOM_ARRAY" /* ATOM_ARRAY */: {
          text += `		${key}${optional}: string[]
`;
          break;
        }
        default: {
          text += `		${key}${optional}: ${real_book_property_type[prop_def.type]}
`;
        }
      }
    }
    text += `	}

`;
  }
  return text;
}
function _generate_union_names(type_name, names) {
  const union = names.length > 0 ? names.map((n) => `'${n}'`).join(" | ") : "never";
  return `	export type ${type_name} = ${union}

`;
}

// src/generate.ts
generate_exports.schema_and_save();
module.exports = __toCommonJS(generate_exports2);
