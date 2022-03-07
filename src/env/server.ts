/**
 * Env module
 *
 * @packageDocumentation
 */

import {urn_util, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('CORE_ENV_MODULE', `Core environment module`);

import {core_env} from './defaults';

export {core_env as defaults};

import {Environment} from '../typ/env';

let _is_core_initialized = false;

export function get<k extends keyof Environment>(param_name:k)
		:typeof core_env[k]{
	_check_if_uranio_was_initialized();
	_check_if_param_exists(param_name);
	return core_env[param_name];
}

export function is_initialized():boolean{
	return _is_core_initialized;
}

export function set_initialize(is_initialized:boolean):void{
	_is_core_initialized = is_initialized;
}

export function set_from_env(repo_env:Required<Environment>):void{
	const env = _get_env_vars(repo_env);
	set(repo_env, env);
}

export function set(repo_env:Required<Environment>, env:Partial<Environment>)
		:void{
	_validate_env_types(repo_env, env);
	for(const [conf_key, conf_value] of Object.entries(env)){
		(repo_env as any)[conf_key] = conf_value;
	}
}

function _get_env_vars(repo_env:Environment):Environment{
	const env:Environment = {} as Environment;
	for(const [conf_key, conf_value] of Object.entries(repo_env)){
		const env_var_name = `URN_${conf_key.toUpperCase()}`;
		switch(typeof conf_value){
			case 'number':{
				if(
					typeof process.env[env_var_name] === 'number'
					|| typeof process.env[env_var_name] === 'string'
					&& process.env[env_var_name] !== ''
				){
					(env as any)[conf_key] = Number(process.env[env_var_name]);
				}
				break;
			}
			case 'boolean':{
				if(
					typeof process.env[env_var_name] === 'boolean'
					|| typeof process.env[env_var_name] === 'string'
					&& process.env[env_var_name] !== ''
				){
					(env as any)[conf_key] =
						(process.env[env_var_name] === 'true')
						|| (process.env[env_var_name] as any === true);
				}
				break;
			}
			case 'string':{
				if(
					typeof process.env[env_var_name] === 'string'
					&& process.env[env_var_name] !== ''
				){
					(env as any)[conf_key] = process.env[env_var_name];
				}
				break;
			}
		}
	}
	return env;
}

function _validate_env_types(
	repo_env:Required<Environment>,
	env:Partial<Environment>
){
	for(const [env_key, env_value] of Object.entries(env)){
		const key = env_key as keyof typeof repo_env;
		if(typeof env_value !== typeof repo_env[key]){
			throw urn_exc.create_not_initialized(
				`INVALID_ENV_VALUE`,
				`Invalid env value for \`${env_key}\`. \`${env_key}\` value ` +
				` must be of type \`${typeof repo_env[key]}\`,` +
				`\`${typeof env_value}\` given.`
			);
		}
	}
}

function _check_if_param_exists(param_name:string){
	return urn_util.object.has_key(core_env, param_name);
}

function _check_if_uranio_was_initialized(){
	if(is_initialized() === false){
		throw urn_exc.create_not_initialized(
			`NOT_INITIALIZED`,
			`Uranio was not initialized. Please run \`uranio.init()\` in your main file.`
		);
	}
}
