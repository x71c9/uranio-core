"use strict";
/**
 * Module for default client env object
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.core_client_env = void 0;
const uranio_utils_1 = require("uranio-utils");
/**
 * IMPORTANT: if new variable are added here they must be added on
 * uranio-core/env/client.ts
 *
 * Unfortunately the browser doesn't allow to dynamically access process.env
 * variable, like process.env[var_name] where `var_name` is a variable.
 */
exports.core_client_env = {
    log_level: uranio_utils_1.urn_log.LogLevel.INFO,
    // dev_log_level: urn_log.LogLevel.DEBUG,
};
//# sourceMappingURL=default_env.js.map