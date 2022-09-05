/**
 * Client Env type module
 *
 * @packageDocumentation
 */
import { urn_log } from 'uranio-utils';
declare type RequiredClientEnvParams = {};
declare type OptionalClientEnvParam = {
    log_level: urn_log.LogLevel;
};
export declare type ClientEnvironment = RequiredClientEnvParams & Partial<OptionalClientEnvParam>;
export {};
