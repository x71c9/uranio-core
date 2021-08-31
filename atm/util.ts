/**
 * Module for Atom Util
 *
 * @packageDocumentation
 */

import {urn_exception, urn_util} from 'urn-lib';

const urn_exc = urn_exception.init('ATOM_UTIL', `Atom Util module`);

import {atom_book} from 'uranio-books-client/atom';

import {dock_book} from 'uranio-books-client/dock';

import * as keys from './keys';

import {
	Atom,
	AtomShape,
	AtomName,
	AuthAtom,
	AuthName,
	Molecule,
	Depth,
} from '../typ/atom';

import {Book} from '../typ/book_cln';

import {BookPropertyType} from '../typ/common';

import {
	atom_hard_properties,
	atom_common_properties,
} from '../stc/';

export function molecule_to_atom<A extends AtomName, D extends Depth>(
	atom_name:A,
	molecule:Molecule<A,D>
):Atom<A>{
	const bond_keys = keys.get_bond(atom_name);
	let k:keyof Molecule<A,D>;
	for(k of bond_keys){
		const prop_value = molecule[k];
		if(Array.isArray(prop_value)){
			for(let i = 0; i < prop_value.length; i++){
				(prop_value[i] as any) = ((prop_value[i] as any)._id) ? (prop_value[i] as any)._id : null;
			}
		}else{
			molecule[k] = ((prop_value as any)._id) ? (prop_value as any)._id : null;
		}
	}
	return molecule as Atom<A>;
}

export function get_subatom_name<A extends AtomName>(atom_name:A ,atom_key:string)
		:AtomName{
	const atom_def = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	const key_string = atom_key as string;
	const prop = atom_def[key_string];
	if(prop){
		if(prop.type === BookPropertyType.ATOM || prop.type === BookPropertyType.ATOM_ARRAY){
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
		err_msg += ` Key should be an AtomName.`;
		throw urn_exc.create('GET_ATOM_NAME_INVALID_KEY', err_msg);
	}
}

export function is_atom<A extends AtomName>(atom_name:A, atom:Atom<A>)
		:atom is Atom<A>{
	const subatom_keys = keys.get_bond(atom_name);
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
	const subatom_keys = keys.get_bond(atom_name) as Set<keyof Molecule<A,D>>;
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

export function is_auth_atom_name<A extends AtomName>(atom_name:A)
		:boolean{
	// const atom_def = atom_book[atom_name] as Book.BasicDefinition;
	const atom_dock_def = dock_book[atom_name].dock;
	if(atom_dock_def && urn_util.object.has_key(atom_dock_def, 'auth')){
		return true;
	}
	return false;
}

export function is_auth_atom<A extends AuthName>(atom:unknown)
		:atom is AuthAtom<A>{
	if(
		urn_util.object.has_key(atom, 'email') &&
		urn_util.object.has_key(atom, 'password') &&
		urn_util.object.has_key(atom, 'groups')
	){
		return true;
	}
	return false;
}

export function hide_hidden_properties<A extends AtomName, D extends Depth>(atom_name:A, molecules:Molecule<A,D>):Molecule<A,D>;
export function hide_hidden_properties<A extends AtomName, D extends Depth>(atom_name:A, molecules:Molecule<A,D>[]):Molecule<A,D>[];
export function hide_hidden_properties<A extends AtomName, D extends Depth>(atom_name:A, molecules:Molecule<A,D>|Molecule<A,D>[])
			:Molecule<A,D>|Molecule<A,D>[]{
	if(Array.isArray(molecules)){
		for(let i = 0; i < molecules.length; i++){
			molecules[i] = _hide_hidden_properties_single_molecule(atom_name, molecules[i]!) as Molecule<A,D>;
		}
	}else{
		molecules = _hide_hidden_properties_single_molecule(atom_name, molecules);
	}
	return molecules;
}
	
function _hide_hidden_properties_single_molecule<A extends AtomName, D extends Depth>(atom_name:A, molecule:Molecule<A,D>)
		:Molecule<A,D>{
	
	const hidden_keys = keys.get_hidden(atom_name);
	const bond_keys = keys.get_bond(atom_name);
	
	if(is_atom(atom_name, molecule as Atom<A>)){
		let k:keyof Molecule<A,D>;
		for(k of hidden_keys){
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

export function is_optional_property<A extends AtomName>(atom_name:A, key:keyof Atom<A>)
		:boolean{
	const atom_props = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	let prop_def = undefined;
	if(urn_util.object.has_key(atom_hard_properties, key)){
		prop_def = atom_hard_properties[key];
	}else if(urn_util.object.has_key(atom_common_properties, key)){
		prop_def = atom_common_properties[key];
	}else if(urn_util.object.has_key(atom_props, key)){
		prop_def = atom_props[key];
	}
	if(!prop_def){
		const err_msg = `Atom property definition missing for atom \`${atom_name}\` property \`${key}\``;
		throw urn_exc.create('IS_OPTIONAL_MISSING_ATM_PROP_DEFINITION', err_msg);
	}
	return (
		prop_def &&
		urn_util.object.has_key(prop_def, 'optional') &&
		(prop_def as any).optional === true
	);
}

export function has_property<A extends AtomName>(atom_name:A, key:string):boolean;
export function has_property<A extends AtomName>(atom_name:A, key:keyof Atom<A>):boolean;
export function has_property<A extends AtomName>(atom_name:A, key:keyof Atom<A>|string)
		:boolean{
	if(urn_util.object.has_key(atom_hard_properties, key)){
		return true;
	}
	if(urn_util.object.has_key(atom_common_properties, key)){
		return true;
	}
	if(urn_util.object.has_key(atom_book[atom_name]['properties'], key)){
		return true;
	}
	return false;
}

export function delete_undefined_optional<A extends AtomName>(
	atom_name: A,
	partial_atom: Partial<AtomShape<A>>
):Partial<AtomShape<A>>{
	const optional_keys = keys.get_optional(atom_name);
	let k:keyof Partial<AtomShape<A>>;
	for(k in partial_atom){
		if(optional_keys.has(k) && !partial_atom[k]){
			delete partial_atom[k];
		}
	}
	return partial_atom;
}

