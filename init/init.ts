/**
 * Init module
 *
 * @packageDocumentation
 */

import * as types from '../types';

import {core_config} from '../cnf/defaults';

export function init(config:types.Configuration)
		:void{
	Object.assign(core_config, config);
}
