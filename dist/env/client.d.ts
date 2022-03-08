/**
 * Env module
 *
 * @packageDocumentation
 */
import { core_client_env } from '../client/default_env';
export { core_client_env as defaults };
import * as types from '../client/types';
export declare function get<k extends keyof Required<types.ClientEnvironment>>(param_name: k): typeof core_client_env[k];
export declare function get_current<k extends keyof types.ClientEnvironment>(param_name: k): typeof core_client_env[k];
export declare function is_production(): boolean;
export declare function is_initialized(): boolean;
export declare function set_initialize(is_initialized: boolean): void;
export declare function set_from_env(repo_env: Required<types.ClientEnvironment>): void;
export declare function set(repo_env: Required<types.ClientEnvironment>, env: Partial<types.ClientEnvironment>): void;
