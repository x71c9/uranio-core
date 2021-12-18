/**
 * Conf module
 *
 * @packageDocumentation
 */

import {urn_util, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('CONF_MODULE', `Configuration module`);

import {core_config} from './defaults';

import {FullConfiguration} from '../typ/conf';

import * as init from '../init/';

export function get<k extends keyof FullConfiguration>(param_name:k)
		:typeof core_config[k]{
	_check_if_uranio_was_initialized();
	_check_if_param_exists(param_name);
	return core_config[param_name];
}

function _check_if_param_exists(param_name:string){
	return urn_util.object.has_key(core_config, param_name);
}

function _check_if_uranio_was_initialized(){
	if(init.is_initialized() === false){
		throw urn_exc.create_not_initialized(
			`NOT_INITIALIZED`,
			`Uranio was not initialized. Please run \`uranio.init()\` in your main file.`
		);
	}
}
