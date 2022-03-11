/**
 * Client Conf type module
 *
 * @packageDocumentation
 */
declare type RequiredClientConfigParams = {};
declare type OptionalClientConfigParam = {
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
export declare type ClientConfiguration = RequiredClientConfigParams & Partial<OptionalClientConfigParam>;
export {};
