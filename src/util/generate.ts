/**
 * Generate module
 *
 * @packageDocumentation
 */

import fs from 'fs';

import path from 'path';

import caller from 'caller';

import {urn_util, urn_exception, urn_log} from 'urn-lib';

const urn_exc = urn_exception.init(`REGISTER_MODULE`, `Register module.`);

import {schema} from '../sch/';

import {real_book_property_type} from '../stc/';

import * as book from '../book/';

import * as types from '../types';

export function generate():void{
	
	urn_log.debug('Generating uranio schema...');
	
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
	
	const caller_path = caller();
	const declaraion_path = `${path.dirname(caller_path)}/schema/index.d.ts`;
	_replace_text(declaraion_path, txt);
	
	urn_log.debug(`Schema generated.`);
}

function _replace_text(path:string, txt:string){
	if(!fs.existsSync(path)){
		fs.writeFileSync(path, '');
	}
	const data = fs.readFileSync(path, {encoding: 'utf8'});
	
	const data_start = data.split('/** --uranio-generate-start */');
	const data_end = data_start[1].split('/** --uranio-generate-end */');
	
	let new_data = '';
	new_data += data_start[0];
	new_data += `/** --uranio-generate-start */\n\n`;
	new_data += txt; + '\n\n';
	new_data += `/** --uranio-generate-end */`;
	new_data += data_end[1];
	
	fs.writeFileSync(path, new_data);
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

function _generate_bond_shape_depth(depth:schema.Depth, atom_book:types.Book){
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
			if(prop_def.type === types.BookProperty.ATOM){
				if(typeof prop_def.atom !== 'string' || (prop_def.atom as unknown) === ''){
					urn_exc.create_invalid_book(
						`INVALID_PROP_ATOM_NAME`,
						`Invalid property atom name form property \`key\`.`
					);
				}
				// TODO check if is valid atom_name
				bonds.push(`${key}${optional}: ${atom_molecule}<'${prop_def.atom}'${molecule_depth}>`);
			}else if(prop_def.type === types.BookProperty.ATOM_ARRAY){
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
			if(prop_def.type === types.BookProperty.ATOM || prop_def.type === types.BookProperty.ATOM_ARRAY){
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
				case types.BookProperty.ATOM:{
					text += `\t\t${key}${optional}: string\n`;
					break;
				}
				case types.BookProperty.ATOM_ARRAY:{
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


