"use strict";
/**
 * Module for default configuration object
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.core_config = void 0;
exports.core_config = {
    db_type: 'mongo',
    db_host: 'localhost',
    db_port: 27017,
    db_name: 'uranio_dev',
    db_trash_name: 'uranio_trash_dev',
    db_log_name: 'uranio_log_dev',
    jwt_private_key: 'A_KEY_THAT_NEED_TO_BE_CHANGED',
    encryption_round: 12,
    max_password_length: 58,
    max_query_depth_allowed: 3
};
//# sourceMappingURL=defaults.js.map