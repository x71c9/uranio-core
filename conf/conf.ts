/**
 * Conf module
 *
 * @packageDocumentation
 */

import {urn_util, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('CONF_MODULE', `Configuration module`);

import {core_config} from './defaults';

import * as types from '../types';

let _is_uranio_initialized = false;

export function get<k extends keyof types.FullConfiguration>(param_name:k)
		:typeof core_config[k]{
	_check_if_uranio_was_initialized();
	_check_if_param_exists(param_name);
	return core_config[param_name];
}

export function is_initialized():boolean{
	return _is_uranio_initialized;
}

export function set_initialize(is_initialized:boolean):void{
	_is_uranio_initialized = is_initialized;
}

export function set_from_env(repo_config:types.FullConfiguration):void{
	const config = _get_env_vars(repo_config);
	set(repo_config, config);
}

export function set(repo_config:types.FullConfiguration, config:types.Configuration)
		:void{
	_validate_config_types(repo_config, config);
	Object.assign(repo_config, config);
}

function _get_env_vars(repo_config:types.Configuration):types.Configuration{
	const config:types.Configuration = {} as types.Configuration;
	for(const [conf_key, conf_value] of Object.entries(repo_config)){
		const env_var_name = `URN_${conf_key.toUpperCase()}`;
		switch(typeof conf_value){
			case 'number':{
				if(
					typeof process.env[env_var_name] === 'number'
					|| typeof process.env[env_var_name] === 'string'
					&& process.env[env_var_name] !== ''
				){
					(config as any)[conf_key] = Number(process.env[env_var_name]);
				}
				break;
			}
			case 'boolean':{
				if(
					typeof process.env[env_var_name] === 'boolean'
					|| typeof process.env[env_var_name] === 'string'
					&& process.env[env_var_name] !== ''
				){
					(config as any)[conf_key] =
						(process.env[env_var_name] === 'true') || (process.env[env_var_name] as any === true);
				}
				break;
			}
			case 'string':{
				if(
					typeof process.env[env_var_name] === 'string'
					&& process.env[env_var_name] !== ''
				){
					(config as any)[conf_key] = process.env[env_var_name];
				}
				break;
			}
		}
	}
	return config;
}

function _validate_config_types(repo_config:types.FullConfiguration, config:types.Configuration){
	for(const [config_key, config_value] of Object.entries(config)){
		const key = config_key as keyof typeof repo_config;
		if(typeof config_value !== typeof repo_config[key]){
			throw urn_exc.create_not_initialized(
				`INVALID_CONFIG_VALUE`,
				`Invalid config value for \`${config_key}\`. \`${config_key}\` value ` +
				` must be of type \`${typeof repo_config[key]}\`,` +
				`\`${typeof config_value}\` given.`
			);
		}
	}
}

function _check_if_param_exists(param_name:string){
	return urn_util.object.has_key(core_config, param_name);
}

function _check_if_uranio_was_initialized(){
	if(is_initialized() === false){
		throw urn_exc.create_not_initialized(
			`NOT_INITIALIZED`,
			`Uranio was not initialized. Please run \`uranio.init()\` in your main file.`
		);
	}
}
