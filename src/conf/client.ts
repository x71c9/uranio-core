/**
 * Conf module
 *
 * @packageDocumentation
 */

import fs from 'fs';

import minimist from 'minimist';

import toml from 'toml';

import {urn_log, urn_util, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('CONF_CORE_CLIENT_MODULE', `Core client configuration module`);

import {core_client_config} from '../client/default_conf';

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

// export function set_from_env(repo_config:Required<types.ClientConfiguration>):void{
//   const config = _get_env_vars(repo_config);
//   set(repo_config, config);
// }

export function set_from_file():void{
	
	let toml_config_path = './uranio.toml';
	const args = minimist(process.argv.slice(2));
	if(args.c){
		toml_config_path = args.c;
	}
	
	if(!fs.existsSync(toml_config_path)){
		urn_log.warn(`Missing TOML configuration file.`);
		return;
	}
	
	try{
		
		const toml_data = fs.readFileSync(toml_config_path);
		const parsed_toml = toml.parse(toml_data.toString('utf8'));
		const converted_toml = _conver_toml(parsed_toml);
		set(core_client_config, converted_toml);
		
	}catch(err){
		throw urn_exc.create(
			`IVALID_TOML_CONF_FILE`,
			`Invalid toml config file.`,
			err as Error
		);
	}
}

function _conver_toml(parsed_toml:any):Partial<types.ClientConfiguration>{
	const converted_config:Partial<types.ClientConfiguration> = {};
	for(const [key, value] of Object.entries(parsed_toml)){
		if(value === null || value === undefined){
			continue;
		}
		if(typeof value === 'object'){
			_convert_subobject(converted_config, key, value);
		}else{
			(converted_config as any)[key] = value;
		}
	}
	return converted_config;
}

function _convert_subobject(config:Partial<types.ClientConfiguration>, key:string, obj:any){
	for(const [subkey, subvalue] of Object.entries(obj)){
		if(subvalue === null || subvalue === undefined){
			continue;
		}
		if(typeof subvalue === 'object'){
			_convert_subobject(config, subkey, subvalue);
		}else{
			(config as any)[`${key}_${subkey}`] = subvalue;
		}
	}
	return config;
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

// function _get_env_vars(repo_config:types.ClientConfiguration):types.ClientConfiguration{
//   if(
//     typeof process.env.URN_LOG_LEVEL === 'number'
//     || typeof process.env.URN_LOG_LEVEL === 'string'
//     && process.env.URN_LOG_LEVEL !== ''
//   ){
//     repo_config.log_level = Number(process.env.URN_LOG_LEVEL);
//   }
//   return repo_config;
// }

