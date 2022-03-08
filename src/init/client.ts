/**
 * Init module
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import {core_client_config} from '../client/default_conf';

import {core_client_env} from '../client/default_env';

import * as required from '../req/server';

import * as register from '../reg/server';

import * as types from '../client/types';

import * as conf from '../conf/client';

import * as env from '../env/client';

import * as log from '../log/client';

export function init(
	config?: Partial<types.ClientConfiguration>,
	register_required=true
):void{
	
	env.set_from_env(core_client_env);
	
	// _set_from_config_file();
	conf.set_from_file();
	
	if(config){
		conf.set(core_client_config, config);
	}
	
	if(register_required){
		_register_required_atoms();
	}
	
	_validate_core_variables();
	_validate_core_book();
	
	conf.set_initialize(true);
	env.set_initialize(true);
	
	log.init(urn_log);
	
	urn_log.debug(`Uranio core client initialization completed.`);
	
}

// function _set_from_config_file(){
//   let toml_config_path = './uranio.toml';
//   const args = minimist(process.argv.slice(2));
//   if(args.c){
//     toml_config_path = args.c;
//   }
//   const toml_data = fs.readFileSync(toml_config_path);
//   const parsed_toml = toml.parse(toml_data.toString('utf8'));
//   conf.set(core_client_config, parsed_toml as types.ClientConfiguration);
// }

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
