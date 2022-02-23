/**
 * Client Conf type module
 *
 * @packageDocumentation
 */
import { urn_log } from 'urn-lib';
declare type RequiredClientConfigParams = {};
declare type OptionalClientConfigParam = {
    log_level: urn_log.LogLevel;
};
export declare type ClientConfiguration = RequiredClientConfigParams & Partial<OptionalClientConfigParam>;
export {};
