/**
 * Main module
 *
 * @packageDocumentation
 */
import * as types from './types';
export { types };
import * as bll from './bll/';
export { bll };
export declare function init(config: types.Configuration): void;
