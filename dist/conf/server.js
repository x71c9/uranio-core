"use strict";
/**
 * Conf module
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.set_from_file = exports.set = exports.set_initialize = exports.is_initialized = exports.object = exports.get_current = exports.get = exports.defaults = void 0;
const fs_1 = __importDefault(require("fs"));
const minimist_1 = __importDefault(require("minimist"));
const toml_1 = __importDefault(require("toml"));
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('CONF_CORE_MODULE', `Core configuration module`);
const defaults_1 = require("./defaults");
Object.defineProperty(exports, "defaults", { enumerable: true, get: function () { return defaults_1.core_config; } });
const env = __importStar(require("../env/server"));
let _is_core_initialized = false;
function get(param_name) {
    _check_if_uranio_was_initialized();
    _check_if_param_exists(param_name);
    return defaults_1.core_config[param_name];
}
exports.get = get;
function get_current(param_name) {
    const pro_value = get(param_name);
    if (env.is_production()) {
        return pro_value;
    }
    if (param_name.indexOf('log_') !== -1) {
        const dev_param = param_name.replace('log_', 'log_dev_');
        const dev_value = get(dev_param);
        if (typeof dev_value === typeof defaults_1.core_config[dev_param]) {
            return dev_value;
        }
    }
    return pro_value;
}
exports.get_current = get_current;
function object() {
    _check_if_uranio_was_initialized();
    return defaults_1.core_config;
}
exports.object = object;
function is_initialized() {
    return _is_core_initialized;
}
exports.is_initialized = is_initialized;
function set_initialize(is_initialized) {
    _is_core_initialized = is_initialized;
}
exports.set_initialize = set_initialize;
// export function set_from_env(repo_config:Required<Configuration>):void{
//   const config = _get_env_vars(repo_config);
//   set(repo_config, config);
// }
function set(repo_config, config) {
    _validate_config_types(repo_config, config);
    for (const [conf_key, conf_value] of Object.entries(config)) {
        repo_config[conf_key] = conf_value;
    }
    // Object.assign(repo_config, config);
}
exports.set = set;
function set_from_file(repo_config) {
    let toml_config_path = './uranio.toml';
    const args = (0, minimist_1.default)(process.argv.slice(2));
    if (args.c) {
        toml_config_path = args.c;
    }
    if (!fs_1.default.existsSync(toml_config_path)) {
        urn_lib_1.urn_log.warn(`Missing TOML configuration file.`);
        return;
    }
    try {
        const toml_data = fs_1.default.readFileSync(toml_config_path);
        const parsed_toml = toml_1.default.parse(toml_data.toString('utf8'));
        const converted_toml = _conver_toml(parsed_toml);
        set(repo_config, converted_toml);
    }
    catch (err) {
        throw urn_exc.create(`IVALID_TOML_CONF_FILE`, `Invalid toml config file.`, err);
    }
}
exports.set_from_file = set_from_file;
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
// function _get_env_vars(repo_config:Configuration):Configuration{
//   const config:Configuration = {} as Configuration;
//   for(const [conf_key, conf_value] of Object.entries(repo_config)){
//     const env_var_name = `URN_${conf_key.toUpperCase()}`;
//     switch(typeof conf_value){
//       case 'number':{
//         if(
//           typeof process.env[env_var_name] === 'number'
//           || typeof process.env[env_var_name] === 'string'
//           && process.env[env_var_name] !== ''
//         ){
//           (config as any)[conf_key] = Number(process.env[env_var_name]);
//         }
//         break;
//       }
//       case 'boolean':{
//         if(
//           typeof process.env[env_var_name] === 'boolean'
//           || typeof process.env[env_var_name] === 'string'
//           && process.env[env_var_name] !== ''
//         ){
//           (config as any)[conf_key] =
//             (process.env[env_var_name] === 'true')
//             || (process.env[env_var_name] as any === true);
//         }
//         break;
//       }
//       case 'string':{
//         if(
//           typeof process.env[env_var_name] === 'string'
//           && process.env[env_var_name] !== ''
//         ){
//           (config as any)[conf_key] = process.env[env_var_name];
//         }
//         break;
//       }
//     }
//   }
//   return config;
// }
function _validate_config_types(repo_config, config) {
    _validate_object_types(config, repo_config);
}
function _validate_object_types(obj, repo_obj) {
    for (const [repo_key, repo_value] of Object.entries(repo_obj)) {
        const key = repo_key;
        const subconf = obj[key];
        if (!subconf || typeof subconf === 'undefined') {
            continue;
        }
        if (typeof subconf === 'object') {
            _validate_object_types(subconf, repo_value);
        }
        else if (typeof repo_value !== typeof subconf) {
            throw urn_exc.create_not_initialized(`INVALID_CONFIG_VALUE`, `Invalid config value for \`${repo_key}\`. \`${repo_key}\` value ` +
                ` must be of type \`${typeof repo_value}\`, ` +
                `\`${typeof subconf}\` given.`);
        }
    }
}
function _check_if_param_exists(param_name) {
    return urn_lib_1.urn_util.object.has_key(defaults_1.core_config, param_name);
}
function _check_if_uranio_was_initialized() {
    if (is_initialized() === false) {
        throw urn_exc.create_not_initialized(`NOT_INITIALIZED`, `Uranio was not initialized. Please run \`uranio.init()\` in your main file.`);
    }
}
//# sourceMappingURL=server.js.map