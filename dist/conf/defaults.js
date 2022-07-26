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
    token_expire_seconds: 60 * 60 * 24 * 7,
    auth_cookie_expire_seconds: 60 * 60 * 24 * 7,
    encryption_rounds: 12,
    // It should be less than 60. 60 are the hashed string.
    max_password_length: 58,
    max_query_depth_allowed: 3,
    storage: 'aws',
    connect_on_init: false,
    superuser_create_on_init: false,
    default_atoms_superuser: true,
    default_atoms_group: true,
    default_atoms_user: false,
    default_atoms_media: false,
    log_debug_info: true,
    log_color: true,
    log_time_format: 'yyyy-mm-dd\'T\'HH:MM:ss:l',
    log_max_str_length: 174,
    log_prefix: '',
    log_prefix_type: false,
    dev_log_debug_info: true,
    dev_log_color: true,
    dev_log_time_format: 'yyyy-mm-dd\'T\'HH:MM:ss:l',
    dev_log_max_str_length: 174,
    dev_log_prefix: '',
    dev_log_prefix_type: false,
};
//# sourceMappingURL=defaults.js.map