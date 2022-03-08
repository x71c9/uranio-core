/**
 * Conf module
 *
 * @packageDocumentation
 */

import fs from 'fs';

import minimist from 'minimist';

import toml from 'toml';

import {urn_log, urn_util, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('CONF_CORE_MODULE', `Core configuration module`);

import {core_config} from './defaults';

export {core_config as defaults};

import {Configuration} from '../typ/conf';

import * as env from '../env/server';

let _is_core_initialized = false;

export function get<k extends keyof Configuration>(param_name:k)
		:typeof core_config[k]{
	_check_if_uranio_was_initialized();
	_check_if_param_exists(param_name);
	return core_config[param_name];
}

export function get_current<k extends keyof Configuration>(param_name:k)
		:typeof core_config[k]{
	const pro_value = get(param_name);
	if(env.is_production()){
		return pro_value;
	}
	if(param_name.indexOf('log_') !== -1){
		const dev_param = param_name.replace('log_', 'log_dev_');
		const dev_value = get(dev_param as keyof Configuration);
		if(typeof dev_value !== 'undefined'){
			return dev_value as typeof core_config[k];
		}
	}
	return pro_value;
}

export function is_initialized():boolean{
	return _is_core_initialized;
}

export function set_initialize(is_initialized:boolean):void{
	_is_core_initialized = is_initialized;
}

// export function set_from_env(repo_config:Required<Configuration>):void{
//   const config = _get_env_vars(repo_config);
//   set(repo_config, config);
// }

export function set(repo_config:Required<Configuration>, config:Partial<Configuration>)
		:void{
	_validate_config_types(repo_config, config);
	for(const [conf_key, conf_value] of Object.entries(config)){
		(repo_config as any)[conf_key] = conf_value;
	}
	// Object.assign(repo_config, config);
}

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
		set(core_config, converted_toml);
		
	}catch(err){
		throw urn_exc.create(
			`IVALID_TOML_CONF_FILE`,
			`Invalid toml config file.`,
			err as Error
		);
	}
}

function _conver_toml(parsed_toml:any):Partial<Configuration>{
	const converted_config:Partial<Configuration> = {};
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

function _convert_subobject(config:Partial<Configuration>, key:string, obj:any){
	for(const [subkey, subvalue] of Object.entries(obj)){
		if(subvalue === null || subvalue === undefined){
			continue;
		}
		const full_key = `${key}_${subkey}`;
		if(typeof subvalue === 'object'){
			_convert_subobject(config, full_key, subvalue);
		}else{
			(config as any)[full_key] = subvalue;
		}
	}
	return config;
}

// function _get_env_vars(repo_config:Configuration):Configuration{
//   const config:Configuration = {} as Configuration;
//   for(const [conf_key, conf_value] of Object.entries(repo_config)){
//     const env_var_name = `URN_${conf_key.toUpperCase()}`;
//     switch(typeof conf_value){
//       case 'number':{
//         if(
//           typeof process.env[env_var_name] === 'number'
//           || typeof process.env[env_var_name] === 'string'
//           && process.env[env_var_name] !== ''
//         ){
//           (config as any)[conf_key] = Number(process.env[env_var_name]);
//         }
//         break;
//       }
//       case 'boolean':{
//         if(
//           typeof process.env[env_var_name] === 'boolean'
//           || typeof process.env[env_var_name] === 'string'
//           && process.env[env_var_name] !== ''
//         ){
//           (config as any)[conf_key] =
//             (process.env[env_var_name] === 'true')
//             || (process.env[env_var_name] as any === true);
//         }
//         break;
//       }
//       case 'string':{
//         if(
//           typeof process.env[env_var_name] === 'string'
//           && process.env[env_var_name] !== ''
//         ){
//           (config as any)[conf_key] = process.env[env_var_name];
//         }
//         break;
//       }
//     }
//   }
//   return config;
// }

function _validate_config_types(
	repo_config:Required<Configuration>,
	config:Partial<Configuration>
){
	_validate_object_types(config, repo_config);
}

function _validate_object_types(obj:any, repo_obj:any){
	for(const [repo_key, repo_value] of Object.entries(repo_obj)){
		const key = repo_key as keyof typeof obj;
		const subconf = obj[key];
		if(!subconf || typeof subconf === 'undefined'){
			continue;
		}
		if(typeof subconf === 'object'){
			
			_validate_object_types(subconf, repo_value);
			
		}else if(typeof repo_value !== typeof subconf){
			throw urn_exc.create_not_initialized(
				`INVALID_CONFIG_VALUE`,
				`Invalid config value for \`${repo_key}\`. \`${repo_key}\` value ` +
				` must be of type \`${typeof repo_value}\`, ` +
				`\`${typeof subconf}\` given.`
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
