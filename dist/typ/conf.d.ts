/**
 * Config types module
 *
 * @packageDocumentation
 */
export declare type Database = 'mongo';
export declare type Storage = 'aws';
export declare type Configuration = {
    db: Database;
    token_expire_seconds: number;
    auth_cookie_expire_seconds: number;
    encryption_rounds?: number;
    max_password_length?: number;
    max_query_depth_allowed?: 0 | 1 | 2 | 3;
    storage?: Storage;
    connect_on_init?: boolean;
    superuser_create_on_init?: boolean;
    default_atoms_superuser: boolean;
    default_atoms_group: boolean;
    default_atoms_user: boolean;
    default_atoms_media: boolean;
    log_debug_info: boolean;
    log_color: boolean;
    log_time_format: string;
    log_max_str_length: number;
    log_prefix: string;
    log_prefix_type: boolean;
    dev_log_debug_info: boolean;
    dev_log_color: boolean;
    dev_log_time_format: string;
    dev_log_max_str_length: number;
    dev_log_prefix: string;
    dev_log_prefix_type: boolean;
};
