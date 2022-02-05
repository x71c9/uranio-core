/**
 * Conf module
 *
 * @packageDocumentation
 */
import { core_config } from './defaults';
import * as types from '../types';
import { FullConfiguration } from '../typ/intra';
export declare function get<k extends keyof FullConfiguration>(param_name: k): typeof core_config[k];
export declare function is_initialized(): boolean;
export declare function set_initialize(is_initialized: boolean): void;
export declare function set_from_env(repo_config: FullConfiguration): void;
export declare function set(repo_config: FullConfiguration, config: types.Configuration): void;
