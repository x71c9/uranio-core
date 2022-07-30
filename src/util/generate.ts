/**
 * Core Generate module
 *
 * @packageDocumentation
 */

import fs from 'fs';

import path from 'path';

// import dateformat from 'dateformat';

import * as esbuild from 'esbuild';

import {urn_util, urn_exception, urn_log} from 'urn-lib';

const urn_exc = urn_exception.init(`REGISTER_MODULE`, `Register module.`);

import {schema as schema_types} from '../sch/server';

import {real_book_property_type} from '../stc/server';

import {core_config} from '../conf/defaults';

import * as book from '../book/server';

import * as types from '../server/types';

import * as toml from './toml';

import {ClientConfiguration} from '../typ/conf_cln';

export const process_params = {
	urn_command: `schema`,
	urn_repo_path: 'node_modules/uranio',
	urn_schema_repo_path: 'node_modules/uranio-schema'
};

export function schema():string{
	urn_log.debug('Started generating uranio core schema...');
	init();
	const text = _generate_uranio_schema_text();
	urn_log.debug(`Core schema generated.`);
	return text;
}

export function save_schema(text:string):void{
	// const now = dateformat(new Date(), `yyyymmddHHMMssl`);
	// const backup_path = `${_get_atom_schema_path()}.${now}.bkp`;
	// fs.copyFileSync(_get_atom_schema_path(), backup_path);
	// urn_log.debug(`Copied backup file for atom schema in [${backup_path}].`);
	fs.writeFileSync(_get_atom_schema_path(), text);
	urn_log.debug(`Update schema [${_get_atom_schema_path()}].`);
}

export function schema_and_save():void{
	const text = schema();
	save_schema(text);
	urn_log.debug(`Schema generated and saved.`);
}

export function client_config(client_default:Required<ClientConfiguration>):string{
	urn_log.debug('Started generating uranio core client config...');
	init();
	const text = _generate_client_config_text(client_default);
	urn_log.debug(`Core client config generated.`);
	return text;
}

export function save_client_config(text:string):void{
	fs.mkdirSync(path.dirname(_get_core_client_config_path_src()), {recursive: true});
	fs.writeFileSync(_get_core_client_config_path_src(), text, {flag: 'w+'});
	urn_log.debug(`Update core client config [${_get_core_client_config_path_src()}].`);
	_compile_client_config();
	urn_log.debug(`Core Client config core generated and saved.`);
}

export function client_config_and_save(client_default:Required<ClientConfiguration>):void{
	const text = client_config(client_default);
	save_client_config(text);
	urn_log.debug(`Client config generated and saved.`);
}

export function init():void{
	for(const argv of process.argv){
		const splitted = argv.split('=');
		if(
			splitted[0] === 'urn_command'
			&& typeof splitted[1] === 'string'
			&& splitted[1] !== ''
		){
			process_params.urn_command = splitted[1];
		}else if(
			splitted[0] === 'urn_schema_repo_path'
			&& typeof splitted[1] === 'string'
			&& splitted[1] !== ''
		){
			process_params.urn_schema_repo_path = splitted[1];
		}else if(
			splitted[0] === 'urn_repo_path'
			&& typeof splitted[1] === 'string'
			&& splitted[1] !== ''
		){
			process_params.urn_repo_path = splitted[1];
		}
		// if(
		//   splitted[0] === 'urn_base_schema'
		//   && typeof splitted[1] === 'string'
		//   && splitted[1] !== ''
		// ){
		//   process_params.urn_base_schema = splitted[1];
		// }else if(
		//   splitted[0] === 'urn_output_dir'
		//   && typeof splitted[1] === 'string'
		//   && splitted[1] !== ''
		// ){
		//   process_params.urn_output_dir = splitted[1];
		// }
	}
}

function _compile_client_config(){
	_compile(
		_get_core_client_config_path_src(),
		_get_core_client_config_path_dist()
	);
}

function _compile(src:string, dest:string){
	esbuild.buildSync({
		entryPoints: [src],
		outfile: dest,
		platform: 'node',
		format: 'cjs'
	});
	urn_log.debug(`Core Compiled [${src}] to [${dest}].`);
}

function _get_core_client_config_path_src(){
	return `${process_params.urn_repo_path}/.tmp/client/toml.ts`;
}

function _get_core_client_config_path_dist(){
	return `${process_params.urn_repo_path}/dist/client/toml.js`;
}

function _get_atom_schema_path(){
	return `${process_params.urn_schema_repo_path}/dist/typ/atom.d.ts`;
}

function _read_schema():string{
	return fs.readFileSync(_get_atom_schema_path(), {encoding: 'utf8'});
}

