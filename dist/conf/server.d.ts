/**
 * Conf module
 *
 * @packageDocumentation
 */
import { core_config } from './defaults';
export { core_config as defaults };
import { Configuration } from '../typ/conf';
export declare function get<k extends keyof Configuration>(param_name: k): typeof core_config[k];
export declare function set(config: Partial<Configuration>): void;
