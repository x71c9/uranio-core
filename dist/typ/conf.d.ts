/**
 * Config types module
 *
 * @packageDocumentation
 */
export declare type Database = 'mongo';
export declare type Storage = 'aws';
export declare type Configuration = {
    db: Database;
    encryption_rounds?: number;
    max_password_length?: number;
    max_query_depth_allowed?: 0 | 1 | 2 | 3;
    storage?: Storage;
    connect_on_init?: boolean;
    superuser_create_on_init?: boolean;
};
