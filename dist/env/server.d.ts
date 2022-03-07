/**
 * Env module
 *
 * @packageDocumentation
 */
import { core_env } from './defaults';
export { core_env as defaults };
import { Environment } from '../typ/env';
export declare function get<k extends keyof Environment>(param_name: k): typeof core_env[k];
export declare function is_initialized(): boolean;
export declare function set_initialize(is_initialized: boolean): void;
export declare function set_from_env(repo_env: Required<Environment>): void;
