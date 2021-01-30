/**
 * Config types module
 *
 * @packageDocumentation
 */
export declare type DatabaseType = 'mongo';
declare type RequiredConfigParams = {
    db_type: DatabaseType;
    db_host: string;
    db_port: number;
    db_name: string;
    db_trash_name: string;
    db_log_name: string;
    jwt_private_key: string;
};
declare type OptionalConfigParam = {
    encryption_round: number;
    max_password_length: number;
    max_query_depth_allowed: 0 | 1 | 2 | 3;
};
export declare type Configuration = RequiredConfigParams & Partial<OptionalConfigParam>;
export declare type FullConfiguration = RequiredConfigParams & OptionalConfigParam;
export {};
