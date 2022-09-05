/**
 * Read TOML module
 *
 * @packageDocumentation
 */

import fs from 'fs';

import minimist from 'minimist';

import toml from 'toml';

import {urn_log, urn_exception} from 'uranio-utils';

const urn_exc = urn_exception.init('CORE_UTIL_TOML_MODULE', `Core util toml  module`);

import {Configuration} from '../srv/types';

/**
 * Read `uranio.toml` file. It also populate "dev_" config keys.
 *
 * @param default_repo_config The default configuration object of the current repo
 */
export function read(default_repo_config:Partial<Configuration>):Partial<Configuration>{
	
	let toml_config_path = './uranio.toml';
	const args = minimist(process.argv.slice(2));
	if(args.c){
		toml_config_path = args.c;
	}else if(args.config){
		toml_config_path = args.c;
	}
	
	if(!fs.existsSync(toml_config_path)){
		urn_log.warn(`Missing TOML configuration file.`);
		return {};
	}
	
	try{
		
		const toml_data = fs.readFileSync(toml_config_path);
		const parsed_toml = toml.parse(toml_data.toString('utf8'));
		let converted_toml = _convert_toml(parsed_toml);
		converted_toml = _set_dev_config(converted_toml, default_repo_config);
		return converted_toml;
		
	}catch(err){
		throw urn_exc.create(
			`IVALID_TOML_CONF_FILE`,
			`Invalid toml config file.`,
			err as Error
		);
	}
}

// If "dev_" key is not defined use the non-"dev_" key value.
// This doesn't change client values.
// Client values are handlaed by util/generate/_generate_client_config_text
function _set_dev_config(
	converted_toml:Partial<Configuration>,
	default_repo_config:Partial<Configuration>
):Partial<Configuration>{
	const not_defined_devs:Partial<Configuration> = {};
	for(const [toml_key, toml_value] of Object.entries(converted_toml)){
		if(
			toml_key.indexOf('dev_') === -1
			&& typeof (converted_toml as any)[`dev_${toml_key}`] === 'undefined'
			&& typeof (default_repo_config as any)[`dev_${toml_key}`] !== 'undefined'
		){
			(not_defined_devs as any)[`dev_${toml_key}`] = toml_value;
		}
	}
	return {...converted_toml, ...not_defined_devs};
}

function _convert_toml(parsed_toml:any):Partial<Configuration>{
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

