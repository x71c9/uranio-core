/**
 * Conf module
 *
 * @packageDocumentation
 */
import { core_config } from './defaults';
export { core_config as defaults };
import { Configuration } from '../typ/conf';
export declare function get<k extends keyof Configuration>(param_name: k): typeof core_config[k];
export declare function get_current<k extends keyof Configuration>(param_name: k): typeof core_config[k];
export declare function object(): Configuration;
export declare function is_initialized(): boolean;
export declare function set_initialize(is_initialized: boolean): void;
export declare function set(repo_config: Required<Configuration>, config: Partial<Configuration>): void;
export declare function set_from_file(repo_config: Required<Configuration>): void;
