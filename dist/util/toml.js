"use strict";
/**
 * Read TOML module
 *
 * @packageDocumentation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.read = void 0;
const fs_1 = __importDefault(require("fs"));
const minimist_1 = __importDefault(require("minimist"));
const toml_1 = __importDefault(require("toml"));
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('CORE_UTIL_TOML_MODULE', `Core util toml  module`);
function read() {
    let toml_config_path = './uranio.toml';
    const args = (0, minimist_1.default)(process.argv.slice(2));
    if (args.c) {
        toml_config_path = args.c;
    }
    else if (args.config) {
        toml_config_path = args.c;
    }
    if (!fs_1.default.existsSync(toml_config_path)) {
        urn_lib_1.urn_log.warn(`Missing TOML configuration file.`);
        return {};
    }
    try {
        const toml_data = fs_1.default.readFileSync(toml_config_path);
        const parsed_toml = toml_1.default.parse(toml_data.toString('utf8'));
        const converted_toml = _conver_toml(parsed_toml);
        return converted_toml;
    }
    catch (err) {
        throw urn_exc.create(`IVALID_TOML_CONF_FILE`, `Invalid toml config file.`, err);
    }
}
exports.read = read;
function _conver_toml(parsed_toml) {
    const converted_config = {};
    for (const [key, value] of Object.entries(parsed_toml)) {
        if (value === null || value === undefined) {
            continue;
        }
        if (typeof value === 'object') {
            _convert_subobject(converted_config, key, value);
        }
        else {
            converted_config[key] = value;
        }
    }
    return converted_config;
}
function _convert_subobject(config, key, obj) {
    for (const [subkey, subvalue] of Object.entries(obj)) {
        if (subvalue === null || subvalue === undefined) {
            continue;
        }
        const full_key = `${key}_${subkey}`;
        if (typeof subvalue === 'object') {
            _convert_subobject(config, full_key, subvalue);
        }
        else {
            config[full_key] = subvalue;
        }
    }
    return config;
}
//# sourceMappingURL=toml.js.map