/**
 * Conf module
 *
 * @packageDocumentation
 */
import { core_config } from './defaults';
export { core_config as defaults };
import * as types from '../types';
import { Configuration } from '../typ/conf';
export declare function get<k extends keyof Configuration>(param_name: k): typeof core_config[k];
export declare function is_initialized(): boolean;
export declare function set_initialize(is_initialized: boolean): void;
export declare function set_from_env(repo_config: Required<Configuration>): void;
export declare function set(repo_config: Required<Configuration>, config: types.Configuration): void;
