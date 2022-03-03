/**
 * Init module
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {core_client_config} from '../client/defaults';

import {atom_book} from '../atoms';

import * as register from '../reg/server';

import * as types from '../client/types';

import * as conf from '../conf/client';

import * as log from '../log/client';

export function init(config?:types.ClientConfiguration)
		:void{
	
	log.init(urn_log.defaults);
	
	_register_required_atoms();
	
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

function _register_required_atoms(){
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
		register.atom(atom_def, atom_name);
	}
}