function _generate_client_config_text(client_default:Required<ClientConfiguration>){
	let text = '';
	text += `/**\n`;
	text += ` * Module for default client configuration object\n`;
	text += ` * Uranio \`generate\` script will replace this file with the client part\n`;
	text += ` * of the uranio.toml configration file.\n`;
	text += ` *\n`;
	text += ` * All properties starting with \`client_\` will populate this object.\n`;
	text += ` *\n`;
	text += ` * @packageDocumentation\n`;
	text += ` */\n`;
	text += `\n`;
	text += `import {ClientConfiguration} from './types';\n`;
	text += `\n`;
	text += `export const client_toml:Partial<ClientConfiguration> = {\n`;
	text += _client_config(client_default);
	text += `};\n`;
	return text;
}

function _client_config(client_default:Required<ClientConfiguration>){
	let text = '';
	const toml_keys:string[] = [];
	const toml_read = toml.read(core_config);
	// add keys with client in front
	for(const [conf_key, conf_value] of Object.entries(toml_read)){
		if(conf_key.indexOf('client_') === 0){
			const real_key = conf_key.replace('client_', '');
			toml_keys.push(real_key);
			text += `\t${real_key}: ${_real_value(conf_value)},\n`;
			// add "dev_" keys if they are not defined, same as not-"dev_" keys
			if(
				real_key.indexOf('dev_') === -1 &&
				typeof (client_default as any)[`dev_${real_key}`] !== 'undefined' &&
				typeof (toml_read as any)[`dev_${real_key}`] === 'undefined'
			){
				toml_keys.push(`dev_${real_key}`);
				text += `\tdev_${real_key}: ${_real_value(conf_value)},\n`;
			}
		}
	}
	// add keys that have same name of the server but they are not defined
	// i.e.: log -> if defined only once it can be used also for the client
	for(const [conf_key, conf_value] of Object.entries(toml_read)){
		if(
			!toml_keys.includes(conf_key) &&
			typeof client_default[conf_key as keyof ClientConfiguration] ===
			typeof toml_read[conf_key as keyof typeof toml_read]
		){
			toml_keys.push(conf_key);
			text += `\t${conf_key}: ${_real_value(conf_value)},\n`;
			// set also "dev_" keys if not set
			if(
				conf_key.indexOf('dev_') === -1 &&
				typeof (client_default as any)[`dev_${conf_key}`] !== 'undefined' &&
				typeof (toml_read as any)[`dev_${conf_key}`] === 'undefined'
			){
				toml_keys.push(`dev_${conf_key}`);
				text += `\tdev_${conf_key}: ${_real_value(conf_value)},\n`;
			}
		}
	}
	// add rest of keys from default values
	for(const [conf_key, conf_value] of Object.entries(client_default)){
		if(toml_keys.includes(conf_key)){
			continue;
		}
		text += `\t${conf_key}: ${_real_value(conf_value)},\n`;
	}
	return text;
}

function _real_value(value:any){
	return urn_util.json.safe_stringify(value);
}

function _generate_uranio_schema_text(){
	const txt = _generate_schema_text();
	// const data = fs.readFileSync(process_params.urn_base_schema, {encoding: 'utf8'});
	// const data = fs.readFileSync(_get_atom_schema_path(), {encoding: 'utf8'});
	const data = _read_schema();
	const data_start = data.split('/** --uranio-generate-start */');
	const data_end = data_start[1].split('/** --uranio-generate-end */');
	let new_data = '';
	new_data += data_start[0];
	new_data += `/** --uranio-generate-start */\n\n`;
	new_data += txt; + '\n\n';
	new_data += `/** --uranio-generate-end */`;
	new_data += data_end[1];
	return new_data;
}

function _generate_schema_text(){
	const atom_book = book.get_all_definitions();
	const atom_names:string[] = [];
	const auth_names:string[] = [];
	const log_names:string[] = [];
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
		atom_names.push(atom_name);
		if(atom_def.authenticate === true){
			auth_names.push(atom_name);
		}
		if(atom_def.connection === 'log'){
			log_names.push(atom_name);
		}
	}
	let txt = '';
	txt += _generate_union_names(`AtomName`, atom_names);
	txt += _generate_union_names(`AuthName`, auth_names);
	txt += _generate_union_names(`LogName`, log_names);
	txt += _generate_atom_shapes(atom_book);
	txt += _generate_bond_properties(atom_book);
	txt += _generate_bond_shape_depth(0, atom_book);
	txt += _generate_bond_shape_depth(1, atom_book);
	txt += _generate_bond_shape_depth(2, atom_book);
	txt += _generate_bond_shape_depth(3, atom_book);
	txt += _generate_atom_types(atom_names);
	txt += _generate_atom_shape_type(atom_names);
	txt += _generate_atom_type(atom_names);
	txt += _generate_last_export();
	return txt;
}

/**
 * This syntax is needed in order to make the declaration exports only types
 * with `export` in front.
 * Without this the declaration file will export all the types defined
 * in the module, also the ones without `export`
 */
function _generate_last_export(){
	return '\nexport {};';
}

function _generate_atom_type(atom_names:string[]){
	let text = '';
	text += `export declare type Atom<A extends AtomName> =\n`;
	for(const atom_name of atom_names){
		text += `\tA extends '${atom_name}' ? ${_atom_type_name(atom_name)} :\n`;
	}
	text += `\tnever\n\n`;
	return text;
}

