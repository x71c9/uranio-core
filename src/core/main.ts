/**
 * Main module
 *
 * @packageDocumentation
 */

import * as types from './types';

export {types};

import * as bll from './bll/';

export {bll};

import {core_config} from './conf/defaults';

export function init(config:types.Configuration)
		:void{
	Object.assign(core_config, config);
}
