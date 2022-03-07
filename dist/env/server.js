"use strict";
/**
 * Env module
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.set_from_env = exports.set_initialize = exports.is_initialized = exports.get = exports.defaults = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('CORE_ENV_MODULE', `Core environment module`);
const defaults_1 = require("./defaults");
Object.defineProperty(exports, "defaults", { enumerable: true, get: function () { return defaults_1.core_env; } });
let _is_core_initialized = false;
function get(param_name) {
    _check_if_uranio_was_initialized();
    _check_if_param_exists(param_name);
    return defaults_1.core_env[param_name];
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
function set_from_env(repo_env) {
    const env = _get_env_vars(repo_env);
    _set(repo_env, env);
}
exports.set_from_env = set_from_env;
function _set(repo_env, env) {
    _validate_env_types(repo_env, env);
    for (const [conf_key, conf_value] of Object.entries(env)) {
        repo_env[conf_key] = conf_value;
    }
}
function _get_env_vars(repo_env) {
    const env = {};
    for (const [conf_key, conf_value] of Object.entries(repo_env)) {
        const env_var_name = `URN_${conf_key.toUpperCase()}`;
        switch (typeof conf_value) {
            case 'number': {
                if (typeof process.env[env_var_name] === 'number'
                    || typeof process.env[env_var_name] === 'string'
                        && process.env[env_var_name] !== '') {
                    env[conf_key] = Number(process.env[env_var_name]);
                }
                break;
            }
            case 'boolean': {
                if (typeof process.env[env_var_name] === 'boolean'
                    || typeof process.env[env_var_name] === 'string'
                        && process.env[env_var_name] !== '') {
                    env[conf_key] =
                        (process.env[env_var_name] === 'true')
                            || (process.env[env_var_name] === true);
                }
                break;
            }
            case 'string': {
                if (typeof process.env[env_var_name] === 'string'
                    && process.env[env_var_name] !== '') {
                    env[conf_key] = process.env[env_var_name];
                }
                break;
            }
        }
    }
    return env;
}
function _validate_env_types(repo_env, env) {
    for (const [env_key, env_value] of Object.entries(env)) {
        const key = env_key;
        if (typeof env_value !== typeof repo_env[key]) {
            throw urn_exc.create_not_initialized(`INVALID_ENV_VALUE`, `Invalid env value for \`${env_key}\`. \`${env_key}\` value ` +
                ` must be of type \`${typeof repo_env[key]}\`,` +
                `\`${typeof env_value}\` given.`);
        }
    }
}
function _check_if_param_exists(param_name) {
    return urn_lib_1.urn_util.object.has_key(defaults_1.core_env, param_name);
}
function _check_if_uranio_was_initialized() {
    if (is_initialized() === false) {
        throw urn_exc.create_not_initialized(`NOT_INITIALIZED`, `Uranio was not initialized. Please run \`uranio.init()\` in your main file.`);
    }
}
//# sourceMappingURL=server.js.map