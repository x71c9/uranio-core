/**
 * Config types module
 *
 * @packageDocumentation
 */
export declare type Database = 'mongo';
export declare type Storage = 'aws';
export declare type Configuration = {
    db_type: Database;
    mongo_main_connection: string;
    db_main_name: string;
    db_trash_name: string;
    db_log_name: string;
    superuser_email: string;
    superuser_password: string;
    jwt_private_key: string;
    connect_on_init?: boolean;
    mongo_trash_connection?: string;
    mongo_log_connection?: string;
    encryption_rounds?: number;
    max_password_length?: number;
    superuser_create_on_init?: boolean;
    max_query_depth_allowed?: 0 | 1 | 2 | 3;
    storage?: Storage;
    aws_bucket_name?: string;
    aws_bucket_region?: string;
    aws_user_access_key_id?: string;
    aws_user_secret_access_key?: string;
};
