/**
 * Environment types module
 *
 * @packageDocumentation
 */
import { urn_log } from 'urn-lib';
export declare type Environment = {
    log_level: urn_log.LogLevel;
    mongo_main_connection: string;
    db_main_name: string;
    db_trash_name: string;
    db_log_name: string;
    superuser_email: string;
    superuser_password: string;
    jwt_private_key: string;
    mongo_trash_connection?: string;
    mongo_log_connection?: string;
    aws_bucket_name?: string;
    aws_bucket_region?: string;
    aws_user_access_key_id?: string;
    aws_user_secret_access_key?: string;
};
