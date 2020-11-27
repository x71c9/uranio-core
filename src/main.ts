/**
 * Main module
 *
 * @packageDocumentation
 */

export * from './types';

export * from './bll/';

import {user} from './atm/';

const atoms = {
	user
};

import {Configuration} from './types';

import {core_default_config} from './defaults';

export function init(config:Configuration)
		:void{
	Object.assign(core_default_config, config);
}

export {atoms};
