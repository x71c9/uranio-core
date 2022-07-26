"use strict";
/**
 * Module for default client env object
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.core_client_env = void 0;
const urn_lib_1 = require("urn-lib");
/**
 * IMPORTANT: if new variable are added here they must be added on
 * uranio-core/env/client.ts
 *
 * Unfortunately the browser doesn't allow to dynamically access process.env
 * variable, like process.env[var_name] where `var_name` is a variable.
 */
exports.core_client_env = {
    log_level: urn_lib_1.urn_log.LogLevel.ERROR,
    dev_log_level: urn_lib_1.urn_log.LogLevel.DEBUG,
};
//# sourceMappingURL=default_env.js.map