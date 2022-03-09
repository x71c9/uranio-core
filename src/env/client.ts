/**
 * Env module
 *
 * @packageDocumentation
 */

import {urn_util, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('CORE_ENV_CLIENT_MODULE', `Core client environment module`);

import {core_client_env} from '../client/default_env';

export {core_client_env as defaults};

import * as types from '../client/types';

let _is_client_core_initialized = false;

export function get<k extends keyof Required<types.ClientEnvironment>>(param_name:k)
		:typeof core_client_env[k]{
	_check_if_uranio_was_initialized();
	_check_if_param_exists(param_name);
	return core_client_env[param_name];
}

export function get_current<k extends keyof types.ClientEnvironment>(param_name:k)
		:typeof core_client_env[k]{
	const pro_value = get(param_name);
	if(is_production()){
		return pro_value;
	}
	if(param_name.indexOf('log_') !== -1){
		const dev_param = param_name.replace('log_', 'log_dev_');
		const dev_value = get(dev_param as keyof types.ClientEnvironment);
		if(typeof dev_value === typeof core_client_env[dev_param as keyof types.ClientEnvironment]){
			return dev_value as typeof core_client_env[k];
		}
	}
	return pro_value;
}

export function is_production():boolean{
	return process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'PRODUCTION';
}

export function is_initialized():boolean{
	return _is_client_core_initialized;
}

export function set_initialize(is_initialized:boolean):void{
	_is_client_core_initialized = is_initialized;
}

export function set_from_env(repo_env:Required<types.ClientEnvironment>):void{
	const env = _get_env_vars(repo_env);
	set(repo_env, env);
}

export function set(
	repo_env:Required<types.ClientEnvironment>,
	env:Partial<types.ClientEnvironment>
):void{
	_validate_config_types(repo_env, env);
	for(const [conf_key, conf_value] of Object.entries(env)){
		(repo_env as any)[conf_key] = conf_value;
	}
}

function _check_if_param_exists(param_name:string){
	return urn_util.object.has_key(core_client_env, param_name);
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
	repo_env:Required<types.ClientEnvironment>,
	env:Partial<types.ClientEnvironment>
){
	for(const [env_key, env_value] of Object.entries(env)){
		const key = env_key as keyof typeof repo_env;
		if(typeof env_value !== typeof repo_env[key]){
			throw urn_exc.create_not_initialized(
				`INVALID_CLIENT_ENV_VALUE`,
				`Invalid client env value for \`${env_key}\`. \`${env_key}\` value ` +
				` must be of type \`${typeof repo_env[key]}\`,` +
				`\`${typeof env_value}\` given.`
			);
		}
	}
}

function _get_env_vars(repo_env:types.ClientEnvironment):types.ClientEnvironment{
	if(
		typeof process.env.URN_LOG_LEVEL === 'number'
		|| typeof process.env.URN_LOG_LEVEL === 'string'
		&& process.env.URN_LOG_LEVEL !== ''
	){
		repo_env.log_level = Number(process.env.URN_LOG_LEVEL);
	}
	return repo_env;
}

