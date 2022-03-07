"use strict";
/**
 * Conf module
 *
 * @packageDocumentation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.set_from_file = exports.set = exports.set_initialize = exports.is_initialized = exports.get = exports.defaults = void 0;
const fs_1 = __importDefault(require("fs"));
const minimist_1 = __importDefault(require("minimist"));
const toml_1 = __importDefault(require("toml"));
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('CONF_CORE_MODULE', `Core configuration module`);
const defaults_1 = require("./defaults");
Object.defineProperty(exports, "defaults", { enumerable: true, get: function () { return defaults_1.core_config; } });
let _is_core_initialized = false;
function get(param_name) {
    _check_if_uranio_was_initialized();
    _check_if_param_exists(param_name);
    return defaults_1.core_config[param_name];
}
exports.get = get;
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
function set_from_file() {
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
        set(defaults_1.core_config, parsed_toml);
    }
    catch (err) {
        throw urn_exc.create(`IVALID_TOML_CONF_FILE`, `Invalid toml config file.`, err);
    }
}
exports.set_from_file = set_from_file;
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
    for (const [config_key, config_value] of Object.entries(repo_config)) {
        const key = config_key;
        if (typeof config[key] !== 'undefined' && typeof config_value !== typeof config[key]) {
            throw urn_exc.create_not_initialized(`INVALID_CONFIG_VALUE`, `Invalid config value for \`${config_key}\`. \`${config_key}\` value ` +
                ` must be of type \`${typeof repo_config[key]}\`, ` +
                `\`${typeof config[key]}\` given.`);
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