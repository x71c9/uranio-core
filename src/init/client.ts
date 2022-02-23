/**
 * Init module
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {core_client_config} from '../cln/defaults';

import * as types from '../cln/types';

import * as conf from '../conf/client';

import * as log from '../log/client';

export function init(config?:types.ClientConfiguration)
		:void{
	
	log.init(urn_log.defaults);
	
	if(!config){
		conf.set_from_env(core_client_config);
	}else{
		conf.set(core_client_config, config);
	}
	
	if(config && typeof config.log_level === 'number'){
		urn_log.defaults.log_level = config.log_level;
	}
	
	conf.set_initialize(true);
}
