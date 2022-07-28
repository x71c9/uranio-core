"use strict";
/**
 * Core Env module
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.set_client_env = exports.set = exports.get_all = exports.get = exports.is_production = void 0;
const urn_lib_1 = require("urn-lib");
const default_env_1 = require("../client/default_env");
const urn_ctx = urn_lib_1.urn_context.create(default_env_1.core_client_env, is_production(), 'CORE:ENV:CLIENT');
function is_production() {
    return process.env.NODE_ENV === 'production'
        || process.env.NODE_ENV === 'PRODUCTION';
}
exports.is_production = is_production;
function get(param_name) {
    return urn_ctx.get(param_name);
}
exports.get = get;
function get_all() {
    return urn_ctx.get_all();
}
exports.get_all = get_all;
function set(env) {
    urn_ctx.set(env);
}
exports.set = set;
function set_client_env() {
    // Cannot set env as normal because on the browser it is not possible to
    // iterate on the object process.env. Also it is not possible to dynamically
    // assign values to process.env keys. Instead the only way to get value from
    // process.env in the browser is to manually type the key in string like
    // process.env['URN_LOG_LEVEL']
    // urn_ctx.set_env();
    const env = {};
    const process_log_level = process.env['URN_LOG_LEVEL'];
    // const process_log_level_dev = process.env['URN_DEV_LOG_LEVEL'];
    if (typeof process_log_level === 'string' && process_log_level !== '') {
        if (typeof urn_lib_1.urn_log.LogLevel[process_log_level] === 'number') {
            env['log_level'] = urn_lib_1.urn_log.LogLevel[process_log_level];
        }
        else {
            env['log_level'] = default_env_1.core_client_env.log_level;
        }
    }
    else if (typeof process_log_level === 'number' && process_log_level > -1) {
        env['log_level'] = process_log_level;
    }
    // if(typeof process_log_level_dev === 'string' && process_log_level_dev !== ''){
    // 	if(typeof urn_log.LogLevel[process_log_level_dev as any] === 'number'){
    // 		env['dev_log_level'] = urn_log.LogLevel[process_log_level_dev as any] as
    // 			unknown as urn_log.LogLevel;
    // 	}else{
    // 		env['dev_log_level'] = core_client_env.log_level;
    // 	}
    // }else if(typeof process_log_level_dev === 'number' && process_log_level_dev > -1){
    // 	env['dev_log_level'] = process_log_level_dev;
    // }
    set(env);
    return env;
}
exports.set_client_env = set_client_env;
//# sourceMappingURL=client.js.map