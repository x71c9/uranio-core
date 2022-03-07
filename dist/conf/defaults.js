"use strict";
/**
 * Module for default configuration object
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.core_config = void 0;
exports.core_config = {
    db: 'mongo',
    encryption_rounds: 12,
    // It should be less than 60. 60 are the hashed string.
    max_password_length: 58,
    max_query_depth_allowed: 3,
    storage: 'aws',
    connect_on_init: false,
    superuser_create_on_init: false,
};
//# sourceMappingURL=defaults.js.map