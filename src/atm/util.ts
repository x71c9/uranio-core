/**
 * Module for schema.Atom Util
 *
 * @packageDocumentation
 */

import {urn_exception, urn_util} from 'urn-lib';

const urn_exc = urn_exception.init('ATOM_UTIL', `schema.Atom Util module`);

import {schema} from '../sch/client';

import * as keys from './keys';

import {Book, PropertyType} from '../typ/book_cln';

import * as book from '../book/client';

export function molecule_to_atom<A extends schema.AtomName, D extends schema.Depth>(
	atom_name:A,
	molecule:schema.Molecule<A,D>
):schema.Atom<A>{
	const bond_keys = keys.get_bond<A,D>(atom_name);
	// let k:keyof schema.Molecule<A,D>;
	for(const k of bond_keys){
		const prop_value = molecule[k];
		if(Array.isArray(prop_value)){
			for(let i = 0; i < prop_value.length; i++){
				(prop_value[i] as any) = ((prop_value[i] as any)._id) ? (prop_value[i] as any)._id : null;
			}
		}else{
			molecule[k] = ((prop_value as any)._id) ? (prop_value as any)._id : null;
		}
	}
	return molecule as schema.Atom<A>;
}

export function get_subatom_name<A extends schema.AtomName>(atom_name:A ,atom_key:string)
		:schema.AtomName{
	const atom_def = book.get_custom_properties_definition(atom_name);
	const key_string = atom_key as string;
	const prop = atom_def[key_string];
	if(prop){
		if(prop.type === PropertyType.ATOM || prop.type === PropertyType.ATOM_ARRAY){
			if((atom_def[key_string] as Book.Definition.Property.Atom).atom){
				return (atom_def[key_string] as Book.Definition.Property.Atom).atom;
			}else{
				let err_msg = `Invalid book property definition for [${key_string}].`;
				err_msg += ` Missing 'atom' field.`;
				throw urn_exc.create('GET_ATOM_NAME_INVALID_BOOK_PROP', err_msg);
			}
		}else{
			let err_msg = `Invalid book property type for \`${key_string}\`.`;
			err_msg += ` Type shlould be ATOM or ATOM_ARRAY.`;
			throw urn_exc.create('GET_ATOM_NAME_INVALID_BOOK_PROP_TYPE', err_msg);
		}
	}else{
		let err_msg = `Invalid key \`${key_string}\`.`;
		err_msg += ` Key should be an schema.AtomName.`;
		throw urn_exc.create('GET_ATOM_NAME_INVALID_KEY', err_msg);
	}
}

export function is_atom<A extends schema.AtomName>(atom_name:A, atom:unknown)
		:atom is schema.Atom<A>{
	const subatom_keys = keys.get_bond(atom_name);
	for(const subkey of subatom_keys){
		const value = (atom as schema.Atom<A>)[subkey];
		if(Array.isArray(value)){
			if(typeof value[0] === 'object'){
				return false;
			}
		}else if(typeof value === 'object'){
			return false;
		}
	}
	return true;
}

export function is_molecule<A extends schema.AtomName, D extends schema.Depth>(atom_name:A, molecule:unknown)
		:molecule is schema.Molecule<A,D>{
	const subatom_keys = keys.get_bond(atom_name) as Set<keyof schema.Molecule<A,D>>;
	for(const subkey of subatom_keys){
		const value = (molecule as schema.Molecule<A,D>)[subkey];
		if(Array.isArray(value)){
			if(typeof value[0] === 'string'){
				return false;
			}
		}else if(typeof value === 'string'){
			return false;
		}
	}
	return true;
}

export function is_auth_atom_name<A extends schema.AtomName>(atom_name:A)
		:boolean{
	const atom_def = book.get_definition(atom_name);
	if(atom_def.authenticate === true){
		return true;
	}
	return false;
}

export function is_auth_atom<A extends schema.AuthName>(atom:unknown)
		:atom is schema.AuthAtom<A>{
	if(
		urn_util.object.has_key(atom, 'email') &&
		urn_util.object.has_key(atom, 'password') &&
		urn_util.object.has_key(atom, 'groups')
	){
		return true;
	}
	return false;
}

export function hide_hidden_properties<A extends schema.AtomName, D extends schema.Depth>(atom_name:A, molecules:schema.Molecule<A,D>):schema.Molecule<A,D>;
export function hide_hidden_properties<A extends schema.AtomName, D extends schema.Depth>(atom_name:A, molecules:schema.Molecule<A,D>[]):schema.Molecule<A,D>[];
export function hide_hidden_properties<A extends schema.AtomName, D extends schema.Depth>(atom_name:A, molecules:schema.Molecule<A,D>|schema.Molecule<A,D>[])
			:schema.Molecule<A,D>|schema.Molecule<A,D>[]{
	if(Array.isArray(molecules)){
		for(let i = 0; i < molecules.length; i++){
			molecules[i] = _hide_hidden_properties_single_molecule(atom_name, molecules[i]!) as schema.Molecule<A,D>;
		}
	}else{
		molecules = _hide_hidden_properties_single_molecule(atom_name, molecules);
	}
	return molecules;
}
	
function _hide_hidden_properties_single_molecule<A extends schema.AtomName, D extends schema.Depth>(atom_name:A, molecule:schema.Molecule<A,D>)
		:schema.Molecule<A,D>{
	
	const hidden_keys = keys.get_hidden<A,D>(atom_name);
	const bond_keys = keys.get_bond(atom_name);
	
	if(is_atom(atom_name, molecule as schema.Atom<A>)){
		for(const k of hidden_keys){
			delete molecule[k];
		}
	}else{
		for(const k in molecule){
			if(hidden_keys.has(k as any)){
				delete molecule[k];
			}else if(bond_keys.has(k as any)){
				const subatom_name = get_subatom_name(atom_name, k);
				molecule[k] = _hide_hidden_properties_single_molecule(subatom_name, molecule[k] as any) as any;
			}
		}
	}
	return molecule;
}

export function is_optional_property<A extends schema.AtomName>(atom_name:A, key:keyof schema.Atom<A>)
		:boolean{
	const prop_def = book.get_property_definition(atom_name, key as string);
	return (
		prop_def &&
		urn_util.object.has_key(prop_def, 'optional') &&
		(prop_def as any).optional === true
	);
}

export function has_property<A extends schema.AtomName>(atom_name:A, key:string):boolean;
export function has_property<A extends schema.AtomName>(atom_name:A, key:keyof schema.Atom<A>):boolean;
export function has_property<A extends schema.AtomName>(atom_name:A, key:keyof schema.Atom<A>|string)
		:boolean{
	return book.has_property(atom_name, key as string);
}

export function delete_undefined_optional<A extends schema.AtomName>(
	atom_name: A,
	partial_atom: schema.AtomShape<A>
):schema.AtomShape<A>;
export function delete_undefined_optional<A extends schema.AtomName>(
	atom_name: A,
	partial_atom: Partial<schema.AtomShape<A>>
):Partial<schema.AtomShape<A>>;
export function delete_undefined_optional<A extends schema.AtomName>(
	atom_name: A,
	partial_atom: schema.AtomShape<A> | Partial<schema.AtomShape<A>>
):schema.AtomShape<A> | Partial<schema.AtomShape<A>>{
	const optional_keys = keys.get_optional(atom_name);
	let k:keyof Partial<schema.AtomShape<A>>;
	for(k in partial_atom){
		if(optional_keys.has(k) && !partial_atom[k]){
			delete partial_atom[k];
		}
	}
	return partial_atom;
}

