/**
 * Read TOML module
 *
 * @packageDocumentation
 */

import fs from 'fs';

import minimist from 'minimist';

import toml from 'toml';

import {urn_log, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('CORE_UTIL_TOML_MODULE', `Core util toml  module`);

import {Configuration} from '../server/types';

export function read():Partial<Configuration>{
	
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
		const converted_toml = _convert_toml(parsed_toml);
		
		return converted_toml;
		
	}catch(err){
		throw urn_exc.create(
			`IVALID_TOML_CONF_FILE`,
			`Invalid toml config file.`,
			err as Error
		);
	}
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

