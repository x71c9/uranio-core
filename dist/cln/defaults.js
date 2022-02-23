"use strict";
/**
 * Module for default client configuration object
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.core_client_config = void 0;
const urn_lib_1 = require("urn-lib");
/**
 * IMPORTANT: if new variable are added here they must be added on
 * uranio-core/conf/client.ts
 *
 * Unfortunately the browser doesn't allow to dynamically access process.env
 * variable, like process.env[var_name] where `var_name` is a variable.
 */
exports.core_client_config = {
    log_level: urn_lib_1.urn_log.defaults.log_level,
};
//# sourceMappingURL=defaults.js.map