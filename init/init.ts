/**
 * Init module
 *
 * @packageDocumentation
 */

import * as types from '../types';

import * as conf from '../conf/';

export function init(config?:types.Configuration)
		:void{
	if(typeof config === 'undefined'){
		return conf.initialize_from_environment();
	}
	return conf.initialize(config);
}
