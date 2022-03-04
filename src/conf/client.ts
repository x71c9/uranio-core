/**
 * Conf module
 *
 * @packageDocumentation
 */

import {urn_util, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('CONF_CORE_CLIENT_MODULE', `Core client configuration module`);

import {core_client_config} from '../client/defaults';

export {core_client_config as defaults};

import * as types from '../client/types';

let _is_client_core_initialized = false;

export function get<k extends keyof Required<types.ClientConfiguration>>(param_name:k)
		:typeof core_client_config[k]{
	_check_if_uranio_was_initialized();
	_check_if_param_exists(param_name);
	return core_client_config[param_name];
}

export function is_initialized():boolean{
	return _is_client_core_initialized;
}

export function set_initialize(is_initialized:boolean):void{
	_is_client_core_initialized = is_initialized;
}

export function set_from_env(repo_config:Required<types.ClientConfiguration>):void{
	const config = _get_env_vars(repo_config);
	set(repo_config, config);
}

export function set(
	repo_config:Required<types.ClientConfiguration>,
	config:Partial<types.ClientConfiguration>
):void{
	_validate_config_types(repo_config, config);
	for(const [conf_key, conf_value] of Object.entries(config)){
		(repo_config as any)[conf_key] = conf_value;
	}
	// Object.assign(repo_config, config);
}

function _check_if_param_exists(param_name:string){
	return urn_util.object.has_key(core_client_config, param_name);
}

function _check_if_uranio_was_initialized(){
	if(is_initialized() === false){
		throw urn_exc.create_not_initialized(
			`NOT_INITIALIZED`,
			`Uranio was not initialized. Please run \`uranio.init()\` in your main file.`
		);
	}
}

function _validate_config_types(
	repo_config:Required<types.ClientConfiguration>,
	config:Partial<types.ClientConfiguration>
){
	for(const [config_key, config_value] of Object.entries(config)){
		const key = config_key as keyof typeof repo_config;
		if(typeof config_value !== typeof repo_config[key]){
			throw urn_exc.create_not_initialized(
				`INVALID_CLIENT_CONFIG_VALUE`,
				`Invalid client config value for \`${config_key}\`. \`${config_key}\` value ` +
				` must be of type \`${typeof repo_config[key]}\`,` +
				`\`${typeof config_value}\` given.`
			);
		}
	}
}

function _get_env_vars(repo_config:types.ClientConfiguration):types.ClientConfiguration{
	if(
		typeof process.env.URN_LOG_LEVEL === 'number'
		|| typeof process.env.URN_LOG_LEVEL === 'string'
		&& process.env.URN_LOG_LEVEL !== ''
	){
		repo_config.log_level = Number(process.env.URN_LOG_LEVEL);
	}
	return repo_config;
}

