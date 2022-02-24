"use strict";
/**
 * Conf module
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = exports.set_from_env = exports.set_initialize = exports.is_initialized = exports.get = exports.defaults = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('CONF_CORE_CLIENT_MODULE', `Core client configuration module`);
const defaults_1 = require("../client/defaults");
Object.defineProperty(exports, "defaults", { enumerable: true, get: function () { return defaults_1.core_client_config; } });
let _is_client_core_initialized = false;
function get(param_name) {
    _check_if_uranio_was_initialized();
    _check_if_param_exists(param_name);
    return defaults_1.core_client_config[param_name];
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
function set_from_env(repo_config) {
    const config = _get_env_vars(repo_config);
    set(repo_config, config);
}
exports.set_from_env = set_from_env;
function set(repo_config, config) {
    _validate_config_types(repo_config, config);
    Object.assign(repo_config, config);
}
exports.set = set;
function _check_if_param_exists(param_name) {
    return urn_lib_1.urn_util.object.has_key(defaults_1.core_client_config, param_name);
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
function _get_env_vars(repo_config) {
    if (typeof process.env.URN_LOG_LEVEL === 'number'
        || typeof process.env.URN_LOG_LEVEL === 'string'
            && process.env.URN_LOG_LEVEL !== '') {
        repo_config.log_level = Number(process.env.URN_LOG_LEVEL);
    }
    return repo_config;
}
//# sourceMappingURL=client.js.map