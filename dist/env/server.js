"use strict";
/**
 * Env module
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.set_env = exports.get_all = exports.set = exports.get = exports.is_production = void 0;
const urn_lib_1 = require("urn-lib");
const defaults_1 = require("./defaults");
const urn_ctx = urn_lib_1.urn_context.create(defaults_1.core_env, is_production(), 'CORE:ENV');
function is_production() {
    return process.env.NODE_ENV === 'production'
        || process.env.NODE_ENV === 'PRODUCTION';
}
exports.is_production = is_production;
function get(param_name) {
    return urn_ctx.get(param_name);
}
exports.get = get;
function set(env) {
    urn_ctx.set(env);
}
exports.set = set;
function get_all() {
    return urn_ctx.get_all();
}
exports.get_all = get_all;
function set_env() {
    urn_ctx.set_env();
}
exports.set_env = set_env;
//# sourceMappingURL=server.js.map