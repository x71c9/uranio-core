/**
 * Init module
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import * as required from '../req/server';

import * as register from '../reg/server';

import * as types from '../client/types';

import * as conf from '../conf/client';

import * as env from '../env/client';

import * as log from '../log/client';

import {client_toml} from '../client/toml';

export function init(
	config?: Partial<types.ClientConfiguration>,
	register_required=true
):void{
	
	conf.set(client_toml);
	
	env.set_env();
	
	log.init(urn_log);
	
	if(config){
		conf.set(config);
	}
	
	if(register_required){
		_register_required_atoms();
	}
	
	_validate_core_variables();
	_validate_core_book();
	
	urn_log.debug(`Uranio core client initialization completed.`);
	
}

function _register_required_atoms(){
	const required_atoms = required.get();
	for(const [atom_name, atom_def] of Object.entries(required_atoms)){
		register.atom(atom_def, atom_name);
	}
}

function _validate_core_variables(){
	// TODO NOTHING TO CHECK YET
}

/**
 * NOTE:
 * Maybe this should be before compilation and not at runtime?
 */
function _validate_core_book(){
	// TODO DONE IN SERVER?
}