function _generate_atom_shape_type(atom_names:string[]){
	let text = '';
	text += `export declare type AtomShape<A extends AtomName> =\n`;
	for(const atom_name of atom_names){
		text += `\tA extends '${atom_name}' ? ${_atom_shape_type_name(atom_name)} :\n`;
	}
	text += `\tnever\n\n`;
	return text;
}

function _atom_type_name(atom_name:string){
	return `${urn_util.string.ucfirst(atom_name)}`;
}

function _atom_shape_type_name(atom_name:string){
	return `${_atom_type_name(atom_name)}Shape`;
}

function _generate_atom_types(atom_names:string[]){
	let text = '';
	for(const atom_name of atom_names){
		text += `declare type ${_atom_type_name(atom_name)} =`;
		text += ` AtomHardProperties & ${_atom_shape_type_name(atom_name)}\n\n`;
	}
	return text;
}

function _generate_bond_shape_depth(depth:schema_types.Depth, atom_book:types.Book){
	let label = '1';
	let atom_molecule = 'Atom';
	let molecule_depth = '';
	switch(depth){
		case 0:{
			label = '1';
			atom_molecule = 'Atom';
			molecule_depth = '';
			break;
		}
		case 1:{
			label = '2';
			atom_molecule = 'Molecule';
			molecule_depth = ', 1';
			break;
		}
		case 2:{
			label = '3';
			atom_molecule = 'Molecule';
			molecule_depth = ', 2';
			break;
		}
		case 3:{
			label = '4';
			atom_molecule = 'Molecule';
			molecule_depth = ', 3';
			break;
		}
	}
	let text = '';
	text += `declare type BondShapeDepth${label}<A extends AtomName> =\n`;
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
		const bonds:string[] = [];
		for(const [key, prop_def] of Object.entries(atom_def.properties)){
			const optional = (prop_def.optional === true) ? '?' : '';
			if(prop_def.type === types.PropertyType.ATOM){
				if(typeof prop_def.atom !== 'string' || (prop_def.atom as unknown) === ''){
					urn_exc.create_invalid_book(
						`INVALID_PROP_ATOM_NAME`,
						`Invalid property atom name form property \`key\`.`
					);
				}
				// TODO check if is valid atom_name
				bonds.push(`${key}${optional}: ${atom_molecule}<'${prop_def.atom}'${molecule_depth}>`);
			}else if(prop_def.type === types.PropertyType.ATOM_ARRAY){
				if(typeof prop_def.atom !== 'string' || (prop_def.atom as unknown) === ''){
					urn_exc.create_invalid_book(
						`INVALID_PROP_ATOM_ARRAY__NAME`,
						`Invalid property atom name form property \`key\`.`
					);
				}
				bonds.push(`${key}${optional}: ${atom_molecule}<'${prop_def.atom}'${molecule_depth}>[]`);
			}
		}
		const bond_obj = (bonds.length > 0) ? `{${bonds.join(', ')}}` : 'Record<never, unknown>';
		text += `\tA extends '${atom_name}' ? ${bond_obj} :\n`;
	}
	text += `\tnever\n\n`;
	return text;
}

function _generate_bond_properties(atom_book:types.Book){
	let text = '';
	text += `declare type BondProperties<A extends AtomName> =\n`;
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
		const bond_props:string[] = [];
		for(const [key, prop_def] of Object.entries(atom_def.properties)){
			if(prop_def.type === types.PropertyType.ATOM || prop_def.type === types.PropertyType.ATOM_ARRAY){
				bond_props.push(key);
			}
		}
		const bond_prop_union = (bond_props.length > 0) ?
			bond_props.map(n => `'${n}'`).join(' | ') : 'never';
		text += `\tA extends '${atom_name}' ? ${bond_prop_union} :\n`;
	}
	text += `\tnever\n\n`;
	return text;
}

function _generate_atom_shapes(atom_book:types.Book){
	let text = '';
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
		text += `declare type ${_atom_shape_type_name(atom_name)} = AtomCommonProperties & {\n`;
		for(const [key, prop_def] of Object.entries(atom_def.properties)){
			const optional = (prop_def.optional === true) ? '?' : '';
			switch(prop_def.type){
				case types.PropertyType.ATOM:{
					text += `\t${key}${optional}: string\n`;
					break;
				}
				case types.PropertyType.ATOM_ARRAY:{
					text += `\t${key}${optional}: string[]\n`;
					break;
				}
				default:{
					text += `\t${key}${optional}: ${real_book_property_type[prop_def.type]}\n`;
				}
			}
		}
		text += `}\n\n`;
	}
	return text;
}

function _generate_union_names(type_name: string, names:string[]){
	const union = (names.length > 0) ?
		names.map(n => `'${n}'`).join(' | ') : 'never';
	return `export declare type ${type_name} = ${union}\n\n`;
}


