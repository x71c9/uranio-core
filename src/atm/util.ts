/**
 * Module for Atom Util
 *
 * @packageDocumentation
 */

import {urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('ATOM_UTIL', `Atom Util modul`);

import {atom_book} from '../book';

import {get_subatom_keys} from './keys';

import {validate_atom_property} from './validate';

import {
	Atom,
	AtomName,
	Molecule,
	Depth,
	Book,
	BookPropertyType
} from '../types';

export function get_subatom_name<A extends AtomName>(atom_name:A ,atom_key:string)
		:AtomName{
	const atom_def = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	if(atom_def[atom_key]){
		if(
			atom_def[atom_key].type === BookPropertyType.ATOM ||
			atom_def[atom_key].type === BookPropertyType.ATOM_ARRAY
		){
			if((atom_def[atom_key] as Book.Definition.Property.Atom).atom){
				return (atom_def[atom_key] as Book.Definition.Property.Atom).atom;
			}else{
				let err_msg = `Invalid book property definition for [${atom_key}].`;
				err_msg += ` Missing 'atom' field.`;
				throw urn_exc.create('GET_ATOM_NAME_INVALID_BOOK_PROP', err_msg);
			}
		}else{
			let err_msg = `Invalid book property type for [${atom_key}].`;
			err_msg += ` Type shlould be ATOM or ATOM_ARRAY.`;
			throw urn_exc.create('GET_ATOM_NAME_INVALID_BOOK_PROP_TYPE', err_msg);
		}
	}else{
		let err_msg = `Invalid key [${atom_key}].`;
		err_msg += ` Key should be an AtomName.`;
		throw urn_exc.create('GET_ATOM_NAME_INVALID_KEY', err_msg);
	}
}

export function is_atom<A extends AtomName>(atom_name:A, atom:Atom<A>): atom is Atom<A>{
	const subatom_keys = get_subatom_keys(atom_name);
	for(const subkey of subatom_keys){
		if(Array.isArray(atom[subkey])){
			if(typeof (atom[subkey] as Array<any>)[0] === 'object'){
				return false;
			}
		}else if(typeof atom[subkey] === 'object'){
			return false;
		}
	}
	return true;
}

export function is_molecule<A extends AtomName, D extends Depth>(atom_name:A, molecule:Molecule<A,D>)
		:molecule is Molecule<A,D>{
	const subatom_keys = get_subatom_keys(atom_name) as Set<keyof Molecule<A,D>>;
	for(const subkey of subatom_keys){
		if(Array.isArray(molecule[subkey])){
			if(typeof (molecule[subkey] as Array<any>)[0] === 'string'){
				return false;
			}
		}else if(typeof molecule[subkey] === 'string'){
			return false;
		}
	}
	return true;
}

export function fix_atom_property<A extends AtomName>(
	atom_name:A,
	atom:Atom<A>,
	key:string
):Atom<A>{
	const atom_props = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	if(!atom_props[key]){
		const err_msg = `Missing or invalid key [${key}] in atom_book`;
		throw urn_exc.create('FIX_ATOM_KEY', err_msg);
	}
	const prop_def = atom_props[key];
	let fixed_value = null;
	if(prop_def.on_error && typeof prop_def.on_error === 'function'){
		fixed_value = prop_def.on_error!((atom as any)[key]);
	}else if(prop_def.default){
		fixed_value = prop_def.default;
	}
	try{

		validate_atom_property(key, prop_def, fixed_value, atom);
		(atom as any)[key] = fixed_value;

	}catch(err){
		let err_msg = `Cannot fix property of Atom. Default value or on_error result is invalid.`;
		err_msg += ` for Atom [${atom_name}] property [${key}]`;
		throw urn_exc.create('CANNOT_FIX', err_msg);
	}
	return atom;
}

