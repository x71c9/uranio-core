/**
 * Generate module
 *
 * @packageDocumentation
 */

import fs from 'fs';

import {urn_util, urn_exception, urn_log} from 'urn-lib';

const urn_exc = urn_exception.init(`REGISTER_MODULE`, `Register module.`);

import {schema as schema_types} from '../sch/index';

import {real_book_property_type} from '../stc/index';

import * as book from '../book/index';

import * as types from '../types';

export const process_params = {
	urn_command: `schema`,
	urn_base_schema: `./.uranio/generate/base/schema.d.ts`,
	urn_output_dir: `.`
};

export function schema():string{
	urn_log.debug('Started generating uranio core schema...');
	init();
	const text = _generate_uranio_schema_text();
	urn_log.debug(`Core schema generated.`);
	return text;
}

export function schema_and_save():void{
	const text = schema();
	save_schema(text);
	urn_log.debug(`Schema generated and saved.`);
}

export function save_schema(text:string):void{
	const output = `${process_params.urn_output_dir}/schema.d.ts`;
	fs.writeFileSync(output, text);
	urn_log.debug(`Schema saved in [${output}].`);
}

export function init():void{
	for(const argv of process.argv){
		const splitted = argv.split('=');
		if(
			splitted[0] === 'urn_base_schema'
			&& typeof splitted[1] === 'string'
			&& splitted[1] !== ''
		){
			process_params.urn_base_schema = splitted[1];
		}else if(
			splitted[0] === 'urn_output_dir'
			&& typeof splitted[1] === 'string'
			&& splitted[1] !== ''
		){
			process_params.urn_output_dir = splitted[1];
		}
	}
}

function _generate_uranio_schema_text(){
	const txt = _generate_schema_text();
	const data = fs.readFileSync(process_params.urn_base_schema, {encoding: 'utf8'});
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
	return '\n\texport {};';
}

function _generate_atom_type(atom_names:string[]){
	let text = '';
	text += `\texport type Atom<A extends AtomName> =\n`;
	for(const atom_name of atom_names){
		text += `\t\tA extends '${atom_name}' ? ${_atom_type_name(atom_name)} :\n`;
	}
	text += `\t\tnever\n\n`;
	return text;
}

function _generate_atom_shape_type(atom_names:string[]){
	let text = '';
	text += `\texport type AtomShape<A extends AtomName> =\n`;
	for(const atom_name of atom_names){
		text += `\t\tA extends '${atom_name}' ? ${_atom_shape_type_name(atom_name)} :\n`;
	}
	text += `\t\tnever\n\n`;
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
		text += `\ttype ${_atom_type_name(atom_name)} =`;
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
	text += `\ttype BondShapeDepth${label}<A extends AtomName> =\n`;
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
		const bond_obj = (bonds.length > 0) ? `{${bonds.join(', ')}}` : 'never';
		text += `\t\tA extends '${atom_name}' ? ${bond_obj} :\n`;
	}
	text += `\t\tnever\n\n`;
	return text;
}

function _generate_bond_properties(atom_book:types.Book){
	let text = '';
	text += `\ttype BondProperties<A extends AtomName> =\n`;
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
		const bond_props:string[] = [];
		for(const [key, prop_def] of Object.entries(atom_def.properties)){
			if(prop_def.type === types.PropertyType.ATOM || prop_def.type === types.PropertyType.ATOM_ARRAY){
				bond_props.push(key);
			}
		}
		const bond_prop_union = (bond_props.length > 0) ?
			bond_props.map(n => `'${n}'`).join(' | ') : 'never';
		text += `\t\tA extends '${atom_name}' ? ${bond_prop_union} :\n`;
	}
	text += `\t\tnever\n\n`;
	return text;
}

function _generate_atom_shapes(atom_book:types.Book){
	let text = '';
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
		text += `\ttype ${_atom_shape_type_name(atom_name)} = AtomCommonProperties & {\n`;
		for(const [key, prop_def] of Object.entries(atom_def.properties)){
			const optional = (prop_def.optional === true) ? '?' : '';
			switch(prop_def.type){
				case types.PropertyType.ATOM:{
					text += `\t\t${key}${optional}: string\n`;
					break;
				}
				case types.PropertyType.ATOM_ARRAY:{
					text += `\t\t${key}${optional}: string[]\n`;
					break;
				}
				default:{
					text += `\t\t${key}${optional}: ${real_book_property_type[prop_def.type]}\n`;
				}
			}
		}
		text += `\t}\n\n`;
	}
	return text;
}

function _generate_union_names(type_name: string, names:string[]){
	const union = (names.length > 0) ?
		names.map(n => `'${n}'`).join(' | ') : 'never';
	return `\texport type ${type_name} = ${union}\n\n`;
}


