/**
 * Main module
 *
 * @packageDocumentation
 */

export * from './types';

export * from './bll/';

import {Configuration} from './types';

import {core_config} from './defaults';

export function init(config:Configuration)
		:void{
	Object.assign(core_config, config);
}
