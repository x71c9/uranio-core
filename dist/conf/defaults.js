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
    log_debug_info: true,
    log_color: true,
    log_time_format: 'yyyy-mm-dd\'T\'HH:MM:ss:l',
    log_max_str_length: 174,
    log_prefix: '',
    log_prefix_type: false,
    log_dev_debug_info: true,
    log_dev_color: true,
    log_dev_time_format: 'yyyy-mm-dd\'T\'HH:MM:ss:l',
    log_dev_max_str_length: 174,
    log_dev_prefix: '',
    log_dev_prefix_type: false,
};
//# sourceMappingURL=defaults.js.map