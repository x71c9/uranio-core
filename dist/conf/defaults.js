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
    mongo_main_connection: '',
    mongo_trash_connection: '',
    mongo_log_connection: '',
    // This must be the same in _check_if_db_names_were_changed method in conf module
    db_main_name: 'uranio_dev',
    // This must be the same in _check_if_db_names_were_changed method in conf module
    db_trash_name: 'uranio_trash_dev',
    // This must be the same in _check_if_db_names_were_changed method in conf module
    db_log_name: 'uranio_log_dev',
    superuser_email: '',
    superuser_password: '',
    superuser_create_on_init: false,
    // This must be the same in _check_if_jwt_was_changed method in conf module
    jwt_private_key: 'A_KEY_THAT_NEED_TO_BE_CHANGED',
    encryption_rounds: 12,
    // It should be less than 60. 60 are the hashed string.
    max_password_length: 58,
    max_query_depth_allowed: 3,
    connect_on_init: false,
    storage: 'aws',
    aws_bucket_name: '',
    aws_bucket_region: '',
    aws_user_access_key_id: '',
    aws_user_secret_access_key: ''
};
//# sourceMappingURL=defaults.js.map