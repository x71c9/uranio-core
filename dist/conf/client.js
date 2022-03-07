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
exports.set = exports.set_from_file = exports.set_initialize = exports.is_initialized = exports.get = exports.defaults = void 0;
const fs_1 = __importDefault(require("fs"));
const minimist_1 = __importDefault(require("minimist"));
const toml_1 = __importDefault(require("toml"));
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('CONF_CORE_CLIENT_MODULE', `Core client configuration module`);
const default_conf_1 = require("../client/default_conf");
Object.defineProperty(exports, "defaults", { enumerable: true, get: function () { return default_conf_1.core_client_config; } });
let _is_client_core_initialized = false;
function get(param_name) {
    _check_if_uranio_was_initialized();
    _check_if_param_exists(param_name);
    return default_conf_1.core_client_config[param_name];
}
exports.get = get;
function is_initialized() {
    return _is_client_core_initialized;
}
exports.is_initialized = is_initialized;
function set_initialize(is_initialized) {
    _is_client_core_initialized = is_initialized;
}
exports.set_initialize = set_initialize;
// export function set_from_env(repo_config:Required<types.ClientConfiguration>):void{
//   const config = _get_env_vars(repo_config);
//   set(repo_config, config);
// }
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
        set(default_conf_1.core_client_config, parsed_toml);
    }
    catch (err) {
        throw urn_exc.create(`IVALID_TOML_CONF_FILE`, `Invalid toml config file.`, err);
    }
}
exports.set_from_file = set_from_file;
function set(repo_config, config) {
    _validate_config_types(repo_config, config);
    for (const [conf_key, conf_value] of Object.entries(config)) {
        repo_config[conf_key] = conf_value;
    }
    // Object.assign(repo_config, config);
}
exports.set = set;
function _check_if_param_exists(param_name) {
    return urn_lib_1.urn_util.object.has_key(default_conf_1.core_client_config, param_name);
}
function _check_if_uranio_was_initialized() {
    if (is_initialized() === false) {
        throw urn_exc.create_not_initialized(`NOT_INITIALIZED`, `Uranio was not initialized. Please run \`uranio.init()\` in your main file.`);
    }
}
function _validate_config_types(repo_config, config) {
    for (const [config_key, config_value] of Object.entries(config)) {
        const key = config_key;
        if (typeof config_value !== typeof repo_config[key]) {
            throw urn_exc.create_not_initialized(`INVALID_CLIENT_CONFIG_VALUE`, `Invalid client config value for \`${config_key}\`. \`${config_key}\` value ` +
                ` must be of type \`${typeof repo_config[key]}\`,` +
                `\`${typeof config_value}\` given.`);
        }
    }
}
// function _get_env_vars(repo_config:types.ClientConfiguration):types.ClientConfiguration{
//   if(
//     typeof process.env.URN_LOG_LEVEL === 'number'
//     || typeof process.env.URN_LOG_LEVEL === 'string'
//     && process.env.URN_LOG_LEVEL !== ''
//   ){
//     repo_config.log_level = Number(process.env.URN_LOG_LEVEL);
//   }
//   return repo_config;
// }
//# sourceMappingURL=client.js.map